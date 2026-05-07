"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { EnrichedNewsArticle } from "@/data/types";

interface IntelligenceNewsCardProps {
  article: EnrichedNewsArticle;
  onExpand: (article: EnrichedNewsArticle) => void;
}

export default function IntelligenceNewsCard({ article, onExpand }: IntelligenceNewsCardProps) {
  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 p-8">
      <div className="flex-1 flex flex-col">
        {/* Card Top */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-[10px]">
              {article.coin?.slice(0, 3) || "NEW"}
            </div>
            <span className="text-xs font-bold text-zinc-100">{article.coin || "General"}</span>
          </div>
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-6 leading-tight group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        {/* Content Preview */}
        <div className="flex-1">
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4 font-medium italic mb-6">
            {article.content || "No detailed content available for this article."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={() => onExpand(article)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-[11px] font-bold hover:bg-zinc-700 transition-all active:scale-95"
          >
            Read Full
          </button>
          <button 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-[11px] font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            AI Summary
          </button>
        </div>
      </div>
    </Card>
  );
}
