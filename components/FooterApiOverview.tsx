"use client";

import { useTheme } from "next-themes";
import { getDomainUrl } from "@/lib/domains";
import { Terminal, ArrowUpRight, Zap, Code2, Globe } from "lucide-react";

export function FooterApiOverview() {
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-4xl mx-auto my-3 p-5 rounded-3xl liquid-glass border border-neutral-200/60 dark:border-neutral-800/80 text-left transition-all">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/50 dark:border-neutral-800/70">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-gain/10 text-gain flex items-center justify-center shrink-0">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-xs text-black dark:text-white">
                api.superrich.tech
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gain/10 text-gain text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse" />
                <span>Operational</span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Institutional-grade read-only REST API • Unversioned endpoints • 60 req/min free
            </p>
          </div>
        </div>

        <a
          href={getDomainUrl("docs", "/", theme)}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-accent hover:opacity-80 transition-opacity px-3 py-1.5 rounded-full bg-neutral-200/40 dark:bg-neutral-800/60 border border-neutral-300/40 dark:border-neutral-700/50"
        >
          <span>API Docs &amp; Schemas</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
        <a
          href="https://api.superrich.tech/rankings"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/40 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50 transition-colors border border-neutral-200/40 dark:border-neutral-800/40 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <span className="px-1.5 py-0.5 rounded bg-gain/10 text-gain text-[10px]">GET</span>
              <span>/rankings</span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-sans">
            Real-time billionaire index with country &amp; limit query filters
          </p>
        </a>

        <a
          href="https://api.superrich.tech/people/elon-musk"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/40 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50 transition-colors border border-neutral-200/40 dark:border-neutral-800/40 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <span className="px-1.5 py-0.5 rounded bg-gain/10 text-gain text-[10px]">GET</span>
              <span>/people/:slug</span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-sans">
            Curated dossiers with SEC holdings, court archives &amp; timelines
          </p>
        </a>

        <a
          href="https://api.superrich.tech/rtb/list"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/40 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50 transition-colors border border-neutral-200/40 dark:border-neutral-800/40 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <span className="px-1.5 py-0.5 rounded bg-gain/10 text-gain text-[10px]">GET</span>
              <span>/rtb/list</span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-sans">
            Full 3,400+ international feed with live intra-day deltas
          </p>
        </a>
      </div>
    </div>
  );
}
