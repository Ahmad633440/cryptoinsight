import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface HighlightItem {
  label: string;
  value: string;
  sub: string;
  variant: "green" | "red" | "zinc" | "blue" | "yellow";
}

interface MarketHighlightsProps {
  data: HighlightItem[];
}

export default function MarketHighlights({ data }: MarketHighlightsProps) {
  return (
    <Card className="p-5 animate-fade-up delay-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">📊 Market Highlights</h3>
        <Badge variant="blue">Info</Badge>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white">{item.value}</span>
              <Badge variant={item.variant}>{item.sub}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      <div className="mt-5 rounded-lg border border-yellow-500/10 bg-yellow-500/5 px-3 py-2">
        <p className="text-[10px] text-yellow-500/80 leading-relaxed text-center">
          <span className="font-semibold">⚠ Alert:</span> High volatility detected in SOL and DOGE. Monitor positions closely.
        </p>
      </div>
    </Card>
  );
}
