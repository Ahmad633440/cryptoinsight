
/**
 * Cron jobs for crypto news enrichment pipeline
 * 
 * Jobs:
 * 1. News sync - fetches news from external API (every 30 min)
 * 2. Coin detection - auto-detects coins in pending news (every 10 min)
 * 3. News enrichment - enriches news with market data (every 15 min)
 * 4. Price update - updates prices 24h after enrichment (every hour)
 */

import { syncNews } from "@/controllers/fetchNews";
import { enrichNews } from "@/services/enrichNews";
import { updatePricesAfter24h } from "@/services/updateAfter24h";
import { detectCoinsForLegacyNews } from "@/services/coinDetectionService";
import cron from "node-cron";

// Job 1: News sync - every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("[CRON] Starting news sync...");
    const result = await syncNews();
    console.log(`[CRON] News sync completed. Result:`, result);
  } catch (error) {
    console.error("[CRON] News sync failed:", error);
  }
});

// Job 2: Coin detection - every 10 minutes
// Detects coins for news articles that haven't been processed yet
// This is the background worker for legacy news documents
cron.schedule("*/10 * * * *", async () => {
  try {
    console.log("[CRON] Starting coin detection (legacy data)...");
    const result = await detectCoinsForLegacyNews(100);
    console.log(
      `[CRON] Coin detection completed. Updated: ${result.updated}, Skipped: ${result.skipped}, Processed: ${result.processed}`
    );
    if (result.errors.length > 0) {
      console.warn("[CRON] Coin detection errors:", result.errors.slice(0, 3));
    }
  } catch (error) {
    console.error("[CRON] Coin detection failed:", error);
  }
});

// Job 3: News enrichment - every 15 minutes
// Enrichs newly fetched news with coin detection and market data
cron.schedule("*/15 * * * *", async () => {
  try {
    console.log("[CRON] Starting news enrichment...");
    const result = await enrichNews(50);
    console.log(
      `[CRON] News enrichment completed. Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`
    );
    if (result.errors.length > 0) {
      console.error("[CRON] Enrichment errors:", result.errors);
    }
  } catch (error) {
    console.error("[CRON] News enrichment failed:", error);
  }
});

// Job 4: Price update - every hour
// Updates prices 24h after news was enriched
cron.schedule("0 * * * *", async () => {
  try {
    console.log("[CRON] Starting price update (24h after enrichment)...");
    const result = await updatePricesAfter24h(50);
    console.log(
      `[CRON] Price update completed. Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`
    );
    if (result.errors.length > 0) {
      console.error("[CRON] Price update errors:", result.errors);
    }
  } catch (error) {
    console.error("[CRON] Price update failed:", error);
  }
});

export default cron;
