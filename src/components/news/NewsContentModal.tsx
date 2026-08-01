"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import { EnrichedNewsArticle } from "@/data/types";
import { formatRelativeTime } from "@/lib/utils";

interface NewsContentModalProps {
  article: EnrichedNewsArticle;
  onClose: () => void;
}

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

function MetricCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">{label}</span>
      <span className={`font-mono text-sm font-bold ${color || "text-zinc-200"}`}>{value}</span>
    </div>
  );
}

export default function NewsContentModal({ article, onClose }: NewsContentModalProps) {
  const hasStoredData = article.stored && (
    article.stored.priceBefore !== undefined || article.stored.priceAfter !== undefined
  );
  const hasLiveData = article.live && article.live.currentPrice !== undefined;
  const hasSnapshot = article.marketSnapshot && (
    article.marketSnapshot.openPrice !== undefined || article.marketSnapshot.closePrice !== undefined
  );
  const hasCoins = article.coins && article.coins.length > 0;

  const storedChange = article.stored?.priceChangePercent;
  const liveChange = article.live?.percentChange24h;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/50 text-zinc-400 hover:text-white z-10 transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8 md:p-12 overflow-y-auto space-y-8">
          {/* Header Meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="blue" className="uppercase font-bold tracking-tighter">
              {article.coin || "General"}
            </Badge>
            {article.sentiment && (
              <Badge
                variant={article.sentiment === "Bullish" ? "green" : article.sentiment === "Bearish" ? "red" : "zinc"}
                className="uppercase font-bold tracking-tighter text-[10px]"
              >
                {article.sentiment}
              </Badge>
            )}
            {article.category && (
              <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                {article.category}
              </span>
            )}
            <span className="text-xs text-zinc-600 font-bold ml-auto">
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
            {article.title}
          </h2>

          {/* Detected Coins */}
          {hasCoins && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Coins Detected:</span>
              {article.coins!.map((c, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-lg border ${
                    c.confidence === "high" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    c.confidence === "medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                    "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
                  }`}
                >
                  {c.symbol}
                  <span className="opacity-60 text-[9px]">({c.confidence} · {c.score}/10)</span>
                </span>
              ))}
            </div>
          )}

          {/* Market Data Section */}
          {(hasStoredData || hasLiveData || hasSnapshot) && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400">
                  <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                </svg>
                Market Intelligence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Stored Data Panel */}
                {hasStoredData && (
                  <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.15em]">At Publication</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCell label="Price Before" value={formatPrice(article.stored!.priceBefore)} />
                      <MetricCell label="Price After" value={formatPrice(article.stored!.priceAfter)} />
                      <MetricCell label="Market Cap" value={formatLargeNumber(article.stored!.marketCapBefore)} />
                      <MetricCell label="Volume 24h" value={formatLargeNumber(article.stored!.volume24hBefore)} />
                    </div>
                    {storedChange !== undefined && (
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl ${
                        storedChange > 0 ? 'bg-emerald-500/10 border border-emerald-500/15' :
                        storedChange < 0 ? 'bg-red-500/10 border border-red-500/15' :
                        'bg-zinc-800/40 border border-zinc-700/30'
                      }`}>
                        <span className={`text-lg font-black ${
                          storedChange > 0 ? 'text-emerald-400' : storedChange < 0 ? 'text-red-400' : 'text-zinc-400'
                        }`}>
                          {formatPercent(storedChange)}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase ml-auto">Price Impact</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Data Panel */}
                {hasLiveData && (
                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em]">Live Market</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCell label="Current Price" value={formatPrice(article.live!.currentPrice)} color="text-white" />
                      <MetricCell
                        label="24h Change"
                        value={formatPercent(article.live!.percentChange24h)}
                        color={liveChange && liveChange > 0 ? 'text-emerald-400' : liveChange && liveChange < 0 ? 'text-red-400' : 'text-zinc-400'}
                      />
                      <MetricCell label="Market Cap" value={formatLargeNumber(article.live!.currentMarketCap)} />
                      <MetricCell label="Volume 24h" value={formatLargeNumber(article.live!.currentVolume24h)} />
                    </div>
                    {article.live!.lastUpdated && (
                      <p className="text-[9px] text-zinc-600 font-bold">
                        Updated: {new Date(article.live!.lastUpdated).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* OHLC Snapshot Panel */}
                {hasSnapshot && (
                  <div className="p-5 rounded-2xl bg-amber-950/15 border border-amber-500/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
                        <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                      </svg>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.15em]">OHLC Snapshot</span>
                      {article.marketSnapshot!.marketDirection && (
                        <span className={`ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          article.marketSnapshot!.marketDirection.toLowerCase() === 'up' ? 'text-emerald-400 bg-emerald-500/10' :
                          article.marketSnapshot!.marketDirection.toLowerCase() === 'down' ? 'text-red-400 bg-red-500/10' :
                          'text-zinc-400 bg-zinc-800'
                        }`}>
                          {article.marketSnapshot!.marketDirection}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCell label="Open" value={formatPrice(article.marketSnapshot!.openPrice)} />
                      <MetricCell label="High" value={formatPrice(article.marketSnapshot!.highPrice)} color="text-emerald-300" />
                      <MetricCell label="Low" value={formatPrice(article.marketSnapshot!.lowPrice)} color="text-red-300" />
                      <MetricCell label="Close" value={formatPrice(article.marketSnapshot!.closePrice)} />
                    </div>
                    {article.marketSnapshot!.volume !== undefined && (
                      <MetricCell label="Volume" value={formatLargeNumber(article.marketSnapshot!.volume)} />
                    )}
                    {article.marketSnapshot!.priceMovement !== undefined && (
                      <div className={`flex items-center gap-2 p-2 rounded-xl ${
                        article.marketSnapshot!.priceMovement > 0 ? 'bg-emerald-500/10' :
                        article.marketSnapshot!.priceMovement < 0 ? 'bg-red-500/10' : 'bg-zinc-800/40'
                      }`}>
                        <span className={`text-sm font-black ${
                          article.marketSnapshot!.priceMovement > 0 ? 'text-emerald-400' :
                          article.marketSnapshot!.priceMovement < 0 ? 'text-red-400' : 'text-zinc-400'
                        }`}>
                          {formatPercent(article.marketSnapshot!.priceMovement)}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase ml-auto">Movement</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {article.content}
            </p>
          </div>

          {/* Enrichment Metadata */}
          {/* Enrichment Metadata 
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800/50">
            {article.isEnriched && (
              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                ✦ Enriched
              </span>
            )}
            {article.isEmbedded && (
              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/15 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                ⟐ Embedded
              </span>
            )}
            {article.coinsDetected && (
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/15 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                ◎ Coins Detected
              </span>
            )}
            {article.enrichedAt && (
              <span className="text-[9px] text-zinc-600 font-bold ml-auto">
                Enriched: {new Date(article.enrichedAt).toLocaleString()}
              </span>
            )}
          </div>
          */}

          {/* Footer */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              Source: {article.source || "Original Article"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
