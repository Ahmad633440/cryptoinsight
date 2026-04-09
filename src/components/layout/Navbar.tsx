"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 glass">
      <div className="flex h-16 items-center justify-between px-6">

        {/* ── Logo ──────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Crypto<span className="text-gradient">Insight</span>
          </span>
        </Link>

        {/* ── Search ────────────────────────── */}
        <div className="hidden md:flex items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 w-80 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search coins, news, markets..."
            className="bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none w-full"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
            ⌘K
          </kbd>
        </div>

        {/* ── Actions ───────────────────── */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-live" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
