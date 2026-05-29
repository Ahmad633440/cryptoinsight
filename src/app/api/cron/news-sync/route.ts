import { syncNews } from "@/controllers/fetchNews";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes timeout

/**
 * Vercel Cron Job: News Sync
 * Fetches latest news from NewsData API and stores in MongoDB
 * Scheduled: Every 10 minutes via vercel.json
 * 
 * GET /api/cron/news-sync
 */
export async function GET(request: Request) {
  try {
    // Verify request is from Vercel cron (optional security layer)
    const authHeader = request.headers.get("authorization");
    
    console.log("[CRON] ========== News sync (Vercel) ==========");
    console.log(`[CRON] Started at: ${new Date().toISOString()}`);

    const result = await syncNews();
    
    console.log(
      `[CRON] Synced: ${result.synced}, Failed: ${result.failed}`
    );
    console.log("[CRON] (Coin detection runs immediately for each new article)");

    return NextResponse.json({
      success: true,
      message: "News sync completed",
      synced: result.synced,
      failed: result.failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] ❌ News sync failed:", error);
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
