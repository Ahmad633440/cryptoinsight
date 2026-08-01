# News Enrichment Flow Documentation

## Overview

This document explains how news enrichment works in CryptoInsight, including the priority system, cron job automation, and edge case handling.

---

## Priority System: External API Enrichment First

### **Priority 1: External API Data (Get False = Skip Enrichment)**

If the external news API (e.g., NewsData API) provides enrichment fields, **use them directly** and skip the enrichment pipeline.

#### Fields that qualify as "enriched":

- `priceBefore` (price at time of news)
- `marketCapBefore` (market cap at time of news)
- `volume24hBefore` (24h volume at time of news)
- `priceAfter` (optional: price 24h later)
- `priceChangePercent` (optional: price change percentage)

#### When external data is available:

```json
POST /api/news
{
  "title": "Bitcoin Hits New ATH",
  "content": "...",
  "source": "example.com",
  "url": "https://example.com/article",
  "coin": "BTC",
  "priceBefore": 45000,           // ✅ External API provided
  "marketCapBefore": 900000000000, // ✅ External API provided
  "volume24hBefore": 25000000000,  // ✅ External API provided
  "priceAfter": 46500,
  "priceChangePercent": 3.3
}
```

**Result:**

```json
{
  "success": true,
  "enriched": true,
  "note": "External API enrichment data used",
  "data": {
    /* news object with isEnriched: true */
  }
}
```

The news is **immediately marked as enriched** (`isEnriched: true`) and **skipped** by the enrichment pipeline.

---

### **Priority 2: Automatic Enrichment via Cron Job**

If external API **doesn't provide enrichment fields**, the cron job automatically enriches the news.

#### When external data is NOT available:

```json
POST /api/news
{
  "title": "Bitcoin Hits New ATH",
  "content": "...",
  "source": "example.com",
  "url": "https://example.com/article",
  "coin": "BTC"
  // ❌ No enrichment fields provided
}
```

**Result:**

```json
{
  "success": true,
  "enriched": false,
  "note": "Awaiting enrichment pipeline",
  "data": {
    /* news object with isEnriched: false */
  }
}
```

The news is **marked as unenriched** and will be processed by the cron job.

---

## Cron Job Automation

### **Job 2: News Enrichment (Every 15 minutes)**

The cron job runs automatically every 15 minutes to enrich news articles.

**Location:** `src/scripts/cron.ts` (Job 2)

**Process:**

1. Find all unenriched news articles (`isEnriched: false`)
2. For each article:
   - **Detect coin** from title/content using keyword matching
   - **Validate coin** exists in CoinMarketCap API
   - **Fetch market data** (current price, market cap, 24h volume)
   - **Store as snapshot** (priceBefore, marketCapBefore, volume24hBefore)
   - Mark as `isEnriched: true`

**Example log output:**

```
Starting news enrichment...
[ENRICHED] News 507abc123: BTC @ $45,000.50
[ENRICHED] News 507abc124: ETH @ $2,500.75
[EDGE CASE] General news (no coin detected), marked as enriched: 507abc125
[EDGE CASE] Coin ETH not found in CoinMarketCap, marked as enriched: 507abc126
News enrichment completed. Success: 2, Failed: 0, Skipped: 2
```

---

## Edge Cases & Handling

### **Edge Case 1: General News (No Coin Detected)**

News articles that don't mention any specific cryptocurrency.

**Example:**

- "SEC Announces New Cryptocurrency Regulations"
- "How Blockchain is Transforming Supply Chains"

**Handling:**

- Coin detection returns `null`
- Article is **marked as enriched anyway** (`isEnriched: true`)
- No market data is stored
- Article is **excluded from coin-specific queries**

**Result:**

```
[EDGE CASE] General news (no coin detected), marked as enriched: 507abc125
```

---

### **Edge Case 2: Invalid/New Coins**

News mentions a coin that doesn't exist in CoinMarketCap yet.

**Example:**

- "New altcoin XYZ launches on Solana"
- Coin detected: `XYZ`
- CoinMarketCap API validation fails

**Handling:**

- Coin is detected but validation fails
- Article is **marked as enriched** (`isEnriched: true`)
- **No market data stored** (cannot fetch from invalid coin)
- Article can be retrieved but without price comparisons

**Result:**

```
[EDGE CASE] Coin XYZ not found in CoinMarketCap, marked as enriched: 507abc126
```

---

### **Edge Case 3: API Rate Limiting**

CoinMarketCap API rate limit is hit during enrichment.

**Handling:**

- Request fails with error status
- Article remains `isEnriched: false`
- **Retried** in the next cron cycle (15 minutes)
- Rate limiting is handled with 1-second delays between requests

---

### **Edge Case 4: Duplicate News**

Same article from multiple sources.

**Handling:**

- Checked via `url` field (must be unique)
- First instance is enriched
- Duplicates are skipped
- Returns: `created: false, enriched: existing.isEnriched`

---

## Complete Data Flow

### **Scenario 1: External API Provides Enrichment**

```
NewsData API
    ↓
News fetched with price data
    ↓
POST /api/news (with enrichment fields)
    ↓
createNewsWithEmbedding() detects enrichment data
    ↓
News stored with isEnriched: true ✅
    ↓
Cron job SKIPS this (already enriched)
    ↓
Frontend displays enriched data ✅
```

### **Scenario 2: External API Doesn't Provide Enrichment**

```
NewsData API
    ↓
News fetched without price data
    ↓
POST /api/news (no enrichment fields)
    ↓
createNewsWithEmbedding() detects no enrichment data
    ↓
News stored with isEnriched: false
    ↓
Cron job (every 15 min) processes unenriched news
    ↓
Coin detection → CoinMarketCap API call
    ↓
News updated with priceBefore, marketCapBefore, volume24hBefore
    ↓
isEnriched: true ✅
    ↓
Frontend displays enriched data ✅
```

### **Scenario 3: General News (No Coin)**

```
NewsData API
    ↓
News about regulations (no coin mention)
    ↓
POST /api/news
    ↓
News stored with isEnriched: false
    ↓
Cron job processes it
    ↓
Coin detection returns NULL ❌
    ↓
News marked as isEnriched: true (but no market data)
    ↓
Article available in /api/latest but NOT in /api/enriched
    ↓
Frontend shows as general news (no price data)
```

---

## API Usage Examples

### **1. Get Enriched News with Live Market Data**

```
GET /api/enriched?limit=10&page=1
```

Returns news with:

- `stored`: Historical price snapshot (priceBefore, marketCapBefore, etc.)
- `live`: Current market data from CoinMarketCap

```json
{
  "success": true,
  "data": [
    {
      "_id": "507abc123",
      "title": "Bitcoin Hits New ATH",
      "coin": "BTC",
      "stored": {
        "priceBefore": 45000,
        "marketCapBefore": 900000000000,
        "volume24hBefore": 25000000000,
        "enrichedAt": "2026-05-13T10:00:00Z"
      },
      "live": {
        "currentPrice": 46500,
        "currentMarketCap": 930000000000,
        "percentChange24h": 3.3
      }
    }
  ]
}
```

### **2. Get Latest News (All News)**

```
GET /api/latest
```

Returns all news (enriched and unenriched, coin-related and general).

### **3. Get Paginated News**

```
GET /api/news?limit=20&page=1
```

Returns basic news without enrichment data.

### **4. Create News with External Enrichment**

```
POST /api/news
{
  "title": "Bitcoin Surges",
  "content": "...",
  "source": "example.com",
  "url": "https://...",
  "coin": "BTC",
  "priceBefore": 45000,
  "marketCapBefore": 900000000000,
  "volume24hBefore": 25000000000,
  "priceAfter": 46500,
  "priceChangePercent": 3.3
}
```

Returns immediately with `enriched: true`.

---

## Configuration

### **Cron Job Schedules** (in `src/scripts/cron.ts`)

- **Job 1:** News sync - `*/30 * * * *` (every 30 minutes)
- **Job 2:** News enrichment - `*/15 * * * *` (every 15 minutes)
- **Job 3:** Price update - `0 * * * *` (every hour)

### **Adjust Cron Timing**

Modify the cron expression if needed:

- `*/5 * * * *` = every 5 minutes
- `*/30 * * * *` = every 30 minutes
- `0 */6 * * *` = every 6 hours

---

## Troubleshooting

### **Issue: No Enriched News Showing**

1. Check if news has `isEnriched: true` in database
2. Check cron job logs for errors
3. Verify CoinMarketCap API key is set
4. Check that coins are valid (in CoinMarketCap)

### **Issue: Enrichment Takes Too Long**

1. Cron runs every 15 minutes by default
2. API rate limiting: 1-second delay between requests
3. For 100 articles: ~100 seconds (1.5 minutes) + API latency

### **Issue: General News Showing in Enriched Results**

General news (no coin detected) should NOT appear in `/api/enriched`.
If it does, check `isEnriched` flag in MongoDB.

---

## Summary

| Stage           | Trigger          | Data Source       | isEnriched                                      |
| --------------- | ---------------- | ----------------- | ----------------------------------------------- |
| 1️⃣ News Created | External API     | NewsData API      | `false` or `true` (if enrichment data provided) |
| 2️⃣ Enrichment   | Cron Job (15min) | CoinMarketCap API | Set to `true`                                   |
| 3️⃣ Price Update | Cron Job (1hr)   | CoinMarketCap API | Updates priceAfter                              |

The system prioritizes external API enrichment data and only uses the cron job when that data is unavailable.
