"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChatbotFAB() {
  const pathname = usePathname();

  if (pathname === "/chatbot") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
      {/* Outer pulsing glow */}
      <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
      
      {/* Expanding Pill Button */}
      <Link 
        href="/chatbot"
        className="relative flex items-center bg-gradient-to-tr from-blue-600 to-indigo-500 p-3 sm:p-4 rounded-full text-white shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 group border border-white/10"
      >
        {/* Robot/AI Icon */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="relative z-10 shrink-0"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
        
        {/* Expanding text container */}
        <div className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-[max-width] duration-300 ease-in-out flex items-center">
          <span className="font-bold text-sm whitespace-nowrap pl-3 pr-2">
            Ask AI Assistant
          </span>
        </div>
      </Link>
    </div>
  );
}
