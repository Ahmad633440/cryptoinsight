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
    // Verify request comes with an optional secret header set by GitHub Actions
    // If GHA_CRON_SECRET is defined in the runtime env, require callers to include
    // that secret in the `x-github-actions-secret` header (or authorization).
    const incomingSecret = request.headers.get("x-github-actions-secret") || request.headers.get("authorization");
    if (process.env.GHA_CRON_SECRET && incomingSecret !== process.env.GHA_CRON_SECRET) {
      console.warn('[CRON] Unauthorized request to news-sync');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
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