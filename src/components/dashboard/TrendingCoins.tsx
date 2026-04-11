import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface TrendingCoin {
  name: string;
  symbol: string;
  searches: string;
  color: string;
}

interface TrendingCoinsProps {
  data: TrendingCoin[];
}

export default function TrendingCoins({ data }: TrendingCoinsProps) {
  return (
    <Card className="p-5 animate-fade-up delay-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">🔥 Trending</h3>
        <Badge variant="yellow">Hot</Badge>
      </div>
      <div className="space-y-3">
        {data.map((coin, index) => (
          <div key={coin.symbol} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-600 w-4">{index + 1}</span>
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white transition-opacity group-hover:opacity-80"
                style={{ background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)` }}
              >
                {coin.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">{coin.name}</p>
                <p className="text-[10px] text-zinc-600 uppercase">{coin.symbol}</p>
              </div>
            </div>
            <span className="text-[10px] text-zinc-500">{coin.searches} searches</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
