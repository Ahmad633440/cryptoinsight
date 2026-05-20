"use client";

import React from "react";

interface MarketData {
  openPrice?: number;
  closePrice?: number;
  marketDirection?: string;
  priceMovement?: number;
}

interface MarketDataWidgetProps {
  marketData?: MarketData;
}

export default function MarketDataWidget({ marketData }: MarketDataWidgetProps) {
  if (!marketData) return null;

  const { openPrice, closePrice, marketDirection, priceMovement } = marketData;

  // If there's no price movement or prices, don't show the widget
  if (openPrice === undefined && closePrice === undefined && priceMovement === undefined) {
    return null;
  }

  // Determine sentiment
  let sentiment: "bullish" | "bearish" | "neutral" = "neutral";
  if (priceMovement !== undefined) {
    if (priceMovement > 0) sentiment = "bullish";
    else if (priceMovement < 0) sentiment = "bearish";
  } else if (openPrice !== undefined && closePrice !== undefined) {
    if (closePrice > openPrice) sentiment = "bullish";
    else if (closePrice < openPrice) sentiment = "bearish";
  }

  const isUp = marketDirection?.toLowerCase() === "up" || sentiment === "bullish";
  const isDown = marketDirection?.toLowerCase() === "down" || sentiment === "bearish";

  // Formatter for prices
  const formatPrice = (val?: number) => {
    if (val === undefined || isNaN(val)) return "N/A";
    if (val === 0) return "$0.00";
    if (val < 1) return `$${val.toFixed(4)}`;
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Formatter for percentage
  const formatPercentage = (val?: number) => {
    if (val === undefined || isNaN(val)) {
      // If we have open/close price, we can calculate it
      if (openPrice && closePrice) {
        const calculated = ((closePrice - openPrice) / openPrice) * 100;
        return `${calculated > 0 ? "+" : ""}${calculated.toFixed(2)}%`;
      }
      return "0.00%";
    }
    return `${val > 0 ? "+" : ""}${val.toFixed(2)}%`;
  };

  const widgetClass = 
    sentiment === "bullish" ? "market-widget--bullish" :
    sentiment === "bearish" ? "market-widget--bearish" : "market-widget--neutral";

  const textColor = 
    sentiment === "bullish" ? "text-emerald-400" :
    sentiment === "bearish" ? "text-red-400" : "text-zinc-400";

  return (
    <div className={`market-widget ${widgetClass} animate-fade-in`}>
      {/* Percentage change & direction */}
      <div className="flex items-center gap-1.5 col-span-2 border-b border-zinc-800/60 pb-1.5 mb-1">
        <span className={`text-base font-black ${textColor}`}>
          {formatPercentage(priceMovement)}
        </span>
        {isUp && (
          <svg className="h-4 w-4 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {isDown && (
          <svg className="h-4 w-4 text-red-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {!isUp && !isDown && (
          <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
          </svg>
        )}
        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold ml-auto">
          Price Impact
        </span>
      </div>

      {/* Details grid */}
      <div className="flex flex-col">
        <span className="text-[9px] text-zinc-500 uppercase font-medium">Open</span>
        <span className="font-mono text-[11px] text-zinc-300">{formatPrice(openPrice)}</span>
      </div>
      <div className="flex flex-col text-right">
        <span className="text-[9px] text-zinc-500 uppercase font-medium">Close</span>
        <span className="font-mono text-[11px] text-zinc-300">{formatPrice(closePrice)}</span>
      </div>
    </div>
  );
}
