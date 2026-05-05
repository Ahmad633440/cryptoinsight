import { connectDB } from "@/lib/db";
import { findSimilarNews } from "@/services/newsService";
import { NextResponse } from "next/server";

/**
 * POST /api/news/similar
 * Finds similar news articles based on vector similarity
 */
export async function POST(req: Request) {
  try {
    
    await connectDB();

    const body = await req.json();
    const { newsId } = body;

    if (!newsId) {
      return NextResponse.json(
        {
          success: false,
          message: "News ID is required",
        },
        { status: 400 }
      );
    }

    // Find similar news using service layer
    const similarNews = await findSimilarNews(newsId);

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        similarNews,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Determine HTTP status based on error type
    let status = 500;
    if (
      errorMessage.includes("Invalid") ||
      errorMessage.includes("not found")
    ) {
      status = 404;
    } else if (errorMessage.includes("Invalid news ID")) {
      status = 400;
    }

    console.error("[API] Similar news search failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status }
    );
  }
}