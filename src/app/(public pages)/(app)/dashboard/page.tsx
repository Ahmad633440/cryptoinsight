import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PriceCard from "@/components/dashboard/PriceCard";
import MarketTable from "@/components/dashboard/MarketTable";
import VolumeChart from "@/components/dashboard/VolumeChart";

/* ================================================================
   MOCK DATA — will be replaced with CoinGecko API calls later
   ================================================================ */

const STAT_CARDS = [
  {
    label: "Total Market Cap",
    value: "$2.41T",
    change: "+2.34%",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
      </svg>
    ),
  },
  {
    label: "24h Volume",
    value: "$89.7B",
    change: "+5.12%",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    label: "BTC Dominance",
    value: "52.4%",
    change: "-0.8%",
    positive: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    label: "Active Coins",
    value: "13,847",
    change: "+124",
    positive: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

const TOP_COINS = [
  { rank: 1, name: "Bitcoin",    symbol: "BTC",  price: 67432.18,   change24h: 3.24,   marketCap: 1_324_000_000_000, color: "#f7931a" },
  { rank: 2, name: "Ethereum",   symbol: "ETH",  price: 3521.42,    change24h: 1.87,   marketCap: 423_000_000_000,   color: "#627eea" },
  { rank: 3, name: "BNB",        symbol: "BNB",  price: 587.33,     change24h: -0.45,  marketCap: 87_600_000_000,    color: "#f3ba2f" },
  { rank: 4, name: "Solana",     symbol: "SOL",  price: 142.67,     change24h: 5.82,   marketCap: 63_200_000_000,    color: "#9945ff" },
  { rank: 5, name: "XRP",        symbol: "XRP",  price: 0.5234,     change24h: -1.23,  marketCap: 28_700_000_000,    color: "#00aae4" },
  { rank: 6, name: "Cardano",    symbol: "ADA",  price: 0.4521,     change24h: 2.15,   marketCap: 16_100_000_000,    color: "#0033ad" },
];

const TABLE_DATA = [
  { rank: 1,  name: "Bitcoin",    symbol: "BTC",  price: 67432.18,  change1h: 0.12,  change24h: 3.24,  change7d: 8.45,   marketCap: 1_324_000_000_000, volume24h: 32_400_000_000, color: "#f7931a" },
  { rank: 2,  name: "Ethereum",   symbol: "ETH",  price: 3521.42,   change1h: -0.08, change24h: 1.87,  change7d: 5.23,   marketCap: 423_000_000_000,   volume24h: 18_200_000_000, color: "#627eea" },
  { rank: 3,  name: "BNB",        symbol: "BNB",  price: 587.33,    change1h: 0.05,  change24h: -0.45, change7d: 2.11,   marketCap: 87_600_000_000,    volume24h: 2_100_000_000,  color: "#f3ba2f" },
  { rank: 4,  name: "Solana",     symbol: "SOL",  price: 142.67,    change1h: 0.34,  change24h: 5.82,  change7d: 12.34,  marketCap: 63_200_000_000,    volume24h: 3_800_000_000,  color: "#9945ff" },
  { rank: 5,  name: "XRP",        symbol: "XRP",  price: 0.5234,    change1h: -0.15, change24h: -1.23, change7d: -3.45,  marketCap: 28_700_000_000,    volume24h: 1_200_000_000,  color: "#00aae4" },
  { rank: 6,  name: "Cardano",    symbol: "ADA",  price: 0.4521,    change1h: 0.22,  change24h: 2.15,  change7d: 6.78,   marketCap: 16_100_000_000,    volume24h: 520_000_000,    color: "#0033ad" },
  { rank: 7,  name: "Dogecoin",   symbol: "DOGE", price: 0.0823,    change1h: 0.45,  change24h: 4.56,  change7d: 1.23,   marketCap: 11_700_000_000,    volume24h: 890_000_000,    color: "#c2a633" },
  { rank: 8,  name: "Polkadot",   symbol: "DOT",  price: 7.23,      change1h: -0.11, change24h: -0.89, change7d: -2.34,  marketCap: 9_800_000_000,     volume24h: 340_000_000,    color: "#e6007a" },
  { rank: 9,  name: "Avalanche",  symbol: "AVAX", price: 35.67,     change1h: 0.67,  change24h: 3.45,  change7d: 9.12,   marketCap: 13_200_000_000,    volume24h: 780_000_000,    color: "#e84142" },
  { rank: 10, name: "Chainlink",  symbol: "LINK", price: 14.82,     change1h: 0.09,  change24h: 1.23,  change7d: 4.56,   marketCap: 8_700_000_000,     volume24h: 620_000_000,    color: "#2a5ada" },
];

const VOLUME_DATA = [
  { label: "BTC",  value: 32_400_000_000, color: "#f7931a" },
  { label: "ETH",  value: 18_200_000_000, color: "#627eea" },
  { label: "SOL",  value: 3_800_000_000,  color: "#9945ff" },
  { label: "BNB",  value: 2_100_000_000,  color: "#f3ba2f" },
  { label: "XRP",  value: 1_200_000_000,  color: "#00aae4" },
  { label: "DOGE", value: 890_000_000,    color: "#c2a633" },
  { label: "AVAX", value: 780_000_000,    color: "#e84142" },
  { label: "LINK", value: 620_000_000,    color: "#2a5ada" },
];

const TOP_GAINERS = [
  { name: "Solana",   symbol: "SOL",   change: 5.82, color: "#9945ff" },
  { name: "Dogecoin", symbol: "DOGE",  change: 4.56, color: "#c2a633" },
  { name: "Avalanche",symbol: "AVAX",  change: 3.45, color: "#e84142" },
  { name: "Bitcoin",  symbol: "BTC",   change: 3.24, color: "#f7931a" },
];

const TOP_LOSERS = [
  { name: "XRP",      symbol: "XRP",  change: -1.23, color: "#00aae4" },
  { name: "Polkadot", symbol: "DOT",  change: -0.89, color: "#e6007a" },
  { name: "BNB",      symbol: "BNB",  change: -0.45, color: "#f3ba2f" },
];

const TRENDING = [
  { name: "Solana",    symbol: "SOL",  searches: "142K", color: "#9945ff" },
  { name: "Dogecoin",  symbol: "DOGE", searches: "98K",  color: "#c2a633" },
  { name: "Avalanche", symbol: "AVAX", searches: "67K",  color: "#e84142" },
  { name: "Cardano",   symbol: "ADA",  searches: "54K",  color: "#0033ad" },
  { name: "Chainlink", symbol: "LINK", searches: "41K",  color: "#2a5ada" },
];


/* ================================================================
   PAGE COMPONENT
   ================================================================ */

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 space-y-8">

      {/* ──────────────────────────────────────────────────────────
          SECTION 1 — Header
          ────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Market Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Real-time cryptocurrency prices, market caps &amp; trading volume
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="green" dot>Live Data</Badge>
            <Badge variant="zinc">
              Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 2 — Key Stats
          ────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => (
          <Card key={stat.label} hover className={`p-5 animate-fade-up delay-${i + 1}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-zinc-500">{stat.icon}</span>
              <Badge variant={stat.positive ? "green" : "red"}>
                {stat.change}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 3 — Top Coins (Price Cards)
          ────────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Top Coins</h2>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {TOP_COINS.map((coin, i) => (
            <div key={coin.symbol} className={`animate-fade-up delay-${i + 1}`}>
              <PriceCard {...coin} />
            </div>
          ))}
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 4 — Volume Chart + Gainers/Losers
          ────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Volume Chart — takes 2 cols */}
        <div className="xl:col-span-2 animate-fade-up delay-1">
          <VolumeChart data={VOLUME_DATA} />
        </div>

        {/* Gainers & Losers — 1 col */}
        <div className="space-y-4 animate-fade-up delay-2">

          {/* Top Gainers */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">🚀 Top Gainers</h3>
              <Badge variant="green">24h</Badge>
            </div>
            <div className="space-y-3">
              {TOP_GAINERS.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)` }}
                    >
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">{coin.name}</p>
                      <p className="text-[10px] text-zinc-600 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    +{coin.change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Losers */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">📉 Top Losers</h3>
              <Badge variant="red">24h</Badge>
            </div>
            <div className="space-y-3">
              {TOP_LOSERS.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${coin.color}, ${coin.color}99)` }}
                    >
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">{coin.name}</p>
                      <p className="text-[10px] text-zinc-600 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-red-400">
                    {coin.change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 5 — Market Table
          ────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Market Overview</h2>
          <div className="flex items-center gap-2">
            <Badge variant="zinc">Top 10</Badge>
          </div>
        </div>
        <MarketTable data={TABLE_DATA} />
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 6 — Trending + Fear & Greed + Market Info
          ────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Trending Coins */}
        <Card className="p-5 animate-fade-up delay-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">🔥 Trending</h3>
            <Badge variant="yellow">Hot</Badge>
          </div>
          <div className="space-y-3">
            {TRENDING.map((coin, index) => (
              <div key={coin.symbol} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-600 w-4">{index + 1}</span>
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
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

        {/* Fear & Greed Index */}
        <Card className="p-5 animate-fade-up delay-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">😨 Fear &amp; Greed</h3>
            <Badge variant="green">Greed</Badge>
          </div>

          {/* Gauge */}
          <div className="flex flex-col items-center py-6">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                {/* Background track */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="#27272a" strokeWidth="10" strokeDasharray="314" strokeDashoffset="78.5" strokeLinecap="round" />
                {/* Value arc */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#gauge-gradient)" strokeWidth="10" strokeDasharray="314" strokeDashoffset={314 - (235.5 * 0.72)} strokeLinecap="round" />
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">72</span>
                <span className="text-[10px] text-zinc-500">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-4">Market sentiment is currently <span className="text-emerald-400 font-medium">Greedy</span></p>
          </div>

          {/* Scale */}
          <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-3 border-t border-zinc-800/60">
            <span className="text-red-400">Extreme Fear</span>
            <span className="text-amber-400">Neutral</span>
            <span className="text-emerald-400">Extreme Greed</span>
          </div>
        </Card>

        {/* Market Highlights */}
        <Card className="p-5 animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">📊 Market Highlights</h3>
            <Badge variant="blue">Info</Badge>
          </div>

          <div className="space-y-4">
            {[
              { label: "ETH Gas",          value: "23 Gwei",    sub: "Low",    variant: "green" as const },
              { label: "BTC Hash Rate",    value: "612 EH/s",   sub: "ATH",    variant: "green" as const },
              { label: "DeFi TVL",         value: "$87.3B",     sub: "+3.2%",  variant: "green" as const },
              { label: "Stablecoin MC",    value: "$145.2B",    sub: "+0.8%",  variant: "zinc" as const },
              { label: "NFT Volume (24h)", value: "$12.4M",     sub: "-8.1%",  variant: "red" as const },
              { label: "Active Addresses", value: "1.02M",      sub: "+5.6%",  variant: "green" as const },
            ].map((item) => (
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
            <p className="text-[10px] text-yellow-500/80 leading-relaxed">
              <span className="font-semibold">⚠ Alert:</span> High volatility detected in SOL and DOGE. Monitor positions closely.
            </p>
          </div>
        </Card>
      </section>


      {/* ──────────────────────────────────────────────────────────
          SECTION 7 — Quick Actions
          ────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Want deeper insights?</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Use our AI Chatbot for real-time analysis or check Risk Scores before making decisions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/chatbot"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Open AI Chatbot
              </a>
              <a
                href="/risk"
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
              >
                Risk Analysis
              </a>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}
