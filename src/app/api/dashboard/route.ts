import { getLiveCoins } from "@/services/dashboardCoins";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard
 * Fetch top 100 coins with market data from CoinGecko API
 * 
 * Query params:
 * - force=true: Skip cache and fetch fresh data
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: CoinGeckoMarket[],
 *   meta: {
 *     count: number,
 *     timestamp: string,
 *     cached: boolean
 *   },
 *   error?: string
 * }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("force") === "true";

    // If force refresh is requested, bypass cache (handled by fetch next: { revalidate })
    const coins = await getLiveCoins(forceRefresh);

    if (!coins || coins.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No coins data available",
          error: "CoinGecko API returned empty data",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coins,
      meta: {
        count: coins.length,
        timestamp: new Date().toISOString(),
        cached: !forceRefresh,
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Handle specific error types
    if (errorMessage.includes("Authentication")) {
      return NextResponse.json(
        {
          success: false,
          error: "API Key Error: Your CoinGecko API key is expired or invalid",
          message: "Please update your COIN_GECKO_API_KEY environment variable",
          tip: "Visit https://www.coingecko.com/en/api/documentation to get a new API key",
        },
        { status: 401 }
      );
    }

    if (errorMessage.includes("Rate Limit")) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate Limit Exceeded",
          message: "Too many requests to CoinGecko API. Please try again in a few moments.",
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
