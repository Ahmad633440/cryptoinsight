import { detectCoinsForLegacyNews } from "@/services/coinDetectionService";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes timeout

/**
 * Vercel Cron Job: Coin Detection (Legacy Data)
 * Detects coins for news articles that don't have coin data yet
 * Scheduled: Every 5 minutes via vercel.json
 * 
 * GET /api/cron/coin-detection
 */
export async function GET(request: Request) {
  try {
    console.log("[CRON] ========== Coin detection (Vercel - legacy data) ==========");
    console.log(`[CRON] Started at: ${new Date().toISOString()}`);

    const result = await detectCoinsForLegacyNews(100);

    console.log(
      `[CRON] Updated: ${result.updated}, Processed: ${result.processed}, Skipped: ${result.skipped}`
    );

    if (result.errors.length > 0) {
      console.warn("[CRON] ⚠️ Errors encountered:", result.errors.slice(0, 3));
    }

    return NextResponse.json({
      success: true,
      message: "Coin detection completed",
      updated: result.updated,
      processed: result.processed,
      skipped: result.skipped,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] ❌ Coin detection failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
