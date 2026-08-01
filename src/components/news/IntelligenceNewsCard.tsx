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
          //question: `Summarize this crypto news article in 3-4 concise bullet points. Focus on key facts, market impact, and what it means for investors. Article title: "${article.title}". Article content: "${article.content?.slice(0, 1500) || article.title}"`,
          question: `You are summarizing a cryptocurrency news article for an investor-facing app.

Instructions:
- Output exactly 3-4 bullet points, each starting with "•"
- Each bullet should be one concise sentence (max ~20 words)
- Bullet 1-2: the key facts/what happened
- Bullet 3: market impact (price movement, volume, sentiment, etc. if mentioned)
- Bullet 4: what this means for investors (implication or outlook)
- Do not include a title, intro, or closing remarks — output only the bullets
- If the article lacks enough detail for a category, skip that bullet rather than inventing information

Article title: "${article.title}"
Article content: "${article.content?.slice(0, 1500) || article.title}"`,
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
          {article.content ? article.content.replace(/ONLY AVAILABLE IN PAID PLANS/gi, '').trim() : "No detailed content available for this article."}
        </p>

        {/* ── Market Data Panels ── */}
        {hasLiveData && (
          <div className="news-card__market-grid">
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


          </div>
        )}


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
