/**
 * News API with live market data
 * 
 * Returns news articles with:
 * - Stored market data (priceBefore, marketCapBefore, volume24hBefore, priceAfter, priceChangePercent)
 * - Live market data from CoinMarketCap (current price, market cap, volume)
 */

import { connectDB } from "@/lib/db";
import News from "@/models/news";
import { getQuotes } from "@/lib/coinMarketCap";
import { NextResponse } from "next/server";
import { CoinQuote } from "@/data/types";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const coin = searchParams.get("coin");
    const includeLive = searchParams.get("live") !== "false"; // Default: include live data

    // Build query
    const query: Record<string, any> = {
      isEnriched: true,
    };
    if (coin) {
      query.coin = coin.toUpperCase();
    }

    // Fetch stored news
    const newsArticles = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    // If live data not requested, return stored data only
    if (!includeLive) {
      return NextResponse.json({
        success: true,
        data: newsArticles,
        meta: {
          total: newsArticles.length,
          liveData: false,
        },
      });
    }

    // Get unique coins from news articles
    const uniqueCoins = [...new Set(newsArticles.map((n) => n.coin).filter(Boolean))];

    // Fetch live data for all unique coins
    let liveQuotes: Map<string, CoinQuote> = new Map();
    if (uniqueCoins.length > 0) {
      try {
        liveQuotes = await getQuotes(uniqueCoins as string[]);
      } catch (error) {
        console.error("Failed to fetch live market data:", error);
        // Continue without live data
      }
    }

    // Merge stored and live data
    const enrichedNews = newsArticles.map((article: any) => {
      const stored = {
        priceBefore: article.priceBefore,
        marketCapBefore: article.marketCapBefore,
        volume24hBefore: article.volume24hBefore,
        priceAfter: article.priceAfter,
        priceChangePercent: article.priceChangePercent,
        enrichedAt: article.enrichedAt,
      };

      const live = article.coin && liveQuotes.has(article.coin)
        ? {
            currentPrice: liveQuotes.get(article.coin)?.price,
            currentMarketCap: liveQuotes.get(article.coin)?.marketCap,
            currentVolume24h: liveQuotes.get(article.coin)?.volume24h,
            percentChange24h: liveQuotes.get(article.coin)?.percentChange24h,
            lastUpdated: liveQuotes.get(article.coin)?.lastUpdated,
          }
        : null;

      return {
        ...article,
        stored,
        live,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedNews,
      meta: {
        total: newsArticles.length,
        liveData: true,
        coinsQueried: uniqueCoins.length,
      },
    });
    
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}