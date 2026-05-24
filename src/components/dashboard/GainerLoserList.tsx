import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface CoinChange {
  name: string;
  symbol: string;
  change: number;
  color: string;
}

interface GainerLoserListProps {
  title: string;
  subtitle: string;
  data: CoinChange[];
  variant: "green" | "red";
}

export default function GainerLoserList({ 
  title, 
  subtitle, 
  data, 
  variant 
}: GainerLoserListProps) {
  const isPositive = variant === "green";
  const badgeVariant = isPositive ? "green" : "red";
  const changeColor = isPositive ? "text-emerald-400" : "text-red-400";
  const changePrefix = isPositive ? "+" : "";

  return (
    <Card className="p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{title}</h3>
        <Badge variant={badgeVariant} className="shrink-0 text-[9px] sm:text-[11px]">{subtitle}</Badge>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {data.map((coin) => (
          <div key={coin.symbol} className="flex items-center justify-between group cursor-pointer gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <div
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-md sm:rounded-lg flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white transition-opacity group-hover:opacity-80 shrink-0"
                style={{ background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)` }}
              >
                {coin.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-white group-hover:text-blue-400 transition-colors uppercase truncate">
                  {coin.name}
                </p>
                <p className="text-[9px] sm:text-[10px] text-zinc-600 uppercase">{coin.symbol}</p>
              </div>
            </div>
            <span className={`text-[10px] sm:text-xs font-semibold ${changeColor} shrink-0`}>
              {changePrefix}{coin.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
