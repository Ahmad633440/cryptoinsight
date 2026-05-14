/**
 * Coin detection service
 * Detects crypto coins from news title/content/description
 */

import { DetectedCoin, DetectedCoinData } from "@/data/types";
import { getQuoteBySymbol } from "@/lib/coinMarketCap";

/**
 * Coin definitions
 */
const COINS: Record<
  string,
  {
    name: string;
    aliases: string[];
    coinId: string;
  }
> = {
  BTC: {
    name: "Bitcoin",
    aliases: ["bitcoin", "btc", "satoshi", "bitcoin etf", "btc etf"],
    coinId: "1",
  },

  ETH: {
    name: "Ethereum",
    aliases: ["ethereum", "eth", "ether", "eth2", "vitalik"],
    coinId: "1027",
  },

  XRP: {
    name: "XRP",
    aliases: ["xrp", "ripple", "xrpl"],
    coinId: "52",
  },

  SOL: {
    name: "Solana",
    aliases: ["solana", "sol"],
    coinId: "4128",
  },

  ADA: {
    name: "Cardano",
    aliases: ["cardano", "ada"],
    coinId: "2010",
  },

  DOGE: {
    name: "Dogecoin",
    aliases: ["dogecoin", "doge"],
    coinId: "74",
  },

  PEPE: {
    name: "Pepe",
    aliases: ["pepe", "pepe coin", "pepe token"],
    coinId: "24478",
  },

  SHIB: {
    name: "Shiba Inu",
    aliases: ["shiba", "shib", "shiba inu"],
    coinId: "5994",
  },

  BNB: {
    name: "BNB",
    aliases: ["bnb", "binance coin", "bnb chain"],
    coinId: "1839",
  },

  LINK: {
    name: "Chainlink",
    aliases: ["chainlink"],
    coinId: "1975",
  },

  AVAX: {
    name: "Avalanche",
    aliases: ["avalanche", "avax"],
    coinId: "12559",
  },

  DOT: {
    name: "Polkadot",
    aliases: ["polkadot"],
    coinId: "1214",
  },
};

/**
 * Escape regex special characters
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Create safer regex for crypto detection
 */
const createCoinRegex = (alias: string): RegExp => {
  return new RegExp(
    `(^|\\W)${escapeRegex(alias.toLowerCase())}(?=\\W|$)`,
    "gi"
  );
};

/**
 * Detect multiple coins from article
 */
export const detectCoinsMultiple = (
  title: string,
  content?: string,
  description?: string
): DetectedCoinData[] => {
  const safeTitle = title || "";
  const safeContent = content || "";
  const safeDescription = description || "";

  const fullText = `
    ${safeTitle}
    ${safeDescription}
    ${safeContent}
  `.toLowerCase();

  const detectedCoins: DetectedCoinData[] = [];

  for (const [symbol, coinInfo] of Object.entries(COINS)) {
    let score = 0;

    for (const alias of coinInfo.aliases) {
      const regex = createCoinRegex(alias);

      // title matches = higher weight
      const titleMatches =
        (safeTitle.toLowerCase().match(regex) || []).length;

      score += titleMatches * 5;

      // description matches
      const descriptionMatches =
        (safeDescription.toLowerCase().match(regex) || []).length;

      score += descriptionMatches * 3;

      // content matches
      const contentMatches =
        (safeContent.toLowerCase().match(regex) || []).length;

      score += contentMatches * 1;
    }

    if (score > 0) {
      let confidence: "high" | "medium" | "low" = "low";

      if (score >= 8) {
        confidence = "high";
      } else if (score >= 4) {
        confidence = "medium";
      }

      detectedCoins.push({
        symbol,
        coinId: coinInfo.coinId,
        confidence,
        score,
      });
    }
  }

  // sort highest score first
  return detectedCoins.sort((a, b) => b.score - a.score);
};

/**
 * Legacy single coin detector
 */
export const detectCoin = (
  title: string,
  content?: string,
  description?: string
): DetectedCoin | null => {
  const coins = detectCoinsMultiple(title, content, description);

  if (coins.length === 0) {
    return null;
  }

  const topCoin = coins[0];

  return {
    symbol: topCoin.symbol,
    name: COINS[topCoin.symbol].name,
    coinId: topCoin.coinId,
    confidence: topCoin.confidence,
  };
};

/**
 * Validate coin exists in CoinMarketCap
 */
export const validateCoin = async (
  symbol: string
): Promise<boolean> => {
  try {
    const quote = await getQuoteBySymbol(symbol);

    return quote !== null;
  } catch (error) {
    console.error(`Failed to validate coin ${symbol}:`, error);

    return false;
  }
};

/**
 * Get supported symbols
 */
export const getSupportedCoins = (): string[] => {
  return Object.keys(COINS);
};

/**
 * Get coin info
 */
export const getCoinInfo = (
  symbol: string
): {
  name: string;
  aliases: string[];
  coinId: string;
} | null => {
  return COINS[symbol.toUpperCase()] || null;
};

export default detectCoin;