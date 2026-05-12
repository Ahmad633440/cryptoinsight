import React from "react";
import { NEWS_CATEGORIES } from "@/data/news";

interface NewsFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function NewsFilters({ 
  activeCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange 
}: NewsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-fade-up">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === category 
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800/60"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="relative group min-w-[300px]">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-blue-400 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search news, topics, or sources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
