/**
 * Pipeline management API for enrichment and coin detection
 * 
 * Endpoints:
 * - POST /api/pipeline?action=enrich - Trigger news enrichment
 * - POST /api/pipeline?action=detect-coins - Trigger coin detection for legacy news
 * - POST /api/pipeline?action=update-prices - Trigger price updates (24h after enrichment)
 * - GET /api/pipeline - Get enrichment and detection status
 */

import { connectDB } from "@/lib/db";
import { enrichNews } from "@/services/enrichNews";
import { updatePricesAfter24h } from "@/services/updateAfter24h";
import { detectCoinsForLegacyNews, getCoinDetectionStats } from "@/services/coinDetectionService";
import { NextResponse } from "next/server";


// Trigger pipeline actions
export async function POST(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "enrich") {
      const limit = parseInt(searchParams.get("limit") || "50");
      console.log(`[API] Manual enrichment triggered (limit: ${limit})`);
      
      const result = await enrichNews(limit);
      
      return NextResponse.json({
        success: true,
        action: "enrich",
        result,
      });
    }

    if (action === "detect-coins") {
      const limit = parseInt(searchParams.get("limit") || "100");
      console.log(`[API] Manual coin detection triggered (limit: ${limit})`);
      
      const result = await detectCoinsForLegacyNews(limit);
      
      return NextResponse.json({
        success: true,
        action: "detect-coins",
        result,
      });
    }

    if (action === "update-prices") {
      const limit = parseInt(searchParams.get("limit") || "50");
      console.log(`[API] Manual price update triggered (limit: ${limit})`);
      
      const result = await updatePricesAfter24h(limit);
      
      return NextResponse.json({
        success: true,
        action: "update-prices",
        result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action. Use ?action=enrich, ?action=detect-coins, or ?action=update-prices",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in pipeline trigger:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get pipeline status
export async function GET() {
  try {
    await connectDB();

    const News = (await import("@/models/news")).default;

    const [
      totalNews,
      enrichedNews,
      pendingEnrichment,
      withPriceAfter,
      pendingPriceUpdate,
      coinsDetectionStats,
    ] = await Promise.all([
      News.countDocuments({}),
      News.countDocuments({ isEnriched: true }),
      News.countDocuments({ isEnriched: false }),
      News.countDocuments({ priceAfter: { $exists: true, $ne: null } }),
      News.countDocuments({
        isEnriched: true,
        priceAfter: { $exists: false },
      }),
      getCoinDetectionStats(),
    ]);

    return NextResponse.json({
      success: true,
      status: {
        // Enrichment pipeline
        total: totalNews,
        enriched: enrichedNews,
        pendingEnrichment,
        withPriceAfter,
        pendingPriceUpdate,
        
        // Coin detection pipeline
        coinsDetected: coinsDetectionStats.coinsDetected,
        pendingCoinDetection: coinsDetectionStats.pending,
        coinsNotFoundInArticles: coinsDetectionStats.coinsNotDetected,
      },
    });
  } catch (error) {
    console.error("Error getting pipeline status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}