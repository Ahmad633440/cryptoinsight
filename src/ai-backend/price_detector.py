"""
price_detector.py
-----------------
Detects whether a user question is asking for live price data,
and extracts which coins are being asked about.
"""

import re
from coingecko import SYMBOL_TO_GECKO_ID, FALLBACK_COINS

# Intent detection pattern
_PRICE_INTENT_RE = re.compile(
    r"\b(price|prices|worth|cost|value|trading at|market cap|24h|volume|"
    r"how much is|how much does|what is .{0,30}(price|worth|at)|"
    r"current|live|now|today|right now|at the moment)\b",
    re.IGNORECASE,
)


def is_price_question(text: str) -> bool:
    """Return True when the question is likely asking for live market data."""
    return bool(_PRICE_INTENT_RE.search(text))


def extract_gecko_ids(text: str) -> list[str]:
    """
    Return a deduplicated list of CoinGecko IDs mentioned in the text.
    Falls back to FALLBACK_COINS when no specific coin is found.
    """
    upper = text.upper()
    found: dict[str, bool] = {}

    for symbol, gecko_id in SYMBOL_TO_GECKO_ID.items():
        pattern = r"\b" + re.escape(symbol) + r"\b"
        if re.search(pattern, upper) and gecko_id not in found:
            found[gecko_id] = True

    return list(found.keys()) or FALLBACK_COINS
