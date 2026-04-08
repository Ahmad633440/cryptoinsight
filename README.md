# 🚀 CryptoInsight

A data-driven web platform that helps users understand current cryptocurrency market news by comparing it with historically similar events and showing real market outcomes.

---

## 📌 Overview

CryptoInsight analyzes real-time crypto news and matches it with similar past events using semantic search (embeddings). Instead of predicting the future, it provides historical context and actual price reactions to help users make informed decisions.

---

## 🎯 Problem

Crypto users often react emotionally to news without context. Traditional platforms:

* Show raw news
* Require manual research
* Provide no historical comparison

---

## 💡 Solution

CryptoInsight:

* Finds similar past events automatically
* Shows actual price movements after those events
* Provides structured comparison insights

---

## ⚙️ How It Works

1. Fetch real-time crypto news via APIs
2. Convert news into embeddings (vector representation)
3. Store data in MongoDB
4. When new news arrives:

   * Generate embedding
   * Perform vector similarity search
5. Retrieve similar past events
6. Display:

   * Past event details
   * Price changes (24h / few days)
   * AI-generated comparison summary

---

## 🧠 Core Features

* 🔍 Semantic Search (context-based matching)
* 📊 Historical Price Analysis
* 🤖 AI-powered Comparison Summaries
* 🧾 Source Transparency (real news links)
* ⚠️ No Predictions (data-driven insights only)

---

## 🏗️ Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (with vector search)

### AI / APIs

* Embeddings API (e.g., Gemini / OpenAI)
* Coin Gecko APIs
* Crypto Panic APIs

---

## 📊 Data Model (Simplified)

* title
* description
* coin
* date
* embedding
* priceBefore
* priceAfter
* priceChangePercent
* source

---

## 🚧 Limitations

* Similarity is not always perfect
* Market behavior is unpredictable
* Results depend on data quality
* System provides insights, not financial advice

---

## 🔥 Future Improvements

* Better event classification
* More historical data
* Confidence scoring system
* User personalization

---

## 🧪 Setup Instructions

### 1. Clone the repo

```
git clone https://github.com/your-username/cryptoInsight.git
```

### 2. Install dependencies

```
cd client && npm install
cd ../server && npm install
```

### 3. Setup environment variables

Create `.env` file in server:

```
MONGO_URI=
API_KEYS=
```

### 4. Run project

```
# backend
cd server
npm run dev

# frontend
cd client
npm run dev
```

---

## 📌 Key Principle

> We don’t predict the market. We show what happened in similar situations so users can think better.

---

## 📜 License

This project is for educational purposes.
