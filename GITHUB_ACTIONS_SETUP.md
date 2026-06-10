# GitHub Actions Cron Setup for News Fetching

## Overview

This guide sets up automated news fetching via **GitHub Actions** (every 30 minutes) with **Vercel Cron** as a backup for redundancy.

---

## ✅ What's Been Set Up

1. **GitHub Actions Workflow** (`.github/workflows/fetch-news-cron.yml`)
   - Runs every 30 minutes
   - Calls your Vercel API endpoint: `/api/cron/news-sync`
   - Provides detailed logging and error handling
   - Can be manually triggered for testing

2. **Vercel Cron Config** (`vercel.json`)
   - Backup scheduled task (every 30 minutes)
   - Provides redundancy in case GitHub Actions fails
   - Native to Vercel, no additional setup needed

---

## 🚀 Deployment Steps

### Step 1: Get Your Vercel API Endpoint

1. **Deploy to Vercel** (if not already done)

   ```bash
   git push origin <your-branch>
   ```

2. **Find your Vercel domain**
   - Go to https://vercel.com/dashboard
   - Select your project: `cryptoinsight`
   - Copy the domain (e.g., `https://cryptoinsight-abc123.vercel.app`)

### Step 2: Configure GitHub Actions Secret

1. **Go to GitHub Repository Settings**
   - https://github.com/Ahmad633440/cryptoinsight/settings/secrets/actions

2. **Add New Secret**
   - Click: "New repository secret"
   - **Name**: `VERCEL_API_ENDPOINT`
   - **Value**: Your Vercel domain (e.g., `https://cryptoinsight-abc123.vercel.app`)
   - Click: "Add secret"

3. **Verify**
   - You should see `VERCEL_API_ENDPOINT` in the secrets list

---

## 📋 Environment Variables Required on Vercel

Make sure these environment variables are set in your Vercel project:

1. Go to: **Project Settings** → **Environment Variables**
2. Add these (copy from your local `.env`):

```
MONGODB_URI=your_mongodb_connection_string
NEWSDATA_API_KEY=your_newsdata_api_key
COIN_MARKETCAP_API_KEY=your_coinmarketcap_api_key
GEMINI_EMBEDDINGS_API_KEY=your_google_gemini_embeddings_api_key
```

⚠️ **Do NOT use `NEXT_PUBLIC_` prefix** for sensitive API keys!

---

## ✨ Workflow Details

### GitHub Actions Workflow

**File**: `.github/workflows/fetch-news-cron.yml`

- **Trigger**: Every 30 minutes via cron schedule
- **Alternative trigger**: Manual via "Run workflow" button in GitHub
- **Action**:
  1. Calls `/api/cron/news-sync` on your Vercel deployment
  2. Logs the response (news synced count, failures)
  3. Reports success/failure status

### Expected Output

```
Fetching crypto news at 2024-06-10 14:30:00 UTC
Status: 200
Response: {"success":true,"message":"News sync completed","synced":15,"failed":0,"timestamp":"2024-06-10T14:30:00Z"}
✅ News fetch successful
```

---

## 🧪 Testing the Setup

### Option 1: Manual GitHub Actions Trigger

1. Go to: https://github.com/Ahmad633440/cryptoinsight/actions
2. Select: `Fetch Crypto News - Every 30 Minutes`
3. Click: **Run workflow** → **Run workflow** (green button)
4. Wait 30 seconds and check the logs

### Option 2: Manual Vercel Cron Trigger

1. Go to your Vercel project settings
2. Find the cron job: `/api/cron/news-sync`
3. Click the test/trigger button (if available)

### Option 3: Direct API Call

```bash
curl -X GET https://your-vercel-domain.vercel.app/api/cron/news-sync
```

---

## 📊 Monitoring

### GitHub Actions

- **Dashboard**: https://github.com/Ahmad633440/cryptoinsight/actions
- **Workflow**: "Fetch Crypto News - Every 30 Minutes"
- **Check**:
  - Workflow runs (look for green ✅ or red ❌)
  - Click a run to see detailed logs
  - Monitor for any failures

### Vercel

- **Dashboard**: https://vercel.com/dashboard
- **Project**: cryptoinsight
- **Crons**: In project settings → Cron Jobs
- **Function Logs**: Monitor `/api/cron/news-sync` executions

### Frontend

- Should show **recent news** (today/yesterday)
- Check if "26 days old" issue is resolved
- Verify new articles appear within 30 minutes of publishing

---

## 🐛 Troubleshooting

### GitHub Actions Fails with 404

**Problem**: `Status: 404 - endpoint not found`

**Solution**:

1. Verify `VERCEL_API_ENDPOINT` secret is set correctly
2. Make sure domain includes protocol: `https://...`
3. Ensure your Vercel app is deployed and `/api/cron/news-sync` endpoint exists

### GitHub Actions Fails with 500

**Problem**: `Status: 500 - server error`

**Solution**:

1. Check Vercel function logs: https://vercel.com/dashboard → project → logs
2. Verify all environment variables are set on Vercel
3. Check MongoDB connection is working
4. Verify API keys (NEWSDATA, CoinMarketCap, Gemini) are valid

### No News Appearing on Frontend

**Problem**: Frontend still shows old news

**Solution**:

1. Manually trigger GitHub Actions workflow or Vercel cron
2. Check MongoDB: should have recent news documents
3. Verify `publishedAt` dates are recent
4. Check browser cache: hard refresh (Ctrl+Shift+R)
5. Check API response: `/api/news` should return recent articles

### Duplicate News Articles

**Problem**: Same articles showing multiple times

**Solution**:

1. The system checks for duplicates by URL (unique constraint)
2. If seeing duplicates, check database for orphaned documents
3. Run a cleanup: Delete duplicate entries by URL in MongoDB

---

## 🔄 Free API Rate Limits

Your 30-minute schedule respects free tier limits:

| API           | Limit              | Your Usage               | Status  |
| ------------- | ------------------ | ------------------------ | ------- |
| NewsData      | ~100 requests/day  | 48/day (30-min interval) | ✅ Safe |
| CoinMarketCap | 30 requests/minute | ~1 per minute max        | ✅ Safe |
| Gemini API    | 15 requests/minute | ~1 per minute max        | ✅ Safe |

---

## 🚀 Next Steps

1. **Deploy to Vercel**

   ```bash
   git push origin <your-branch>
   ```

2. **Set GitHub Actions Secret**
   - Add `VERCEL_API_ENDPOINT` secret

3. **Verify Environment Variables**
   - Set on Vercel dashboard

4. **Test Manually**
   - Trigger workflow from GitHub Actions dashboard
   - Check logs for success/failure

5. **Monitor**
   - Watch GitHub Actions runs
   - Check frontend for recent news
   - Verify MongoDB has fresh documents

---

## 📚 Related Documentation

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Project Overview](./PROJECT_OVERVIEW.md)
- [Vercel Cron Setup](./VERCEL_CRON_SETUP.md)

---

## ❓ Questions?

Check these documents for more context:

- **How embeddings work**: See `embeddingServices.ts`
- **How coins are detected**: See `coinDetectionService.ts`
- **How enrichment works**: See `immediateEnrichmentService.ts`
- **API flow**: Check `/src/app/api/cron/news-sync/route.ts`

---

**Last Updated**: June 2024
**Status**: ✅ Ready for Deployment
