"use client";

import React from "react";
import { NewsArticle } from "@/data/types";
import Card from "@/components/ui/Card";

interface NewsSliderProps {
  articles: NewsArticle[];
}

export default function NewsSlider({ articles }: NewsSliderProps) {
  if (articles.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[600px] overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-xl group">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Snap Scroll Container */}
      <div className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar p-6">
        {articles.map((article, index) => (
          <div 
            key={article.id}
            className="h-full w-full snap-start snap-always flex flex-col items-center justify-center text-center space-y-8 p-4 md:p-12 mb-6"
          >
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest font-bold">
                  {article.category}
                </span>
                <span className="text-zinc-700 font-medium text-xs">•</span>
                <span className="text-zinc-500 text-xs font-medium">{article.date}</span>
              </div>

              <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                {article.title}
              </h2>

              <p className="text-zinc-400 text-sm md:text-xl leading-relaxed max-w-2xl mx-auto">
                {article.summary}
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up">
              <a 
                href={article.sourceUrl || "https://www.coingecko.com/en/news"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-2xl bg-white text-zinc-950 font-extrabold text-sm hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center gap-2 group/btn"
              >
                See More on {article.source}
                <svg 
                  width="18" height="18" viewBox="0 0 24 24" fill="none" 
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="group-hover/btn:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </a>
              
              <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Verified News Source
              </div>
            </div>

            {/* Visual Indicator of more content below (except for last item) */}
            {index < articles.length - 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7 13 5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Scroll Suggestion */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3">
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest vertical-text font-bold">Scroll</span>
        <div className="h-32 w-px bg-gradient-to-t from-transparent via-zinc-800 to-transparent" />
      </div>
    </div>
  );
}
