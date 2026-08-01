# Complete Setup Guide: From Local to Deployed

This document guides you through deploying your entire crypto-insight system (Vercel + Python + Crons) completely FREE.

## Current Status

✅ **Done**:

- Vercel Cron endpoints created (4 files)
- vercel.json configuration created
- Setup guides generated

⏳ **Next Steps**:

1. Push changes to GitHub
2. Deploy to Vercel
3. Verify crons work
4. (Optional) Deploy Python backend

---

## Phase 1: Deploy Vercel Crons (RIGHT NOW - 5 minutes)

### Step 1.1: Commit and Push Changes

```bash
cd g:\----\cryptoinsight

# Stage all new files
git add .

# Commit
git commit -m "Add Vercel cron jobs for news sync, coin detection, and price updates"

# Push to GitHub
git push origin Ahmad/dashboard-backend
```

### Step 1.2: Verify Changes Pushed

```bash
git log --oneline -5
# You should see your commit at the top
```

### Step 1.3: Deploy to Vercel

Go to your Vercel Dashboard:

1. https://vercel.com/dashboard
2. Select your project
3. Should see deployment in progress
4. Wait for green checkmark ("Ready")

### Step 1.4: Set Environment Variable

In Vercel Dashboard:

1. Click your project
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate random: `xyz123abc456def789` (any random string)
4. Select: **Production**, **Preview**, **Development**
5. Click **Save**

### Step 1.5: Trigger Redeployment

```bash
# In local terminal
git commit --allow-empty -m "Trigger redeployment with CRON_SECRET"
git push
```

OR in Vercel Dashboard: Click "Redeploy" button on latest deployment.

### Step 1.6: Verify Crons are Running

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click latest deployment
5. Click **Functions** tab
6. Click **Crons**
7. You should see 3 crons listed:
   - `/api/cron/news-sync` (every 10 min)
   - `/api/cron/coin-detection` (every 5 min)
   - `/api/cron/price-update` (every hour)

---

## Phase 2: Test Crons Locally (OPTIONAL - 10 minutes)

Before deploying, test locally:

```bash
# Start your Next.js dev server
npm run dev

# In another terminal, call cron endpoints manually
curl http://localhost:3000/api/cron/news-sync
curl http://localhost:3000/api/cron/coin-detection
curl http://localhost:3000/api/cron/price-update

# Call embedding migration
curl -X POST http://localhost:3000/api/cron/migrate-embeddings \
  -H "Authorization: Bearer xyz123abc456def789"
```

Expected response: `{ success: true, ... }`

---

## Phase 3: Monitor Crons Running on Vercel (5 minutes)

### Check if News is Being Fetched

1. Go to your deployed site: `https://your-app.vercel.app`
2. Visit `/news` page
3. Check if latest news appears

### Check Cron Logs

In Vercel Dashboard:

1. Deployments → Latest → Functions → Crons
2. Click each cron to see logs
3. Look for lines like:
   ```
   [CRON] Synced: 5, Failed: 0
   ```

### Alternative: Check MongoDB

Connect to MongoDB:

```bash
mongosh your_mongodb_connection_string

# Check latest news
use cryptoinsight
db.news.find().sort({ createdAt: -1 }).limit(5)

# Should see recently created articles
```

---

## Phase 4: Deploy Python Backend (OPTIONAL - 20-60 minutes)

**Only do this if you need heavy processing or want to run Python services.**

### Option A: Use Fly.io (Recommended)

**Cost**: FREE tier ($0-5/month after)

#### Step 4A.1: Install Fly CLI

```bash
# Using npm
npm install -g flyctl

# Or using choco (Windows)
choco install flyctl

# Verify installation
flyctl --version
```

#### Step 4A.2: Create Dockerfile

Create `Dockerfile` in root of project:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python code
COPY src/ai-backend/ .

# Expose port
EXPOSE 5000

# Run Flask app
CMD ["python", "app.py"]
```

#### Step 4A.3: Login to Fly

```bash
flyctl auth login
# Opens browser to sign up/login
```

#### Step 4A.4: Launch App

```bash
cd g:\----\cryptoinsight

flyctl launch --name cryptoinsight-backend
```

**When prompted**:

- Region: Select closest to you (e.g., us-west or eu-west)
- Would you like to set up a Postgresql database now? → No
- Would you like to deploy now? → Yes

#### Step 4A.5: Get Your URL

```bash
flyctl status

# Output will show something like:
# https://cryptoinsight-backend.fly.dev
```

**Copy this URL!** You'll need it to connect from Vercel.

#### Step 4A.6: Set Environment Variables

```bash
flyctl secrets set GEMINI_API_KEY=your_gemini_key
flyctl secrets set MONGODB_URI=your_mongodb_connection
flyctl secrets set NEWSDATA_API_KEY=your_newsdata_key
# etc.
```

#### Step 4A.7: Verify Deployment

```bash
# Check logs
flyctl logs

# Should see Flask app starting without errors
```

### Option B: Use PythonAnywhere (Easier but Limited)

**Cost**: FREE (limited resources)

#### Step 4B.1: Sign Up

Go to https://www.pythonanywhere.com

#### Step 4B.2: Upload Code

1. Files → Create directory `/ai-backend`
2. Upload `src/ai-backend/app.py`

#### Step 4B.3: Create Web App

1. Web → Add a new web app
2. Python 3.11 + Flask
3. Point to your app.py

#### Step 4B.4: Get URL

Your URL: `https://yourusername.pythonanywhere.com`

---

## Phase 5: Connect Python Backend to Vercel (OPTIONAL)

Once Python backend is running, update Vercel cron to call it:

**File**: `src/app/api/cron/news-sync/route.ts`

Add at end of `syncNews()` call:

```typescript
// Call Python backend for enrichment
try {
  const pythonBackendUrl =
    process.env.PYTHON_BACKEND_URL || "https://cryptoinsight-backend.fly.dev";
  const response = await fetch(`${pythonBackendUrl}/enrich`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ synced: result.synced }),
  });
  console.log("[PYTHON] Enrichment response:", response.status);
} catch (error) {
  console.warn("[PYTHON] Backend call failed (optional):", error);
}
```

Then add to Vercel environment variables:

```
PYTHON_BACKEND_URL = https://cryptoinsight-backend.fly.dev
```

---

## ✅ Verification Checklist

After completing all phases:

- [ ] Vercel crons created and deployed
- [ ] CRON_SECRET environment variable set on Vercel
- [ ] Latest news appears in `/api/news`
- [ ] Cron logs show successful executions
- [ ] MongoDB has fresh articles (from cron)
- [ ] (Optional) Python backend deployed and running
- [ ] (Optional) Vercel calls Python backend successfully

---

## 🆘 Troubleshooting

### Crons Not Running?

1. Check `vercel.json` exists in project root
2. Verify environment variables are set
3. Check MongoDB connection string
4. Review function logs in Vercel Dashboard

### News Not Fetching?

1. Verify `NEWSDATA_API_KEY` is set
2. Check API quota hasn't been exceeded
3. Review cron logs for errors
4. Check MongoDB connection

### Python Backend Won't Deploy?

1. Verify `Dockerfile` exists
2. Check Python requirements are installed
3. Review Fly logs: `flyctl logs`
4. Ensure Flask app runs locally: `python src/ai-backend/app.py`

### High Vercel Function Duration?

1. Optimize database queries
2. Reduce batch sizes (limit in cron endpoints)
3. Add indexes to MongoDB collections
4. Consider splitting into smaller functions

---

## 📊 Cost Summary

| Component        | Platform      | Cost         | Notes                                |
| ---------------- | ------------- | ------------ | ------------------------------------ |
| Frontend + Crons | Vercel        | **$0**       | Free tier sufficient                 |
| Python Backend   | Fly.io        | **$0-5/mo**  | Pay-as-you-go, free credits included |
| Database         | MongoDB Atlas | **$0-15/mo** | Free tier available                  |
| **TOTAL**        | -             | **$0-20/mo** | Completely free if using free tiers  |

---

## 🎯 What Happens Next (Automatic)

Once deployed:

**Every 10 minutes**:

- ✅ News fetched from NewsData API
- ✅ Articles stored in MongoDB
- ✅ Embeddings generated
- ✅ Coins auto-detected

**Every 5 minutes**:

- ✅ Legacy articles processed for coin detection

**Every hour**:

- ✅ 24-hour price updates captured

**Result**: Users see latest news within 10 minutes! 🚀

---

## 📚 Reference Files

- `VERCEL_CRON_SETUP.md` - Detailed Vercel cron configuration
- `PYTHON_DEPLOYMENT_OPTIONS.md` - All free Python deployment options
- `vercel.json` - Cron schedule configuration
- `src/app/api/cron/*` - All cron endpoint implementations
