"use client";

import React, { useState, useEffect } from "react";
import ComparisonRow from "./ComparisonRow";
import ComparisonModal from "./ComparisonModal";
import "./comparison.css";

interface SimilarHistoricalItem {
  _id: string;
  title: string;
  coin?: string;
  sentiment?: string;
  publishedAt: string | Date;
  source?: string;
  url?: string;
  marketData?: {
    openPrice?: number;
    closePrice?: number;
    marketDirection?: string;
    priceMovement?: number;
  };
  similarityScore: number;
}

interface SimilarNewsItem {
  _id: string;
  title: string;
  content?: string;
  coin?: string;
  coins?: unknown[];
  sentiment?: string;
  publishedAt: string | Date;
  source?: string;
  url?: string;
  marketData?: {
    openPrice?: number;
    closePrice?: number;
    marketDirection?: string;
    priceMovement?: number;
  };
  similarHistorical: SimilarHistoricalItem[];
}

export default function ComparisonFeed() {
  const [data, setData] = useState<SimilarNewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinFilter, setCoinFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<SimilarNewsItem | null>(null);
  const [selectedHistorical, setSelectedHistorical] = useState<SimilarHistoricalItem | undefined>(undefined);

  const limit = 5; // Rows per page for visual readability
  const totalPages = Math.ceil(totalItems / limit);

  // Predefined filter options
  const filterOptions = ["ALL", "BTC", "ETH", "SOL", "USDT"];

  useEffect(() => {
    fetchSimilarNews(currentPage, coinFilter);
  }, [currentPage, coinFilter]);

  const fetchSimilarNews = async (page: number, coin: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/similar?page=${page}&limit=${limit}`;
      if (coin !== "ALL") {
        url += `&coin=${coin}`;
      }
      
      const response = await fetch(url);
      const json = await response.json();
      
      if (json.success) {
        setData(json.data || []);
        setHasMore(json.pagination?.hasMore || false);
        setTotalItems(json.pagination?.total || 0);
      } else {
        setError(json.message || "Failed to load comparison data.");
      }
    } catch (err) {
      setError("An error occurred while fetching comparison news.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (coin: string) => {
    setCoinFilter(coin);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSelectArticle = (article: SimilarNewsItem, historical?: SimilarHistoricalItem) => {
    setSelectedArticle(article);
    setSelectedHistorical(historical);
  };

  return (
    <div className="space-y-8 relative">
      {/* Glow backgrounds */}
      <div className="glow-spot" />

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">
            Search Filter
          </span>
          <p className="text-xs text-zinc-500 font-medium">
            Filter articles by blockchain asset to track matching historical patterns.
          </p>
        </div>

        {/* Custom Pill Tabs */}
        <div className="filter-tabs">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => handleFilterChange(opt)}
              className={`filter-tab-btn ${coinFilter === opt ? "filter-tab-btn--active" : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="relative z-10">
        {isLoading ? (
          /* Premium Shimmer Loading Skeleton */
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full rounded-2xl bg-zinc-900/20 border border-zinc-800/40 p-6 md:p-8 animate-pulse flex flex-col lg:flex-row gap-8 justify-between"
                style={{ minHeight: "220px" }}
              >
                <div className="flex-1 space-y-4">
                  <div className="h-4 w-1/4 bg-zinc-800 rounded" />
                  <div className="h-6 w-3/4 bg-zinc-800 rounded" />
                  <div className="h-16 w-full bg-zinc-800 rounded" />
                </div>
                <div className="w-[1px] bg-zinc-800 hidden lg:block" />
                <div className="flex-1 space-y-4">
                  <div className="h-4 w-1/3 bg-zinc-800 rounded" />
                  <div className="h-16 w-full bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-16 text-center space-y-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
            <div className="flex justify-center">
              <div className="p-3.5 rounded-full bg-red-500/10 text-red-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-red-400 font-extrabold text-sm uppercase tracking-wider">Retrieval Failed</p>
              <p className="text-zinc-500 text-xs">{error}</p>
            </div>
            <button
              onClick={() => fetchSimilarNews(currentPage, coinFilter)}
              className="px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-all active:scale-95"
            >
              Retry Connection
            </button>
          </div>
        ) : data.length > 0 ? (
          /* Comparison Rows Container */
          <div className="comparison-container">
            {data.map((item) => (
              <ComparisonRow
                key={item._id}
                item={item}
                onSelectArticle={handleSelectArticle}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center space-y-4 rounded-3xl border border-zinc-800/40 bg-zinc-900/10">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-zinc-800/30 text-zinc-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No matching results found</p>
              <p className="text-zinc-600 text-xs max-w-sm mx-auto leading-relaxed">
                There are currently no news alerts with similar vector embeddings for asset "{coinFilter}". Try selecting another coin.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Premium Pagination Controls ── */}
      {!isLoading && !error && data.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-8 border-t border-zinc-800/50">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white transition-all active:scale-95"
            aria-label="Previous page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-4">
              Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages || 1}</span>
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasMore}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white transition-all active:scale-95"
            aria-label="Next page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Modal Comparison Trigger ── */}
      {selectedArticle && (
        <ComparisonModal
          article={selectedArticle}
          initialHistorical={selectedHistorical}
          onClose={() => {
            setSelectedArticle(null);
            setSelectedHistorical(undefined);
          }}
        />
      )}
    </div>
  );
}
