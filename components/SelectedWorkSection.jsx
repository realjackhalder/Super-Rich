'use client';

import React from 'react';
import { ArrowUpRight, TrendingUp, Calculator, BarChart3, Globe, Sparkles, QrCode } from 'lucide-react';

export default function SelectedWorkSection({
  onSelectFeature,
  onOpenAI
}) {
  const modules = [
    {
      id: 'RATES',
      roman: '01',
      title: 'Live Exchange Board',
      subtitle: 'Real-time parallel & interbank foreign exchange clearing rates',
      category: 'Market Telemetry',
      action: () => onSelectFeature('RATES_SECTION'),
      preview: {
        type: 'rates',
        pair: 'USD / MMK',
        rate: '4,595.00',
        buy: '4,570.00',
        sell: '4,620.00',
        delta: '+0.35%'
      }
    },
    {
      id: 'CONVERTER',
      roman: '02',
      title: 'Precision Converter',
      subtitle: 'Instant cross-currency calculator with zero-hidden-margin transparency',
      category: 'Financial Calculator',
      action: () => onSelectFeature('CONVERTER_SECTION'),
      preview: {
        type: 'converter',
        from: '1,000 USD',
        to: '4,595,000 MMK',
        fee: '0.00% Spread Bias'
      }
    },
    {
      id: 'TOOLS',
      roman: '03',
      title: 'TradingView Terminal',
      subtitle: 'Professional candlestick charts, dynamic order book depth & live trade tape',
      category: 'Market Infrastructure',
      action: () => onSelectFeature('TOOLS'),
      preview: {
        type: 'terminal',
        badge: 'TRADINGVIEW ENGINE',
        metric: 'USDT/MMK &bull; BTC/USDT'
      }
    },
    {
      id: 'COUNTRIES',
      roman: '04',
      title: 'Global Sovereign Directory',
      subtitle: 'Profiles, reserve statistics, and central bank pegs for 35+ national currencies',
      category: 'Central Banking Index',
      action: () => onSelectFeature('COUNTRIES'),
      preview: {
        type: 'directory',
        flags: ['🇺🇸', '🇲🇲', '🇹🇭', '🇸🇬', '🇪🇺', '🇨🇳', '🇯🇵', '🇬🇧']
      }
    },
    {
      id: 'AI_ADVISOR',
      roman: '05',
      title: 'AI Market Intelligence',
      subtitle: 'Automated macroeconomic briefings powered by Qwen 3.8-27B analysis models',
      category: 'Algorithmic Advisory',
      action: onOpenAI,
      preview: {
        type: 'ai',
        status: 'ONLINE &bull; QWEN 27B'
      }
    },
    {
      id: 'HELP',
      roman: '06',
      title: 'Direct Settlement Desk',
      subtitle: 'Cross-border remittances, QR payment rails (PromptPay, KBZPay), and Bitcoin',
      category: 'Payment Settlement',
      action: () => onSelectFeature('HELP'),
      preview: {
        type: 'settlement',
        networks: 'PROMPTPAY &bull; KBZPAY &bull; BTC'
      }
    },
  ];

  return (
    <section className="py-16 md:py-24 border-b border-black/10">
      {/* Header in the exact NDStudio style */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-black/10">
        <div className="flex items-center space-x-6 text-[#141413]">
          <span className="font-mono text-sm tracking-widest text-[#8C8A84]">I</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-[#141413]">
            Selected Systems &amp; Modules
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#8C8A84]">
          Independent Exchange Architecture &bull; 06 Modules
        </p>
      </div>

      {/* Grid of Portfolio Cards (3 Columns like ndstudio.gov) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {modules.map((m) => (
          <div
            key={m.id}
            onClick={m.action}
            className="group block cursor-pointer transition-opacity hover:opacity-90 text-left"
          >
            {/* Top title line with hover arrow reveal */}
            <div className="flex items-baseline justify-between pb-3 border-b border-black/10">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-[#8C8A84]">{m.roman}</span>
                <span className="font-serif text-2xl text-[#141413] tracking-tight group-hover:underline underline-offset-4 decoration-black/40">
                  {m.title}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#141413] opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            </div>

            {/* Visual Aspect Ratio Card (Like NDStudio work showcase preview) */}
            <div className="mt-4 aspect-[4/3] rounded-lg bg-[#F2EFE9] border border-black/10 p-6 flex flex-col justify-between overflow-hidden relative group-hover:border-black/30 transition-all">
              {/* Category pill */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8A84] px-2.5 py-1 rounded bg-[#FAF9F5] border border-black/10">
                  {m.category}
                </span>
                <span className="font-mono text-[10px] text-[#8C8A84] group-hover:text-[#141413]">
                  EXPLORE ↗
                </span>
              </div>

              {/* Unique internal card representation */}
              {m.preview.type === 'rates' && (
                <div className="my-auto py-2">
                  <div className="font-mono text-xs text-[#63625D]">{m.preview.pair}</div>
                  <div className="font-serif text-4xl font-normal text-[#141413] font-mono-num mt-1">
                    {m.preview.rate}
                  </div>
                  <div className="mt-2 flex items-center space-x-3 text-xs font-mono">
                    <span className="text-[#1B6B38] font-semibold">{m.preview.delta}</span>
                    <span className="text-[#8C8A84]">Buy: {m.preview.buy}</span>
                    <span className="text-[#8C8A84]">Sell: {m.preview.sell}</span>
                  </div>
                </div>
              )}

              {m.preview.type === 'converter' && (
                <div className="my-auto py-2 space-y-2">
                  <div className="font-serif text-2xl text-[#141413]">
                    {m.preview.from}
                  </div>
                  <div className="font-mono text-xs text-[#8C8A84]">
                    = {m.preview.to}
                  </div>
                  <div className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#1B6B38] bg-[#1B6B38]/10 px-2 py-0.5 rounded">
                    {m.preview.fee}
                  </div>
                </div>
              )}

              {m.preview.type === 'terminal' && (
                <div className="my-auto py-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#8C8A84] uppercase">
                    <BarChart3 className="w-4 h-4 text-[#141413]" />
                    <span>Real-time Depth</span>
                  </div>
                  <div className="mt-2 font-serif text-3xl text-[#141413]">
                    Candlesticks &amp; Tape
                  </div>
                  <div className="font-mono text-[11px] text-[#63625D] mt-1" dangerouslySetInnerHTML={{ __html: m.preview.metric }} />
                </div>
              )}

              {m.preview.type === 'directory' && (
                <div className="my-auto py-2">
                  <div className="flex items-center space-x-1.5 text-2xl mb-2">
                    {m.preview.flags.slice(0, 5).map((fl, i) => (
                      <span key={i}>{fl}</span>
                    ))}
                  </div>
                  <div className="font-mono text-xs text-[#141413] uppercase tracking-wider font-semibold">
                    35+ Sovereign Currencies
                  </div>
                  <div className="font-mono text-[11px] text-[#8C8A84] mt-1">
                    Central bank reserves, mints &amp; pegs
                  </div>
                </div>
              )}

              {m.preview.type === 'ai' && (
                <div className="my-auto py-2">
                  <div className="flex items-center space-x-2 text-[#141413] mb-1">
                    <Sparkles className="w-4 h-4 text-[#1B6B38]" />
                    <span className="font-mono text-xs font-semibold">Qwen Macro Engine</span>
                  </div>
                  <div className="font-serif text-3xl text-[#141413]">
                    Instant Volatility Briefs
                  </div>
                  <div className="font-mono text-[10px] text-[#1B6B38] mt-1">
                    {m.preview.status}
                  </div>
                </div>
              )}

              {m.preview.type === 'settlement' && (
                <div className="my-auto py-2">
                  <div className="font-serif text-2xl text-[#141413] mb-1">
                    Frictionless Settlement
                  </div>
                  <div className="font-mono text-[10px] text-[#63625D] tracking-wider uppercase">
                    {m.preview.networks}
                  </div>
                  <div className="font-mono text-[10px] text-[#8C8A84] mt-1">
                    Zero intermediary fees
                  </div>
                </div>
              )}

              {/* Bottom subtitle text */}
              <p className="text-xs text-[#63625D] leading-relaxed pt-2 border-t border-black/10">
                {m.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
