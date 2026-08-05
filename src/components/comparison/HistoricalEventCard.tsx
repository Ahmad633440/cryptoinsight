"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import MarketDataWidget from "./MarketDataWidget";

interface SimilarHistoricalItem {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  sentiment?: string;
  publishedAt: string | Date;
  source?: string;
  url?: string;
  marketData?: {
    openPrice?: number;
    closePrice?: number;
    marketDirection?: string;
    priceMovement?: number;
  };
  similarityScore: number;
}

interface HistoricalEventCardProps {
  event: SimilarHistoricalItem;
  onClick: () => void;
}

export default function HistoricalEventCard({ event, onClick }: HistoricalEventCardProps) {
  const { title, coin, sentiment, publishedAt, marketData, similarityScore } = event;

  // Format Similarity Score (e.g. 0.895 -> 89.5% Match)
  const formatScore = (score: number) => {
    const val = score <= 1 ? score * 100 : score;
    return `${val.toFixed(1)}% Match`;
  };

  const sentimentVariant = 
    sentiment === "Bullish" ? "green" : 
    sentiment === "Bearish" ? "red" : "zinc";

  // Format as a readable absolute date, e.g. "Jan 12, 2024"
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div 
      onClick={onClick}
      className="historical-card animate-fade-in hover:shadow-lg hover:shadow-indigo-500/5"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="similarity-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {formatScore(similarityScore)}
          </span>
          {coin && (
            <Badge variant="blue" className="text-[9px] py-0 px-1">
              {coin}
            </Badge>
          )}
        </div>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          {formattedDate}
        </span>
      </div>

      {/* Title */}
      <h4 className="historical-card__title">
        {title}
      </h4>

      {/* Short content preview */}
      <p className="historical-card__body text-sm text-zinc-400 mt-2 line-clamp-3">
        {event.content ? event.content : "No detailed content available."}
      </p>

      {/* Bottom row: Sentiment badge and market widget */}
      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-zinc-800/40">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
            Past Sentiment
          </span>
          <Badge variant={sentimentVariant} className="text-[9px] py-0">
            {sentiment || "Neutral"}
          </Badge>
        </div>
        
        {/* Render market snapshot if available */}
        {marketData && (
          <MarketDataWidget marketData={marketData} />
        )}
      </div>
    </div>
  );
}
