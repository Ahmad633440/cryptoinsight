"use client";

import { useState, useMemo } from "react";
import Badge from "@/components/ui/Badge";
import InteractiveSparkline from "./InteractiveSparkline";

interface CoinRow {
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  color: string;
  sparkline: number[];
}

interface MarketTableProps {
  data: CoinRow[];
}

// Helpers for drawing static SVGs on mobile
function generateSvgPath(prices: number[], width: number, height: number, padding: number): string {
  if (!prices || prices.length < 2) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min === 0 ? 1 : max - min;
  
  return prices.map((price, index) => {
    const x = padding + (index / (prices.length - 1)) * (width - padding * 2);
    const y = height - padding - ((price - min) / range) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function getPricesOrMock(coin: CoinRow): number[] {
  if (coin.sparkline && coin.sparkline.length > 5) {
    return coin.sparkline;
  }
  const points = 24;
  const result: number[] = [];
  const startPrice = coin.price / (1 + coin.change24h / 100);
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const noise = Math.sin(progress * Math.PI * 4) * 0.012 + Math.cos(progress * Math.PI * 9) * 0.005;
    const trend = progress * (coin.change24h / 100);
    result.push(startPrice * (1 + trend + noise));
  }
  return result;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatPrice(value: number): string {
  if (value >= 1) return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toFixed(6)}`;
}

function ChangeCell({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`text-xs sm:text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
      {isPositive ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

// Stacked layout for mobile cards to prevent cramming and support small screens (down to 280px)
function MobileCoinCard({ coin }: { coin: CoinRow }) {
  const isPositive = coin.change24h >= 0;
  const prices = getPricesOrMock(coin);
  const width = 100;
  const height = 24;
  const pathD = generateSvgPath(prices, width, height, 2);
  const areaD = pathD ? `${pathD} L ${width} ${height} L 0 ${height} Z` : "";
  const gradId = `mobile-grad-${coin.symbol}`;

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 border-b border-zinc-800/20 last:border-b-0 hover:bg-zinc-800/20 transition-colors">
      {/* Top Row: Coin identification on left, current price on right */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[10px] font-bold text-zinc-600 w-4 shrink-0 text-right">
            {coin.rank.toString().padStart(2, "0")}
          </span>
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
            style={{
              background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)`,
            }}
          >
            {coin.symbol.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-white truncate">{coin.name}</span>
            <span className="text-[9px] text-zinc-500 font-bold uppercase shrink-0">{coin.symbol}</span>
          </div>
        </div>
        
        <div className="text-right shrink-0">
          <span className="text-xs sm:text-sm font-black text-white">{formatPrice(coin.price)}</span>
        </div>
      </div>

      {/* Bottom Row: Wider detailed sparkline in middle, change percentage badge on right */}
      <div className="flex items-center justify-between gap-3 pl-8 sm:pl-9">
        <div className="flex-1 max-w-[150px] h-6 flex items-center">
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.15} />
                <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <path
              d={pathD}
              fill="none"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {areaD && (
              <path
                d={areaD}
                fill={`url(#${gradId})`}
              />
            )}
          </svg>
        </div>

        <div className="shrink-0 text-right">
          <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

const TABLE_HEADERS = [
  { label: "#", align: "text-left", className: "" },
  { label: "Name", align: "text-left", className: "" },
  { label: "Price", align: "text-right", className: "" },
  { label: "24h %", align: "text-right", className: "" },
  { label: "7D Trend", align: "text-center", className: "" },
  { label: "Market Cap", align: "text-right", className: "hidden lg:table-cell" },
  { label: "Volume (24h)", align: "text-right", className: "hidden xl:table-cell" },
];

export default function MarketTable({ data }: MarketTableProps) {
  const [showEducation, setShowEducation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((coin) => 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search coins by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800/40 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-11 pr-4 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-md"
        />
      </div>

      {/* Beginner Educational Banner */}
      {showEducation && (
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-zinc-300 relative animate-fade-in text-xs leading-relaxed max-w-full">
          <button 
            onClick={() => setShowEducation(false)}
            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            💡 Guide: Reading Crypto Trend Lines (Sparklines)
          </h4>
          <p className="mb-2.5 text-zinc-400">
            A **sparkline** shows price direction over the past 7 days. It helps you see market dynamics without complex charting tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-400">
            <div className="space-y-1">
              <p><span className="text-emerald-400 font-bold">🟢 Green Line:</span> Price is higher than it was 7 days ago. Buyers dominate.</p>
              <p><span className="text-red-400 font-bold">🔴 Red Line:</span> Price is lower than it was 7 days ago. Sellers dominate.</p>
            </div>
            <div className="space-y-1">
              <p><span className="text-blue-400 font-bold">🎯 Hover:</span> Hover the chart to check hourly price points.</p>
              <p><span className="text-indigo-400 font-bold">🧠 Market Mood:</span> Shows beginner-friendly advice on current trends!</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl sm:rounded-3xl border border-zinc-800/40 bg-zinc-900/20 backdrop-blur-md overflow-hidden min-w-0">
        
        {/* ── Mobile View (< md) ─────────── */}
        <div className="md:hidden">
          {filteredData.length > 0 ? (
            filteredData.map((coin) => (
              <MobileCoinCard key={coin.symbol} coin={coin} />
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No coins found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* ── Desktop Table View (≥ md) ──── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            {/* ── Head ─────────────────────────── */}
            <thead>
              <tr className="border-b border-zinc-800/40">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h.label}
                    className={`px-4 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 ${h.align} ${h.className || ""} first:pl-6 last:pr-6`}
                  >
                    {h.label === "7D Trend" ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{h.label}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEducation(prev => !prev);
                          }}
                          className="p-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/30 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center justify-center"
                          title="What is this? Click to learn!"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      h.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ─────────────────────────── */}
            <tbody>
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={TABLE_HEADERS.length} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No coins found matching "{searchQuery}"
                  </td>
                </tr>
              )}
              {filteredData.map((coin, i) => (
                <tr
                  key={coin.symbol}
                  className={`
                    border-b border-zinc-800/10 hover:bg-zinc-800/20 transition-all cursor-pointer group
                    animate-fade-up delay-${(i % 10) + 1}
                  `}
                >
                  {/* Rank */}
                  <td className="px-4 lg:px-6 py-4 pl-6">
                    <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      {coin.rank.toString().padStart(2, "0")}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)`,
                          boxShadow: `0 4px 12px ${coin.color}20`
                        }}
                      >
                        {coin.symbol.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                          {coin.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                          {coin.symbol}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <span className="text-sm font-black text-white">{formatPrice(coin.price)}</span>
                  </td>

                  {/* 24h Change */}
                  <td className="px-4 lg:px-6 py-4 text-right"><ChangeCell value={coin.change24h} /></td>

                  {/* 7D Trend */}
                  <td className="px-4 lg:px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <InteractiveSparkline
                        prices={coin.sparkline}
                        change24h={coin.change24h}
                        currentPrice={coin.price}
                        symbol={coin.symbol}
                        name={coin.name}
                      />
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="px-4 lg:px-6 py-4 text-right hidden lg:table-cell">
                    <span className="text-sm font-bold text-zinc-300">{formatCompact(coin.marketCap)}</span>
                  </td>

                  {/* Volume */}
                  <td className="px-4 lg:px-6 py-4 text-right pr-6 hidden xl:table-cell">
                    <span className="text-xs font-medium text-zinc-500">{formatCompact(coin.volume24h)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer ─────────────────────────── */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-t border-zinc-800/40 bg-zinc-950/20">
          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Displaying {filteredData.length} assets
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="zinc" className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter bg-zinc-800/40 border-zinc-700/30">
              Real-time Source
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

