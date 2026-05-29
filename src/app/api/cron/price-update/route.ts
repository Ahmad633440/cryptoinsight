import { updatePricesAfter24h } from "@/services/updateAfter24h";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes timeout

/**
 * Vercel Cron Job: Price Update (24h After Publish)
 * Captures market data 24 hours after article was published
 * Stores: priceAfter, marketCapAfter, volume24hAfter
 * Scheduled: Every hour via vercel.json
 * 
 * GET /api/cron/price-update
 */
export async function GET(request: Request) {
  try {
    console.log("[CRON] ========== Price update (Vercel - 24h after publish) ==========");
    console.log(`[CRON] Started at: ${new Date().toISOString()}`);

    const result = await updatePricesAfter24h(50);

    console.log(
      `[CRON] Success: ${result.success}, Failed: ${result.failed}, Skipped: ${result.skipped}`
    );

    if (result.errors.length > 0) {
      console.error("[CRON] ❌ Errors encountered:", result.errors.slice(0, 3));
    }

    return NextResponse.json({
      success: true,
      message: "Price update completed",
      success_count: result.success,
      failed: result.failed,
      skipped: result.skipped,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] ❌ Price update failed:", error);
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
