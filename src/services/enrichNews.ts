
/**
 * News enrichment service - enriches news articles with market data from CoinMarketCap
 * 
 * Flow:
 * 1. Find unenriched news articles
 * 2. Use detected coins (or fall back to coin detection)
 * 3. Fetch current market data from CoinMarketCap for primary coin
 * 4. Store market data as priceBefore, marketCapBefore, volume24hBefore
 * 5. Mark as enriched and schedule for price update
 * 
 * Multi-coin support:
 * - Articles can have multiple detected coins
 * - Enrichment focuses on primary coin (highest confidence)
 * - Other coins are available in coins array for future features
 */

import News from "@/models/news";
import { detectCoin, validateCoin } from "./detectCoin";
import { getQuoteBySymbol } from "@/lib/coingecko";
import { CoinQuote, EnrichmentResult } from "@/data/types";

/**
 * Get the primary coin to enrich
 * Priority:
 * 1. Use highest confidence coin from coins array
 * 2. Fall back to legacy coin field
 * 3. Run coin detection
 */
const getPrimaryCoin = async (
  newsDoc: any
): Promise<{ symbol: string; confidence: string } | null> => {
  // Check if coins array has data
  if (newsDoc.coins && newsDoc.coins.length > 0) {
    const primaryCoin = newsDoc.coins[0]; // Already sorted by score
    console.log(
      `[ENRICHMENT] Using detected coin: ${primaryCoin.symbol} (${primaryCoin.confidence})`
    );
    return {
      symbol: primaryCoin.symbol,
      confidence: primaryCoin.confidence,
    };
  }

  // Fall back to legacy coin field
  if (newsDoc.coin) {
    console.log(`[ENRICHMENT] Using legacy coin field: ${newsDoc.coin}`);
    return {
      symbol: newsDoc.coin,
      confidence: "legacy",
    };
  }

  // Run detection as fallback
  const detected = detectCoin(newsDoc.title, newsDoc.content || undefined);
  if (detected) {
    console.log(
      `[ENRICHMENT] Detected coin via fallback: ${detected.symbol} (${detected.confidence})`
    );
    return {
      symbol: detected.symbol,
      confidence: detected.confidence,
    };
  }

  return null;
};

/**
 * Enrich a single news article with market data
 */
export const enrichSingleNews = async (newsId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return { success: false, error: "News not found" };
    }

    if (news.isEnriched) {
      return { success: false, error: "Already enriched" };
    }

    // Step 1: Get primary coin to enrich
    const primaryCoin = await getPrimaryCoin(news);

    if (!primaryCoin) {
      // Edge case: General news (not related to any specific coin)
      news.isEnriched = true;
      news.enrichedAt = new Date();
      await news.save();
      console.log(`[ENRICHMENT] General news (no coin detected), marked as enriched: ${newsId}`);
      return { success: true };
    }

    // Step 2: Validate coin exists in CoinGecko
    const isValid = await validateCoin(primaryCoin.symbol);
    if (!isValid) {
      // Edge case: Coin mentioned but not in CoinMarketCap (invalid/new coin)
      news.isEnriched = true;
      news.enrichedAt = new Date();
      await news.save();
      console.warn(
        `[ENRICHMENT] Coin ${primaryCoin.symbol} not found in CoinGecko, marked as enriched without data: ${newsId}`
      );
      return { success: true };
    }

    // Step 3: Fetch current market data
    let marketData: CoinQuote | null = null;
    try {
      marketData = await getQuoteBySymbol(primaryCoin.symbol);
    } catch (error) {
      console.error(`Failed to fetch market data for ${primaryCoin.symbol}:`, error);
      return { success: false, error: "Failed to fetch market data" };
    }

    if (!marketData) {
      return { success: false, error: "No market data available" };
    }

    // Step 4: Update news with market data
    news.coin = primaryCoin.symbol; // Update legacy field for backward compatibility
    news.coinId = marketData.id;
    news.priceBefore = marketData.price;
    news.priceChangePercent = marketData.percentChange24h ?? 0;
    news.impactDurationHours = 24;
    news.isEnriched = true;
    news.enrichedAt = new Date();

    await news.save();

    console.log(
      `[ENRICHED] News ${newsId}: ${primaryCoin.symbol} @ $${marketData.price.toFixed(2)}`
    );
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to enrich news ${newsId}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Enrich all unenriched news articles
 * @param limit - Maximum number of articles to process (default: 50)
 */
export const enrichNews = async (limit: number = 50): Promise<EnrichmentResult> => {
  const result: EnrichmentResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Connect to MongoDB
    const { connectDB } = await import("@/lib/db");
    await connectDB();

    // Find unenriched news articles
    const unenrichedNews = await News.find({ isEnriched: false })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    console.log(`Found ${unenrichedNews.length} unenriched news articles`);

    for (const news of unenrichedNews) {
      const enrichmentResult = await enrichSingleNews(news._id.toString());

      if (enrichmentResult.success) {
        result.success++;
      } else if (
        enrichmentResult.error === "No coin detected (general news)" ||
        enrichmentResult.error === "Coin not found in CMC"
      ) {
        result.skipped++;
      } else {
        result.failed++;
        result.errors.push(`News ${news._id}: ${enrichmentResult.error}`);
      }

      // Small delay to avoid API rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Enrichment process failed:", errorMessage);
    result.errors.push(`Process error: ${errorMessage}`);
    return result;
  }
};

export default enrichNews;