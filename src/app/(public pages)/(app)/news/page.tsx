"use client";

import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import IntelligenceNewsCard from "@/components/news/IntelligenceNewsCard";
import NewsPagination from "@/components/news/NewsPagination";
import NewsContentModal from "@/components/news/NewsContentModal";
import { EnrichedNewsArticle } from "@/data/types";

export default function NewsIntelligencePage() {
  const [news, setNews] = useState<EnrichedNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [expandedArticle, setExpandedArticle] = useState<EnrichedNewsArticle | null>(null);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/enriched?limit=${itemsPerPage}&page=${page}`);
      const result = await response.json();
      if (result.success) {
        setNews(result.data);
        setTotalItems(result.meta.total || 0);
      } else {
        setError(result.message || "Failed to load news");
      }
    } catch (err) {
      setError("An error occurred while fetching news");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-12">
        <div className="space-y-4">
          <Badge variant="blue" className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
            Intelligence AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            News <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-lg font-medium leading-relaxed">
            Direct access to institutional-grade crypto intelligence, simplified for real-time analysis.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-1">Total Signals</p>
            <p className="text-sm text-white font-mono bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800">
              {totalItems}
            </p>
          </div>
          <button 
            onClick={() => fetchNews(currentPage)}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 active:scale-95"
            title="Refresh news"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col md:flex-row rounded-2xl bg-zinc-900/40 animate-pulse border border-zinc-800/50 overflow-hidden" style={{ minHeight: '16rem' }}>
                <div className="flex-[1.2] p-10" />
                <div className="w-px bg-zinc-800/30 hidden md:block" />
                <div className="flex-[0.8] p-10 bg-zinc-950/30" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center space-y-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] animate-fade-in">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <p className="text-red-400 font-bold text-lg">{error}</p>
            <button 
              onClick={() => fetchNews(currentPage)} 
              className="px-6 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all font-bold text-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex flex-col gap-6">
              {news.map((article) => (
                <IntelligenceNewsCard 
                  key={article._id} 
                  article={article} 
                  onExpand={setExpandedArticle} 
                />
              ))}
            </div>

            <NewsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {expandedArticle && (
        <NewsContentModal 
          article={expandedArticle} 
          onClose={() => setExpandedArticle(null)} 
        />
      )}
    </div>
  );
}
