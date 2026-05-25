# CryptoInsight: Project Overview & Architecture

## 1. What is the Project Doing?
**CryptoInsight** is an intelligent, educational, and analytical cryptocurrency platform. It aggregates crypto news, automatically detects mentioned cryptocurrencies, enriches the news with real-time market data, and uses AI (RAG - Retrieval-Augmented Generation) to answer user questions about the crypto space. It also provides tools to compare different crypto assets and monitor overall market health.

## 2. Target Audience
The primary audience for CryptoInsight includes:
- **Beginners & Novices**: Users looking to learn about blockchain, Web3, and cryptocurrency concepts in a simplified, jargon-free manner without receiving direct financial advice.
- **Crypto Enthusiasts & Traders**: Users who want to track how specific news articles impact coin prices over a 24-hour window, compare assets side-by-side, and stay updated with AI-curated news feeds.

---

## 3. Full Flow of Modules & Functions

### Module A: News Ingestion & Embedding
**Purpose**: Automatically fetch crypto news, generate vector embeddings for semantic search, and store them in the database.
- **`fetchCryptoNews()`** (in `fetchNews.ts`): Calls the external `NewsData.io` API to fetch recent articles related to "cryptocurrency", "bitcoin", etc.
- **`syncNews()`** (in `fetchNews.ts`): Orchestrates the fetching process and iterates through the articles.
- **`createNewsWithEmbedding()`** (in `embeddingServices.ts`): Takes the raw article, calls the Gemini Embedding API (`gemini-embedding-001`) to generate vector embeddings of the content, and saves the article alongside its vectors in MongoDB.

### Module B: Coin Detection
**Purpose**: Identify which specific cryptocurrencies are mentioned in the news articles.
- **`detectCoinsForNews()`** (in `coinDetectionService.ts`): Analyzes the title and content of a newly synced article to find mentions of coins (e.g., "BTC", "Ethereum"). It assigns confidence scores.
- **`detectCoinsForLegacyNews()`**: A background worker that scans older MongoDB documents to update them with detected coins if they were missed.

### Module C: Market Data Enrichment
**Purpose**: Fetch real-time market metrics for the coins detected in the news to track future price impact.
- **`enrichSingleNews()`** (in `enrichNews.ts`): Takes the primary detected coin from an article and calls the **CoinMarketCap API** (`getQuoteBySymbol`).
- **Data Storage**: Stores the current `priceBefore`, `marketCapBefore`, and `volume24hBefore` in the news document. It marks the article as enriched and schedules a 24-hour update.

### Module D: Price Impact Tracking
**Purpose**: Update the price data 24 hours after a news article was published to observe market reactions.
- **`updatePricesAfter24h()`** (in `updateAfter24h.ts`): A scheduled job that finds enriched articles older than 24 hours. It fetches the latest CoinMarketCap data and stores it as `priceAfter`, allowing the frontend to show the percentage change caused by the news.

### Module E: AI Chatbot (Python / Flask Backend)
**Purpose**: Answer user questions contextually using the database of news and general crypto knowledge.
- **Flask App (`app.py`)**: Runs an API server exposing the `/ask` endpoint.
- **Retrieval**: Uses `MongoDBAtlasVectorSearch` with Gemini embeddings to perform semantic search against the synced news articles.
- **Generation**: Uses `LangChain` and the `Llama-3.3-70b-versatile` model (via Groq) to generate an answer. The system prompt strictly forces the AI to act as a neutral educator and refuse non-crypto questions or financial advice requests.

### Module F: Frontend Web Application (Next.js)
**Purpose**: Provide a premium, interactive user interface for data visualization and AI interaction.
- **Dashboard (`/dashboard`)**: Displays real-time market highlights, volume charts, and top gainers/losers.
- **News Feed (`/news`)**: Displays the AI-enriched news cards, showing sentiment and the associated coin's market data.
- **Comparison Tool (`/comparison`)**: Allows users to select multiple coins and compare their metrics side-by-side.
- **Chat Interface (`/chatbot`)**: A UI that sends user prompts to the Python Flask backend (`/ask`) and streams or displays the AI's educational responses.
