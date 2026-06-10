"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What is Bitcoin and how does it work?",
  "How do I start investing in crypto safely?",
  "What is a crypto wallet?",
  "Why are crypto prices so volatile?",
];

export default function ChatWindow() {
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const savedMessages = sessionStorage.getItem("cryptoinsight_chat_messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (e) {
        console.error("Failed to parse saved messages", e);
        setMessages([
          {
            id: "1",
            role: "bot",
            content:
              "Hello! I'm your CryptoInsight AI. How can I help you navigate the markets today?",
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      setMessages([
        {
          id: "1",
          role: "bot",
          content:
            "Hello! I'm your CryptoInsight AI. How can I help you navigate the markets today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save to session storage when messages change
  useEffect(() => {
    if (isMounted && messages.length > 0) {
      sessionStorage.setItem(
        "cryptoinsight_chat_messages",
        JSON.stringify(messages)
      );
    }
  }, [messages, isMounted]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      });

      if (!response.ok) throw new Error("Failed to fetch response from the AI.");

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content:
          "Sorry, I am currently experiencing technical difficulties connecting to the backend. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    /*
     * The outer div must:
     *  - flex-col  → stack header / messages / input vertically
     *  - h-full    → fill the parent wrapper that already has a constrained height
     *  - min-h-0   → allow flex children to shrink below their content size
     *  - overflow-hidden → clip anything that tries to escape
     */
    <div className="flex flex-col h-full min-h-0 w-full glass border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl animate-fade-in">

      {/* ── Header (fixed height, never shrinks) ── */}
      <div className="shrink-0 px-4 py-3 md:px-6 md:py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-zinc-100">
              CryptoInsight AI
            </h3>
            {/* Removed Live Analysis indicator */}
          </div>
        </div>

        <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
          v2.4 Pro
        </div>
      </div>

      {/* ── Messages (flex-1 + min-h-0 → scrolls inside, never grows the parent) ── */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto bg-zinc-900/20 px-3 py-4 md:px-6 md:py-6 space-y-4"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Empty / welcome state */}
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center text-center py-6 md:py-12 animate-fade-up">
            <div className="w-12 h-12 md:w-20 md:h-20 mb-3 md:mb-6 rounded-xl md:rounded-3xl bg-zinc-800/50 flex items-center justify-center border border-white/5 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-6 h-6 md:w-10 md:h-10 text-indigo-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A.504.504 0 0012.12 20a3.413 3.413 0 001.077.533c.48.155 1.018.04 1.482-.151a5.464 5.464 0 011.666-.33c.636-.027 1.257.108 1.836.402A9.033 9.033 0 0012 20.25z"
                />
              </svg>
            </div>
            <h4 className="text-base md:text-xl font-bold text-zinc-100 mb-1.5">
              How can I help you today?
            </h4>
            <p className="text-[11px] md:text-sm text-zinc-400 max-w-xs mx-auto mb-4 md:mb-8 px-4">
              Ask me anything about crypto! I&apos;m here to help you understand the markets.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md px-4 sm:px-0">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="px-3.5 py-2.5 rounded-xl bg-zinc-800/40 border border-white/5 text-[11px] md:text-sm text-zinc-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-left font-medium animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages — only render once the user has sent something (length > 1) */}
        {messages.length > 1 && messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4 animate-fade-in">
            <div className="glass border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Input (fixed at bottom, never squashed) ── */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
