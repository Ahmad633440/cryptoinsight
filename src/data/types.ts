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