/**
 * Pipeline management API for news processing
 * 
 * Processing Flow:
 * 1. News fetched from external API (NewsData.io)
 * 2. Coin detection runs IMMEDIATELY (NLP/entity detection)
 * 3. 24 hours after publish: Market data captured (price, marketcap, volume)
 * 
 * Endpoints:
 * - POST /api/pipeline?action=detect-coins - Trigger coin detection for legacy news
 * - POST /api/pipeline?action=update-prices - Trigger 24h price updates
 * - GET /api/pipeline - Get pipeline status
 */

import { connectDB } from "@/lib/db";
import { updatePricesAfter24h } from "@/services/updateAfter24h";
import { detectCoinsForLegacyNews, getCoinDetectionStats } from "@/services/coinDetectionService";
import { NextResponse } from "next/server";


// Manual triggers for pipeline actions
export async function POST(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "detect-coins") {
      const limit = parseInt(searchParams.get("limit") || "100");
      console.log(`[API] Manual coin detection triggered (limit: ${limit})`);
      
      const result = await detectCoinsForLegacyNews(limit);
      
      return NextResponse.json({
        success: true,
        action: "detect-coins",
        description: "Detect coins for legacy news (created before auto-detection existed)",
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
        description: "Capture market data 24 hours after article published",
        result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action. Use ?action=detect-coins or ?action=update-prices",
        availableActions: {
          detectCoins: "POST /api/pipeline?action=detect-coins&limit=100",
          updatePrices: "POST /api/pipeline?action=update-prices&limit=50",
          getStatus: "GET /api/pipeline"
        }
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("[API] Error in pipeline trigger:", error);
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
// export async function GET() {
//   try {
//     await connectDB();

//     const News = (await import("@/models/news")).default;

//     const [
//       totalNews,
//       enriched,
//       pendingPriceUpdate,
//       withPriceAfter,
//       coinsDetectionStats,
//     ] = await Promise.all([
//       News.countDocuments({}),
//       News.countDocuments({ isEnriched: true }),
//       News.countDocuments({
//         isEnriched: true,
//         $or: [
//           { priceAfter: { $exists: false } },
//           { priceAfter: null }
//         ]
//       }),
//       News.countDocuments({ priceAfter: { $exists: true, $ne: null } }),
//       getCoinDetectionStats(),
//     ]);

//     return NextResponse.json({
//       success: true,
//       description: "News processing pipeline status",
//       status: {
//         overview: {
//           total: totalNews,
//           description: "Total news articles in database"
//         },
//         coinDetection: {
//           detected: coinsDetectionStats.coinsDetected,
//           pending: coinsDetectionStats.pending,
//           notFound: coinsDetectionStats.coinsNotDetected,
//           description: "Coins detected from article text"
//         },
//         enrichment: {
//           enriched: enriched,
//           description: "News with market data snapshot (priceBefore, marketCapBefore, volume24hBefore)"
//         },
//         priceUpdate: {
//           updated: withPriceAfter,
//           pending: pendingPriceUpdate,
//           description: "Articles that need 24h price update (priceAfter, marketCapAfter, volume24hAfter)"
//         }
//       },
//       pipeline: {
//         step1: "News fetched from external API",
//         step2: "Coin detection runs immediately (finds coins mentioned in article)",
//         step3: "Enrichment runs immediately (fetches market data from CoinMarketCap)",
//         step4: "24 hours later: Price update runs (fetches current market data for comparison)"
//       }
//     });
//   } catch (error) {
//     console.error("[API] Error getting pipeline status:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to get status",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }