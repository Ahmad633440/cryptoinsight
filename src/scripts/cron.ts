
/**
 * Cron jobs for crypto news processing pipeline
 * 
 * Jobs:
 * 1. News sync - fetches news from external API (every 30 min)
 *    └─ Coin detection runs IMMEDIATELY for new articles
 * 2. Coin detection - auto-detects coins in legacy news (every 10 min)
 * 3. Price update - captures market data 24h after publish (every hour)
 */

import { syncNews } from "@/controllers/fetchNews";
import { updatePricesAfter24h } from "@/services/updateAfter24h";
import { detectCoinsForLegacyNews } from "@/services/coinDetectionService";
import cron from "node-cron";

// Job 1: News sync - every 30 minutes
// Fetches news from API and stores with immediate coin detection
cron.schedule("*/30 * * * *", async () => {
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
cron.schedule("*/10 * * * *", async () => {
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

// Job 3: Price update - every hour
// Captures market data 24 hours after article published
// Stores priceAfter, marketCapAfter, volume24hAfter
cron.schedule("0 * * * *", async () => {
  try {
    console.log("[CRON] ========== Price update (24h after publish) ==========");
    const result = await updatePricesAfter24h(50);
    console.log(
      `[CRON] Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`
    );
    if (result.errors.length > 0) {
      console.error("[CRON] ❌ Errors:", result.errors.slice(0, 3));
    }
  } catch (error) {
    console.error("[CRON] ❌ Price update failed:", error);
  }
});

export default cron;
