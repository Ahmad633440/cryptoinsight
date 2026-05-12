/**
 * Manual trigger API for enrichment pipeline
 * 
 * Endpoints:
 * - POST /api/news/enrich - Trigger news enrichment
 * - POST /api/news/update-prices - Trigger price updates (24h after enrichment)
 */

import { connectDB } from "@/lib/db";
import { enrichNews } from "@/services/enrichNews";
import { updatePricesAfter24h } from "@/services/updateAfter24h";
import { NextResponse } from "next/server";

// Trigger news enrichment
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
        message: "Invalid action. Use ?action=enrich or ?action=update-prices",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in enrichment trigger:", error);
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

// Get enrichment status
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
    ] = await Promise.all([
      News.countDocuments({}),
      News.countDocuments({ isEnriched: true }),
      News.countDocuments({ isEnriched: false }),
      News.countDocuments({ priceAfter: { $exists: true, $ne: null } }),
      News.countDocuments({
        isEnriched: true,
        priceAfter: { $exists: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      status: {
        total: totalNews,
        enriched: enrichedNews,
        pendingEnrichment,
        withPriceAfter,
        pendingPriceUpdate,
      },
    });
  } catch (error) {
    console.error("Error getting enrichment status:", error);
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