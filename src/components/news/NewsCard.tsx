import React from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { NewsArticle } from "@/data/types";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const sentimentVariant = 
    article.sentiment === "Bullish" ? "green" : 
    article.sentiment === "Bearish" ? "red" : "zinc";

  return (
    <Card hover className="flex flex-col h-full overflow-hidden animate-fade-up">
      <div className="relative h-48 w-full">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="blue" className="backdrop-blur-md bg-blue-500/20">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            {article.source} • {article.date}
          </span>
          <Badge variant={sentimentVariant} className="text-[9px] px-1.5 py-0">
            {article.sentiment}
          </Badge>
        </div>
        
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug hover:text-blue-400 transition-colors cursor-pointer">
          {article.title}
        </h3>
        
        <p className="text-xs text-zinc-400 line-clamp-3 mb-4 flex-grow">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 mt-auto">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white">
              {article.author[0]}
            </div>
            <span className="text-[11px] text-zinc-400">{article.author}</span>
          </div>
          <span className="text-[11px] text-zinc-600">{article.readTime} read</span>
        </div>
      </div>
    </Card>
  );
}
