"use client";

import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import MarketDataWidget from "./MarketDataWidget";
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

interface ComparisonModalProps {
  article: SimilarNewsItem;
  initialHistorical?: SimilarHistoricalItem;
  onClose: () => void;
}

export default function ComparisonModal({ article, initialHistorical, onClose }: ComparisonModalProps) {
  const [selectedHistorical, setSelectedHistorical] = useState<SimilarHistoricalItem | null>(
    initialHistorical || (article.similarHistorical?.[0] ?? null)
  );

  // Lock scroll on background when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const sentimentVariant = 
    article.sentiment === "Bullish" ? "green" : 
    article.sentiment === "Bearish" ? "red" : "zinc";

  const historicalSentimentVariant = 
    selectedHistorical?.sentiment === "Bullish" ? "green" : 
    selectedHistorical?.sentiment === "Bearish" ? "red" : "zinc";

  // Quick price metrics helper
  const getMovementText = (movement?: number) => {
    if (movement === undefined) return "N/A";
    return `${movement > 0 ? "+" : ""}${movement.toFixed(2)}%`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl h-[100dvh] md:h-[80vh] flex flex-col md:rounded-3xl border-x-0 border-y md:border-y-0 border-zinc-800 md:border bg-zinc-950 overflow-hidden shadow-2xl shadow-indigo-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ── Header ── */}
        <header className="flex items-center justify-between gap-3 md:gap-4 p-4 md:p-6 border-b border-zinc-800/80 bg-zinc-900/30 shrink-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Semantic Analysis Comparison
            </span>
            <h2 className="text-base md:text-lg font-black text-white truncate max-w-xl">
              Comparing: {article.title}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="shrink-0 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 active:scale-95"
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* ── Scrollable Body Grid ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 md:space-y-8 hide-scrollbar">
          
          {/* Main Comparison Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-stretch">
            
            {/* Left Panel: Current News */}
            <div className="flex flex-col p-4 md:p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 space-y-3 md:space-y-4 overflow-hidden">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-wider shrink-0">
                  Current Alert
                </span>
                {article.coin && (
                  <Badge variant="blue" className="text-[10px] shrink-0">
                    {article.coin}
                  </Badge>
                )}
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-auto shrink-0">
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white leading-snug break-words">
                {article.title}
              </h3>

              <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span>Source: {article.source || "Unknown"}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span>Sentiment:</span>
                  <Badge variant={sentimentVariant} className="text-[9px] py-0">
                    {article.sentiment || "Neutral"}
                  </Badge>
                </div>
              </div>

              <div className="text-xs md:text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap flex-1 bg-zinc-950/40 p-3 md:p-4 rounded-xl border border-zinc-900/60 overflow-y-auto max-h-[200px] md:max-h-[250px] scrollbar-thin break-words">
                {article.content || "No details content available."}
              </div>

              {article.marketData && (
                <div className="pt-2">
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Current Market Impact</span>
                  <MarketDataWidget marketData={article.marketData} />
                </div>
              )}
            </div>

            {/* Right Panel: Similar Historical Event */}
            <div className="flex flex-col p-4 md:p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 space-y-3 md:space-y-4 overflow-hidden">
              {selectedHistorical ? (
                <>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-wider shrink-0">
                      Historical Event
                    </span>
                    <span className="similarity-badge text-[10px] py-0.5 px-2 shrink-0">
                      {(selectedHistorical.similarityScore * 100).toFixed(1)}% Match
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-auto shrink-0">
                      {new Date(selectedHistorical.publishedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white leading-snug break-words">
                    {selectedHistorical.title}
                  </h3>

                  <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span>Detected Asset: {selectedHistorical.coin || "N/A"}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>Sentiment:</span>
                      <Badge variant={historicalSentimentVariant} className="text-[9px] py-0">
                        {selectedHistorical.sentiment || "Neutral"}
                      </Badge>
                    </div>
                  </div>

                  {selectedHistorical.url ? (
                    <a
                      href={selectedHistorical.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-200 transition-all active:scale-95 group"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Read Article{selectedHistorical.source ? ` — ${selectedHistorical.source}` : ""}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                      </svg>
                    </a>
                  ) : selectedHistorical.source ? (
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                      Source: {selectedHistorical.source}
                    </span>
                  ) : null}

                  {selectedHistorical.marketData && (
                    <div className="pt-2">
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Historical Market Impact</span>
                      <MarketDataWidget marketData={selectedHistorical.marketData} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full border border-dashed border-zinc-800 rounded-xl p-8 text-zinc-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-zinc-700">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 17v-5M12 17V9M15 17v-3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-widest">Select a historical event</p>
                  <span className="text-[11px] text-zinc-600 mt-1 max-w-[250px]">
                    Select one of the matching historical events from the bottom list to inspect detail comparison side-by-side.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Correlation Summary Section ── */}
          {selectedHistorical && (
            <section className="p-4 md:p-6 rounded-2xl border border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 space-y-3 md:space-y-4 overflow-hidden">
              <h4 className="text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                AI Correlation Report
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-zinc-300">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Sentiment Correlation</span>
                  <p className="text-sm font-semibold">
                    {article.sentiment === selectedHistorical.sentiment ? (
                      <span className="text-emerald-400">Perfect Match ({article.sentiment})</span>
                    ) : (
                      <span className="text-amber-400">Deviation ({article.sentiment} vs {selectedHistorical.sentiment || "Neutral"})</span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Historical Output</span>
                  <p className="text-sm font-semibold">
                    The historical event resulted in a{" "}
                    <span className={selectedHistorical.marketData?.priceMovement && selectedHistorical.marketData.priceMovement > 0 ? "text-emerald-400" : "text-red-400"}>
                      {getMovementText(selectedHistorical.marketData?.priceMovement)}
                    </span>{" "}
                    movement in the asset price.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Confidence Level</span>
                  <p className="text-sm font-semibold text-purple-400">
                    High Confidence (Similarity: {(selectedHistorical.similarityScore * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                Based on semantic matching, when this pattern occurred in the past, it generated a {selectedHistorical.sentiment?.toLowerCase() || "neutral"} sentiment trigger.
                If the current trend follows the historical path, a similar price movement is anticipated. Monitor key resistance points relative to current price.
              </p>
            </section>
          )}

          {/* ── Match Selector Panel (If multiple historical events exist) ── */}
          {article.similarHistorical && article.similarHistorical.length > 1 && (
            <div className="space-y-3">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block">
                All Matching Historical Events ({article.similarHistorical.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {article.similarHistorical.map((hist) => {
                  const isActive = selectedHistorical?._id === hist._id;
                  const scoreFormatted = (hist.similarityScore * 100).toFixed(0);
                  const histVariant = hist.sentiment === "Bullish" ? "green" : hist.sentiment === "Bearish" ? "red" : "zinc";

                  return (
                    <button
                      key={hist._id}
                      onClick={() => setSelectedHistorical(hist)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-2 ${
                        isActive
                          ? "bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-500/5"
                          : "bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800/40 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] text-indigo-400 font-bold">{scoreFormatted}% Match</span>
                        <Badge variant={histVariant} className="text-[8px] py-0 px-1">
                          {hist.sentiment || "Neutral"}
                        </Badge>
                      </div>
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {hist.title}
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        {new Date(hist.publishedAt).toLocaleDateString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
