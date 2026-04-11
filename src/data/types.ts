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
