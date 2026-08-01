# Vercel Cron Jobs Setup Guide

This project uses Vercel Cron Functions to automatically sync news, detect coins, and update prices.

## How It Works

Vercel automatically runs cron jobs on schedule without needing a separate server. The cron endpoints are located in:

- `src/app/api/cron/news-sync` - Runs every 10 minutes
- `src/app/api/cron/coin-detection` - Runs every 5 minutes
- `src/app/api/cron/price-update` - Runs every hour

## Deployment Instructions

### 1. Local Setup

Add to your `.env.local`:

```bash
CRON_SECRET=your_random_secret_token_12345
```

(Generate a random token: `openssl rand -hex 32` or just use any random string)

### 2. Push to Vercel

```bash
git add .
git commit -m "Add Vercel cron jobs"
git push
```

### 3. Configure Environment on Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   Name: CRON_SECRET
   Value: your_random_secret_token_12345
   ```
5. Make sure it's checked for all environments (Production, Preview, Development)

### 4. Verify Crons are Running

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Go to **Functions** → **Crons**
6. You should see all 3 cron jobs listed and scheduled

## Manual Embedding Migration

To trigger the embedding migration manually:

```bash
curl -X POST \
  https://your-vercel-url.vercel.app/api/cron/migrate-embeddings \
  -H "Authorization: Bearer your_random_secret_token_12345"
```

## Monitoring

### Check Cron Logs

1. Vercel Dashboard → Your Project → Deployments
2. Click latest deployment → Functions → Crons
3. Click on each cron to see execution logs

### Expected Behavior

- **News Sync (every 10 min)**: Fetches latest news from NewsData API
- **Coin Detection (every 5 min)**: Detects coins in articles without coin data
- **Price Update (every hour)**: Captures market data 24h after article publication

### Logs Location

All logs are available in:

- Vercel Dashboard → Function Logs
- Vercel CLI: `vercel logs`

## Troubleshooting

### Crons not running?

- Check if `vercel.json` exists in root
- Verify environment variables are set in Vercel Dashboard
- Ensure MongoDB connection string is correct
- Check API rate limits (NewsData, CoinMarketCap, Gemini)

### Getting errors?

- Review function logs in Vercel Dashboard
- Check MongoDB connection
- Verify all API keys are set
- Check rate limits on external APIs

### High costs?

- Monitor function duration and memory usage
- Optimize queries if needed
- Consider reducing cron frequency if needed
