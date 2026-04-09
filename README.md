# CryptoInsight

AI-powered crypto analysis platform that combines real-time market data, news sentiment analysis, historical comparisons, and risk scoring to help users make informed decisions.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB (Mongoose)
- **AI/ML:** OpenAI, LangChain, Vector DB (embeddings)
- **Data Source:** CoinGecko API, CryptoPanic API

## Modules

| Module | Route | Description |
|---|---|---|
| **Market Dashboard** | `/` | Real-time coin prices, market cap, 24h volume via CoinGecko REST API polling |
| **AI News Summaries** | `/news` | CryptoPanic news ingested → OpenAI summarises → Bullish/Bearish/Neutral label |
| **Historical Comparison** | `/comparison` | Vector DB semantic search returns top-N past events; generates Comparison Report |
| **Risk Analysis** | `/risk` | Volatility + volume + sentiment + market cap → Multi-factor Low/Med/High risk score |
| **AI Chatbot** | `/chatbot` | LangChain RAG chain: user query → vector search → context injection → GPT response |
| **Trusted Coin System** | `/trusted-coins` | Multi-factor credibility scoring: classifies coins as Trusted / Uncertain / Risky |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                       # Root layout (html, body, fonts, metadata)
│   ├── globals.css                      # Global styles & Tailwind config
│   │
│   ├── (public pages)/                  # Route group — no URL prefix
│   │   ├── layout.tsx                   # Public layout (Navbar, Footer)
│   │   ├── page.tsx                     # / → Market Dashboard
│   │   ├── news/page.tsx               # /news → AI News Summaries
│   │   ├── comparison/page.tsx         # /comparison → Historical Comparison
│   │   ├── risk/page.tsx               # /risk → Risk Analysis
│   │   ├── chatbot/page.tsx            # /chatbot → AI Chatbot
│   │   └── trusted-coins/page.tsx      # /trusted-coins → Trusted Coin System
│   │
│   └── api/                             # Backend API routes
│       └── test/route.ts               # DB connection test endpoint
│
├── components/
│   ├── layout/                          # App shell components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── ui/                              # Shared reusable UI primitives
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Loader.tsx
│   │
│   ├── dashboard/                       # Market Dashboard components
│   │   ├── PriceCard.tsx               # Single coin price display
│   │   ├── MarketTable.tsx             # Coin listing table
│   │   └── VolumeChart.tsx             # 24h volume chart
│   │
│   ├── news/                            # AI News components
│   │   ├── NewsFeed.tsx                # News article list
│   │   ├── NewsCard.tsx                # Single news item
│   │   └── SentimentBadge.tsx          # Bullish/Bearish/Neutral label
│   │
│   ├── comparison/                      # Historical Comparison components
│   │   ├── ComparisonReport.tsx        # Generated comparison report
│   │   ├── EventCard.tsx               # Past event match card
│   │   └── SearchBar.tsx               # Semantic search input
│   │
│   ├── risk/                            # Risk Analysis components
│   │   ├── RiskScore.tsx               # Low/Med/High score display
│   │   ├── RiskFactors.tsx             # Factor breakdown
│   │   └── RiskGauge.tsx               # Visual risk meter
│   │
│   ├── chatbot/                         # AI Chatbot components
│   │   ├── ChatWindow.tsx              # Chat container with messages
│   │   ├── ChatMessage.tsx             # Single message bubble
│   │   └── ChatInput.tsx               # Text input + send button
│   │
│   └── trusted-coins/                   # Trusted Coin System components
│       ├── CoinList.tsx                # Coin listing with trust badges
│       ├── CoinCard.tsx                # Single coin credibility card
│       └── TrustBadge.tsx              # Trusted/Uncertain/Risky label
│
├── hooks/
│   └── useFetch.ts                      # Generic data fetching hook
│
├── data/
│   └── types.ts                         # Shared TypeScript types (frontend ↔ backend)
│
├── lib/
│   └── db.ts                            # MongoDB connection utility
│
└── models/
    └── pastNews.ts                      # News Mongoose schema (with embeddings)
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your MONGODB_URI, API keys, etc.

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `OPENAI_API_KEY` | OpenAI API key for summaries & chatbot |
| `COINGECKO_API_KEY` | CoinGecko API key (optional for free tier) |
| `CRYPTOPANIC_API_KEY` | CryptoPanic API key for news ingestion |
