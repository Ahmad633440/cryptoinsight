/**
 * Price update service - fetches market data 24h after article published
 * 
 * Flow:
 * 1. Find news articles published 24+ hours ago without market data
 * 2. Has coins detected (coins[] array populated)
 * 3. Fetch current market data from CoinMarketCap for primary coin
 * 4. Store priceAfter, marketCapAfter, volume24hAfter
 */

import News from "@/models/news";
import { getQuoteBySymbol } from "@/lib/coinMarketCap";
import { PriceUpdateResult } from "@/data/types";

/**
 * Update market data for a single news article (24h after publish)
 */
export const updateSinglePrice = async (newsId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return { success: false, error: "News not found" };
    }

    // Check if already updated
    if (news.priceAfter !== undefined && news.priceAfter !== null) {
      return { success: false, error: "Already updated" };
    }

    // Check if we have coins to track
    if (!news.coins || news.coins.length === 0) {
      return { success: false, error: "No coins detected" };
    }

    // Check if 24 hours have passed since publish
    if (news.publishedAt) {
      const hoursSincePublish = (Date.now() - news.publishedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSincePublish < 24) {
        return { success: false, error: `Not ready (${(24 - hoursSincePublish).toFixed(1)}h remaining)` };
      }
    }

    // Get market data for primary coin (highest score)
    const primaryCoin = news.coins[0];
    let marketData;
    try {
      marketData = await getQuoteBySymbol(primaryCoin.symbol);
    } catch (error) {
      console.error(`[PRICE UPDATE] Failed to fetch data for ${primaryCoin.symbol}:`, error);
      return { success: false, error: `Failed to fetch CMC data for ${primaryCoin.symbol}` };
    }

    if (!marketData) {
      return { success: false, error: "No market data available from CMC" };
    }

    // Validate all required fields are present
    if (marketData.price === undefined || marketData.marketCap === undefined || marketData.volume24h === undefined) {
      console.warn(`[PRICE UPDATE] Incomplete market data for ${primaryCoin.symbol}:`, marketData);
      return { success: false, error: "Incomplete market data from API" };
    }

    // Store the 24h values
    news.priceAfter = marketData.price;
    news.marketCapAfter = marketData.marketCap;
    news.volume24hAfter = marketData.volume24h;
    news.priceUpdatedAt = new Date();

    await news.save();

    console.log(
      `[PRICE UPDATE] ✅ Updated ${primaryCoin.symbol}: $${marketData.price.toFixed(2)} ` +
      `| MCap: $${(marketData.marketCap / 1e9).toFixed(2)}B | Vol: $${(marketData.volume24h / 1e6).toFixed(2)}M`
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[PRICE UPDATE] ❌ Failed for news ${newsId}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Update prices for all news articles pending 24h update
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
    // Connect to MongoDB
    const { connectDB } = await import("@/lib/db");
    await connectDB();

    // Find articles published 24+ hours ago with coins but no priceAfter yet
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingUpdates = await News.find({
      coinsDetected: true,
      coins: { $exists: true, $ne: [] },
      $or: [
        { priceAfter: { $exists: false } },
        { priceAfter: null },
      ],
      publishedAt: { $lte: twentyFourHoursAgo },
    })
      .sort({ publishedAt: 1 })
      .limit(limit)
      .lean();

    console.log(`[PRICE UPDATE] Found ${pendingUpdates.length} articles ready for 24h update`);

    for (const news of pendingUpdates) {
      const updateResult = await updateSinglePrice(news._id.toString());

      if (updateResult.success) {
        result.success++;
      } else if (updateResult.error?.includes("Not ready")) {
        result.skipped++;
      } else {
        result.failed++;
        result.errors.push(`${news._id}: ${updateResult.error}`);
      }

      // Small delay to avoid API rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`[PRICE UPDATE] Complete - Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[PRICE UPDATE] Process failed:", errorMessage);
    result.errors.push(`Process error: ${errorMessage}`);
    return result;
  }
};

export default updatePricesAfter24h;