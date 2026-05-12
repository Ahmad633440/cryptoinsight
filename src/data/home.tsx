import React, { ReactNode } from "react";

export interface Feature {
  title: string;
  desc: string;
  icon: ReactNode;
}

export const HERO_CONTENT = {
  badge: "Market Intelligence",
  title: {
    main: "Understand",
    highlight: "Crypto",
    suffix: "Markets"
  },
  description: "CryptoInsight provides deep market intelligence through historical analysis, real-time news updates, and AI-powered insights to help you navigate the digital asset space.",
  primaryCta: {
    text: "Explore Market Insights",
    href: "/dashboard"
  },
  secondaryCta: {
    text: "Get Started",
    href: "/chatbot"
  }
};

export const FEATURES: Feature[] = [
  {
    title: "Market Analysis",
    desc: "Explore historical market data and understand price movements in context with advanced charting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
      </svg>
    ),
  },
  {
    title: "News & Insights",
    desc: "Stay ahead with curated news feeds and professional analysis of the latest market developments.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 20l-7-7 7-7" /><path d="M12 19l-7-7 7-7" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Learning",
    desc: "Get intelligent explanations about complex crypto concepts from our specialized AI assistant.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 8v4" /><path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    title: "Historical Patterns",
    desc: "Visualize how past events correlated with market cycles to better understand market dynamics.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export const SECTION_TITLES = {
  features: {
    title: "Intelligent Insights, Not Speculation",
    subtitle: "Our platform focuses on deep understanding and professional analysis of the crypto ecosystem."
  }
};

export const AI_CTA = {
  title: "Have Questions? Ask Our AI Assistant",
  description: "Get real-time explanations about cryptocurrency concepts, market terminology, and how different technologies work.",
  buttonText: "Start a Conversation",
  href: "/chatbot"
};

export const CRYPTO_INFO = {
  title: "New to Crypto?",
  subtitle: "Understanding the fundamentals is the first step towards market intelligence.",
  items: [
    {
      title: "Blockchain Technology",
      description: "A secure, decentralized ledger that records all transactions across a network of computers, ensuring transparency and immutability.",
      tag: "Technology"
    },
    {
      title: "Decentralization",
      description: "A shift from central authorities (like banks) to a peer-to-peer network, giving users more control over their financial assets.",
      tag: "Philosophy"
    },
    {
      title: "Smart Contracts",
      description: "Self-executing contracts with the terms of the agreement directly written into code, enabling trustless automation.",
      tag: "Innovation"
    },
    {
      title: "Digital Scarcity",
      description: "Cryptocurrencies like Bitcoin have a limited supply, creating value through mathematical scarcity rather than central policy.",
      tag: "Economics"
    }
  ]
};

export const MARKET_GROWTH = {
  title: "Global Adoption Curve",
  subtitle: "The number of cryptocurrency users is doubling almost every two years, following a similar path to early internet adoption.",
  stats: [
    { year: "2014", users: "10M", height: "10%" },
    { year: "2016", users: "25M", height: "18%" },
    { year: "2018", users: "60M", height: "30%" },
    { year: "2020", users: "150M", height: "50%" },
    { year: "2022", users: "320M", height: "75%" },
    { year: "2024", users: "580M", height: "100%" }
  ]
};
