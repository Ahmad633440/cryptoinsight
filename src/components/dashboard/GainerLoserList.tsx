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
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <Badge variant={badgeVariant}>{subtitle}</Badge>
      </div>
      <div className="space-y-3">
        {data.map((coin) => (
          <div key={coin.symbol} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white transition-opacity group-hover:opacity-80"
                style={{ background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)` }}
              >
                {coin.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors uppercase">
                  {coin.name}
                </p>
                <p className="text-[10px] text-zinc-600 uppercase">{coin.symbol}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold ${changeColor}`}>
              {changePrefix}{coin.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
