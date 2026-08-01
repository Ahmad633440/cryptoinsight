# Quick Reference Guide - Coin Detection System

## For Users

### How It Works

```
News Article → Auto Coin Detection → Coins Array Populated → Enrichment Uses Coins
```

Every news article automatically gets coins detected in real-time. You don't need to do anything!

## For Developers

### Check Detection Status

```bash
# Get overall statistics
curl http://localhost:3000/api/pipeline

# Response shows:
# - totalNews: How many articles
# - coinsDetected: How many have coins detected
# - pendingCoinDetection: How many need detection
```

### Manual Triggers

**Process legacy news for coin detection:**

```bash
curl -X POST "http://localhost:3000/api/pipeline?action=detect-coins&limit=100"
```

**Trigger enrichment:**

```bash
curl -X POST "http://localhost:3000/api/pipeline?action=enrich&limit=50"
```

**Trigger price update:**

```bash
curl -X POST "http://localhost:3000/api/pipeline?action=update-prices&limit=50"
```

### Query News by Coins

```typescript
// Find articles about Bitcoin
const btcNews = await News.find({
  coins: { $elemMatch: { symbol: "BTC" } },
});

// Find articles with high-confidence detections
const highConfidence = await News.find({
  coins: { $elemMatch: { confidence: "high" } },
});

// Find articles mentioning multiple coins
const multiCoin = await News.find({
  "coins.1": { $exists: true }, // Has at least 2 coins
});

// Get all detected coins with their frequency
db.news.aggregate([
  { $unwind: "$coins" },
  { $group: { _id: "$coins.symbol", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

### Understand the Scoring System

```
Score Calculation:
- Each alias match in title: +3 points
- Each alias match in description: +2 points
- Each alias match in content: +1 point
- Final score normalized to 0-10 scale

Confidence Levels:
- score ≥ 7   → "high"
- score 4-7   → "medium"
- score < 4   → "low"
```

Example: "Bitcoin and Ethereum markets surge"

```
Bitcoin:
  - "bitcoin" found in title: +3
  - "btc" not found: +0
  - Total: 3 → normalized to 9.5 → high confidence

Ethereum:
  - "ethereum" found in title: +3
  - "eth" not found: +0
  - Total: 3 → normalized to 8.2 → high confidence
```

### View Processing Logs

**Real-time detection:**

```
[AUTO DETECTION] Running coin detection for news: 507f...
[COIN DETECTION] News 507f...: Detected coins: BTC(high:9.5), ETH(high:8.2)
```

**Enrichment using detected coins:**

```
[ENRICHMENT] Using detected coin: BTC (high)
[ENRICHED] News 507f...: BTC @ $42500.00
```

**Background worker processing:**

```
[BACKGROUND WORKER] Found 87 news articles pending coin detection
[COIN DETECTION] News 507f...: Detected coins: SOL(high:7.5)
[BACKGROUND WORKER] Coin detection completed. Updated: 87, Skipped: 0
```

### Add New Coins

Edit `src/services/detectCoin.ts`:

```typescript
const COINS = {
  // ... existing coins
  NEAR: {
    name: "NEAR Protocol",
    aliases: ["near", "near protocol", "near blockchain"],
    coinId: "13152", // CoinMarketCap ID
  },
};
```

Changes take effect immediately on next detection.

## For DevOps

### Cron Job Schedule

```
Every 30 minutes  → News Sync (fetch from API)
Every 10 minutes  → Coin Detection (background worker)
Every 15 minutes  → News Enrichment (market data)
Every 1 hour      → Price Update (24h snapshots)
```

### Monitor Health

**Check detection progress:**

```bash
curl http://localhost:3000/api/pipeline | jq '.status'

# Sample output:
{
  "total": 1000,
  "enriched": 850,
  "pendingEnrichment": 150,
  "coinsDetected": 900,
  "pendingCoinDetection": 100,
  "coinsNotFoundInArticles": 50
}
```

**Expected healthy state:**

- `coinsDetected / total` > 90%
- `pendingCoinDetection` decreasing over time
- `coinsNotDetected` stable (articles with no coins mentioned)

### Database Indexes

Already added:

```javascript
// For coin detection queries
db.news.createIndex({ coinsDetected: 1, coinsDetectedAt: 1 });

// For coin lookups
db.news.createIndex({ "coins.symbol": 1 });
```

## Troubleshooting

### Issue: Some coins not being detected

**Check:**

1. Is the coin in the COINS dictionary?
2. Are the aliases correct?
3. Look at console logs for detection score

**Example:**

```typescript
// Test detection manually
import { detectCoinsMultiple } from "@/services/detectCoin";

const title = "Ripple XRP Partnership Announced";
const detected = detectCoinsMultiple(title);
console.log(detected);
// Should return: [{ symbol: "XRP", ... }]
```

### Issue: Background worker not processing

**Check:**

1. MongoDB connection active
2. Cron job enabled in `cron.ts`
3. Check logs for `[BACKGROUND WORKER]` entries
4. Manually trigger: `POST /api/pipeline?action=detect-coins`

### Issue: High latency in detection

**Likely cause:** Large batch processing
**Solution:** Reduce batch size

```bash
# Instead of 100, process 25 at a time
curl -X POST "http://localhost:3000/api/pipeline?action=detect-coins&limit=25"
```

## Performance Tips

1. **Keep batch size reasonable:** 25-100 articles per batch
2. **Let cron run automatically:** Don't manually trigger every minute
3. **Monitor database indexes:** Ensure indexes are used

## Configuration

**File:** `src/services/detectCoin.ts`

Supported coins (26 total):

- BTC (Bitcoin)
- ETH (Ethereum)
- XRP (XRP)
- SOL (Solana)
- BNB (BNB)
- ADA (Cardano)
- DOGE (Dogecoin)
- DOT (Polkadot)
- MATIC (Polygon)
- LINK (Chainlink)
- AVAX (Avalanche)
- LTC (Litecoin)
- UNI (Uniswap)
- ATOM (Cosmos)
- XLM (Stellar)
- NEAR (NEAR Protocol)
- APT (Aptos)
- ARB (Arbitrum)
- OP (Optimism)
- PEPE (Pepe)
- SHIB (Shiba Inu)

## API Reference

### POST /api/pipeline?action=detect-coins

**Parameters:**

- `limit` (optional): Max articles to process (default: 100)

**Response:**

```json
{
  "success": true,
  "action": "detect-coins",
  "result": {
    "processed": 87,
    "updated": 85,
    "skipped": 2,
    "errors": []
  }
}
```

### GET /api/pipeline

**Response:**

```json
{
  "success": true,
  "status": {
    "total": 1000,
    "enriched": 850,
    "pendingEnrichment": 150,
    "withPriceAfter": 400,
    "pendingPriceUpdate": 450,
    "coinsDetected": 900,
    "pendingCoinDetection": 100,
    "coinsNotFoundInArticles": 50
  }
}
```

## Key Files for Reference

**Detection Logic:**

- `src/services/detectCoin.ts`

**Orchestration:**

- `src/services/coinDetectionService.ts`

**Integration Points:**

- `src/services/embeddingServices.ts` (auto-detection)
- `src/services/enrichNews.ts` (multi-coin support)

**Scheduling:**

- `src/scripts/cron.ts`

**API:**

- `src/app/api/pipeline/route.ts`

**Documentation:**

- `NLP_ENTITY_DETECTION.md` (comprehensive)
- `IMPLEMENTATION_SUMMARY.md` (overview)
- This file (quick reference)

## Frequently Asked Questions

**Q: Why multiple coins per article?**
A: News often mentions multiple cryptocurrencies. Storing all of them enables better search and analysis.

**Q: What if coin is detected but not found?**
A: The article is marked as `coinsDetected: true` with an empty coins array. It will still be enriched as general crypto news.

**Q: How are scores normalized?**
A: Raw score is divided by 2, then clamped to 0-10 range. (Math.min(10, Math.max(1, score / 2)))

**Q: Can I disable auto-detection?**
A: The hook in `embeddingServices.ts` can be commented out, but background worker will still run via cron.

**Q: What if detection fails?**
A: It's non-blocking. News is still created, and background worker retries later.

**Q: How long does detection take?**
A: ~1-5ms per article. 100 articles take ~500ms.

## Need Help?

1. Check `NLP_ENTITY_DETECTION.md` for detailed documentation
2. Review console logs with `[COIN DETECTION]` prefix
3. Check database stats: `curl http://localhost:3000/api/pipeline`
4. Manually test detection in TypeScript console
