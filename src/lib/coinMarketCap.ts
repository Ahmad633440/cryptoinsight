import { CoinQuote } from "@/data/types";
import axios, { AxiosInstance } from "axios";

const API_KEY = process.env.COIN_MARKETCAP_API_KEY;

if (!API_KEY) {
  throw new Error("COIN_MARKETCAP_API_KEY is not defined in environment variables");
}

// Rate limiting: token bucket simulation
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests


const rateLimitedRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  return requestFn();
};

export const cmcClient: AxiosInstance = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v2",
  headers: {
    "X-CMC_PRO_API_KEY": API_KEY,
    Accept: "application/json",
  },
  timeout: 10000,
});

// Add response interceptor for error handling
cmcClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn("CoinMarketCap API rate limit hit, retrying after delay...");
    }
    return Promise.reject(error);
  }
);

/**
 * Get quote for specific coins by symbol
 * @param symbols - Array of coin symbols (e.g., ["BTC", "ETH", "XRP"])
 * @returns Map of symbol -> quote data
 */
export const getQuotes = async (symbols: string[]): Promise<Map<string, CoinQuote>> => {
  return rateLimitedRequest(async () => {
    const response = await cmcClient.get("/cryptocurrency/quotes/latest", {
      params: {
        symbol: symbols.join(","),
        convert: "USD",
      },
    });

    const data = response.data.data;
    const quoteMap = new Map<string, CoinQuote>();

    for (const [symbol, coinData] of Object.entries(data)) {
      const quote = (coinData as any).quote.USD;
      quoteMap.set(symbol, {
        id: (coinData as any).id,
        symbol: symbol,
        name: (coinData as any).name,
        price: quote.price,
        marketCap: quote.market_cap,
        volume24h: quote.volume_24h,
        percentChange24h: quote.percent_change_24h,
        lastUpdated: quote.last_updated,
      });
    }

    return quoteMap;
  });
};

/**
 * Get quote for a single coin by symbol
 */
export const getQuoteBySymbol = async (symbol: string): Promise<CoinQuote | null> => {
    try {
        const quotes = await getQuotes([symbol.toUpperCase()]);
        return quotes.get(symbol.toUpperCase()) || null;
        
        console.log(`Fetched quote for ${symbol} `);

        
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error);
      return null;
    }
};

/**
 * Get coin ID mapping from symbol
 */
export const getCoinId = async (symbol: string): Promise<string | null> => {
  return rateLimitedRequest(async () => {
    const response = await cmcClient.get("/cryptocurrency/map", {
      params: {
        symbol: symbol.toUpperCase(),
        limit: 1,
      },
    });

    const data = response.data.data;
    if (data && data.length > 0) {
      return data[0].id.toString();
    }
    return null;
  });
};

