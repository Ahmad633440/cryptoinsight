# Deployment & Verification Checklist

## Pre-Deployment Verification

### Code Review

- [ ] All TypeScript files compile without errors
- [ ] No console.error() statements left unhandled
- [ ] Import statements are correct
- [ ] No circular dependencies
- [ ] All new functions are exported if needed

### Files Changed/Created

**Modified Files (6):**

- [ ] `src/models/news.ts` - Schema updated
- [ ] `src/data/types.ts` - New types added
- [ ] `src/services/detectCoin.ts` - Multi-coin detection
- [ ] `src/services/embeddingServices.ts` - Auto-detection hook
- [ ] `src/services/enrichNews.ts` - Multi-coin support
- [ ] `src/controllers/fetchNews.ts` - Refactored
- [ ] `src/scripts/cron.ts` - Background worker job added
- [ ] `src/app/api/pipeline/route.ts` - New endpoint added

**New Files (3):**

- [ ] `src/services/coinDetectionService.ts` - Background worker
- [ ] `src/scripts/detectCoinsWorker.ts` - Standalone script
- [ ] `NLP_ENTITY_DETECTION.md` - Comprehensive documentation

**Documentation (4):**

- [ ] `IMPLEMENTATION_SUMMARY.md` - Change overview
- [ ] `QUICK_REFERENCE.md` - Developer guide
- [ ] `ARCHITECTURE_DIAGRAM.md` - System design
- [ ] This file - Deployment guide

## Deployment Steps

### Step 1: Backup Current Data

```bash
# Export current news collection
mongodump --db cryptoinsight --collection news --out ./backup
```

### Step 2: Deploy Code

```bash
# Build (if using TypeScript compilation)
npm run build

# Or for Next.js
npm run next build
```

### Step 3: Start Application

```bash
# Development
npm run dev

# Production
npm run start
```

### Step 4: Verify Services Started

```bash
# Check cron jobs are active (no errors in logs)
# Should see these messages immediately:
# [CRON] Starting news sync...
# [CRON] Starting coin detection...
# [CRON] Starting news enrichment...
# [CRON] Starting price update...
```

### Step 5: Test API Endpoints

```bash
# Test detection trigger
curl -X POST "http://localhost:3000/api/pipeline?action=detect-coins&limit=5"

# Test status endpoint
curl http://localhost:3000/api/pipeline

# Expected: Success response with statistics
```

## Post-Deployment Verification

### 1. Real-Time Detection Test

Create a test article:

```typescript
// In a test script or terminal
import { createNewsWithEmbedding } from "@/services/embeddingServices";

const result = await createNewsWithEmbedding({
  title: "Bitcoin and Ethereum Surge Today",
  content: "Markets show strong momentum in major cryptocurrencies",
  source: "test",
  url: "http://test.com/" + Date.now(),
  publishedAt: new Date(),
  sentiment: "Neutral",
});

// Check the created news
const news = await News.findById(result.news._id);
console.log(news.coins); // Should have BTC and ETH
console.log(news.coinsDetected); // Should be true
```

**Expected Output:**

```javascript
{
  coins: [
    { symbol: "BTC", coinId: "1", confidence: "high", score: 9.5 },
    { symbol: "ETH", coinId: "1027", confidence: "high", score: 8.2 }
  ],
  coinsDetected: true,
  coinsDetectedAt: 2026-05-14T12:00:00.000Z
}
```

### 2. Background Worker Test

Run background worker:

```bash
# Via API
curl -X POST "http://localhost:3000/api/pipeline?action=detect-coins&limit=10"

# Via script (if enabled)
npm run ts-node src/scripts/detectCoinsWorker.ts
```

**Expected Output:**

```
[BACKGROUND WORKER] Found 87 news articles pending coin detection
[COIN DETECTION] News 507f1f77: Detected coins: BTC(high:9.5)
...
[BACKGROUND WORKER] Coin detection completed. Updated: 87, Skipped: 0
```

### 3. Enrichment Integration Test

Check enrichment uses detected coins:

```bash
# Trigger enrichment
curl -X POST "http://localhost:3000/api/pipeline?action=enrich&limit=5"
```

**Expected in logs:**

```
[ENRICHMENT] Using detected coin: BTC (high)
[ENRICHED] News 507f1f77: BTC @ $42500.00
```

### 4. Database Verification

```javascript
// Check test document
db.news.findOne({ "coins.0": { $exists: true } })

// Should return:
{
  _id: ObjectId(...),
  title: "Bitcoin and Ethereum Surge Today",
  coins: [
    { symbol: "BTC", coinId: "1", confidence: "high", score: 9.5 },
    { symbol: "ETH", coinId: "1027", confidence: "high", score: 8.2 }
  ],
  coinsDetected: true,
  coinsDetectedAt: ISODate("2026-05-14T12:00:00.000Z"),
  coin: "BTC",  // Backward compatibility
  ...
}
```

### 5. Cron Job Verification

Monitor logs for at least 20 minutes:

```
✓ Every 10 minutes: [CRON] Starting coin detection...
✓ Every 15 minutes: [CRON] Starting news enrichment...
✓ Every 30 minutes: [CRON] Starting news sync...
✓ Every 1 hour:    [CRON] Starting price update...
```

### 6. API Status Check

```bash
curl http://localhost:3000/api/pipeline | jq

# Response should show:
{
  "success": true,
  "status": {
    "total": <number>,
    "enriched": <number>,
    "pendingEnrichment": <number>,
    "withPriceAfter": <number>,
    "pendingPriceUpdate": <number>,
    "coinsDetected": <number>,        # NEW
    "pendingCoinDetection": <number>, # NEW
    "coinsNotFoundInArticles": <number> # NEW
  }
}
```

## Health Checks

### Daily Monitoring

Run this query daily:

```bash
# Check detection progress
curl http://localhost:3000/api/pipeline

# Expected: coinsDetected increasing, pendingCoinDetection decreasing
```

### Weekly Validation

```javascript
// Verify coin distribution
db.news.aggregate([
  { $unwind: "$coins" },
  { $group: { _id: "$coins.symbol", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
]);

// Should show BTC, ETH, SOL, etc. with reasonable counts
```

### Monthly Audit

```javascript
// Check for anomalies
db.news
  .find({
    coinsDetected: false,
    createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  })
  .count();

// Should be 0 (all old articles detected)
```

## Rollback Plan

If issues occur, rollback is simple since changes are backward compatible:

### Option 1: Disable Auto-Detection (Keep DB changes)

```typescript
// In src/services/embeddingServices.ts
// Comment out:
// const coinDetectionResult = await detectCoinsForNews(news._id.toString());
```

### Option 2: Disable Background Worker (Keep DB changes)

```typescript
// In src/scripts/cron.ts
// Comment out the coin detection cron job:
// cron.schedule("*/10 * * * *", async () => { ... });
```

### Option 3: Full Rollback

```bash
# Revert to previous commit
git revert <commit-hash>

# Restart application
npm run dev
```

**Data will not be lost** - coins array can be safely ignored if detection is disabled.

## Performance Benchmarks

### Expected Metrics

| Operation                  | Time     | Impact      |
| -------------------------- | -------- | ----------- |
| Detect coins per article   | 1-5ms    | Minimal     |
| Batch process 100 articles | 500ms    | Acceptable  |
| Enrichment per article     | 500ms+   | API limited |
| Cron job overhead          | <10% CPU | Background  |
| Database query time        | <10ms    | Indexed     |

### Target Health Stats

- `coinsDetected / total` > 95%
- `pendingCoinDetection` < 100
- Average response time for `/api/pipeline` < 100ms

## Troubleshooting

### Issue: Coins not detected on new articles

**Check:**

1. Look for `[AUTO DETECTION]` logs
2. Verify MongoDB connection
3. Check if embedding generation is failing first

**Solution:**

```typescript
// Manually test detection
import { detectCoinsMultiple } from "@/services/detectCoin";
const coins = detectCoinsMultiple("Bitcoin news title");
console.log(coins); // Should return array
```

### Issue: Background worker not processing

**Check:**

1. MongoDB connection active
2. Cron job in cron.ts not commented out
3. Look for `[BACKGROUND WORKER]` logs

**Manual trigger:**

```bash
curl -X POST "http://localhost:3000/api/pipeline?action=detect-coins&limit=10"
```

### Issue: Enrichment using wrong coin

**Check:**

1. View detected coins: `news.coins`
2. Verify coins array is sorted by score
3. Check enrichment logs: `[ENRICHMENT]`

**Debug query:**

```javascript
// Find articles with multiple coins
db.news.find({ "coins.1": { $exists: true } }).limit(5);

// Verify first coin has highest score
```

### Issue: Database growing too fast

**Likely cause:** Old documents being processed repeatedly

**Solution:**

```javascript
// Verify detection marked properly
db.news.updateMany(
  { coinsDetected: { $exists: false } },
  { $set: { coinsDetected: false, coinsDetectedAt: null } },
);
```

## Compliance & Validation

### Code Quality

- [ ] No TypeScript errors
- [ ] All imports resolved
- [ ] Functions properly typed
- [ ] Error handling in place

### Data Integrity

- [ ] coins array valid format
- [ ] confidence values valid ("high" | "medium" | "low")
- [ ] scores between 0-10
- [ ] coinId matches CoinMarketCap format

### Performance

- [ ] Detection < 10ms per article
- [ ] Cron jobs run on schedule
- [ ] No memory leaks
- [ ] Database indexes used

### Security

- [ ] No sensitive data in logs
- [ ] API endpoints secured (if needed)
- [ ] No SQL injection possible (MongoDB)
- [ ] Input validation in place

## Monitoring & Alerting

### Suggested Alerts

1. **Detection Lag Alert**
   - If `pendingCoinDetection > 1000` for 1 hour

2. **Cron Job Failure**
   - If `[CRON] Coin detection failed` appears

3. **API Error Rate**
   - If `/api/pipeline` returns error rate > 5%

4. **Database Growth**
   - If news collection grows > 100MB in 1 day

### Log Monitoring

Watch for these critical patterns:

```
[ERROR] or [FAIL] - Indicates problem
[AUTO DETECTION] Error - Detection failed
[BACKGROUND WORKER] Failed - Worker crashed
[CRON] ... failed - Job didn't complete
```

## Sign-Off

- [ ] All tests passed
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Backup verified
- [ ] Monitoring configured
- [ ] Rollback plan understood
- [ ] Go-live approved

---

**Deployment Date:** ******\_\_\_******
**Deployed By:** ******\_\_\_******
**Verified By:** ******\_\_\_******
**Notes:** **********************\_\_\_**********************
