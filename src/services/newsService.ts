import mongoose from "mongoose";
import News from "@/models/news";

interface SimilarHistoricalItem {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  sentiment?: string;
  publishedAt: Date;
  marketData?: unknown;
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
  marketData?: unknown;
  similarHistorical: SimilarHistoricalItem[];
}

interface SimilarNewsResponse {
  success: true;
  data: SimilarNewsItem[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total: number;
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
    "embedding.0": { $exists: true },
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
        openPrice: 1,
        closePrice: 1,
        marketDirection: 1,
        marketDircetion: 1,
        "movement_OpenClose_%": 1,
        embedding: 1,
      })
      .lean(),
  ]);

  const data: SimilarNewsItem[] = [];

  for (const item of pageItems) {
    const embedding = Array.isArray(item.embedding) ? item.embedding : [];

    let similarHistorical: SimilarHistoricalItem[] = [];
    if (embedding.length > 0) {
      const itemId = typeof item._id === "string" ? new mongoose.Types.ObjectId(item._id) : item._id;
      const matchStage: Record<string, unknown> = {
        _id: { $ne: itemId },
      };
      if (item.url) {
        Object.assign(matchStage, { url: { $ne: item.url } });
      }

      // Run vector search with a higher candidate limit, then filter/normalize in JS
      const rawMatches = await News.aggregate<any>([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: embedding,
            numCandidates: 150,
            limit: 10,
          },
        },
        {
          $match: matchStage,
        },
        // Project all required fields (include `content` so frontend can display it)
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            coin: 1,
            sentiment: 1,
            publishedAt: 1,
            source: 1,
            url: 1,
            marketData: {
              $ifNull: [
                "$marketSnapshot",
                {
                  openPrice: "$openPrice",
                  closePrice: "$closePrice",
                  marketDirection: { $ifNull: ["$marketDirection", "$marketDircetion"] },
                  priceMovement: "$movement_OpenClose_%",
                },
              ],
            },
            similarityScore: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      // Post-process: dedupe by _id, normalize score to 0-1, filter threshold, limit to max 3
      const seen = new Set<string>();
      for (const m of rawMatches) {
        const matchId = String(m._id);
        if (seen.has(matchId)) continue; // dedupe

        // Normalize similarity score to fraction 0..1
        let score = typeof m.similarityScore === "number" ? m.similarityScore : 0;
        if (score > 1) {
          score = score / 100;
        }

        // Enforce 80% threshold
        if (score < 0.8) continue;

        seen.add(matchId);
        similarHistorical.push({
          _id: matchId,
          title: m.title,
          content: m.content,
          coin: m.coin,
          sentiment: m.sentiment,
          publishedAt: m.publishedAt,
          marketData: m.marketData,
          similarityScore: score,
        });

        if (similarHistorical.length >= 3) break; // cap
      }
    }

    const marketData =
      item.marketSnapshot ?? {
        openPrice: item.openPrice,
        closePrice: item.closePrice,
        marketDirection: item.marketDirection ?? item.marketDircetion,
        priceMovement: item["movement_OpenClose_%"],
      };

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
      marketData,
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
      total: totalCount,
    },
  };
};
