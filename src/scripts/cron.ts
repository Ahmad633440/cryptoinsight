
/**
 * Cron jobs for crypto news processing pipeline
 * 
 * Jobs:
 * 1. News sync - fetches news from external API (every 30 min)
 *    └─ Coin detection runs IMMEDIATELY for new articles
 * 2. Coin detection - auto-detects coins in legacy news (every 10 min)
 */

import { syncNews } from "@/controllers/fetchNews";
import cron from "node-cron";


// npx tsx src/scripts/cron.ts


// Job 1: News sync - once daily
// Fetches news from API and stores with immediate coin detection
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("[CRON] ========== News sync ==========");
    const result = await syncNews();
    console.log(`[CRON] Synced: ${result.synced}, Failed: ${result.failed}`);
    console.log("[CRON] (Coin detection runs immediately for each new article)");
  } catch (error) {
    console.error("[CRON] ❌ News sync failed:", error);
  }
});

// Job 2: Coin detection - every 10 minutes
// Detects coins for OLD news that don't have coin data yet
// (for legacy articles created before coin detection was added)

//cron.schedule("*/5 * * * *", async () => {
  /*
  try {
    console.log("[CRON] ========== Coin detection (legacy data) ==========");
    const result = await detectCoinsForLegacyNews(100);
    console.log(
      `[CRON] Updated: ${result.updated}, Processed: ${result.processed}, Skipped: ${result.skipped}`
    );
    if (result.errors.length > 0) {
      console.warn("[CRON] ⚠️ Errors:", result.errors.slice(0, 3));
    }
  } catch (error) {
    console.error("[CRON] ❌ Coin detection failed:", error);
  }
});

*/


export default cron;
