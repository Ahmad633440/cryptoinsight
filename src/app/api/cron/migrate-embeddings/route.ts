import { embedPendingNews } from "@/services/embeddingServices";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes timeout

/**
 * Manual Embeddings Migration Endpoint
 * Processes pending news articles and generates embeddings
 * Can be called manually or scheduled as needed
 * 
 * Security: Requires CRON_SECRET token in Authorization header
 * POST /api/cron/migrate-embeddings
 * 
 * Headers:
 *   Authorization: Bearer {CRON_SECRET}
 * 
 * Example:
 *   curl -X POST \
 *     https://your-app.vercel.app/api/cron/migrate-embeddings \
 *     -H "Authorization: Bearer your_secret_token"
 */
export async function POST(request: Request) {
  try {
    // Security check: Verify CRON_SECRET
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("[MIGRATION] CRON_SECRET not configured");
      return NextResponse.json(
        { success: false, error: "Server not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[MIGRATION] ❌ Unauthorized access attempt");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[MIGRATION] ========== Starting embedding migration ==========");
    console.log(`[MIGRATION] Started at: ${new Date().toISOString()}`);

    await connectDB();

    let totalProcessed = 0;
    let batchCount = 0;
    let batchResult = 0;

    do {
      batchResult = await embedPendingNews(100);
      totalProcessed += batchResult;
      batchCount++;
      console.log(
        `[MIGRATION] Batch ${batchCount}: Processed ${batchResult} embeddings (total: ${totalProcessed})`
      );

      // Small delay between batches to avoid rate limiting
      if (batchResult > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } while (batchResult > 0);

    console.log(
      `[MIGRATION] ✅ Complete. Total processed: ${totalProcessed} (${batchCount} batches)`
    );

    return NextResponse.json({
      success: true,
      message: "Embedding migration completed",
      totalProcessed,
      batchCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[MIGRATION] ❌ Failed:", error);
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

/**
 * GET endpoint for health check / status
 */
export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    message: "Migration endpoint is ready",
    method: "POST",
    description: "Send POST request with Authorization header to run migration",
    timestamp: new Date().toISOString(),
  });
}
