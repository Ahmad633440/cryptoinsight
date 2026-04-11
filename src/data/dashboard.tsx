import React from "react";

export const STAT_CARDS = [
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

export const TOP_COINS = [
  { rank: 1, name: "Bitcoin",    symbol: "BTC",  price: 67432.18,   change24h: 3.24,   marketCap: 1_324_000_000_000, color: "#f7931a" },
  { rank: 2, name: "Ethereum",   symbol: "ETH",  price: 3521.42,    change24h: 1.87,   marketCap: 423_000_000_000,   color: "#627eea" },
  { rank: 3, name: "BNB",        symbol: "BNB",  price: 587.33,     change24h: -0.45,  marketCap: 87_600_000_000,    color: "#f3ba2f" },
  { rank: 4, name: "Solana",     symbol: "SOL",  price: 142.67,     change24h: 5.82,   marketCap: 63_200_000_000,    color: "#9945ff" },
  { rank: 5, name: "XRP",        symbol: "XRP",  price: 0.5234,     change24h: -1.23,  marketCap: 28_700_000_000,    color: "#00aae4" },
  { rank: 6, name: "Cardano",    symbol: "ADA",  price: 0.4521,     change24h: 2.15,   marketCap: 16_100_000_000,    color: "#0033ad" },
];

export const TABLE_DATA = [
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

export const VOLUME_DATA = [
  { label: "BTC",  value: 32_400_000_000, color: "#f7931a" },
  { label: "ETH",  value: 18_200_000_000, color: "#627eea" },
  { label: "SOL",  value: 3_800_000_000,  color: "#9945ff" },
  { label: "BNB",  value: 2_100_000_000,  color: "#f3ba2f" },
  { label: "XRP",  value: 1_200_000_000,  color: "#00aae4" },
  { label: "DOGE", value: 890_000_000,    color: "#c2a633" },
  { label: "AVAX", value: 780_000_000,    color: "#e84142" },
  { label: "LINK", value: 620_000_000,    color: "#2a5ada" },
];

export const TOP_GAINERS = [
  { name: "Solana",   symbol: "SOL",   change: 5.82, color: "#9945ff" },
  { name: "Dogecoin", symbol: "DOGE",  change: 4.56, color: "#c2a633" },
  { name: "Avalanche",symbol: "AVAX",  change: 3.45, color: "#e84142" },
  { name: "Bitcoin",  symbol: "BTC",   change: 3.24, color: "#f7931a" },
];

export const TOP_LOSERS = [
  { name: "XRP",      symbol: "XRP",  change: -1.23, color: "#00aae4" },
  { name: "Polkadot", symbol: "DOT",  change: -0.89, color: "#e6007a" },
  { name: "BNB",      symbol: "BNB",  change: -0.45, color: "#f3ba2f" },
];

export const TRENDING = [
  { name: "Solana",    symbol: "SOL",  searches: "142K", color: "#9945ff" },
  { name: "Dogecoin",  symbol: "DOGE", searches: "98K",  color: "#c2a633" },
  { name: "Avalanche", symbol: "AVAX", searches: "67K",  color: "#e84142" },
  { name: "Cardano",   symbol: "ADA",  searches: "54K",  color: "#0033ad" },
  { name: "Chainlink", symbol: "LINK", searches: "41K",  color: "#2a5ada" },
];

export const MARKET_HIGHLIGHTS = [
  { label: "ETH Gas",          value: "23 Gwei",    sub: "Low",    variant: "green" as const },
  { label: "BTC Hash Rate",    value: "612 EH/s",   sub: "ATH",    variant: "green" as const },
  { label: "DeFi TVL",         value: "$87.3B",     sub: "+3.2%",  variant: "green" as const },
  { label: "Stablecoin MC",    value: "$145.2B",    sub: "+0.8%",  variant: "zinc" as const },
  { label: "NFT Volume (24h)", value: "$12.4M",     sub: "-8.1%",  variant: "red" as const },
  { label: "Active Addresses", value: "1.02M",      sub: "+5.6%",  variant: "green" as const },
];

export const FEAR_AND_GREED = {
  value: 72,
  label: "Greed",
  description: "Market sentiment is currently Greedy",
  color: "text-emerald-400"
};
