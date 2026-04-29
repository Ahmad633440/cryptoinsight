import News from "@/models/news";
import { generateEmbedding } from "@/lib/embedding";
import { NewsPayload } from "@/data/types";



const buildEmbeddingText = ({
  title,
  content,
  description,
}: Pick<NewsPayload, "title" | "content" | "description">): string => {
  const segments = [title, content, description]
    .filter(Boolean)
    .map((value) => value?.toString().trim())
    .filter(Boolean);

  return segments.join(" \n\n");
};

export const createNewsWithEmbedding = async (
  payload: NewsPayload
): Promise<{ news: any; created: boolean; embedded: boolean }> => {
  const existing = await News.findOne({ url: payload.url });

  const textForEmbedding = buildEmbeddingText(payload);
  let embedding: number[] | undefined;
  let isEmbedded = false;

  if (textForEmbedding) {
    try {
      embedding = await generateEmbedding(textForEmbedding);
      isEmbedded = true;
    } catch (error) {
      console.error("Embedding generation failed for news:", {
        url: payload.url,
        title: payload.title,
        error: error instanceof Error ? error.message : error,
      });
      isEmbedded = false;
      embedding = undefined;
    }
  }

  if (existing) {
    if (existing.isEmbedded) {
      return { news: existing, created: false, embedded: true };
    }

    if (isEmbedded && embedding) {
      existing.embedding = embedding;
      existing.isEmbedded = true;
      await existing.save();
      return { news: existing, created: false, embedded: true };
    }

    return { news: existing, created: false, embedded: false };
  }

  const news = await News.create({
    title: payload.title,
    content: payload.content,
    source: payload.source,
    publishedAt: payload.publishedAt,
    url: payload.url,
    coin: payload.coin,
    category: payload.category,
    sentiment: payload.sentiment ?? "Neutral",
    embedding: embedding ?? undefined,
    isEmbedded,
  });

  return { news, created: true, embedded: isEmbedded };
};

export const embedPendingNews = async (limit: number = 50): Promise<number> => {
  const pending = await News.find({ isEmbedded: false })
    .sort({ publishedAt: -1 })
    .limit(limit);

  let processed = 0;

  for (const item of pending) {
    const textForEmbedding = buildEmbeddingText({
      title: item.title,
      content: item.content,
      description: undefined,
    });

    if (!textForEmbedding) {
      continue;
    }

    try {
      item.embedding = await generateEmbedding(textForEmbedding);
      item.isEmbedded = true;
      await item.save();
      processed += 1;
    } catch (error) {
      console.error("Retry embedding failed for pending news:", item.url, error);
    }
  }

  return processed;
};
 