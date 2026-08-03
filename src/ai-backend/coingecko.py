"""
coingecko.py
------------
Thin wrapper around the CoinGecko /simple/price endpoint.
Mirrors the symbol -> id mapping in src/lib/coingecko.ts so both sides stay in sync.
"""

import requests
from config import COINGECKO_TIMEOUT

# Symbol map (same as src/lib/coingecko.ts)
SYMBOL_TO_GECKO_ID: dict[str, str] = {
    # Tickers
    "BTC":  "bitcoin",
    "ETH":  "ethereum",
    "XRP":  "ripple",
    "SOL":  "solana",
    "ADA":  "cardano",
    "DOGE": "dogecoin",
    "PEPE": "pepe",
    "SHIB": "shiba-inu",
    "BNB":  "binancecoin",
    "LINK": "chainlink",
    "AVAX": "avalanche-2",
    "DOT":  "polkadot",
    # Full names (for natural-language queries like "bitcoin price")
    "BITCOIN":   "bitcoin",
    "ETHEREUM":  "ethereum",
    "RIPPLE":    "ripple",
    "SOLANA":    "solana",
    "CARDANO":   "cardano",
    "DOGECOIN":  "dogecoin",
    "BINANCE":   "binancecoin",
    "CHAINLINK": "chainlink",
    "AVALANCHE": "avalanche-2",
    "POLKADOT":  "polkadot",
    "SHIBA":     "shiba-inu",
}

# Shown when a price question names no specific coin
FALLBACK_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple"]

_COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price"


def fetch_live_prices(gecko_ids: list[str]) -> dict:
    """
    Call CoinGecko and return the raw JSON dict.
    Returns {} on any network / API error so callers degrade gracefully.
    """
    if not gecko_ids:
        return {}
    try:
        resp = requests.get(
            _COINGECKO_API,
            params={
                "ids":                     ",".join(gecko_ids),
                "vs_currencies":           "usd",
                "include_market_cap":      "true",
                "include_24hr_vol":        "true",
                "include_24hr_change":     "true",
                "include_last_updated_at": "true",
            },
            timeout=COINGECKO_TIMEOUT,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        print(f"[CoinGecko] Error: {exc}")
        return {}


def build_price_context(gecko_ids: list[str]) -> str:
    """
    Fetch live prices and format them as a labelled context block
    ready to inject into the LLM prompt. Returns "" on failure.
    """
    data = fetch_live_prices(gecko_ids)
    if not data:
        return ""

    lines = ["[LIVE MARKET DATA - fetched right now from CoinGecko]"]
    for gecko_id, info in data.items():
        price  = info.get("usd")
        change = info.get("usd_24h_change")
        mcap   = info.get("usd_market_cap")
        vol    = info.get("usd_24h_vol")
        name   = gecko_id.replace("-", " ").title()

        price_str = f"${price:,.8g} USD" if price is not None else "price unavailable"
        parts = [f"{name}: {price_str}"]
        if change is not None:
            parts.append(f"24h change: {change:+.2f}%")
        if mcap is not None:
            parts.append(f"market cap: ${mcap:,.0f}")
        if vol is not None:
            parts.append(f"24h volume: ${vol:,.0f}")
        lines.append(" | ".join(parts))

    return "\n".join(lines)
