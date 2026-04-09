import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* ──────────────────────────────────────────────────────────
          SECTION 1 — Hero
          ────────────────────────────────────────────────────────── */}
      <section className="w-full flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-up">
        <div className="mb-8">
          <Badge variant="yellow" className="py-1.5 px-4 rounded-full border-yellow-500/30">
            ⚠ Educational Platform Only
          </Badge>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 max-w-4xl leading-[1.1]">
          Understand <span className="text-gradient">Crypto</span> Markets
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          CryptoInsight is an educational platform that helps you learn about cryptocurrency markets through historical analysis, risk awareness, and AI-powered explanations.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            Explore Market Insights
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/chatbot"
            className="px-8 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-white font-semibold hover:bg-zinc-800 transition-all active:scale-95"
          >
            Start Learning
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2 — Features
          ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl px-6 py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">Learn, Don't Speculate</h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Our platform focuses on education and understanding, not predictions or trading signals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Market Analysis",
              desc: "Explore historical market data and understand price movements in context.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                </svg>
              ),
            },
            {
              title: "Risk Awareness",
              desc: "Learn about volatility, credibility factors, and what makes assets risky.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
            },
            {
              title: "AI-Powered Learning",
              desc: "Get educational explanations about crypto concepts from our AI assistant.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 8v4" /><path d="M12 16h.01" />
                </svg>
              ),
            },
            {
              title: "Historical Patterns",
              desc: "See how past events correlated with market movements for educational insight.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <Card key={feature.title} hover className={`p-8 animate-fade-up delay-${i + 1}`}>
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3 — Disclaimer & CTA
          ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl px-6 py-24 space-y-24">
        {/* Red Disclaimer */}
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 md:p-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h3 className="text-xl font-bold text-red-500 tracking-tight">Important Disclaimer</h3>
          </div>
          <div className="space-y-4 text-xs md:text-sm text-zinc-400 leading-relaxed">
            <p>
              This platform is for educational purposes only. It does not provide financial, investment, or trading advice. Cryptocurrency markets are highly volatile and risky. Always do your own research and consult with qualified professionals before making any investment decisions.
            </p>
            <p>
              Cryptocurrency investments carry significant risks including total loss of capital. Past performance does not guarantee future results. Never invest more than you can afford to lose.
            </p>
          </div>
        </div>

        {/* AI CTA */}
        <div className="text-center space-y-8 pb-12 animate-fade-up">
           <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
           </div>
           
           <div>
            <h2 className="text-3xl font-bold text-white mb-4">Have Questions? Ask Our AI Assistant</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Get educational explanations about cryptocurrency concepts, market terminology, and how different technologies work.
            </p>
           </div>
           
           <Link
            href="/chatbot"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-400 transition-all active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
