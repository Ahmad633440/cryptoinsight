/**
 * Coin detection service - automatically detects coins in news articles
 * Runs on news creation and as a background worker for legacy documents
 * 
 * Architecture:
 * - Detects multiple coins per article
 * - Stores in coins array with confidence scores
 * - Provides background worker for legacy data
 * - Integrates with enrichment pipeline
 */

import News from "@/models/news";
import { detectCoinsMultiple } from "./detectCoin";
import { DetectedCoinData, CoinDetectionResult } from "@/data/types";
import { connectDB } from "@/lib/db";

/**
 * Auto-detect coins for a single news article
 * Updates coins array in the document
 * Also triggers immediate enrichment if coins are detected
 * @param newsId - MongoDB news document ID
 * @returns Success status and detected coins
 */
export const detectCoinsForNews = async (
  newsId: string
): Promise<{ success: boolean; coins?: DetectedCoinData[]; error?: string }> => {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return { success: false, error: "News not found" };
    }

    // Skip if already detected
    if (news.coinsDetected && news.coins && news.coins.length > 0) {
      return { success: false, error: "Coins already detected" };
    }

    // Detect multiple coins
    const detectedCoins = detectCoinsMultiple(news.title, news.content, undefined);

    // Update document with detected coins
    news.coins = detectedCoins;
    news.coinsDetected = true;
    news.coinsDetectedAt = new Date();

    // For backward compatibility: set single 'coin' field to the highest confidence coin
    if (detectedCoins.length > 0) {
      news.coin = detectedCoins[0].symbol;
    }

    await news.save();

    // Log detected coins
    if (detectedCoins.length > 0) {
      const coinSymbols = detectedCoins
        .map((c) => `${c.symbol}(${c.confidence}:${c.score})`)
        .join(", ");
      console.log(
        `[COIN DETECTION] News ${newsId}: Detected coins: ${coinSymbols}`
      );
      
      // Trigger immediate enrichment for the primary coin
      try {
        const { enrichNewsImmediately } = await import("./immediateEnrichmentService");
        const enrichResult = await enrichNewsImmediately(
          newsId,
          detectedCoins[0].symbol
        );
        if (enrichResult.success) {
          console.log(
            `[COIN DETECTION → ENRICHMENT] ✅ Enriched news ${newsId} with ${detectedCoins[0].symbol}`
          );
        } else {
          console.warn(
            `[COIN DETECTION → ENRICHMENT] ⚠️ Enrichment failed for ${newsId}: ${enrichResult.error}`
          );
        }
      } catch (enrichError) {
        console.error(
          `[COIN DETECTION → ENRICHMENT] ❌ Enrichment error for ${newsId}:`,
          enrichError
        );
      }
    } else {
      console.log(`[COIN DETECTION] News ${newsId}: No coins detected`);
    }

    return { success: true, coins: detectedCoins };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[COIN DETECTION] Failed for news ${newsId}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

/**
 * Detect coins for multiple news articles (batch)
 * @param newsIds - Array of MongoDB news document IDs
 * @returns Summary of detection results
 */
export const detectCoinsForNewsBatch = async (
  newsIds: string[]
): Promise<CoinDetectionResult> => {
  const result: CoinDetectionResult = {
    processed: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const newsId of newsIds) {
    const detectionResult = await detectCoinsForNews(newsId);

    if (detectionResult.success) {
      result.updated++;
    } else if (detectionResult.error === "Coins already detected") {
      result.skipped++;
    } else {
      result.errors.push(`News ${newsId}: ${detectionResult.error}`);
    }

    result.processed++;
  }

  return result;
};

/**
 * Background worker: Detect coins for all news articles missing coin data
 * This function scans old MongoDB documents and updates them with detected coins
 * 
 * @param limit - Maximum number of articles to process per run (default: 100)
 * @returns Detection results summary
 */
export const detectCoinsForLegacyNews = async (
  limit: number = 100
): Promise<CoinDetectionResult> => {
  const result: CoinDetectionResult = {
    processed: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Connect to MongoDB
    await connectDB();

    // Find news articles that don't have coins array populated yet
    // This includes:
    // 1. New articles that haven't been processed by coin detection
    // 2. Old articles created before coins array was added
    const pendingNews = await News.find({
      $or: [{ coinsDetected: false }, { coinsDetected: { $exists: false } }],
    })
      .sort({ createdAt: -1 }) // Process newest first
      .limit(limit)
      .lean();

    console.log(
      `[BACKGROUND WORKER] Found ${pendingNews.length} news articles pending coin detection`
    );

    for (const newsDoc of pendingNews) {
      const detectionResult = await detectCoinsForNews(newsDoc._id.toString());

      if (detectionResult.success) {
        result.updated++;
      } else if (detectionResult.error === "Coins already detected") {
        result.skipped++;
      } else {
        result.errors.push(
          `News ${newsDoc._id}: ${detectionResult.error}`
        );
      }

      result.processed++;

      // Small delay to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(
      `[BACKGROUND WORKER] Coin detection completed. Processed: ${result.processed}, Updated: ${result.updated}, Skipped: ${result.skipped}`
    );

    if (result.errors.length > 0) {
      console.warn(
        `[BACKGROUND WORKER] ${result.errors.length} errors encountered:`,
        result.errors.slice(0, 5) // Log first 5 errors
      );
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[BACKGROUND WORKER] Coin detection process failed:", errorMessage);
    result.errors.push(`Process error: ${errorMessage}`);
    return result;
  }
};

/**
 * Get statistics about coin detection progress
 * @returns Statistics about detected vs pending news
 */
export const getCoinDetectionStats = async (): Promise<{
  totalNews: number;
  coinsDetected: number;
  pending: number;
  coinsNotDetected: number;
}> => {
  await connectDB();

  const [totalNews, coinsDetected, pending, coinsNotDetected] = await Promise.all([
    News.countDocuments({}),
    News.countDocuments({ coinsDetected: true }),
    News.countDocuments({
      $or: [{ coinsDetected: false }, { coinsDetected: { $exists: false } }],
    }),
    News.countDocuments({
      coinsDetected: true,
      coins: { $exists: true, $eq: [] }, // Detected but no coins found
    }),
  ]);

  return {
    totalNews,
    coinsDetected,
    pending,
    coinsNotDetected,
  };
};

/**
 * Manual trigger to process all pending coin detections
 * Useful for admin operations or scheduled tasks
 */
export const processPendingCoinDetections = async (
  limit: number = 100
): Promise<CoinDetectionResult> => {
  console.log(
    `[MANUAL TRIGGER] Starting coin detection for up to ${limit} news articles...`
  );
  const result = await detectCoinsForLegacyNews(limit);
  console.log(
    `[MANUAL TRIGGER] Coin detection completed:`,
    result
  );
  return result;
};

export default {
  detectCoinsForNews,
  detectCoinsForNewsBatch,
  detectCoinsForLegacyNews,
  getCoinDetectionStats,
  processPendingCoinDetections,
};
