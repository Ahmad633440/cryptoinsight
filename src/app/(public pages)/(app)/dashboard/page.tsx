"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PriceCard from "@/components/dashboard/PriceCard";
import MarketTable from "@/components/dashboard/MarketTable";
import StatCards from "@/components/dashboard/StatCards";
import GainerLoserList from "@/components/dashboard/GainerLoserList";

// Type based on our service
interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

// Helper to generate a hex color from string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substring(-2);
  }
  return color;
}

export default function DashboardPage() {
  const [data, setData] = useState<CoinGeckoMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const fetchDashboardData = async (force = false) => {
    try {
      setLoading(true);
      const url = force ? `/api/dashboard?force=true&t=${Date.now()}` : `/api/dashboard`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(json.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("An error occurred while fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    const intervalId = setInterval(() => {
      fetchDashboardData(true);
    }, 60000); // 1 minute
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Loading market data...</p>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 px-4">
        <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 font-bold text-center">{error}</p>
        <button 
          onClick={() => fetchDashboardData(true)}
          className="px-6 py-2 mt-4 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate stats
  const totalMarketCap = data.reduce((acc, coin) => acc + coin.market_cap, 0);
  const totalVolume = data.reduce((acc, coin) => acc + coin.total_volume, 0);
  
  // Find top gainer
  const sortedByChange = [...data].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
  const topGainer = sortedByChange[0];
  
  const statCardsData = [
    {
      label: "Total Market Cap",
      value: totalMarketCap >= 1e12 ? `$${(totalMarketCap / 1e12).toFixed(2)}T` : `$${(totalMarketCap / 1e9).toFixed(2)}B`,
      change: "+0.0%",
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
        </svg>
      )
    },
    {
      label: "24h Volume",
      value: totalVolume >= 1e9 ? `$${(totalVolume / 1e9).toFixed(2)}B` : `$${(totalVolume / 1e6).toFixed(2)}M`,
      change: "+0.0%", 
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
        </svg>
      )
    },
    {
      label: "Active Coins",
      value: data.length.toString(),
      change: "Live",
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="M16.71 13.88l.7.71-2.82 2.82" />
        </svg>
      )
    },
    {
      label: "Top Performer (24h)",
      value: topGainer ? topGainer.symbol.toUpperCase() : "N/A",
      change: topGainer ? `+${topGainer.price_change_percentage_24h.toFixed(2)}%` : "0%",
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 3.82-13A1.5 1.5 0 0 0 11.23 2a22 22 0 0 0-13 3.82l-3 3" /><path d="m5.3 10.3 3.4 3.4" /><path d="M15 15h.01" />
        </svg>
      )
    }
  ];

  const topGainers = sortedByChange.slice(0, 5).map(coin => ({
    name: coin.name,
    symbol: coin.symbol,
    change: coin.price_change_percentage_24h || 0,
    color: stringToColor(coin.symbol)
  }));

  const topLosers = [...data].sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)).slice(0, 5).map(coin => ({
    name: coin.name,
    symbol: coin.symbol,
    change: coin.price_change_percentage_24h || 0,
    color: stringToColor(coin.symbol)
  }));

  const topCoins = data.slice(0, 3).map((coin, index) => ({
    rank: coin.market_cap_rank || (index + 1),
    name: coin.name,
    symbol: coin.symbol,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap,
    color: stringToColor(coin.symbol)
  }));

  const tableData = data.slice(0, visibleCount).map((coin, index) => {
    const prices = coin.sparkline_in_7d?.price || [];
    const change7d = prices.length > 1 && prices[0] !== 0
      ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
      : 0;

    return {
      rank: coin.market_cap_rank || (index + 1),
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      change1h: 0,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: change7d,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      color: stringToColor(coin.symbol),
      sparkline: prices,
    };
  });

  return (
    <div className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 space-y-8 sm:space-y-10 md:space-y-12 max-w-7xl mx-auto w-full min-w-0">

      {/* ── Header ─────────────────────────── */}
      <section className="animate-fade-up">
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter">
              Market <span className="text-blue-500">Dashboard</span>
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm md:text-base max-w-md font-medium">
              Track your favorite crypto assets with simple, real-time market data.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant="green" dot className="bg-emerald-500/10 border-emerald-500/20 px-2 sm:px-3 py-1 text-[10px] sm:text-[11px]">
              Live Feed
            </Badge>
            <Badge variant="zinc" className="bg-zinc-800/40 border-zinc-700/30 px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold">
              UPDATED {lastUpdated ? lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "..."}
            </Badge>
          </div>
        </div>
      </section>

      {/* ── Key Stats ──────────────────────── */}
      <section className="animate-fade-up">
        <StatCards stats={statCardsData} />
      </section>

      {/* ── Top Moving Assets ──────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="animate-fade-up min-w-0">
          <GainerLoserList 
            title="🔥 Top Gainers" 
            subtitle="Last 24 Hours" 
            data={topGainers} 
            variant="green" 
          />
        </div>
        <div className="animate-fade-up delay-1 min-w-0">
          <GainerLoserList 
            title="🩸 Top Losers" 
            subtitle="Last 24 Hours" 
            data={topLosers} 
            variant="red" 
          />
        </div>
      </section>

      {/* ── Leading Coins ──────────────────── */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">Main Assets</h2>
          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Global Top 3</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {topCoins.map((coin, i) => (
            <div key={coin.symbol} className={`animate-fade-up delay-${i + 1}`}>
              <PriceCard {...coin} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Full Market Overview ────────────── */}
      <section className="space-y-4 sm:space-y-6 animate-fade-up min-w-0">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">Detailed Market List</h2>
          <button 
            onClick={() => fetchDashboardData(true)}
            disabled={loading}
            className="text-[9px] sm:text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh List"}
          </button>
        </div>
        <MarketTable data={tableData} />
        
        {visibleCount < data.length && (
          <div className="flex justify-center pt-2 pb-4 sm:pb-6">
            <button
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/30 text-zinc-300 hover:text-white font-bold transition-all text-xs sm:text-sm group flex items-center gap-2"
            >
              Load More Coins
              <svg 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                className="group-hover:translate-y-0.5 transition-transform"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* ── CTA Section ────────────────────── */}
      <section className="animate-fade-up">
        <Card className="p-5 sm:p-6 md:p-8 border-none bg-gradient-to-br from-zinc-900/40 to-black/20 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 sm:p-12 opacity-5 scale-100 sm:scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9L3 21m9-9l9-9" />
             </svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center md:text-left space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Need more help?</h3>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-sm leading-relaxed">
                Our AI Assistant can explain complex terms or analyze specific coins for you in plain English.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
              <a
                href="/chatbot"
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all text-center"
              >
                Ask the AI
              </a>
              <a
                href="/risk"
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl border border-zinc-800 text-zinc-400 font-bold text-xs sm:text-sm hover:bg-zinc-800 hover:text-white transition-all text-center"
              >
                Understand Risks
              </a>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}
