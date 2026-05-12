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
    <Card hover className="p-6 group border-zinc-800/40 bg-zinc-900/20 backdrop-blur-md rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              boxShadow: `0 8px 20px ${color}20`,
            }}
          >
            {symbol.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{name}</h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{symbol}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/50 rounded-full px-2 py-1 border border-zinc-700/30">
          RANK #{rank}
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        <p className="text-2xl font-black text-white tracking-tighter">
          {formatCurrency(price)}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-lg ${
            isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
          }`}>
            {isPositive ? "↑" : "↓"} {Math.abs(change24h).toFixed(2)}%
          </span>
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">24h Change</span>
        </div>
      </div>

      {/* Market Cap */}
      <div className="pt-4 border-t border-zinc-800/40">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Market Valuation</span>
          <span className="text-xs font-bold text-zinc-300">{formatCurrency(marketCap)}</span>
        </div>
      </div>
    </Card>
  );
}

