"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import MarketDataWidget from "./MarketDataWidget";
import HistoricalEventCard from "./HistoricalEventCard";
import { formatRelativeTime } from "@/lib/utils";

interface SimilarHistoricalItem {
  _id: string;
  title: string;
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

interface SimilarNewsItem {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  coins?: unknown[];
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
  similarHistorical: SimilarHistoricalItem[];
}

interface ComparisonRowProps {
  item: SimilarNewsItem;
  onSelectArticle: (article: SimilarNewsItem, selectedHistorical?: SimilarHistoricalItem) => void;
}

export default function ComparisonRow({ item, onSelectArticle }: ComparisonRowProps) {
  const { title, content, coin, sentiment, publishedAt, source, url, marketData, similarHistorical } = item;

  const sentimentVariant = 
    sentiment === "Bullish" ? "green" : 
    sentiment === "Bearish" ? "red" : "zinc";

  return (
    <div className="comparison-row group/row">
      {/* ── Left Side: Current News ── */}
      <div className="current-card">
        <div className="space-y-3">
          {/* Metadata Row */}
          <div className="current-card__header">
            {coin && (
              <Badge variant="indigo" className="text-[10px] uppercase font-bold py-0.5 px-2">
                {coin}
              </Badge>
            )}
            {source && (
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {source}
              </span>
            )}
            <Badge variant={sentimentVariant} className="text-[9px] py-0">
              {sentiment || "Neutral"}
            </Badge>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest ml-auto">
              {formatRelativeTime(publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectArticle(item)}
            className="current-card__title cursor-pointer hover:underline decoration-indigo-500/50"
          >
            {title}
          </h3>

          {/* Description Preview */}
          <p className="current-card__body">
            {content || "No detailed content is available for this current alert."}
          </p>
        </div>

        {/* Action Row & Market Data */}
        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800/40 mt-auto">
          {marketData && (
            <MarketDataWidget marketData={marketData} />
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelectArticle(item)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              View Detailed Report
            </button>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-zinc-500 hover:text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1"
              >
                Source Url
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Middle: Connector Col ── */}
      <div className="connector-col">
        <div className="connector-line" />
        <div className="connector-node">
          <div className="connector-node-inner" />
        </div>
      </div>

      {/* ── Right Side: Similar Historical Events ── */}
      <div className="historical-grid">
        {similarHistorical && similarHistorical.length > 0 ? (
          similarHistorical.map((historyEvent) => (
            <HistoricalEventCard
              key={historyEvent._id}
              event={historyEvent}
              onClick={() => onSelectArticle(item, historyEvent)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 text-zinc-600 col-span-2 min-h-[150px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-zinc-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-[11px] font-bold uppercase tracking-wider">No matching events found</p>
            <span className="text-[10px] text-zinc-700 mt-1 max-w-[200px]">
              No past historical events exceeded the vector database similarity score.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
