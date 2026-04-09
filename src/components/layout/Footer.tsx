import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Dashboard", href: "/" },
    { label: "AI News", href: "/news" },
    { label: "Risk Analysis", href: "/risk" },
    { label: "AI Chatbot", href: "/chatbot" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="px-8 py-12">
        {/* ── Top Section ─────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="font-semibold text-white">CryptoInsight</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI-powered crypto analysis platform. Real-time data, news sentiment, risk scoring &amp; more.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ─────────────────────── */}
        <div className="border-t border-zinc-800/60" />

        {/* ── Bottom Section ──────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} CryptoInsight. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-700 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-live" />
              All systems operational
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-zinc-600 hover:text-blue-400 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-blue-400 transition-colors">Terms</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-blue-400 transition-colors">Cookies</Link>
          </div>
        </div>

        {/* ── Disclaimer ─────────────────── */}
        <div className="mt-8 rounded-lg border border-yellow-500/10 bg-yellow-500/5 px-4 py-3">
          <p className="text-[11px] text-yellow-600/80 leading-relaxed">
            <span className="font-semibold text-yellow-500/90">⚠ Disclaimer:</span>{" "}
            CryptoInsight provides information for educational purposes only. It does not constitute financial advice.
            Cryptocurrency investments carry risk — always do your own research before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
