import ChatWindow from "@/components/chatbot/ChatWindow";

export const metadata = {
  title: "AI Market Analyst | CryptoInsight",
  description: "Get real-time crypto insights and market analysis from our advanced AI chatbot.",
};

export default function ChatbotPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full px-4 py-8 md:py-12 flex flex-col items-center">
      {/* Page Header */}
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          AI <span className="text-gradient">Market Analyst</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-medium">
          Leverage real-time data and advanced algorithms to get instant answers about the crypto ecosystem.
        </p>
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-5xl flex-1 flex flex-col">
        <ChatWindow />
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 animate-fade-in delay-5">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          Real-time Pricing
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          Technical Indicators
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          Sentiment Analysis
        </div>
      </div>
    </div>
  );
}
