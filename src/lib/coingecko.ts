import { CoinQuote } from "@/data/types";

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
}

const SYMBOL_TO_GECKO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  XRP: "ripple",
  SOL: "solana",
  ADA: "cardano",
  DOGE: "dogecoin",
  PEPE: "pepe",
  SHIB: "shiba-inu",
  BNB: "binancecoin",
  LINK: "chainlink",
  AVAX: "avalanche-2",
  DOT: "polkadot",
};

const getCoinGeckoId = (symbol: string): string | null => {
  return SYMBOL_TO_GECKO_ID[symbol.toUpperCase()] || null;
};

const rateLimitedRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  const lastRequestTime = (globalThis as any).__coingecko_last_request_time ?? 0;
  const minInterval = 1000;

  if (now - lastRequestTime < minInterval) {
    await new Promise((resolve) => setTimeout(resolve, minInterval - (now - lastRequestTime)));
  }

  (globalThis as any).__coingecko_last_request_time = Date.now();
  return requestFn();
};

export const getQuotes = async (symbols: string[]): Promise<Map<string, CoinQuote>> => {
  const ids = symbols
    .map((symbol) => getCoinGeckoId(symbol))
    .filter(Boolean) as string[];

  if (ids.length === 0) {
    return new Map();
  }

  return rateLimitedRequest(async () => {
    const params = new URLSearchParams({
      ids: ids.join(","),
      vs_currencies: "usd",
      include_market_cap: "true",
      include_24hr_vol: "true",
      include_24hr_change: "true",
      include_last_updated_at: "true",
    });

    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }

    const data = (await response.json()) as CoinGeckoPriceResponse;
    const quoteMap = new Map<string, CoinQuote>();

    for (const symbol of symbols) {
      const geckoId = getCoinGeckoId(symbol);
      if (!geckoId) {
        continue;
      }

      const marketData = data[geckoId];
      if (!marketData || marketData.usd === undefined) {
        continue;
      }

      quoteMap.set(symbol.toUpperCase(), {
        id: geckoId,
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        price: marketData.usd,
        marketCap: marketData.usd_market_cap ?? 0,
        volume24h: marketData.usd_24h_vol ?? 0,
        percentChange24h: marketData.usd_24h_change ?? 0,
        lastUpdated: new Date((marketData.last_updated_at ?? Date.now()) * 1000).toISOString(),
      });
    }

    return quoteMap;
  });
};

export const getQuoteBySymbol = async (symbol: string): Promise<CoinQuote | null> => {
  try {
    const quotes = await getQuotes([symbol]);
    return quotes.get(symbol.toUpperCase()) || null;
  } catch (error) {
    console.error(`Failed to fetch CoinGecko quote for ${symbol}:`, error);
    return null;
  }
};

export default getQuoteBySymbol;
