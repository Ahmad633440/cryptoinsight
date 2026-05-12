import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PriceCard from "@/components/dashboard/PriceCard";
import MarketTable from "@/components/dashboard/MarketTable";
import StatCards from "@/components/dashboard/StatCards";
import GainerLoserList from "@/components/dashboard/GainerLoserList";

import { 
  STAT_CARDS, 
  TOP_COINS, 
  TABLE_DATA, 
  TOP_GAINERS, 
  TOP_LOSERS, 
} from "@/data/dashboard";

export default function DashboardPage() {
  return (
    <div className="px-6 py-10 space-y-12 max-w-7xl mx-auto">

      {/* ──────────────────────────────────────────────────────────
          SECTION 1 — Header (Simplified)
          ────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              Market <span className="text-blue-500">Dashboard</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-md font-medium">
              Track your favorite crypto assets with simple, real-time market data.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="green" dot className="bg-emerald-500/10 border-emerald-500/20 px-3 py-1">
              Live Feed
            </Badge>
            <Badge variant="zinc" className="bg-zinc-800/40 border-zinc-700/30 px-3 py-1 text-[10px] font-bold">
              UPDATED {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 2 — Key Stats (The Big Picture)
          ────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <StatCards stats={STAT_CARDS} />
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 3 — Top Moving Assets
          ────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-up">
          <GainerLoserList 
            title="🔥 Top Gainers" 
            subtitle="Last 24 Hours" 
            data={TOP_GAINERS} 
            variant="green" 
          />
        </div>
        <div className="animate-fade-up delay-1">
          <GainerLoserList 
            title="🩸 Top Losers" 
            subtitle="Last 24 Hours" 
            data={TOP_LOSERS} 
            variant="red" 
          />
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 4 — Leading Coins (Price Cards)
          ────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Main Assets</h2>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Global Top 3</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {TOP_COINS.map((coin, i) => (
            <div key={coin.symbol} className={`animate-fade-up delay-${i + 1}`}>
              <PriceCard {...coin} />
            </div>
          ))}
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 5 — Full Market Overview
          ────────────────────────────────────────────────────────── */}
      <section className="space-y-6 animate-fade-up">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Detailed Market List</h2>
          <button className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
            Refresh List
          </button>
        </div>
        <MarketTable data={TABLE_DATA} />
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 6 — Simple Actions
          ────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <Card className="p-8 border-none bg-gradient-to-br from-zinc-900/40 to-black/20 backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9L3 21m9-9l9-9" />
             </svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-3">
              <h3 className="text-2xl font-bold text-white">Need more help?</h3>
              <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                Our AI Assistant can explain complex terms or analyze specific coins for you in plain English.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <a
                href="/chatbot"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all text-center"
              >
                Ask the AI
              </a>
              <a
                href="/risk"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-800 hover:text-white transition-all text-center"
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

