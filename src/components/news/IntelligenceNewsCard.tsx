"use client";

import React, { useState } from "react";
import { EnrichedNewsArticle } from "@/data/types";
import { formatRelativeTime } from "@/lib/utils";
import "./news-card.css";

interface IntelligenceNewsCardProps {
  article: EnrichedNewsArticle;
  onExpand: (article: EnrichedNewsArticle) => void;
}

/* ─── Formatting helpers ─── */
function formatPrice(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "—";
  if (val === 0) return "$0.00";
  if (val < 0.01) return `$${val.toFixed(6)}`;
  if (val < 1) return `$${val.toFixed(4)}`;
  return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatLargeNumber(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "—";
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
}

function formatPercent(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "—";
  return `${val > 0 ? "+" : ""}${val.toFixed(2)}%`;
}

function confidenceColor(conf: string) {
  switch (conf) {
    case "high": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "low": return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  }
}

export default function IntelligenceNewsCard({ article, onExpand }: IntelligenceNewsCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (summary) return;
    setIsLoadingSummary(true);
    setSummaryError(null);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Summarize this crypto news article in 3-4 concise bullet points. Focus on key facts, market impact, and what it means for investors. Article title: "${article.title}". Article content: "${article.content?.slice(0, 1500) || article.title}"`,
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setSummary(data.answer);
      } else {
        setSummaryError(data.error || "Failed to generate summary");
      }
    } catch {
      setSummaryError("Could not connect to AI backend");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const sentimentColor = article.sentiment === "Bullish"
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : article.sentiment === "Bearish"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

  // Determine if we have market data
  const hasStoredData = article.stored && (
    article.stored.priceBefore !== undefined || article.stored.priceAfter !== undefined
  );
  const hasLiveData = article.live && article.live.currentPrice !== undefined;
  const hasSnapshot = article.marketSnapshot && (
    article.marketSnapshot.openPrice !== undefined || article.marketSnapshot.closePrice !== undefined
  );
  const hasCoins = article.coins && article.coins.length > 0;

  // Price change direction from stored data
  const storedChange = article.stored?.priceChangePercent;
  const storedIsUp = storedChange !== undefined && storedChange > 0;
  const storedIsDown = storedChange !== undefined && storedChange < 0;

  // Live data direction
  const liveChange = article.live?.percentChange24h;
  const liveIsUp = liveChange !== undefined && liveChange > 0;
  const liveIsDown = liveChange !== undefined && liveChange < 0;

  // Snapshot direction
  const snapDir = article.marketSnapshot?.marketDirection;
  const snapMovement = article.marketSnapshot?.priceMovement;

  return (
    <article className="news-card group">
      {/* ── LEFT: News Content Section ── */}
      <div className="news-card__content">
        {/* Meta row */}
        <div className="news-card__meta">
          <div className="news-card__coin-badge">
            {article.coin?.slice(0, 6) || "NEWS"}
          </div>
          <span className="news-card__source">{article.source || "Unknown"}</span>
          {article.sentiment && (
            <span className={`news-card__sentiment ${sentimentColor}`}>
              {article.sentiment}
            </span>
          )}
          {article.category && (
            <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
              {article.category}
            </span>
          )}
          <span className="news-card__date">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="news-card__title">{article.title}</h3>

        {/* Content preview */}
        <p className="news-card__body">
          {article.content || "No detailed content available for this article."}
        </p>

        {/* ── Detected Coins Pills ── */}
        {hasCoins && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mr-1 self-center">Detected:</span>
            {article.coins!.map((c, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${confidenceColor(c.confidence)}`}
              >
                {c.symbol}
                <span className="opacity-60 text-[8px]">({c.confidence})</span>
              </span>
            ))}
          </div>
        )}

        {/* ── Market Data Panels ── */}
        {(hasStoredData || hasLiveData || hasSnapshot) && (
          <div className="news-card__market-grid">
            {/* Stored: Before/After */}
            {hasStoredData && (
              <div className="news-card__market-panel">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.15em]">Snapshot Data</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Price Before</span>
                    <span className="font-mono text-[11px] text-zinc-300">{formatPrice(article.stored!.priceBefore)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Price After</span>
                    <span className="font-mono text-[11px] text-zinc-300">{formatPrice(article.stored!.priceAfter)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Mkt Cap</span>
                    <span className="font-mono text-[11px] text-zinc-300">{formatLargeNumber(article.stored!.marketCapBefore)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Vol 24h</span>
                    <span className="font-mono text-[11px] text-zinc-300">{formatLargeNumber(article.stored!.volume24hBefore)}</span>
                  </div>
                </div>

                {/* Price change highlight */}
                {storedChange !== undefined && (
                  <div className={`mt-2 flex items-center gap-1.5 px-2 py-1 rounded-lg ${storedIsUp ? 'bg-emerald-500/10' : storedIsDown ? 'bg-red-500/10' : 'bg-zinc-800/40'}`}>
                    {storedIsUp && (
                      <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                    {storedIsDown && (
                      <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    <span className={`text-xs font-black ${storedIsUp ? 'text-emerald-400' : storedIsDown ? 'text-red-400' : 'text-zinc-400'}`}>
                      {formatPercent(storedChange)}
                    </span>
                    <span className="text-[8px] text-zinc-500 font-bold uppercase ml-auto">Impact</span>
                  </div>
                )}
              </div>
            )}

            {/* Live Market Data */}
            {hasLiveData && (
              <div className="news-card__market-panel news-card__market-panel--live">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.15em]">Live Data</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Current Price</span>
                    <span className="font-mono text-[11px] text-white font-bold">{formatPrice(article.live!.currentPrice)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">24h Change</span>
                    <span className={`font-mono text-[11px] font-bold ${liveIsUp ? 'text-emerald-400' : liveIsDown ? 'text-red-400' : 'text-zinc-400'}`}>
                      {formatPercent(article.live!.percentChange24h)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Mkt Cap</span>
                    <span className="font-mono text-[11px] text-zinc-300">{formatLargeNumber(article.live!.currentMarketCap)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider">Vol 24h</span>
                    <span className="font-mono text-[11px] text-zinc-300">{formatLargeNumber(article.live!.currentVolume24h)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Market Snapshot (OHLC) */}
            {hasSnapshot && (
              <div className="news-card__market-panel news-card__market-panel--snapshot">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
                    <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                  </svg>
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.15em]">OHLC Snapshot</span>
                  {snapDir && (
                    <span className={`ml-auto text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      snapDir.toLowerCase() === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 
                      snapDir.toLowerCase() === 'down' ? 'text-red-400 bg-red-500/10' : 
                      'text-zinc-400 bg-zinc-800'
                    }`}>
                      {snapDir}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold">Open</span>
                    <span className="font-mono text-[10px] text-zinc-300">{formatPrice(article.marketSnapshot!.openPrice)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-emerald-600 uppercase font-bold">High</span>
                    <span className="font-mono text-[10px] text-emerald-300">{formatPrice(article.marketSnapshot!.highPrice)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-red-600 uppercase font-bold">Low</span>
                    <span className="font-mono text-[10px] text-red-300">{formatPrice(article.marketSnapshot!.lowPrice)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase font-bold">Close</span>
                    <span className="font-mono text-[10px] text-zinc-300">{formatPrice(article.marketSnapshot!.closePrice)}</span>
                  </div>
                </div>
                {snapMovement !== undefined && (
                  <div className={`mt-1.5 text-[10px] font-bold ${snapMovement > 0 ? 'text-emerald-400' : snapMovement < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                    Movement: {formatPercent(snapMovement)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Enrichment Status Tag */}
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-2">
          {article.isEnriched && (
            <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-md uppercase tracking-widest">
              ✦ Enriched
            </span>
          )}
          {article.isEmbedded && (
            <span className="text-[8px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/15 px-2 py-0.5 rounded-md uppercase tracking-widest">
              ⟐ Embedded
            </span>
          )}
          {article.coinsDetected && (
            <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-md uppercase tracking-widest">
              ◎ Coins Detected
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="news-card__actions">
          <button
            onClick={() => onExpand(article)}
            className="news-card__btn news-card__btn--secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Read Full Article
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card__btn news-card__btn--ghost"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Source
          </a>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="news-card__divider" />

      {/* ── RIGHT: AI Summary Panel ── */}
      <div className="news-card__ai">
        <div className="news-card__ai-header">
          <div className="news-card__ai-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
              <circle cx="9" cy="15" r="1" />
              <circle cx="15" cy="15" r="1" />
            </svg>
          </div>
          <span className="news-card__ai-label">AI Intelligence</span>
        </div>

        <div className="news-card__ai-body">
          {summary ? (
            <div className="news-card__ai-summary">{summary}</div>
          ) : isLoadingSummary ? (
            <div className="news-card__ai-loading">
              <div className="news-card__ai-pulse" />
              <div className="news-card__ai-pulse news-card__ai-pulse--short" />
              <div className="news-card__ai-pulse news-card__ai-pulse--medium" />
              <p className="news-card__ai-loading-text">Analyzing article...</p>
            </div>
          ) : summaryError ? (
            <div className="news-card__ai-error">
              <p>{summaryError}</p>
              <button onClick={fetchSummary} className="news-card__btn news-card__btn--retry">
                Retry
              </button>
            </div>
          ) : (
            <div className="news-card__ai-placeholder">
              <p className="news-card__ai-placeholder-text">
                Get an AI-powered breakdown of key insights, market impact, and investor takeaways.
              </p>
              <button onClick={fetchSummary} className="news-card__btn news-card__btn--primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
