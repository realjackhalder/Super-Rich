'use client';

import React from 'react';
import { Shield, Cpu, Code2, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutView({ onOpenAI }) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-20">
      {/* Hero Intro */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#182016] border border-[#a3e635]/30 text-[#a3e635] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent &bull; Transparent &bull; Real-Time</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          About SuperRich Platform
        </h1>
        <p className="text-sm sm:text-base text-[#8e95a5] max-w-2xl mx-auto leading-relaxed">
          SuperRich is a professional-grade currency and commodity exchange intelligence platform
          engineered specifically for the Myanmar market and global digital asset traders.
        </p>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-base">Real-Time P2P Rates</h3>
          <p className="text-xs text-[#8e95a5] leading-relaxed">
            Direct proxy feeds tracking actual merchant buying and selling depth across MMK, THB, SGD,
            CNY, EUR, and USD from major liquidity pools.
          </p>
        </div>

        <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-base">AI Market Analyst</h3>
          <p className="text-xs text-[#8e95a5] leading-relaxed">
            Integrated with Qwen 3.8-27B via ExperientialLabs to deliver instant volatility
            breakdowns, travel conversion planning, and macroeconomic outlooks.
          </p>
        </div>

        <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-base">Open Developer API</h3>
          <p className="text-xs text-[#8e95a5] leading-relaxed">
            Fast, cached REST API endpoints designed for web and mobile developers building financial
            tools in Southeast Asia.
          </p>
        </div>
      </div>

      {/* Developer API Section */}
      <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-white font-extrabold text-lg tracking-wide flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#a3e635]" />
            Developer API Endpoints
          </h3>
          <p className="text-xs text-[#8b94a5] mt-1">
            Access live exchange rates and AI intelligence programmatically.
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#151821] border border-[#232836] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-[#1f2937] text-[#38bdf8] font-bold text-[11px]">
                GET
              </span>
              <span className="text-white">/api/rates</span>
            </div>
            <span className="text-[#8b94a5] text-[11px]">Returns all real-time currency rates with 24h sparklines</span>
          </div>

          <div className="bg-[#151821] border border-[#232836] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-[#1f2937] text-[#38bdf8] font-bold text-[11px]">
                GET
              </span>
              <span className="text-white">/api/p2p-rates</span>
            </div>
            <span className="text-[#8b94a5] text-[11px]">Returns raw P2P fiat price dictionary</span>
          </div>

          <div className="bg-[#151821] border border-[#232836] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-[#1f2937] text-[#a3e635] font-bold text-[11px]">
                POST
              </span>
              <span className="text-white">/api/ai</span>
            </div>
            <span className="text-[#8b94a5] text-[11px]">Generates Qwen 3.8 currency trend analysis</span>
          </div>
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="bg-[#15171e] border border-[#252936] rounded-2xl p-6 text-xs text-[#8e95a5] space-y-2">
        <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-[#ef4444]">
          Independent Disclaimer
        </h4>
        <p className="leading-relaxed">
          SuperRich is an independent open market transparency initiative and is not affiliated,
          associated, authorized, endorsed by, or in any way officially connected with Super Rich
          Thailand (SuperRich 1965 / SuperRich Green). All rates displayed are indicative reference
          points aggregated from peer-to-peer digital markets and community reports.
        </p>
      </div>
    </div>
  );
}
