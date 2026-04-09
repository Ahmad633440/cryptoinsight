import Card from "@/components/ui/Card";

interface PriceCardProps {
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  color: string;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1) return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toFixed(6)}`;
}

function MiniChart({ positive }: { positive: boolean }) {
  const points = positive
    ? "0,20 8,18 16,15 24,17 32,12 40,14 48,8 56,10 64,5 72,3"
    : "0,5 8,8 16,6 24,10 32,14 40,12 48,16 56,15 64,18 72,20";

  return (
    <svg viewBox="0 0 72 24" className="w-20 h-8" fill="none">
      <polyline
        points={points}
        stroke={positive ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <linearGradient id={`grad-${positive ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
        <stop offset="100%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity="0" />
      </linearGradient>
      <polygon
        points={`0,24 ${points} 72,24`}
        fill={`url(#grad-${positive ? "up" : "down"})`}
      />
    </svg>
  );
}

export default function PriceCard({
  rank,
  name,
  symbol,
  price,
  change24h,
  marketCap,
  color,
}: PriceCardProps) {
  const isPositive = change24h >= 0;

  return (
    <Card hover className="p-5 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Coin icon */}
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              boxShadow: `0 4px 15px ${color}30`,
            }}
          >
            {symbol.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            <p className="text-xs text-zinc-500 uppercase">{symbol}</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/80 rounded-md px-1.5 py-0.5">
          #{rank}
        </span>
      </div>

      {/* Price & Chart */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xl font-bold text-white tracking-tight">
            {formatCurrency(price)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? "↑" : "↓"} {Math.abs(change24h).toFixed(2)}%
            </span>
            <span className="text-[10px] text-zinc-600">24h</span>
          </div>
        </div>
        <MiniChart positive={isPositive} />
      </div>

      {/* Market Cap */}
      <div className="pt-3 border-t border-zinc-800/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">Market Cap</span>
          <span className="text-[11px] font-medium text-zinc-300">{formatCurrency(marketCap)}</span>
        </div>
      </div>
    </Card>
  );
}
