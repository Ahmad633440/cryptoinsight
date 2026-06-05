import { connectDB } from "@/lib/db";
import { findSimilarNews } from "@/services/newsService";
import { NextResponse } from "next/server";



// GET /api/similar
// GET /api/similar?page=1&limit=10&coin=bitcoin
// Response format:
// in this api u will get the latest news along with there Similar historical news in the form of array, 

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const coinParam = url.searchParams.get("coin") || undefined;

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pagination parameters. page and limit must be positive integers.",
        },
        { status: 400 }
      );
    }

    const response = await findSimilarNews({ page, limit, coin: coinParam });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Similar news request failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
