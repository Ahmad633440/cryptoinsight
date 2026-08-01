# FREE Python Backend Deployment Options

Your Python Flask/FastAPI code is currently in `src/ai-backend/app.py`. Here are FREE deployment options:

## 🏆 Recommended: Fly.io (Most Balanced)

**Cost**: FREE tier (pay-as-you-go after free credits run out, ~$5/month typical)
**Uptime**: 99.5%
**Features**: Full Python support, Docker ready, fast, reliable

### Why Fly.io?

✅ Generous free tier ($3/month in free credits)
✅ No credit card required (initially)
✅ Very fast cold starts
✅ Good documentation
✅ Can keep services running 24/7 for free during credit period

### Setup (20 minutes):

1. **Sign up** (no credit card needed):

   ```bash
   https://fly.io
   ```

2. **Install Fly CLI**:

   ```bash
   choco install flyctl
   # or
   npm install -g flyctl
   ```

3. **Create Dockerfile** (in root):

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

4. **Login to Fly**:

   ```bash
   flyctl auth login
   ```

5. **Launch app**:

   ```bash
   flyctl launch --name cryptoinsight-backend
   ```

   When prompted:
   - Choose region closest to you
   - Choose not to add PostgreSQL
   - Say yes to deploy

6. **Get your URL**:

   ```bash
   flyctl status
   # Output: https://cryptoinsight-backend.fly.dev
   ```

7. **Set environment variables**:

   ```bash
   flyctl secrets set GEMINI_API_KEY=your_key
   flyctl secrets set MONGODB_URI=your_connection_string
   # etc.
   ```

8. **Deploy updates**:
   ```bash
   flyctl deploy
   ```

---

## 🎓 Alternative: PythonAnywhere (Easiest)

**Cost**: Completely FREE (limited resources)
**Uptime**: Good
**Best For**: Simple Python scripts, not heavy ML

### Why PythonAnywhere?

✅ No setup required (cloud IDE included)
✅ Web framework hosting included (Flask, Django)
✅ Very beginner-friendly
✅ No Docker needed
✅ Free tier works well for light usage

### Setup (15 minutes):

1. **Sign up**:

   ```
   https://www.pythonanywhere.com
   ```

2. **Upload your code**:
   - Go to Files tab
   - Upload `src/ai-backend/` folder

3. **Create Web App**:
   - Click "Web"
   - "Add a new web app"
   - Select Python 3.11
   - Select Flask

4. **Edit WSGI file**:

   ```python
   import sys
   import os
   path = '/home/yourusername/ai-backend'
   if path not in sys.path:
       sys.path.append(path)
   from app import app as application
   ```

5. **Install packages**:
   - Go to "Web" tab
   - Under "Virtualenv", create virtualenv
   - SSH in and pip install from requirements.txt

6. **Get URL**:
   - Your URL: `https://yourusername.pythonanywhere.com`

### Limitations:

- ❌ Only 100 CPU seconds per day (limited for heavy processing)
- ❌ Can't keep server running 24/7
- ❌ Limited free tier resources

---

## 🚀 Advanced: Oracle Cloud Always Free

**Cost**: Actually FREE (Oracle's free tier, forever)
**Uptime**: 99.9%
**Best For**: Full control, serious projects

### Why Oracle?

✅ Truly free (no time limit, no credit card fraud risk)
✅ Full VPS access
✅ Can run anything
✅ Good performance
✅ Good support

### Cons:

❌ More complex setup
❌ Requires credit card verification
❌ Steeper learning curve
❌ Setup takes ~1 hour

### Quick Setup:

1. Sign up at oracle.com/cloud/free
2. Create free VM instance
3. SSH in and install Python
4. Install Docker (optional but recommended)
5. Deploy your Flask app
6. Keep it running 24/7 (included in free tier)

---

## ⚡ Quick Comparison Table

| Platform           | Cost            | Setup Time | Ease   | Python Support | 24/7 Running | Best For          |
| ------------------ | --------------- | ---------- | ------ | -------------- | ------------ | ----------------- |
| **Fly.io**         | $0-5/mo         | 20 min     | Medium | ⭐⭐⭐         | ✅           | **Recommended**   |
| **PythonAnywhere** | $0              | 15 min     | Easy   | ⭐⭐⭐         | ❌ Limited   | Beginners         |
| **Oracle Cloud**   | $0              | 60 min     | Hard   | ⭐⭐⭐⭐       | ✅           | Advanced          |
| **Replit**         | $0              | 10 min     | Easy   | ⭐⭐           | ❌ Limited   | Testing only      |
| **Render**         | ❌ (no free)    | -          | -      | -              | -            | ❌ Paid only      |
| **Railway**        | ❌ (no free)    | -          | -      | -              | -            | ❌ Paid only      |
| **Heroku**         | ❌ (free ended) | -          | -      | -              | -            | ❌ No longer free |

---

## 📝 Recommended Path (Best Price/Performance)

### Option 1: Use Fly.io (Recommended)

1. Deploy Flask app to Fly.io ($0-5/month)
2. Update Vercel cron endpoints to call Fly.io URL
3. Everything runs automatically 24/7

### Option 2: Keep Everything on Vercel (If Light Usage)

1. Use Vercel crons (already configured)
2. Don't deploy Python backend separately
3. Call Vercel API routes directly
4. Cost: $0 (Vercel free tier only)

### Option 3: Use PythonAnywhere (If Ultra Low Cost)

1. Deploy to PythonAnywhere (free, limited)
2. Note: Limited CPU time, not ideal for heavy processing
3. Cost: $0 (free tier only)

---

## 🔧 Integration: Calling Your Python Backend from Vercel

Once deployed, update your Vercel cron endpoints to call your Python backend:

**Example**: Modify `src/app/api/cron/news-sync/route.ts`

```typescript
const result = await syncNews();

// Call Python backend for enrichment (if needed)
if (result.synced > 0) {
  try {
    await fetch("https://cryptoinsight-backend.fly.dev/enrichment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsIds: result.newsIds }),
    });
  } catch (error) {
    console.error("Python backend call failed:", error);
  }
}
```

---

## ✅ Next Steps

1. **Immediate** (Right now):
   - Test Vercel cron setup locally
   - Deploy to Vercel
   - Verify crons run

2. **Soon** (Optional):
   - Choose deployment platform (Fly.io recommended)
   - Deploy Python backend
   - Connect Vercel → Python backend

3. **Later** (Performance optimization):
   - Monitor costs
   - Optimize cron frequencies
   - Scale as needed

---

## 🆘 Questions?

- **Fly.io having issues?** → Check docs at fly.io/docs
- **Python app not starting?** → Check logs: `flyctl logs`
- **Connection issues?** → Verify environment variables are set
- **Cost concerns?** → Monitor usage in dashboard
