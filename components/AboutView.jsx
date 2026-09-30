'use client';

import React from 'react';
import { Shield, Cpu, Code2, Globe2, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function AboutView({ onOpenAI }) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-24">
      {/* Editorial Header (NDStudio Style) */}
      <div className="space-y-4 pt-6 border-b border-black/10 pb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block">
          [ BUREAU CHARTER • CONSTITUTION ]
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#141413] leading-[0.96] font-normal">
          Designed to bring dignity, precision, and transparency to sovereign exchange.
        </h1>
        <p className="text-base sm:text-lg text-[#63625D] leading-relaxed pt-2">
          SuperRich is an independent foreign exchange and liquidity intelligence infrastructure engineered for citizens, businesses, and traders across Myanmar and Southeast Asia.
        </p>
      </div>

      {/* Narrative Section (Like NDStudio Ten Billion Hours essay) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-4">
        <div className="md:col-span-4">
          <span className="font-mono text-xs uppercase tracking-wider text-[#8C8A84]">
            I. The Parallel Reality
          </span>
          <h2 className="font-serif text-2xl text-[#141413] mt-1">
            Beyond Artificial Pegs
          </h2>
        </div>
        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-[#403F3B] leading-relaxed">
          <p>
            When central banks freeze currency pegs divorced from macroeconomic reality, trade does not stop—it migrates to parallel merchant networks. In that vacuum, predatory spreads and panic pricing thrive.
          </p>
          <p>
            SuperRich was formed to measure the truth. By aggregating verified OTC cashier tickets, digital remittance transactions, and regional interbank orderbooks, we provide public-good market transparency with sub-second latency.
          </p>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-[#FFFFFF] border border-black/10 rounded-xl p-6 shadow-xs space-y-3 text-left">
          <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider">
            PILLAR 01
          </span>
          <h3 className="font-serif text-2xl text-[#141413]">Open-Market Clearing</h3>
          <p className="text-xs text-[#63625D] leading-relaxed">
            Direct tracking of real merchant cash and digital liquidity depth across MMK, THB, SGD, CNY, EUR, and USD.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-black/10 rounded-xl p-6 shadow-xs space-y-3 text-left">
          <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider">
            PILLAR 02
          </span>
          <h3 className="font-serif text-2xl text-[#141413]">Algorithmic Briefs</h3>
          <p className="text-xs text-[#63625D] leading-relaxed">
            Integrated with advanced neural intelligence models (Qwen 3.8-27B) providing real-time macro briefs and volatility alerts.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-black/10 rounded-xl p-6 shadow-xs space-y-3 text-left">
          <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider">
            PILLAR 03
          </span>
          <h3 className="font-serif text-2xl text-[#141413]">Zero Intermediary Bias</h3>
          <p className="text-xs text-[#63625D] leading-relaxed">
            Free public developer API with no artificial markups, enabling developers to build resilient financial services.
          </p>
        </div>
      </div>

      {/* Developer API Box */}
      <div className="bg-[#F2EFE9] border border-black/10 rounded-2xl p-6 sm:p-8 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84]">
              DEVELOPER ACCESS
            </span>
            <h3 className="font-serif text-2xl text-[#141413]">
              Public Sovereign REST API
            </h3>
          </div>
          <span className="font-mono text-xs text-[#1B6B38] font-semibold">
            STATUS: 99.98% UPTIME
          </span>
        </div>

        <p className="text-xs text-[#63625D] leading-relaxed max-w-2xl">
          Integrate live rates into ecommerce checkouts, accounting systems, and remittance applications.
        </p>

        <div className="bg-[#FAF9F5] border border-black/10 rounded-lg p-3 font-mono text-xs text-[#141413] flex items-center justify-between">
          <span>GET https://api.superrich.tech/v1/rates</span>
          <span className="text-[#8C8A84] text-[10px]">JSON &bull; NO AUTH REQUIRED</span>
        </div>
      </div>

      {/* AI Advisor Prompt Banner */}
      <div className="p-8 rounded-2xl border border-black/10 bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#141413]">
            Consult the Currency Intelligence Desk
          </h3>
          <p className="text-xs text-[#63625D]">
            Ask questions about volatility trends, remittance timing, and parallel market dynamics.
          </p>
        </div>
        <button
          onClick={onOpenAI}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-black text-xs font-mono uppercase tracking-wider shrink-0 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FAF9F5]" />
          <span>Launch Advisor</span>
        </button>
      </div>
    </div>
  );
}
