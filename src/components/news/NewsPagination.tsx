"use client";

import React from "react";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NewsPagination({ currentPage, totalPages, onPageChange }: NewsPaginationProps) {

  return (
    <div className="flex justify-center items-center gap-4 pt-12 border-t border-zinc-800">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white transition-all active:scale-95"
        aria-label="Previous page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-4">
          Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages || 1}</span>
        </span>
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages || currentPage + 1, currentPage + 1))}
        disabled={totalPages > 0 ? currentPage === totalPages : false}
        className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white transition-all active:scale-95"
        aria-label="Next page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
