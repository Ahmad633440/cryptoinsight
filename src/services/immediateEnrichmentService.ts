/**
 Immediate Enrichment Service
 Runs immediately after coin detection for newly fetched news
 Stores the initial price snapshot and derived impact metrics.
 */

import News from "@/models/news";
import { getQuoteBySymbol } from "@/lib/coingecko";
import { CoinQuote } from "@/data/types";

/**
 Immediately enrich a single news article with market data
 Called right after coin detection succeeds
 
 @param newsId - MongoDB news document ID
@param coinSymbol - Coin symbol to enrich (e.g., "BTC")
 @returns Success status
 */
export const enrichNewsImmediately = async (
  newsId: string,
  coinSymbol: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return { success: false, error: "News not found" };
    }

    // Skip if already enriched
    if (news.isEnriched) {
      return { success: false, error: "Already enriched" };
    }

    console.log(
      `[IMMEDIATE ENRICHMENT] Starting enrichment for ${newsId} (coin: ${coinSymbol})`
    );

    // Fetch market data from CoinGecko
    let marketData: CoinQuote | null = null;
    try {
      marketData = await getQuoteBySymbol(coinSymbol);
    } catch (error) {
      console.error(
        `[IMMEDIATE ENRICHMENT] Failed to fetch market data for ${coinSymbol}:`,
        error
      );
      return { success: false, error: "Failed to fetch market data" };
    }

    if (!marketData) {
      console.warn(
        `[IMMEDIATE ENRICHMENT] No market data returned for ${coinSymbol}`
      );
      return { success: false, error: "No market data available" };
    }

    // Validate all required fields are present
    if (
      marketData.price === undefined ||
      marketData.marketCap === undefined ||
      marketData.volume24h === undefined
    ) {
      console.warn(
        `[IMMEDIATE ENRICHMENT] Incomplete market data for ${coinSymbol}:`,
        {
          price: marketData.price,
          marketCap: marketData.marketCap,
          volume24h: marketData.volume24h,
        }
      );
      return { success: false, error: "Incomplete market data from CoinGecko" };
    }

    const priceChangePercent = marketData.percentChange24h ?? 0;
    const impactDurationHours = 24;

    // Store market data snapshot
    news.priceBefore = marketData.price;
    news.priceChangePercent = priceChangePercent;
    news.impactDurationHours = impactDurationHours;

    // Mark as enriched
    news.isEnriched = true;
    news.enrichedAt = new Date();

    // Set coin fields for backward compatibility
    news.coin = coinSymbol;
    news.coinId = marketData.id;

    await news.save();

    console.log(
      `[IMMEDIATE ENRICHMENT] ✅ Success for ${newsId} (${coinSymbol}): ` +
      `Price: $${marketData.price.toFixed(2)}, ` +
      `Price change: ${priceChangePercent.toFixed(2)}%, ` +
      `Impact duration: ${impactDurationHours}h`
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[IMMEDIATE ENRICHMENT] ❌ Failed for ${newsId}:`,
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
};

export default {
  enrichNewsImmediately,
};
