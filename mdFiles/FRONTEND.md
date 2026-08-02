# CryptoInsight Frontend Architecture

This document provides a comprehensive overview of the frontend architecture, directory structure, core pages, and UI components used in the CryptoInsight application.

## Overview

CryptoInsight is built using a modern frontend stack designed for performance, high-quality aesthetics, and maintainability. The application uses Next.js with the App Router, providing a seamless routing experience and server-side rendering capabilities.

## Technology Stack

- **Framework**: Next.js (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, PostCSS, and custom Vanilla CSS (`.css` files)
- **Data Fetching**: Custom hooks (`useFetch`) and `axios`
- **Animation**: CSS-based animations (`animate-fade-up`, `animate-fade-in`), smooth transitions, and hover effects
- **Theming**: Dark mode-first design with neon gradients, glassmorphism, and premium aesthetics.

---

## Directory Structure

The frontend code is primarily located within the `src/` directory.

```text
src/
├── app/                  # Next.js App Router root
│   ├── (public pages)/   # Route group for public-facing pages
│   │   ├── (app)/        # Protected/App-specific route group
│   │   │   ├── chatbot/  # AI Chatbot interface page
│   │   │   ├── comparison/ # Crypto comparison tool page
│   │   │   ├── dashboard/# Main market dashboard page
│   │   │   └── news/     # AI-curated news feed page
│   │   ├── layout.tsx    # Shared layout for public pages
│   │   └── page.tsx      # Main Landing page
│   ├── globals.css       # Global styles, Tailwind directives, custom utilities
│   └── layout.tsx        # Root layout of the application
├── components/           # Reusable React components (organized by domain)
│   ├── chatbot/          # Chatbot specific components
│   ├── comparison/       # Comparison tool components
│   ├── dashboard/        # Dashboard widgets and charts
│   ├── layout/           # Global layout elements (Navbar, Sidebar, Footer)
│   ├── news/             # News feed components
│   └── ui/               # Generic primitive UI components
├── hooks/                # Custom React hooks (e.g., useFetch.ts)
└── lib/                  # Utility functions and shared logic
```

---

## Core Pages & Routes

The routing is handled via Next.js App Router utilizing Route Groups `(public pages)` and `(app)` to logically separate the UI without affecting the URL structure.

### 1. Landing Page (`/`)
- **Location**: `src/app/(public pages)/page.tsx`
- **Description**: The main entry point featuring a highly visual hero section, feature highlights, a "Crypto Basics" learning hub, and market growth visualizations.
- **Key Elements**: Dynamic background blurs, animated statistics bars, and interactive call-to-action buttons.

### 2. Dashboard (`/dashboard`)
- **Location**: `src/app/(public pages)/(app)/dashboard/page.tsx`
- **Description**: Real-time market overview providing insights into crypto performance.
- **Key Components**: `FearAndGreedGauge`, `GainerLoserList`, `MarketHighlights`, `MarketTable`, `PriceCard`, `StatCards`, `TrendingCoins`, `VolumeChart`.

### 3. Comparison Tool (`/comparison`)
- **Location**: `src/app/(public pages)/(app)/comparison/page.tsx`
- **Description**: Side-by-side crypto asset comparison utility allowing users to contrast multiple coins.
- **Key Components**: `ComparisonFeed`, `ComparisonModal`, `ComparisonRow`, `MarketDataWidget`, `HistoricalEventCard`.
- **Styling**: Specific custom styling is defined in `comparison.css`.

### 4. News Feed (`/news`)
- **Location**: `src/app/(public pages)/(app)/news/page.tsx`
- **Description**: AI-curated intelligence and market news feed with sentiment analysis.
- **Key Components**: `IntelligenceNewsCard`, `NewsHero`, `NewsSlider`, `NewsFilters`, `SentimentBadge`.
- **Styling**: Specific custom styling is defined in `news-card.css`.

### 5. AI Chatbot (`/chatbot`)
- **Location**: `src/app/(public pages)/(app)/chatbot/page.tsx`
- **Description**: Interactive conversational interface for personalized crypto queries and insights.
- **Key Components**: `ChatWindow`, `ChatMessage`, `ChatInput`.

---

## Component Details

Components are neatly organized by domain to ensure scalability and ease of navigation.

### `components/layout/`
- **`Navbar.tsx`**: Top navigation bar containing branding and main navigational links.
- **`Sidebar.tsx`**: Side navigation generally used within the `(app)` sections for quicker access to features.
- **`Footer.tsx`**: Global footer containing secondary links and social information.

### `components/ui/`
- **`Card.tsx`**: A reusable wrapper component utilizing backdrop blurs and subtle borders.
- **`Badge.tsx`**: Status or category pills (e.g., Sentiment tags, New features).
- **`Loader.tsx`**: Reusable loading spinner or skeleton used during data fetching.

### Domain-Specific Components
- **Dashboard**: Contains intricate widgets like `VolumeChart` and `FearAndGreedGauge`.
- **News**: Contains cards that highlight sentiment (`SentimentBadge`) and AI insights (`IntelligenceNewsCard`).
- **Comparison**: Contains structural rows and modals for picking and displaying coin metrics (`ComparisonModal`, `ComparisonRow`).

---

## Theming & Aesthetics

The design system implements premium web design aesthetics:
- **Colors**: Deep dark backgrounds (`zinc-900`, `zinc-950`) contrasted with vibrant, glowing neons (Cyan, Blue, Yellow).
- **Glassmorphism**: Extensive use of `backdrop-blur-xl` and semi-transparent borders (`border-zinc-800/50`) to create a "glassy" effect over glowing background blobs.
- **Micro-animations**: Elements incorporate subtle scaling and translation (`hover:-translate-y-1`, `active:scale-95`) to feel responsive and alive.
- **Typography**: Modern and legible, leveraging varying weights and tracked-out uppercase elements for tags.
