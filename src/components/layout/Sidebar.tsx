"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "News",
    href: "/news",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  {
    label: "Comparison",
    href: "/comparison",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },

  {
    label: "Chatbot",
    href: "/chatbot",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 z-40 border-r border-zinc-800/60 bg-zinc-950
        flex-col overflow-y-auto hidden lg:flex
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* ── Toggle Button ───────────────── */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-end"} px-3 pt-4 pb-2`}>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors group"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#71717a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover:stroke-white transition-all duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <path d="M14 9l-3 3 3 3" />
          </svg>
        </button>
      </div>

      {/* ── Navigation ──────────────────── */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/5"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent"
                }
              `}
            >
              <span className={`shrink-0 ${isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"} transition-colors`}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse-live" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
