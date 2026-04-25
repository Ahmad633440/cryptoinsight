/**
 * Price update service - fetches updated prices 24h after news enrichment
 * 
 * Flow:
 * 1. Find news articles that were enriched 24+ hours ago
 * 2. Fetch current price from CoinMarketCap
 * 3. Calculate price change percentage
 * 4. Store priceAfter and priceChangePercent
 * 5. Mark as fully processed
 */

import News from "@/models/news";
import { getQuoteBySymbol } from "@/lib/coinMarketCap";

export interface PriceUpdateResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

/**
 * Update price for a single news article
 */
export const updateSinglePrice = async (newsId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return { success: false, error: "News not found" };
    }

    // Check if already updated
    if (news.priceAfter !== undefined && news.priceAfter !== null) {
      return { success: false, error: "Price already updated" };
    }

    // Check if coin is available
    if (!news.coin) {
      return { success: false, error: "No coin associated" };
    }

    // Check if enough time has passed (24 hours)
    if (news.enrichedAt) {
      const hoursSinceEnrichment = (Date.now() - news.enrichedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceEnrichment < 24) {
        return { success: false, error: "Not enough time passed (less than 24h)" };
      }
    }

    // Fetch current price
    let marketData;
    try {
      marketData = await getQuoteBySymbol(news.coin);
    } catch (error) {
      console.error(`Failed to fetch price for ${news.coin}:`, error);
      return { success: false, error: "Failed to fetch current price" };
    }

    if (!marketData) {
      return { success: false, error: "No market data available" };
    }

    // Store the new price
    news.priceAfter = marketData.price;

    // Calculate price change percentage
    if (news.priceBefore && news.priceBefore > 0) {
      news.priceChangePercent = ((marketData.price - news.priceBefore) / news.priceBefore) * 100;
    }

    // Update timestamp
    news.priceUpdatedAt = new Date();

    await news.save();

    console.log(
      `Updated price for ${news.coin}: $${news.priceBefore?.toFixed(2)} → $${marketData.price.toFixed(2)} ` +
      `(${news.priceChangePercent?.toFixed(2)}%)`
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to update price for news ${newsId}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Update prices for all news articles pending 24h price update
 * @param limit - Maximum number of articles to process (default: 50)
 */
export const updatePricesAfter24h = async (limit: number = 50): Promise<PriceUpdateResult> => {
  const result: PriceUpdateResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Find news articles ready for price update
    // Articles enriched 24+ hours ago that don't have priceAfter yet
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingUpdates = await News.find({
      isEnriched: true,
      coin: { $exists: true, $ne: null },
      $or: [
        { priceAfter: { $exists: false } },
        { priceAfter: null },
      ],
      enrichedAt: { $lte: twentyFourHoursAgo },
    })
      .sort({ enrichedAt: 1 })
      .limit(limit)
      .lean();

    console.log(`Found ${pendingUpdates.length} news articles pending price update`);

    for (const news of pendingUpdates) {
      const updateResult = await updateSinglePrice(news._id.toString());

      if (updateResult.success) {
        result.success++;
      } else if (updateResult.error === "Not enough time passed (less than 24h)") {
        result.skipped++;
      } else {
        result.failed++;
        result.errors.push(`News ${news._id}: ${updateResult.error}`);
      }

      // Small delay to avoid API rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Price update process failed:", errorMessage);
    result.errors.push(`Process error: ${errorMessage}`);
    return result;
  }
};

/**
 * Get news articles with price change data (for analytics)
 */
export const getNewsWithPriceImpact = async (limit: number = 100): Promise<typeof News[]> => {
  return News.find({
    isEnriched: true,
    priceAfter: { $exists: true, $ne: null },
    priceChangePercent: { $exists: true, $ne: null },
  })
    .sort({ priceChangePercent: -1 })
    .limit(limit)
    .lean();
};

/**
 * Get aggregated price impact by coin
 */
export const getPriceImpactByCoin = async (): Promise<Record<string, { avgChange: number; count: number }>> => {
  const pipeline = [
    {
      $match: {
        isEnriched: true,
        priceChangePercent: { $exists: true, $ne: null },
        coin: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$coin",
        avgChange: { $avg: "$priceChangePercent" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 as const },
    },
  ];

  const results = await News.aggregate(pipeline as any);

  return results.reduce((acc, item) => {
    acc[item._id] = {
      avgChange: item.avgChange,
      count: item.count,
    };
    return acc;
  }, {} as Record<string, { avgChange: number; count: number }>);
};

export default updatePricesAfter24h;