"use client";

import React, { useState } from "react";
import { EnrichedNewsArticle } from "@/data/types";
import "./news-card.css";

interface IntelligenceNewsCardProps {
  article: EnrichedNewsArticle;
  onExpand: (article: EnrichedNewsArticle) => void;
}

/**
 * IntelligenceNewsCard - A full-width horizontal card component for news articles.
 * Features a news content section on the left and an AI summary panel on the right.
 */
export default function IntelligenceNewsCard({ article, onExpand }: IntelligenceNewsCardProps) {
  // --- State Management ---
  const [summary, setSummary] = useState<string | null>(null); // Stores the AI generated summary
  const [isLoadingSummary, setIsLoadingSummary] = useState(false); // Loading state for AI fetching
  const [summaryError, setSummaryError] = useState<string | null>(null); // Error state for AI fetching

  /**
   * fetchSummary - Calls the AI backend (via Next.js proxy) to generate 
   * a concise summary of the article content.
   */
  const fetchSummary = async () => {
    if (summary) return; // Prevent redundant calls if summary already exists
    
    setIsLoadingSummary(true);
    setSummaryError(null);
    
    try {
      // Calls the /api/chatbot route which proxies to the Flask app.py backend
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Summarize this crypto news article in 3-4 concise bullet points. Focus on key facts, market impact, and what it means for investors. Article title: "${article.title}". Article content: "${article.content?.slice(0, 1500) || article.title}"`,
        }),
      });
      
      const data = await res.json();
      
      if (data.answer) {
        setSummary(data.answer); // Successfully set the AI summary
      } else {
        setSummaryError(data.error || "Failed to generate summary");
      }
    } catch (err) {
      setSummaryError("Could not connect to AI backend");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Determine sentiment color classes based on the article's sentiment
  const sentimentColor = article.sentiment === "Bullish"
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : article.sentiment === "Bearish"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

  return (
    <article className="news-card group">
      {/* 
          --- Left: News Content Section --- 
          Contains metadata, title, preview content, and interaction buttons.
      */}
      <div className="news-card__content">
        {/* Top meta row: Coin, Source, Sentiment, and Date */}
        <div className="news-card__meta">
          <div className="news-card__coin-badge">
            {article.coin?.slice(0, 4) || "NEWS"}
          </div>
          <span className="news-card__source">{article.source || "Unknown"}</span>
          {article.sentiment && (
            <span className={`news-card__sentiment ${sentimentColor}`}>
              {article.sentiment}
            </span>
          )}
          <span className="news-card__date">
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Article Title */}
        <h3 className="news-card__title">
          {article.title}
        </h3>

        {/* Body preview: Displays a snippet of the article content */}
        <p className="news-card__body">
          {article.content || "No detailed content available for this article."}
        </p>

        {/* Action buttons for reading full content or visiting source */}
        <div className="news-card__actions">
          <button
            onClick={() => onExpand(article)}
            className="news-card__btn news-card__btn--secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Read Full Article
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-card__btn news-card__btn--ghost"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Source
          </a>
        </div>
      </div>

      {/* Decorative vertical/horizontal divider based on screen size */}
      <div className="news-card__divider" />

      {/* 
          --- Right: AI Summary Panel --- 
          Handles states: Placeholder -> Loading (Pulse) -> Result or Error.
      */}
      <div className="news-card__ai">
        <div className="news-card__ai-header">
          <div className="news-card__ai-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
              <circle cx="9" cy="15" r="1" />
              <circle cx="15" cy="15" r="1" />
            </svg>
          </div>
          <span className="news-card__ai-label">AI Intelligence</span>
        </div>

        <div className="news-card__ai-body">
          {summary ? (
            /* Result State: Display AI Summary */
            <div className="news-card__ai-summary">{summary}</div>
          ) : isLoadingSummary ? (
            /* Loading State: Pulse animations with shimmer effect */
            <div className="news-card__ai-loading">
              <div className="news-card__ai-pulse" />
              <div className="news-card__ai-pulse news-card__ai-pulse--short" />
              <div className="news-card__ai-pulse news-card__ai-pulse--medium" />
              <p className="news-card__ai-loading-text">Analyzing article...</p>
            </div>
          ) : summaryError ? (
            /* Error State: Display error message and retry button */
            <div className="news-card__ai-error">
              <p>{summaryError}</p>
              <button onClick={fetchSummary} className="news-card__btn news-card__btn--retry">
                Retry
              </button>
            </div>
          ) : (
            /* Placeholder State: Initial view before user triggers AI */
            <div className="news-card__ai-placeholder">
              <p className="news-card__ai-placeholder-text">
                Get an AI-powered breakdown of key insights, market impact, and investor takeaways.
              </p>
              <button onClick={fetchSummary} className="news-card__btn news-card__btn--primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
