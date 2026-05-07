export type Sentiment = "Bullish" | "Bearish" | "Neutral";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  sentiment: Sentiment;
  source: string;
  sourceUrl: string;
  featured?: boolean;
}


export interface NewsType {
  title: string;
  content?: string;
  source: string;
  publishedAt: Date;
  url: string;
  coin?: string;
  sentiment?: string;
}

export interface EnrichedNewsArticle {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  source?: string;
  sentiment?: string;
  publishedAt: string;
  url: string;
}

export interface CoinQuote {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  percentChange24h: number;
  lastUpdated: string;
}

export interface DetectedCoin {
  symbol: string;
  name: string;
  coinId: string;
  confidence: "high" | "medium" | "low";
}

export interface EnrichmentResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}