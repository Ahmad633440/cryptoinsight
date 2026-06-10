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
  coins?: {
    symbol: string;
    coinId: string;
    confidence: "high" | "medium" | "low";
    score: number;
  }[];
  category?: string;
  source?: string;
  sentiment?: string;
  publishedAt: string;
  url: string;
  isEnriched?: boolean;
  isEmbedded?: boolean;
  coinsDetected?: boolean;
  enrichedAt?: string;
  priceUpdatedAt?: string;
  coinsDetectedAt?: string;
  priceAfter?: number;
  marketCapAfter?: number;
  volume24hAfter?: number;
  marketSnapshot?: {
    openPrice?: number;
    highPrice?: number;
    lowPrice?: number;
    closePrice?: number;
    volume?: number;
    priceMovement?: number;
    marketDirection?: string;
  };
  stored?: {
    priceBefore?: number;
    marketCapBefore?: number;
    volume24hBefore?: number;
    priceAfter?: number;
    priceChangePercent?: number;
    enrichedAt?: string;
  };
  live?: {
    currentPrice?: number;
    currentMarketCap?: number;
    currentVolume24h?: number;
    percentChange24h?: number;
    lastUpdated?: string;
  } | null;
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

/**
 * Multiple coins detected from a single article
 * Replaces DetectedCoin for multi-coin detection
 */
export interface DetectedCoinData {
  symbol: string;
  coinId: string;
  confidence: "high" | "medium" | "low";
  score: number; // 0-10 scale
}

export interface EnrichmentResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}


export interface NewsPayload {
  title: string;
  content?: string;
  description?: string;
  source: string;
  url: string;
  publishedAt: Date;
  coin?: string;
  category?: string;
  sentiment?: string;
}


export interface PriceUpdateResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

/**
 * Interface for similar news results
 */
export interface SimilarNewsResult {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  source: string;
  publishedAt: Date;
  score: number; // Vector similarity score (higher = more similar)
}

/**
 * Result from coin detection background worker
 */
export interface CoinDetectionResult {
  processed: number;
  updated: number;
  skipped: number;
  errors: string[];
}