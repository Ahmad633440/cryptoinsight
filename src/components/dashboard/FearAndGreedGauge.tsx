import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface FearAndGreedProps {
  data: {
    value: number;
    label: string;
    description: string;
    color: string;
  };
}

export default function FearAndGreedGauge({ data }: FearAndGreedProps) {
  return (
    <Card className="p-5 animate-fade-up delay-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">😨 Fear & Greed</h3>
        <Badge variant="green">{data.label}</Badge>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center py-6">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            {/* Background track */}
            <circle 
              cx="60" cy="60" r="50" 
              fill="none" stroke="#27272a" 
              strokeWidth="10" 
              strokeDasharray="314" 
              strokeDashoffset="78.5" 
              strokeLinecap="round" 
            />
            {/* Value arc */}
            <circle 
              cx="60" cy="60" r="50" 
              fill="none" stroke="url(#gauge-gradient)" 
              strokeWidth="10" 
              strokeDasharray="314" 
              strokeDashoffset={314 - (235.5 * (data.value / 100))} 
              strokeLinecap="round" 
            />
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{data.value}</span>
            <span className="text-[10px] text-zinc-500">/ 100</span>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-4 text-center">
          {data.description} <span className={`${data.color} font-medium`}>{data.label}</span>
        </p>
      </div>

      {/* Scale */}
      <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-3 border-t border-zinc-800/60">
        <span className="text-red-400">Extreme Fear</span>
        <span className="text-amber-400">Neutral</span>
        <span className="text-emerald-400">Extreme Greed</span>
      </div>
    </Card>
  );
}
