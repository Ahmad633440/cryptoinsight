"use client";

import Badge from "@/components/ui/Badge";

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
}

interface MarketTableProps {
  data: CoinRow[];
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

// Mobile card view for each coin
function MobileCoinCard({ coin }: { coin: CoinRow }) {
  const isPositive = coin.change24h >= 0;
  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-zinc-800/20 last:border-b-0 hover:bg-zinc-800/20 transition-colors">
      {/* Rank + Icon */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="text-[10px] font-bold text-zinc-600 w-5 shrink-0 text-right">
          {coin.rank.toString().padStart(2, "0")}
        </span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
          style={{
            background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)`,
          }}
        >
          {coin.symbol.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-bold text-white truncate">{coin.name}</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">{coin.symbol}</p>
        </div>
      </div>

      {/* Price + Change */}
      <div className="text-right shrink-0">
        <p className="text-xs sm:text-sm font-black text-white">{formatPrice(coin.price)}</p>
        <span className={`text-[10px] sm:text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{coin.change24h.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

const TABLE_HEADERS = [
  { label: "#", align: "text-left" },
  { label: "Name", align: "text-left" },
  { label: "Price", align: "text-right" },
  { label: "24h %", align: "text-right" },
  { label: "Market Cap", align: "text-right" },
  { label: "Volume (24h)", align: "text-right" },
];

export default function MarketTable({ data }: MarketTableProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-zinc-800/40 bg-zinc-900/20 backdrop-blur-md overflow-hidden min-w-0">
      
      {/* ── Mobile View (< md) ─────────── */}
      <div className="md:hidden">
        {data.map((coin) => (
          <MobileCoinCard key={coin.symbol} coin={coin} />
        ))}
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
                  className={`px-4 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 ${h.align} first:pl-6 last:pr-6`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ─────────────────────────── */}
          <tbody>
            {data.map((coin, i) => (
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

                {/* Market Cap */}
                <td className="px-4 lg:px-6 py-4 text-right">
                  <span className="text-sm font-bold text-zinc-300">{formatCompact(coin.marketCap)}</span>
                </td>

                {/* Volume */}
                <td className="px-4 lg:px-6 py-4 text-right pr-6">
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
          Displaying {data.length} assets
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="zinc" className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter bg-zinc-800/40 border-zinc-700/30">
            Real-time Source
          </Badge>
        </div>
      </div>
    </div>
  );
}
