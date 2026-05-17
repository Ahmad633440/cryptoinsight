/**
 * Immediate Enrichment Service
 * Runs immediately after coin detection for newly fetched news
 * 
 * Fetches market data from CoinMarketCap and stores:
 * - priceBefore, priceAfter
 * - marketCapBefore, marketCapAfter  
 * - volume24hBefore, volume24hAfter
 */

import News from "@/models/news";
import { getQuoteBySymbol } from "@/lib/coinMarketCap";
import { CoinQuote } from "@/data/types";

/**
 * Immediately enrich a single news article with market data
 * Called right after coin detection succeeds
 * 
 * @param newsId - MongoDB news document ID
 * @param coinSymbol - Coin symbol to enrich (e.g., "BTC")
 * @returns Success status
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

    // Fetch market data from CoinMarketCap
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
      return { success: false, error: "Incomplete market data from CoinMarketCap" };
    }

    // Store market data snapshot
    news.priceBefore = marketData.price;
    news.marketCapBefore = marketData.marketCap;
    news.volume24hBefore = marketData.volume24h;

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
      `MarketCap: $${(marketData.marketCap / 1e9).toFixed(2)}B, ` +
      `Volume24h: $${(marketData.volume24h / 1e9).toFixed(2)}B`
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

/**
 * Update price data 24 hours after enrichment
 * Called by updatePricesAfter24h cron job
 */
export const updatePriceAfter24h = async (newsId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return { success: false, error: "News not found" };
    }

    // Check if enriched and has coin
    if (!news.isEnriched || !news.coins || news.coins.length === 0) {
      return { success: false, error: "News not enriched or no coins detected" };
    }

    // Check if price already updated
    if (news.priceAfter !== undefined && news.priceAfter !== null) {
      return { success: false, error: "Price already updated" };
    }

    // Check if enough time has passed (24 hours)
    if (news.enrichedAt) {
      const hoursSinceEnrichment = (Date.now() - news.enrichedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceEnrichment < 24) {
        return {
          success: false,
          error: `Not enough time passed (${hoursSinceEnrichment.toFixed(1)}/24 hours)`,
        };
      }
    }

    // Get primary coin
    const primaryCoin = news.coins[0];
    console.log(
      `[PRICE UPDATE] Fetching 24h price for ${primaryCoin.symbol} (news: ${newsId})`
    );

    // Fetch current price
    let marketData: CoinQuote | null = null;
    try {
      marketData = await getQuoteBySymbol(primaryCoin.symbol);
    } catch (error) {
      console.error(
        `[PRICE UPDATE] Failed to fetch price for ${primaryCoin.symbol}:`,
        error
      );
      return { success: false, error: "Failed to fetch current price" };
    }

    if (!marketData) {
      return { success: false, error: "No market data available" };
    }

    // Store 24h price data
    news.priceAfter = marketData.price;
    news.marketCapAfter = marketData.marketCap;
    news.volume24hAfter = marketData.volume24h;
    news.priceUpdatedAt = new Date();

    await news.save();

    // Calculate price change
    const priceChange = news.priceBefore ? news.priceAfter - news.priceBefore : 0;
    const priceChangePercent = news.priceBefore
      ? ((priceChange / news.priceBefore) * 100).toFixed(2)
      : 0;

    console.log(
      `[PRICE UPDATE] ✅ Updated for ${newsId} (${primaryCoin.symbol}): ` +
      `$${news.priceBefore?.toFixed(2)} → $${marketData.price.toFixed(2)} ` +
      `(${priceChangePercent}%)`
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[PRICE UPDATE] ❌ Failed for ${newsId}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

export default {
  enrichNewsImmediately,
  updatePriceAfter24h,
};
