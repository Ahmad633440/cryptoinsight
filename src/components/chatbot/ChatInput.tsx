"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 p-4 bg-zinc-900/50 backdrop-blur-xl border-t border-white/5"
    >
      <div className="relative flex-1 group">
        <textarea
          ref={inputRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about crypto markets, trends, or specific coins..."
          disabled={disabled}
          className="w-full bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/5 transition-all resize-none min-h-[48px] max-h-[150px] hide-scrollbar"
        />
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="absolute right-2 bottom-1.5 p-2 rounded-lg text-indigo-400 hover:text-indigo-300 disabled:text-zinc-600 disabled:hover:text-zinc-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
