import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes timeout

/**
 * Vercel Cron Job: Price Update (disabled)
 * This flow has been removed; enrichment now stores a single price snapshot at detection time.
 */
export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    message: "Price update flow is disabled",
    timestamp: new Date().toISOString(),
  });
}
