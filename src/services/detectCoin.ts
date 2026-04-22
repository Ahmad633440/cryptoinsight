
/**
 * Coin detection service - identifies which coin a news article is about
 * Uses keyword matching with support for aliases
 */

import { DetectedCoin } from "@/data/types";
import { getQuoteBySymbol } from "@/lib/coinMarketCap";

// Coin definitions with keywords for detection
// Format: symbol -> { name, aliases, coinId }
const COINS: Record<string, { name: string; aliases: string[]; coinId: string }> = {
  BTC: {
    name: "Bitcoin",
    aliases: ["bitcoin", "btc", "satoshi", "bitcoin ETF", "bitcoin ETF", "btc ETF"],
    coinId: "1",
  },
  ETH: {
    name: "Ethereum",
    aliases: ["ethereum", "eth", "ether", "eth2", "ethereum merge", "vitalik"],
    coinId: "1027",
  },
  XRP: {
    name: "XRP",
    aliases: ["xrp", "ripple", "ripple xrp", "ripplenet", "xrpl"],
    coinId: "52",
  },
  SOL: {
    name: "Solana",
    aliases: ["solana", "sol", "solana blockchain", "solanad"],
    coinId: "4128",
  },
  BNB: {
    name: "BNB",
    aliases: ["bnb", "binance coin", "binance token", "bnb chain"],
    coinId: "1839",
  },
  ADA: {
    name: "Cardano",
    aliases: ["cardano", "ada", "cardano blockchain", "hoskinson"],
    coinId: "2010",
  },
  DOGE: {
    name: "Dogecoin",
    aliases: ["dogecoin", "doge", "doge coin", "shiba inu doge"],
    coinId: "74",
  },
  DOT: {
    name: "Polkadot",
    aliases: ["polkadot", "dot", "polkadot blockchain", "gavin wood"],
    coinId: "1214",
  },
  MATIC: {
    name: "Polygon",
    aliases: ["polygon", "matic", "polygon matic", "polygon zkevm"],
    coinId: "4713",
  },
  LINK: {
    name: "Chainlink",
    aliases: ["chainlink", "link", "chain link", "oracle token"],
    coinId: "1975",
  },
  AVAX: {
    name: "Avalanche",
    aliases: ["avalanche", "avax", "avax avalanche", "avalanche chain"],
    coinId: "12559",
  },
  LTC: {
    name: "Litecoin",
    aliases: ["litecoin", "ltc", "lite coin", "litecoin halving"],
    coinId: "2",
  },
  UNI: {
    name: "Uniswap",
    aliases: ["uniswap", "uni", "uniswap protocol", "uniswap v3"],
    coinId: "5874",
  },
  ATOM: {
    name: "Cosmos",
    aliases: ["cosmos", "atom", "cosmos hub", "tendermint"],
    coinId: "3794",
  },
  XLM: {
    name: "Stellar",
    aliases: ["stellar", "xlm", "stellar lumens", "stellar blockchain"],
    coinId: "512",
  },
  NEAR: {
    name: "NEAR Protocol",
    aliases: ["near", "near protocol", "near blockchain", "near token"],
    coinId: "13152",
  },
  APT: {
    name: "Aptos",
    aliases: ["aptos", "apt", "aptos blockchain", "aptos lab"],
    coinId: "21794",
  },
  ARB: {
    name: "Arbitrum",
    aliases: ["arbitrum", "arb", "arbitrum one", "arbitrum nova"],
    coinId: "11841",
  },
  OP: {
    name: "Optimism",
    aliases: ["optimism", "op", "optimism op", "optimism layer 2"],
    coinId: "25244",
  },
  PEPE: {
    name: "Pepe",
    aliases: ["pepe", "pepe coin", "pepe token", "memecoin pepe"],
    coinId: "24478",
  },
  SHIB: {
    name: "Shiba Inu",
    aliases: ["shiba inu", "shib", "shiba", "shib token"],
    coinId: "5994",
  },
};

/**
 * Detect which coin a news article is about based on title and content
 * @param title - News article title
 * @param content - Optional news article content
 * @returns Detected coin info or null if no match
 */


export const detectCoin = (title: string, content?: string): DetectedCoin | null => {
  const text = `${title} ${content || ""}`.toLowerCase();

  // Score each coin based on keyword matches
  const scores: Record<string, number> = {};

  for (const [symbol, coinInfo] of Object.entries(COINS)) {
    let score = 0;

    // Check aliases (weighted)
    for (const alias of coinInfo.aliases) {
      const aliasLower = alias.toLowerCase();
      const regex = new RegExp(`\\b${escapeRegex(aliasLower)}\\b`, "i");

      if (regex.test(title.toLowerCase())) {
        // Higher weight for title matches
        score += 3;
      } else if (content && regex.test(content.toLowerCase())) {
        score += 1;
      }
    }

    if (score > 0) {
      scores[symbol] = score;
    }
  }

  if (Object.keys(scores).length === 0) {
    return null;
  }

  // Find the coin with highest score
  const highestScore = Object.entries(scores).reduce((max, [symbol, score]) =>
    score > max[1] ? [symbol, score] : max,
  ["", 0]
  );

  const [bestSymbol] = highestScore;
  const coinInfo = COINS[bestSymbol];

  // Determine confidence based on score
  const confidence: "high" | "medium" | "low" =
    highestScore[1] >= 5 ? "high" : highestScore[1] >= 3 ? "medium" : "low";

  return {
    symbol: bestSymbol,
    name: coinInfo.name,
    coinId: coinInfo.coinId,
    confidence,
  };
};

/**
 * Validate detected coin by checking if it exists in CoinMarketCap
 * Use this for higher accuracy when needed
 */
export const validateCoin = async (symbol: string): Promise<boolean> => {
  try {
    const quote = await getQuoteBySymbol(symbol);
    return quote !== null;
  } catch (error) {
    console.error(`Failed to validate coin ${symbol}:`, error);
    return false;
  }
};

/**
 * Get all supported coin symbols
 */
export const getSupportedCoins = (): string[] => {
  return Object.keys(COINS);
};

/**
 * Get coin info by symbol
 */
export const getCoinInfo = (symbol: string): { name: string; aliases: string[]; coinId: string } | null => {
  return COINS[symbol.toUpperCase()] || null;
};

// Helper to escape regex special characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default detectCoin;