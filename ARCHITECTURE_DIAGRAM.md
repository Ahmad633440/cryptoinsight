# Architecture & Integration Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CRYPTO NEWS PIPELINE                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  News API        │ (NewsData.io)
│  (External)      │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  fetchCryptoNews()                       │
│  ├─ Fetch articles from API              │
│  └─ Return raw articles                  │
└────────┬─────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  createNewsWithEmbedding()               │
│  ├─ Store in MongoDB                     │
│  ├─ Generate embedding (if text exists)  │
│  └─ [AUTO] Call detectCoinsForNews()     │ ← ENTRY POINT
└────────┬─────────────────────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌──────────────────┐    ┌─────────────────────┐
│ MongoDB Store    │    │ detectCoinsForNews()│ ← REAL-TIME
│ coins: []        │    │ ├─ Extract aliases  │
│ coinsDetected: ✓ │    │ ├─ Score matches    │
│ coinsDetectedAt  │    │ └─ Save coins array │
└──────────────────┘    └─────────────────────┘
                               │
                        ┌──────┴──────┐
                        ↓             ↓
                    ┌────────┐  ┌──────────┐
                    │ Coins  │  │Confidence│
                    │Detected│  │ & Score  │
                    └────────┘  └──────────┘


┌──────────────────────────────────────────────────────────┐
│         BACKGROUND WORKER (Every 10 minutes)             │
├──────────────────────────────────────────────────────────┤
│ detectCoinsForLegacyNews()                               │
│ ├─ Find articles with coinsDetected: false              │
│ ├─ Run detection for each                               │
│ ├─ Update coins array                                   │
│ └─ Mark coinsDetected: true                             │
└──────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────┐
│    ENRICHMENT PIPELINE (Every 15 minutes)                │
├──────────────────────────────────────────────────────────┤
│ enrichNews()                                             │
│ ├─ Find unenriched articles                             │
│ ├─ getPrimaryCoin()                                     │
│ │  ├─ Use detected coin from coins[] (if exists)       │
│ │  └─ Fall back to legacy coin field                   │
│ ├─ Fetch market data from CoinMarketCap                │
│ └─ Store: priceBefore, marketCapBefore, volume24h      │
│    isEnriched: true, enrichedAt                         │
└──────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────┐
│    PRICE UPDATE PIPELINE (Every 1 hour)                  │
├──────────────────────────────────────────────────────────┤
│ updatePricesAfter24h()                                   │
│ ├─ Find enriched articles (24+ hours old)              │
│ ├─ Fetch current price for coin                         │
│ └─ Store: priceAfter, priceChangePercent               │
│    Schedule for price impact analysis                   │
└──────────────────────────────────────────────────────────┘

```

## Data Flow Sequence

```
1. News Fetched
   └─→ Article stored in MongoDB
       ├─→ Embedding generated (async)
       └─→ [REAL-TIME] Coin detection runs
           └─→ coins array populated
               ├─→ Coins with confidence scores
               └─→ coinsDetected flag set

2. Background Worker (Every 10 min)
   └─→ Query: coinsDetected = false
       └─→ For each article:
           ├─→ Detect coins
           └─→ Update coins array

3. Enrichment (Every 15 min)
   └─→ Query: isEnriched = false
       └─→ For each article:
           ├─→ Get primary coin from coins[] or fallback
           ├─→ Fetch market data
           └─→ Store market snapshot

4. Price Update (Every 1 hour)
   └─→ Query: enrichedAt ≤ 24h ago AND priceAfter = null
       └─→ For each article:
           ├─→ Fetch current price
           ├─→ Calculate change %
           └─→ Store for analytics

5. Analytics Available
   └─→ Query any metrics by coin
       ├─→ Multiple coins per article available
       └─→ Price impact analysis by coin
```

## Module Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│ External Libraries                                           │
├─────────────────────────────────────────────────────────────┤
│ axios (HTTP), mongoose (MongoDB), node-cron (Scheduling)    │
└─────────────────────────────────────────────────────────────┘
          ↑                    ↑                      ↑
          │                    │                      │
    ┌─────┴────────────────────┴──────────────────────┴──────┐
    │                    Core Services                        │
    ├──────────────────────────────────────────────────────────┤
    │                                                          │
    │  detectCoin.ts                                           │
    │  ├─ detectCoinsMultiple() ← Multi-coin detection      │
    │  ├─ detectCoin() ← Single coin (legacy)               │
    │  ├─ validateCoin()                                    │
    │  └─ getSupportedCoins()                               │
    │                                                          │
    │  coinDetectionService.ts ← NEW                          │
    │  ├─ detectCoinsForNews()                              │
    │  ├─ detectCoinsForNewsBatch()                         │
    │  ├─ detectCoinsForLegacyNews() ← Background worker  │
    │  ├─ getCoinDetectionStats()                          │
    │  └─ processPendingCoinDetections()                   │
    │                                                          │
    │  embeddingServices.ts ← UPDATED                         │
    │  ├─ createNewsWithEmbedding() ← Auto-detection hook  │
    │  └─ embedPendingNews()                               │
    │                                                          │
    │  enrichNews.ts ← UPDATED                               │
    │  ├─ getPrimaryCoin() ← Multi-coin aware              │
    │  ├─ enrichSingleNews()                               │
    │  └─ enrichNews()                                     │
    │                                                          │
    │  updateAfter24h.ts                                      │
    │  └─ updatePricesAfter24h()                           │
    │                                                          │
    │  fetchNews.ts ← REFACTORED                             │
    │  ├─ fetchCryptoNews()                                │
    │  └─ syncNews() ← Calls createNewsWithEmbedding()    │
    │                                                          │
    └──────────────────────────────────────────────────────────┘
                    ↑                    ↑
                    │                    │
    ┌───────────────┴────────────────────┴─────────────────┐
    │           Database Layer                            │
    ├──────────────────────────────────────────────────────┤
    │                                                      │
    │  News Model                                          │
    │  ├─ coins[] ← NEW FIELD                             │
    │  ├─ coinsDetected ← NEW FIELD                       │
    │  ├─ coinsDetectedAt ← NEW FIELD                     │
    │  ├─ coin (legacy) ← For backward compatibility      │
    │  └─ All enrichment/price fields                     │
    │                                                      │
    │  Indexes:                                            │
    │  ├─ { coin, isEnriched, publishedAt }              │
    │  ├─ { coinsDetected, coinsDetectedAt }             │
    │  └─ { priceUpdatedAt }                             │
    │                                                      │
    └──────────────────────────────────────────────────────┘
                          ↓
    ┌──────────────────────────────────────────────────────┐
    │         MongoDB Database                            │
    │  ├─ news collection                                 │
    │  └─ _prisma_migrations (if using Prisma)           │
    └──────────────────────────────────────────────────────┘
```

## API Endpoints

```
┌─────────────────────────────────────────────────────────────┐
│ GET /api/pipeline                                           │
├─────────────────────────────────────────────────────────────┤
│ Returns comprehensive pipeline status                       │
│ {                                                           │
│   "status": {                                               │
│     "total": 1000,                      ← All articles     │
│     "enriched": 850,                    ← With market data │
│     "pendingEnrichment": 150,           ← Need enrichment  │
│     "withPriceAfter": 400,              ← With 24h price  │
│     "pendingPriceUpdate": 450,          ← Awaiting price  │
│     "coinsDetected": 900,          ← NEW: With coins     │
│     "pendingCoinDetection": 100,   ← NEW: Need detection │
│     "coinsNotFoundInArticles": 50  ← NEW: No coins found │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ POST /api/pipeline?action=detect-coins&limit=100            │
├─────────────────────────────────────────────────────────────┤
│ Manually trigger coin detection for legacy articles         │
│ {                                                           │
│   "success": true,                                          │
│   "action": "detect-coins",                                │
│   "result": {                                               │
│     "processed": 87,      ← Articles processed             │
│     "updated": 85,        ← Articles with coins detected   │
│     "skipped": 2,         ← Already detected               │
│     "errors": []          ← Any errors                     │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ POST /api/pipeline?action=enrich&limit=50                   │
├─────────────────────────────────────────────────────────────┤
│ Trigger enrichment (unchanged)                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ POST /api/pipeline?action=update-prices&limit=50            │
├─────────────────────────────────────────────────────────────┤
│ Trigger price updates (unchanged)                           │
└─────────────────────────────────────────────────────────────┘
```

## Cron Schedule

```
Every 30 minutes (*/30):
┌─────────────────────────────────────────┐
│ News Sync                               │
│ syncNews()                              │
│ ├─ Fetch from NewsData API             │
│ └─ Call createNewsWithEmbedding()      │
│    └─ [TRIGGERS coin detection]        │
└─────────────────────────────────────────┘

Every 10 minutes (*/10):  ← NEW
┌─────────────────────────────────────────┐
│ Coin Detection (Background Worker)      │
│ detectCoinsForLegacyNews(100)          │
│ ├─ Find articles without coins          │
│ ├─ Detect coins for each                │
│ └─ Update coins array                   │
└─────────────────────────────────────────┘

Every 15 minutes (*/15):
┌─────────────────────────────────────────┐
│ News Enrichment                         │
│ enrichNews(50)                          │
│ ├─ Find unenriched articles             │
│ ├─ Get primary coin (from coins[])      │
│ └─ Fetch & store market data            │
└─────────────────────────────────────────┘

Every 1 hour (0 * * * *):
┌─────────────────────────────────────────┐
│ Price Update                            │
│ updatePricesAfter24h(50)               │
│ ├─ Find articles 24+ hours old          │
│ ├─ Fetch current prices                 │
│ └─ Calculate change %                   │
└─────────────────────────────────────────┘
```

## Integration Checklist

- [x] News model schema updated
- [x] Multi-coin detection service created
- [x] Auto-detection integrated at creation time
- [x] Background worker for legacy data
- [x] Cron job scheduled (every 10 min)
- [x] API endpoint added for manual triggers
- [x] Enrichment service updated
- [x] Type definitions updated
- [x] Backward compatibility maintained
- [x] Logging added (8 log prefixes)
- [x] Documentation complete (3 docs)

## Backward Compatibility

```
Legacy Code                  New Code
───────────────────────────────────────────
coin field       ────────→   coins array
                (populated)  (also populated)

detectCoin()     ────────→   detectCoinsMultiple()
(single)                      (array)

enrichNews()     ────────→   enrichNews()
(uses coin)                   (uses coins[0] or coin)

                             Background worker
                             (new feature)
```

All existing queries and logic still work!

## Testing Strategy

1. **Unit Tests**
   - `detectCoinsMultiple()` with various inputs
   - Score calculation verification
   - Confidence level assignment

2. **Integration Tests**
   - News creation triggers detection
   - Enrichment uses detected coins
   - Background worker updates documents

3. **E2E Tests**
   - Full pipeline: create → detect → enrich → price update
   - Multiple coins handled correctly
   - Cron jobs run on schedule

4. **Monitoring**
   - Check `GET /api/pipeline` regularly
   - Verify log patterns appear
   - Monitor database growth (coins array)

## Performance Expectations

```
Detection:          1-5ms per article
Batch (100):        ~500ms
Enrichment:         500ms per article (includes API call)
Cron overhead:      <10% CPU during processing
Database impact:    Minimal (arrays stored inline)
Memory:             <50MB for all operations
```

## Future Expansion Points

1. **NER Module**
   - Replace regex with Named Entity Recognition
   - Better entity disambiguation

2. **ML Confidence**
   - Train model on manual labels
   - Improve confidence scoring

3. **Relationship Detection**
   - Detect which coins mentioned together
   - Build co-mention graph

4. **Per-Coin Sentiment**
   - Separate sentiment analysis per coin
   - Not just overall article sentiment

5. **Event Classification**
   - Classify news event type
   - (merger, fork, regulation, etc.)

6. **Real-Time Features**
   - WebSocket updates on coin mentions
   - Live trending coins dashboard
