# CoinGecko API Setup & Testing Guide

## ✅ Quick Setup

### 1. Get Your CoinGecko API Key

**Option A: Free Tier (No API Key Required)**

- Works out of the box
- Rate limit: 10-50 calls/minute
- Update frequency: ~10-15 seconds
- ✅ Good for development

**Option B: Free API Key (Recommended)**

1. Go to https://www.coingecko.com/en/api/documentation
2. Click "Get Free API Key"
3. Sign up with email
4. Copy your API key

**Option C: Premium Tier**

- Rate limit: 50 calls/minute
- Most features included
- See: https://www.coingecko.com/en/api/pricing

### 2. Configure Environment Variables

Create or edit `.env.local` in the project root:

```env
# Optional - leave blank for free tier
COIN_GECKO_API_KEY=your_api_key_here

# Other required keys
COIN_MARKETCAP_API_KEY=your_key_here
MONGO_URI=your_mongodb_uri
```

### 3. Test the API

Run the test script to verify everything works:

```bash
# Using npm
npm run test:coingecko

# Or using npx
npx tsx src/scripts/testCoinGecko.ts
```

**Expected output:**

```
✅ API IS WORKING!
📊 Successfully fetched 5 coins:
1. Bitcoin (BTC)
   Price: $67,234.00
   Market Cap: $1,234,567,890,000
   24h Change: +2.45%
```

## 🔍 How to Check If API Key is Expired

### Method 1: Use Test Script

```bash
npx tsx src/scripts/testCoinGecko.ts
```

### Method 2: Check Your Dashboard API

```bash
# In development
curl http://localhost:3000/api/dashboard

# Expected response if working:
# {"success": true, "data": [...], "meta": {"count": 100, ...}}

# If API key is expired, you'll get:
# {"success": false, "error": "API Key Error: ...", status: 401}
```

### Method 3: Manual Test

Use this in your terminal or browser:

```bash
# With API key
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&x_cg_pro_api_key=YOUR_KEY_HERE&per_page=5"

# Without API key (free tier)
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=5"
```

**Response codes:**

- `200` ✅ API is working
- `401` ❌ API key is invalid/expired
- `403` ❌ API key doesn't have permission
- `429` ⚠️ Rate limit hit - wait and retry
- `503` ⚠️ CoinGecko API is down

## 🚀 Using the Dashboard API

### Endpoint

```
GET /api/dashboard?force=true
```

### Parameters

- `force=true` (optional) - Skip cache and fetch fresh data

### Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "current_price": 67234.5,
      "market_cap": 1234567890000,
      "market_cap_rank": 1,
      "total_volume": 45678900000,
      "price_change_percentage_24h": 2.45,
      "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      "last_updated": "2024-01-15T12:34:56.789Z"
    }
    // ... 99 more coins
  ],
  "meta": {
    "count": 100,
    "timestamp": "2024-01-15T12:34:56.789Z",
    "cached": true
  }
}
```

## 📊 Features Added

### ✅ Fetches 100 Coins (Previously 70)

- Now includes more coins in the top 100

### ✅ Better Error Handling

- Detects expired API keys (401/403)
- Handles rate limits (429)
- Proper error messages

### ✅ Proper Type Safety

- Full TypeScript support
- Exported interfaces

### ✅ API Route Exposed

- New endpoint: `/api/dashboard`
- Integrates with Next.js Response caching

## 🛠️ Troubleshooting

### Issue: "API Key is invalid or expired"

**Solution:**

1. Visit https://www.coingecko.com/en/api/documentation
2. Generate a new API key
3. Update `.env.local`
4. Restart dev server: `npm run dev`

### Issue: "Rate limit exceeded (429)"

**Solution:**

- Free tier: Wait 1 minute before retrying
- Check if you're making too many requests
- Consider upgrading to API key or premium

### Issue: "Empty data returned"

**Solution:**

1. Run the test script: `npx tsx src/scripts/testCoinGecko.ts`
2. Check your internet connection
3. Check CoinGecko status: https://status.coingecko.com/

### Issue: "Network error / Connection refused"

**Solution:**

1. Verify internet connection
2. Check if firewall/VPN is blocking API calls
3. Check CoinGecko server status

## 📝 Code Changes Made

### 1. **dashboardCoins.ts** - Fixed & Improved

- ✅ Function now exported
- ✅ Fetches 100 coins (was 70)
- ✅ Proper API key handling
- ✅ Specific error codes for auth failures
- ✅ Full TypeScript typing

### 2. **coinMarketCap.ts** - Fixed

- ✅ Removed unreachable code (console.log after return)

### 3. **New API Route** - `/api/dashboard`

- ✅ Exposes getLiveCoins() function
- ✅ Proper Next.js caching
- ✅ Comprehensive error handling

### 4. **Test Script** - `testCoinGecko.ts`

- ✅ Verify API key status
- ✅ Check connection
- ✅ Display top coins
- ✅ Show rate limit info

## 📚 Documentation

- CoinGecko API Docs: https://www.coingecko.com/en/api/documentation
- API Status: https://status.coingecko.com/
- CoinGecko Pricing: https://www.coingecko.com/en/api/pricing
