import mongoose from "mongoose";
import News from "@/models/news";

interface SimilarHistoricalItem {
  _id: string;
  title: string;
  coin?: string;
  sentiment?: string;
  publishedAt: Date;
  marketSnapshot?: unknown;
  similarityScore: number;
}

interface SimilarNewsItem {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  coins?: unknown[];
  sentiment?: string;
  publishedAt: Date;
  source?: string;
  url?: string;
  marketSnapshot?: unknown;
  similarHistorical: SimilarHistoricalItem[];
}

interface SimilarNewsResponse {
  success: true;
  data: SimilarNewsItem[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export const findSimilarNews = async ({
  page,
  limit,
  coin,
}: {
  page: number;
  limit: number;
  coin?: string;
}): Promise<SimilarNewsResponse> => {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Invalid page value. Page must be a positive integer.");
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Invalid limit value. Limit must be a positive integer.");
  }

  const queryFilter: Record<string, unknown> = {
    isEmbedded: true,
    embedding: { $exists: true },
  };

  if (coin) {
    queryFilter.coin = coin;
  }

  const skip = (page - 1) * limit;

  const [totalCount, pageItems] = await Promise.all([
    News.countDocuments(queryFilter),
    News.find(queryFilter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        title: 1,
        content: 1,
        coin: 1,
        coins: 1,
        sentiment: 1,
        publishedAt: 1,
        source: 1,
        url: 1,
        marketSnapshot: 1,
        embedding: 1,
      })
      .lean(),
  ]);

  const data: SimilarNewsItem[] = [];

  for (const item of pageItems) {
    const embedding = Array.isArray(item.embedding) ? item.embedding : [];

    const similarHistorical =
      embedding.length > 0
        ? await News.aggregate<SimilarHistoricalItem>([
            {
              $vectorSearch: {
                index: "news_vector_index",
                path: "embedding",
                queryVector: embedding,
                numCandidates: 100,
                limit: 4,
                filter: {
                  isEmbedded: true,
                  embedding: { $exists: true },
                },
              },
            },
            {
              $match: {
                _id: { $ne: item._id },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                coin: 1,
                coins: 1,
                sentiment: 1,
                publishedAt: 1,
                source: 1,
                marketSnapshot: 1,
                similarityScore: { $meta: "vectorSearchScore" },
              },
            },
            {
              $limit: 3,
            },
          ])
        : [];

    data.push({
      _id: String(item._id),
      title: item.title,
      content: item.content,
      coin: item.coin,
      coins: item.coins,
      sentiment: item.sentiment,
      publishedAt: item.publishedAt,
      source: item.source,
      url: item.url,
      marketSnapshot: item.marketSnapshot,
      similarHistorical,
    });
  }

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      hasMore: page * limit < totalCount,
    },
  };
};
