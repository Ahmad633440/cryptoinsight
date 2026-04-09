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
    <span className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
      {isPositive ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

function SparklineSVG({ positive }: { positive: boolean }) {
  const d = positive
    ? "M0,12 C4,11 8,9 12,10 C16,11 20,6 24,4 C28,2 32,3 36,1"
    : "M0,2 C4,3 8,5 12,4 C16,3 20,8 24,10 C28,12 32,11 36,13";
  return (
    <svg viewBox="0 0 36 14" className="w-[72px] h-[28px]" fill="none">
      <path d={d} stroke={positive ? "#10b981" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const TABLE_HEADERS = [
  { label: "#", align: "text-left" },
  { label: "Name", align: "text-left" },
  { label: "Price", align: "text-right" },
  { label: "1h %", align: "text-right" },
  { label: "24h %", align: "text-right" },
  { label: "7d %", align: "text-right" },
  { label: "Market Cap", align: "text-right" },
  { label: "Volume (24h)", align: "text-right" },
  { label: "Last 7d", align: "text-right" },
];

export default function MarketTable({ data }: MarketTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800/60 bg-zinc-900/30">
      <table className="w-full min-w-[900px]">
        {/* ── Head ─────────────────────────── */}
        <thead>
          <tr className="border-b border-zinc-800/60">
            {TABLE_HEADERS.map((h) => (
              <th
                key={h.label}
                className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${h.align} first:pl-6 last:pr-6`}
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
                border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors cursor-pointer
                animate-fade-up delay-${i + 1}
              `}
            >
              {/* Rank */}
              <td className="px-4 py-4 pl-6">
                <span className="text-xs font-mono text-zinc-600">{coin.rank}</span>
              </td>

              {/* Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)` }}
                  >
                    {coin.symbol.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">{coin.name}</span>
                    <span className="ml-2 text-xs text-zinc-500 uppercase">{coin.symbol}</span>
                  </div>
                </div>
              </td>

              {/* Price */}
              <td className="px-4 py-4 text-right">
                <span className="text-sm font-semibold text-white">{formatPrice(coin.price)}</span>
              </td>

              {/* 1h */}
              <td className="px-4 py-4 text-right"><ChangeCell value={coin.change1h} /></td>

              {/* 24h */}
              <td className="px-4 py-4 text-right"><ChangeCell value={coin.change24h} /></td>

              {/* 7d */}
              <td className="px-4 py-4 text-right"><ChangeCell value={coin.change7d} /></td>

              {/* Market Cap */}
              <td className="px-4 py-4 text-right">
                <span className="text-sm text-zinc-300">{formatCompact(coin.marketCap)}</span>
              </td>

              {/* Volume */}
              <td className="px-4 py-4 text-right">
                <span className="text-sm text-zinc-400">{formatCompact(coin.volume24h)}</span>
              </td>

              {/* Sparkline */}
              <td className="px-4 py-4 pr-6 text-right">
                <div className="flex justify-end">
                  <SparklineSVG positive={coin.change7d >= 0} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Footer ─────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800/40">
        <span className="text-xs text-zinc-600">Showing {data.length} coins</span>
        <div className="flex items-center gap-1">
          <Badge variant="zinc">CoinGecko API</Badge>
        </div>
      </div>
    </div>
  );
}
