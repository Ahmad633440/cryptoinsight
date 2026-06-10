import ChatWindow from "@/components/chatbot/ChatWindow";

export const metadata = {
  title: "AI Market Analyst | CryptoInsight",
  description:
    "Get real-time crypto insights and market analysis from our advanced AI chatbot.",
};

export default function ChatbotPage() {
  return (
    /* Fills exactly the viewport minus the 64px navbar. No outer scroll. */
    <div className="h-[calc(100dvh-64px)] w-full flex flex-col overflow-hidden">
      {/* Page Header — shrinks but never wraps in a way that pushes the chat off-screen */}
      <div className="shrink-0 text-center px-4 pt-3 pb-2 md:pt-6 md:pb-4 animate-fade-up">
        <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight mb-1 md:mb-3">
          AI <span className="text-gradient">Crypto Assistant</span>
        </h1>
        <p className="text-zinc-400 text-[10px] sm:text-xs md:text-base max-w-2xl mx-auto font-medium">
          Ask questions and get simple, clear explanations about cryptocurrency.
        </p>
      </div>

      {/* Chat Interface — grows to fill all remaining height */}
      <div className="flex-1 min-h-0 w-full px-3 sm:px-4 md:px-6 flex flex-col items-center">
        <div className="w-full max-w-4xl h-full flex flex-col min-h-0">
          <ChatWindow />
        </div>
      </div>

      {/* Footer badges */}
      <div className="shrink-0 flex flex-wrap justify-center gap-2 md:gap-6 text-[8px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 py-2 md:py-3 animate-fade-in">
        {/* Removed Real-time Pricing and Technical Indicators */}
       
      </div>
    </div>
  );
}
