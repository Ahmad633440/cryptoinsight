import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Footer from "@/components/layout/Footer";
import { HERO_CONTENT, FEATURES, SECTION_TITLES, AI_CTA, CRYPTO_INFO, MARKET_GROWTH } from "@/data/home";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* ──────────────────────────────────────────────────────────
          SECTION 1 — Hero
          ────────────────────────────────────────────────────────── */}
      <section className="w-full flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-up">
       
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 max-w-4xl leading-[1.1]">
          {HERO_CONTENT.title.main} <span className="text-gradient">{HERO_CONTENT.title.highlight}</span> {HERO_CONTENT.title.suffix}
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          {HERO_CONTENT.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={HERO_CONTENT.primaryCta.href}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            {HERO_CONTENT.primaryCta.text}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href={HERO_CONTENT.secondaryCta.href}
            className="px-8 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-white font-semibold hover:bg-zinc-800 transition-all active:scale-95"
          >
            {HERO_CONTENT.secondaryCta.text}
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2 — Features
          ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl px-6 py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">{SECTION_TITLES.features.title}</h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            {SECTION_TITLES.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Card key={feature.title} hover className={`p-8 animate-fade-up delay-${(i + 1) * 100}`}>
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
          SECTION 3 — Crypto Basics (New Awesome Section)
          ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl px-6 py-24 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] -z-10" />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Learning Hub
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {CRYPTO_INFO.title}
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {CRYPTO_INFO.subtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {CRYPTO_INFO.items.map((item, i) => (
                <div key={item.title} className="space-y-3 group">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.tag}</span>
                  </div>
                  <h4 className="text-white font-bold group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {CRYPTO_INFO.items.map((item, i) => (
              <div 
                key={item.title} 
                className={`p-6 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-xl hover:border-cyan-500/30 transition-all hover:-translate-y-1 animate-fade-up delay-${i * 100}`}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-cyan-400 mb-4 border border-zinc-800">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4 — Market Growth (Simple Graph Touch)
          ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl px-6 py-24">
        <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-xl p-8 md:p-12 overflow-hidden relative">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10" />
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="md:w-1/3 space-y-6 pb-8">
              <h2 className="text-3xl font-bold text-white leading-tight">
                {MARKET_GROWTH.title}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {MARKET_GROWTH.subtitle}
              </p>
              <div className="pt-4 flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xl font-bold">
                  900M+
                </div>
                <span className="text-xs text-zinc-600 font-medium uppercase tracking-widest">Global Users<br/> 2026</span>
              </div>
            </div>

            <div className="flex-grow w-full flex items-end justify-between gap-2 sm:gap-4 h-64">
              {MARKET_GROWTH.stats.map((stat, i) => (
                <div key={stat.year} className="flex flex-col items-center gap-4 flex-1 group">
                  <div className="relative w-full flex flex-col items-center justify-end h-48">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded border border-zinc-700 whitespace-nowrap z-10">
                      {stat.users} Users
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-cyan-600/20 to-cyan-400/80 group-hover:to-cyan-300 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      style={{ height: stat.height }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {stat.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 5 — AI CTA
          ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl px-6 py-24">
        <div className="text-center space-y-8 pb-12 animate-fade-up">
           <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
           </div>
           
           <div>
            <h2 className="text-3xl font-bold text-white mb-4">{AI_CTA.title}</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              {AI_CTA.description}
            </p>
           </div>
           
           <Link
            href={AI_CTA.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-400 transition-all active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {AI_CTA.buttonText}
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
