"use client";

import Card from "@/components/ui/Card";

interface VolumeBar {
  label: string;
  value: number;
  color: string;
}

interface VolumeChartProps {
  data: VolumeBar[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="p-6">
      {/* ── Header ─────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white">24h Trading Volume</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Top coins by volume</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-live" />
          Real-time
        </div>
      </div>

      {/* ── Chart ──────────────────────────── */}
      <div className="flex items-end gap-3 h-48 mb-4">
        {data.map((bar, i) => {
          const heightPercent = (bar.value / maxValue) * 100;
          return (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Value tooltip */}
              <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                ${(bar.value / 1_000_000_000).toFixed(1)}B
              </span>

              {/* Bar */}
              <div className="w-full relative flex items-end" style={{ height: "100%" }}>
                <div
                  className={`w-full rounded-t-lg animate-bar-grow delay-${i + 1} group-hover:opacity-100 opacity-80 transition-opacity relative overflow-hidden`}
                  style={{
                    height: `${heightPercent}%`,
                    background: `linear-gradient(to top, ${bar.color}40, ${bar.color})`,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Labels ─────────────────────────── */}
      <div className="flex gap-3">
        {data.map((bar) => (
          <div key={bar.label} className="flex-1 text-center">
            <span className="text-[10px] font-medium text-zinc-500 uppercase">{bar.label}</span>
          </div>
        ))}
      </div>

      {/* ── Legend ──────────────────────────── */}
      <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          {data.slice(0, 4).map((bar) => (
            <div key={bar.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: bar.color }} />
              <span className="text-[10px] text-zinc-500">{bar.label}</span>
            </div>
          ))}
        </div>
        <span className="text-[10px] text-zinc-600">Volume in USD</span>
      </div>
    </Card>
  );
}
