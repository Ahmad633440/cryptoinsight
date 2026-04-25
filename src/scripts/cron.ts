
/**
 * Cron jobs for crypto news enrichment pipeline
 * 
 * Jobs:
 * 1. News sync - fetches news from external API (every 30 min)
 * 2. News enrichment - enriches news with market data (every 15 min)
 * 3. Price update - updates prices 24h after enrichment (every hour)
 */

import { syncNews } from "@/controllers/fetchNews";
import { enrichNews } from "@/services/enrichNews";
import { updatePricesAfter24h } from "@/services/updateAfter24h";
import cron from "node-cron";

// Job 1: News sync - every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Starting news sync...");
    const result = await syncNews();
    console.log(`News sync completed. Result:`, result);
  } catch (error) {
    console.error("News sync failed:", error);
  }
});

// Job 2: News enrichment - every 15 minutes
// Enrichs newly fetched news with coin detection and market data
cron.schedule("*/15 * * * *", async () => {
  try {
    console.log(" Starting news enrichment...");
    const result = await enrichNews(50);
    console.log(
      `News enrichment completed. Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`
    );
    if (result.errors.length > 0) {
      console.error("Enrichment errors:", result.errors);
    }
  } catch (error) {
    console.error("News enrichment failed:", error);
  }
});

// Job 3: Price update - every hour
// Updates prices 24h after news was enriched
cron.schedule("0 * * * *", async () => {
  try {
    console.log("Starting price update (24h after enrichment)...");
    const result = await updatePricesAfter24h(50);
    console.log(
      `Price update completed. Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`
    );
    if (result.errors.length > 0) {
      console.error("Price update errors:", result.errors);
    }
  } catch (error) {
    console.error("Price update failed:", error);
  }
});

export default cron;
