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

  // Auto-resize textarea — caps at 5 lines (~120px)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      /* shrink-0 keeps the input bar from being squashed by the message area */
      className="shrink-0 flex items-end gap-2 px-3 py-3 sm:px-4 sm:py-3 bg-zinc-900/60 backdrop-blur-xl border-t border-white/5"
    >
      <div className="relative flex-1">
        <textarea
          ref={inputRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about crypto markets or trends…"
          disabled={disabled}
          style={{ scrollbarWidth: "none" }}
          className="
            w-full resize-none
            bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-500
            rounded-xl border border-white/8
            px-4 py-2.5 pr-11
            text-sm leading-snug
            min-h-[42px] max-h-[120px]
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            transition-all
          "
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="
            absolute right-2 bottom-2
            p-1.5 rounded-lg
            text-indigo-400 hover:text-indigo-300
            disabled:text-zinc-600 disabled:cursor-not-allowed
            transition-colors
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
