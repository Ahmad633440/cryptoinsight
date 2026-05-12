"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import { EnrichedNewsArticle } from "@/data/types";

interface NewsContentModalProps {
  article: EnrichedNewsArticle;
  onClose: () => void;
}

export default function NewsContentModal({ article, onClose }: NewsContentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/50 text-zinc-400 hover:text-white z-10 transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="blue" className="uppercase font-bold tracking-tighter">
              {article.coin || "General"}
            </Badge>
            <span className="text-xs text-zinc-600 font-bold">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black text-white mb-8 leading-tight">
            {article.title}
          </h2>

          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {article.content}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              Source: {article.source || "Original Article"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
