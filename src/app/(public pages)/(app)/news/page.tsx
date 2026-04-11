"use client";

import React, { useState, useMemo } from "react";
import NewsSlider from "@/components/news/NewsSlider";
import NewsFilters from "@/components/news/NewsFilters";
import Card from "@/components/ui/Card";
import { NEWS_ARTICLES } from "@/data/news";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter(article => {
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="px-6 py-8 space-y-12 max-w-5xl mx-auto min-h-[80vh] flex flex-col justify-center">
      
      {/* Header */}
      <section className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live Market Updates
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Crypto Insights <span className="text-blue-500">News</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          The most important headlines in the crypto world, simplified for you. 
          Stay informed with trusted data from real-time sources.
        </p>
      </section>

      {/* Main News Slider */}
      <section className="animate-fade-up">
        {filteredArticles.length > 0 ? (
          <NewsSlider articles={filteredArticles} />
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800/60 text-zinc-500">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">No headlines found</h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                We couldn&apos;t find any news matching your search.
              </p>
            </div>
            <button 
              onClick={() => {setActiveCategory("All"); setSearchQuery("");}}
              className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors"
            >
              Show all news
            </button>
          </div>
        )}
      </section>

      {/* Simplified Filters - Moved below for a cleaner entry */}
      <div className="max-w-4xl mx-auto w-full">
        <NewsFilters 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Newsletter */}
      <section className="animate-fade-up pt-8">
        <Card className="relative overflow-hidden p-8 border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md rounded-3xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-xl font-bold text-white">Market Briefing</h2>
              <p className="text-zinc-500 text-sm">
                Get the top 3 stories delivered to your inbox every morning.
              </p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-grow bg-zinc-950/50 border border-zinc-800/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all">
                Join Now
              </button>
            </form>
          </div>
        </Card>
      </section>

    </div>
  );
}
