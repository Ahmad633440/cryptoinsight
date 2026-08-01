# GitHub Actions Cron Setup (FREE & Unlimited)

## Why GitHub Actions?

- ✅ Completely FREE (2,000 minutes/month included)
- ✅ Unlimited cron frequency (10 min, 5 min, hourly, etc.)
- ✅ No limitations on free tier
- ✅ Reliable GitHub infrastructure
- ✅ Easy to monitor and troubleshoot

## Setup (5 minutes)

### 1. Create Workflow File

Create file: `.github/workflows/cron-news.yml`

```yaml
name: News Sync Cron

on:
  schedule:
    - cron: "*/10 * * * *" # Every 10 minutes
  workflow_dispatch: # Allow manual trigger

jobs:
  sync-news:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger News Sync
        run: |
          curl -X GET \
            'https://your-vercel-url.vercel.app/api/cron/news-sync' \
            -H "User-Agent: GitHub-Actions" \
            -v
```

### 2. Create Coin Detection Workflow

Create file: `.github/workflows/cron-coins.yml`

```yaml
name: Coin Detection Cron

on:
  schedule:
    - cron: "*/5 * * * *" # Every 5 minutes
  workflow_dispatch:

jobs:
  detect-coins:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coin Detection
        run: |
          curl -X GET \
            'https://your-vercel-url.vercel.app/api/cron/coin-detection' \
            -H "User-Agent: GitHub-Actions" \
            -v
```

### 3. Create Price Update Workflow

Create file: `.github/workflows/cron-prices.yml`

```yaml
name: Price Update Cron

on:
  schedule:
    - cron: "0 * * * *" # Every hour at :00 minute
  workflow_dispatch:

jobs:
  update-prices:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Price Update
        run: |
          curl -X GET \
            'https://your-vercel-url.vercel.app/api/cron/price-update' \
            -H "User-Agent: GitHub-Actions" \
            -v
```

### 4. Replace `vercel.json` (Remove Hobby-Incompatible Crons)

Update your `vercel.json`:

```json
{
  "crons": []
}
```

Or remove the file entirely if not needed for other things.

### 5. Push to GitHub

```bash
git add .github/workflows/
git add vercel.json
git commit -m "Switch to GitHub Actions for unlimited free crons"
git push origin Ahmad/dashboard-backend
```

### 6. Verify Workflows

1. Go to your GitHub repo
2. Click **Actions** tab
3. You should see 3 workflows:
   - News Sync Cron
   - Coin Detection Cron
   - Price Update Cron

Each will have a green checkmark when it runs successfully.

## Monitoring

### Check Workflow Runs

1. GitHub → Your repo → **Actions**
2. Click a workflow
3. See all runs with timestamps and status
4. Click a run to see logs

### Check Logs

- Click on a completed workflow run
- Scroll down to see curl output
- Look for success response from Vercel

## Manual Trigger (Optional)

To run a workflow manually:

1. Go to **Actions** tab
2. Click a workflow name
3. Click **Run workflow** button
4. Choose branch
5. Click **Run workflow**

This triggers the cron immediately (useful for testing).

## Troubleshooting

### Workflow not running?

- Check scheduled time (GitHub Actions use UTC)
- Verify workflow file syntax in Actions tab
- Enable Actions if disabled (Settings → Actions)

### Getting 404 errors?

- Verify Vercel URL is correct
- Ensure API endpoints exist
- Check Vercel deployment is live

### Getting 500 errors?

- Check Vercel function logs
- Verify environment variables are set
- Review MongoDB connection

## Cost

- **Workflows**: 2,000 minutes/month free (~1,440 for daily runs)
- **Storage**: 500 MB free
- **For your use case**: Completely free, plenty of capacity

## Comparison: GitHub Actions vs Vercel Crons

| Feature          | GitHub Actions    | Vercel Crons (Hobby) |
| ---------------- | ----------------- | -------------------- |
| **Cost**         | FREE              | FREE                 |
| **Frequency**    | ✅ Unlimited      | ❌ 1x/day max        |
| **Setup**        | Easy (YAML)       | Simple (JSON)        |
| **Reliability**  | 99.9%             | 99.95%               |
| **Monitoring**   | GitHub UI         | Vercel UI            |
| \***\*Best for** | **All use cases** | Limited daily tasks  |
