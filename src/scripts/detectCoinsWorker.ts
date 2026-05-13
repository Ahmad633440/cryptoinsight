/**
 * Background worker for coin detection
 * Scans old MongoDB news documents missing coins and updates them
 * 
 * Usage:
 * - Manual trigger via /api/pipeline?action=detect-coins
 * - Automated via cron job
 * - Standalone script: `node detectCoinsWorker.ts`
 */

import { connectDB } from "@/lib/db";
import { detectCoinsForLegacyNews, getCoinDetectionStats } from "@/services/coinDetectionService";

export async function runCoinDetectionWorker() {
  try {
    console.log("[COIN DETECTION WORKER] Starting...");
    
    // Get current stats
    const statsBefore = await getCoinDetectionStats();
    console.log("[COIN DETECTION WORKER] Stats before:", statsBefore);

    // Process pending coin detections
    const result = await detectCoinsForLegacyNews(100);

    // Get updated stats
    const statsAfter = await getCoinDetectionStats();
    console.log("[COIN DETECTION WORKER] Stats after:", statsAfter);

    console.log("[COIN DETECTION WORKER] Completed");
    console.log("[COIN DETECTION WORKER] Result:", {
      processed: result.processed,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.length,
    });

    return result;
  } catch (error) {
    console.error("[COIN DETECTION WORKER] Failed:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  connectDB()
    .then(() => runCoinDetectionWorker())
    .then(() => {
      console.log("[COIN DETECTION WORKER] Worker completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("[COIN DETECTION WORKER] Worker failed:", error);
      process.exit(1);
    });
}

export default runCoinDetectionWorker;
