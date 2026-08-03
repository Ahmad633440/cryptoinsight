"""
config.py
---------
Central place for environment variables and shared constants.
Import this module everywhere instead of calling os.getenv() directly.
"""

import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

# Credentials
MONGODB_URL: str = os.getenv("MONGODB_URI", "")
GEMINI_KEY: str  = os.getenv("GEMINI_KEY", "")
GROQ_KEY: str    = os.getenv("GROQ_KEY", "")

# MongoDB
DB_NAME         = "cryptoinsight"
COLLECTION_NAME = "news"
VECTOR_INDEX    = "vector_index"
TEXT_KEY        = "content"

# Model names
EMBEDDING_MODEL = "gemini-embedding-001"
LLM_MODEL       = "llama-3.3-70b-versatile"

# RAG
RAG_TOP_K = 4

# CoinGecko
COINGECKO_TIMEOUT = 8   # seconds


def print_config_status() -> None:
    print("MongoDB URL  :", MONGODB_URL[:30] + "..." if MONGODB_URL else "MISSING")
    print("Gemini Key   :", bool(GEMINI_KEY))
    print("Groq Key     :", bool(GROQ_KEY))
