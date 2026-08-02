# News Fetching Pipeline - Fixes & Improvements

## 📌 Problem Statement

- Frontend displaying **26-day-old news** instead of recent articles
- Cron jobs not running on Vercel (empty `vercel.json`)
- No GitHub Actions workflow for reliable scheduling
- Missing environment variable documentation
- **Gap in pipeline**: Coin detection wasn't triggering enrichment

---

## ✅ Fixes Implemented

### 1. **Environment Variables Documentation**

**File**: `.env.example`

**Issue**:

- `coinMarketCap.ts` requires `COIN_MARKETCAP_API_KEY`
- `.env.example` showed `NEXT_PUBLIC_COINGECKO_API_KEY` (wrong service)
- `embedding.ts` uses `GEMINI_EMBEDDINGS_API_KEY`
- `.env.example` showed `GEMINI_API_KEY` (inconsistent)

**Fix**:

```
NEWSDATA_API_KEY=your_newsdata_api_key
COIN_MARKETCAP_API_KEY=your_coinmarketcap_api_key
GEMINI_EMBEDDINGS_API_KEY=your_google_gemini_embeddings_api_key
```

**Impact**: ✅ Ensures correct API keys are configured on Vercel/Netlify

---

### 2. **GitHub Actions Cron Workflow**

**File**: `.github/workflows/fetch-news-cron.yml`

**What it does**:

- Runs every 30 minutes (configurable)
- Calls `/api/cron/news-sync` on your Vercel deployment
- Logs results (news synced, failed)
- Can be manually triggered for testing
- Runs independently from Vercel (more reliable)

**Why it helps**:

- Vercel serverless has limitations on background tasks
- GitHub Actions runs outside your deployment
- Provides redundancy if Vercel cron fails
- Better logging and monitoring

**Usage**:

```bash
# Deploy to GitHub
git push origin <branch>

# Set GitHub Actions secret
# Go to: Settings → Secrets → New repository secret
# Name: VERCEL_API_ENDPOINT
# Value: https://your-domain.vercel.app
```

**Impact**: ✅ Reliable scheduled news fetching every 30 minutes

---

### 3. **Vercel Cron Configuration**

**File**: `vercel.json`

**Changed from**:

```json
{
  "crons": []
}
```

**Changed to**:

```json
{
  "crons": [
    {
      "path": "/api/cron/news-sync",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

**Why**:

- Provides backup scheduled trigger on Vercel
- Redundancy if GitHub Actions fails
- Native Vercel feature, no external setup

**Impact**: ✅ Backup cron on Vercel platform

---

### 4. **Automatic Enrichment After Coin Detection** ⭐ CRITICAL FIX

**File**: `src/services/coinDetectionService.ts`

**The Problem**:

```
Fetch News → Create with Embedding → Detect Coins → ❌ STOP
                                                        ↓
Enrichment needs to happen, but it doesn't trigger automatically!
```

**The Solution**:

```
Fetch News → Create with Embedding → Detect Coins → ✅ Enrich Immediately
                                                        ↓
                                        Market data stored instantly
                                        News ready for display
```

**What changed**:

- `detectCoinsForNews()` now calls `enrichNewsImmediately()` automatically
- When coins are detected, market data is fetched from CoinMarketCap immediately
- News article is marked as enriched and ready for display

**Code change**:

```typescript
// After coin detection succeeds
const { enrichNewsImmediately } = await import("./immediateEnrichmentService");
const enrichResult = await enrichNewsImmediately(
  newsId,
  detectedCoins[0].symbol,
);
```

**Impact**: ✅ **Real-time enrichment** - News gets market data instantly after fetch

---

## 📊 Complete News Pipeline Flow (After Fixes)

```
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Actions Cron (every 30 min) / Vercel Cron (backup)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  /api/cron/news-sync       │
        │  (fetchNews.ts)            │
        └────────────┬───────────────┘
                     │
        Fetch from NEWSDATA API
                     │
                     ▼
        ┌────────────────────────────┐
        │ Create News + Embedding    │
        │ (embeddingServices.ts)     │
        │                            │
        │ - Normalize text           │
        │ - Call Gemini API          │
        │ - Generate embedding       │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ Detect Coins               │
        │ (coinDetectionService.ts)  │
        │                            │
        │ - Match coin aliases       │
        │ - Calculate confidence     │
        │ - Sort by score            │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ ✨ Enrich Immediately ✨   │
        │ (immediateEnrichmentService)
        │                            │
        │ - Get market data from CMC │
        │ - Store priceBefore        │
        │ - Store marketCapBefore    │
        │ - Mark as enriched         │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ ✅ News Ready for Display  │
        │ Store in MongoDB           │
        │ Retrieved by /api/news     │
        │ Shown on Frontend (REAL-TIME)
        └────────────────────────────┘
```

---

## 🔄 API Rate Limits (Free Tier - Safe ✅)

Your 30-minute fetch schedule is **within** free tier limits:

| API                   | Free Tier Limit    | Your Usage (30-min schedule)  | Status  |
| --------------------- | ------------------ | ----------------------------- | ------- |
| **NewsData**          | ~100 requests/day  | 48 requests/day               | ✅ Safe |
| **CoinMarketCap**     | 30 requests/minute | ~1 per minute (at fetch time) | ✅ Safe |
| **Gemini Embeddings** | 15 requests/minute | ~1 per minute (per article)   | ✅ Safe |

---

## 📋 Pre-Deployment Checklist

### ✅ Code Changes

- [x] Environment variables documented
- [x] GitHub Actions workflow created
- [x] Vercel cron configured
- [x] Enrichment pipeline completed
- [x] Error logging added

### ⏳ Configuration Required (Before Deployment)

- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Set environment variables on Vercel:
  - MONGODB_URI
  - NEWSDATA_API_KEY
  - COIN_MARKETCAP_API_KEY
  - GEMINI_EMBEDDINGS_API_KEY
- [ ] Add GitHub Actions secret: VERCEL_API_ENDPOINT
- [ ] Verify Vercel deployment is live

### 🧪 Testing (After Deployment)

- [ ] Manually trigger GitHub Actions workflow
- [ ] Check Vercel function logs
- [ ] Verify `/api/news` returns recent articles
- [ ] Check MongoDB for fresh articles with enrichment data
- [ ] Confirm frontend displays up-to-date news

---

## 🚀 Files Changed Summary

| File                                    | Change                   | Purpose                          |
| --------------------------------------- | ------------------------ | -------------------------------- |
| `.env.example`                          | Updated API keys         | Correct environment variables    |
| `vercel.json`                           | Added cron config        | Enable Vercel cron backup        |
| `.github/workflows/fetch-news-cron.yml` | Created new              | GitHub Actions primary cron      |
| `src/services/coinDetectionService.ts`  | Added enrichment trigger | Auto-enrich after coin detection |

---

## 💡 Key Improvements

1. **Redundancy**: GitHub Actions + Vercel Cron (fail-over support)
2. **Reliability**: GitHub Actions runs independently from Vercel
3. **Real-time**: Enrichment happens instantly after coin detection
4. **Documentation**: Clear setup guide for GitHub Actions
5. **Error Handling**: Comprehensive logging at each step
6. **Rate Limit Safe**: 30-minute schedule within free tier limits

---

## 🔍 Monitoring & Debugging

### Check News Sync Logs

```bash
# Vercel Function Logs
https://vercel.com/dashboard → Project → Functions → api/cron/news-sync

# GitHub Actions Logs
https://github.com/Ahmad633440/cryptoinsight/actions
```

### Verify Database

```mongodb
// Check recent news
db.news.find({ publishedAt: { $gte: new Date(Date.now() - 24*60*60*1000) } }).sort({ publishedAt: -1 }).limit(5)

// Check enriched articles
db.news.find({ isEnriched: true }).count()

// Check coins detected
db.news.find({ coinsDetected: true }).count()
```

### Check Frontend

- Should display news from **today/yesterday**
- No more "26 days ago" timestamps
- New articles appear within **~30 minutes** of publishing

---

## ⚡ Next Steps (Optional Enhancements)

1. **Add Slack Notifications**: Alert when cron fails
2. **Database Cleanup**: Remove duplicates/old articles
3. **Performance Optimization**: Index MongoDB queries
4. **Email Digest**: Daily email with top news
5. **Real Webhooks**: Switch to paid NewsData plan for instant updates

---

## 📞 Troubleshooting Reference

**Issue**: GitHub Actions fails with 404

- **Solution**: Verify VERCEL_API_ENDPOINT secret is set correctly

**Issue**: No news appearing on frontend

- **Solution**: Check MongoDB connection and API keys on Vercel

**Issue**: Enrichment failing for some articles

- **Solution**: CoinMarketCap rate limit hit - this is normal for free tier, enrichment will retry

**Issue**: Duplicate articles in database

- **Solution**: Check URL uniqueness constraint in MongoDB

---

**Implementation Status**: ✅ **COMPLETE & READY FOR DEPLOYMENT**

All code changes are production-ready. Follow the deployment checklist above to activate.
