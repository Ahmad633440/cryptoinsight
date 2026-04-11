import React from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { NewsArticle } from "@/data/types";

interface NewsHeroProps {
  article: NewsArticle;
}

export default function NewsHero({ article }: NewsHeroProps) {
  const sentimentVariant = 
    article.sentiment === "Bullish" ? "green" : 
    article.sentiment === "Bearish" ? "red" : "zinc";

  return (
    <section className="relative w-full rounded-2xl overflow-hidden min-h-[400px] flex items-end group animate-fade-up">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 w-full md:w-3/4 lg:w-2/3">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="blue" className="px-3 py-1">Featured News</Badge>
          <Badge variant={sentimentVariant} className="px-3 py-1 bg-white/10 backdrop-blur-md border-white/10">
            {article.sentiment}
          </Badge>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-zinc-300 text-sm md:text-base lg:text-lg mb-6 line-clamp-2 max-w-2xl">
          {article.summary}
        </p>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">
              {article.author[0]}
            </div>
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <span>{article.date}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>{article.readTime} read</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span className="font-semibold text-zinc-300">{article.source}</span>
          </div>
        </div>
      </div>

      {/* Read Button Floating */}
      <div className="absolute bottom-12 right-12 hidden lg:block">
        <button className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-400 transition-all hover:scale-110 shadow-lg shadow-blue-500/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>
  );
}
