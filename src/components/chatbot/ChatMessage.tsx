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
      className={`flex w-full mb-6 ${
        isBot ? "justify-start" : "justify-end"
      } animate-fade-up`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] px-5 py-4 rounded-2xl relative transition-all duration-300 ${
          isBot
            ? "glass border border-white/5 text-zinc-200 rounded-tl-none"
            : "bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20"
        }`}
      >
        {isBot && (
          <div className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-wider text-indigo-400 opacity-80">
            Crypto AI
          </div>
        )}
        
        <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
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
