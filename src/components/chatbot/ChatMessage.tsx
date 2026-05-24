"use client";

import React from "react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={`flex flex-col w-full mb-4 md:mb-6 ${
        isBot ? "items-start" : "items-end"
      } animate-fade-up`}
    >
      {isBot && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/90 mb-1 ml-1 select-none">
          Crypto AI
        </span>
      )}
      <div
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] px-4 py-3 md:px-5 md:py-4 rounded-2xl relative transition-all duration-300 ${
          isBot
            ? "glass border border-white/5 text-zinc-200 rounded-tl-none"
            : "bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20"
        }`}
      >
        <div className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words min-w-0">
          {message.content}
        </div>

        <div
          className={`text-[10px] mt-2 opacity-40 font-medium ${
            isBot ? "text-zinc-400" : "text-indigo-100"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
