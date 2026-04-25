

/**
 * News enrichment service - enriches news articles with market data from CoinMarketCap
 * 
 * Flow:
 * 1. Find unenriched news articles
 * 2. Detect which coin the news is about
 * 3. Fetch current market data from CoinMarketCap
 * 4. Store market data as priceBefore, marketCapBefore, volume24hBefore
 * 5. Mark as enriched and schedule for price update
 */

import News from "@/models/news";
import { detectCoin, validateCoin } from "./detectCoin";
import { getQuoteBySymbol } from "@/lib/coinMarketCap";
import { CoinQuote, EnrichmentResult } from "@/data/types";



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

    // Step 1: Detect coin
    const detectedCoin = detectCoin(news.title, news.content || undefined);
    
    if (!detectedCoin) {
      // Mark as enriched but without coin data (skip processing)
      news.isEnriched = true;
      news.enrichedAt = new Date();
      await news.save();
      return { success: false, error: "No coin detected" };
    }

    // Step 2: Validate coin exists in CoinMarketCap
    const isValid = await validateCoin(detectedCoin.symbol);
    if (!isValid) {
      console.warn(`Coin ${detectedCoin.symbol} not found in CoinMarketCap, skipping`);
      return { success: false, error: "Coin not found in CMC" };
    }

    // Step 3: Fetch current market data
    let marketData: CoinQuote | null = null;
    try {
      marketData = await getQuoteBySymbol(detectedCoin.symbol);
    } catch (error) {
      console.error(`Failed to fetch market data for ${detectedCoin.symbol}:`, error);
      return { success: false, error: "Failed to fetch market data" };
    }

    if (!marketData) {
      return { success: false, error: "No market data available" };
    }

    // Step 4: Update news with market data
    news.coin = detectedCoin.symbol;
    news.coinId = marketData.id;
    news.priceBefore = marketData.price;
    news.marketCapBefore = marketData.marketCap;
    news.volume24hBefore = marketData.volume24h;
    news.isEnriched = true;
    news.enrichedAt = new Date();
    news.priceUpdatedAt = new Date(); // Schedule for price update in 24h

    await news.save();

    console.log(`Enriched news ${newsId}: ${detectedCoin.symbol} @ $${marketData.price.toFixed(2)}`);
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
      } else if (enrichmentResult.error === "No coin detected" || enrichmentResult.error === "Coin not found in CMC") {
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

/**
 * Get news articles pending price update (24h after enrichment)
 */
export const getNewsPendingPriceUpdate = async (): Promise<typeof News[]> => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return News.find({
    isEnriched: true,
    priceAfter: { $exists: false },
    priceUpdatedAt: { $lte: twentyFourHoursAgo },
    coin: { $exists: true, $ne: null },
  }).lean();
};

export default enrichNews;