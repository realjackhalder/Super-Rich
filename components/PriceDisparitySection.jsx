'use client';

import React, { useState } from 'react';
import { Info, ArrowUpRight, Calculator, Check, ArrowRight } from 'lucide-react';

export default function PriceDisparitySection({
  rates = [],
  baseCurrency = 'MMK',
  onExploreRates
}) {
  const [activeCurrencyPair, setActiveCurrencyPair] = useState('USD');
  const [remittanceAmount, setRemittanceAmount] = useState(1000);

  const comparisonData = {
    USD: {
      currency: 'USD',
      symbol: '$',
      flag: '🇺🇸',
      name: 'US Dollar',
      officialRate: 2100,
      realRate: 4595,
      unit: 'USD',
      step: 100,
      maxSlider: 10000,
      officialDesc: 'Central Bank of Myanmar (CBM) fixed reference peg. Rationed and unobtainable at commercial counters.',
      realDesc: 'SuperRich real-time parallel market clearing rate. Real cash, merchant liquidity, and international settlement.'
    },
    THB: {
      currency: 'THB',
      symbol: '฿',
      flag: '🇹🇭',
      name: 'Thai Baht',
      officialRate: 58.5,
      realRate: 126.6,
      unit: 'THB',
      step: 1000,
      maxSlider: 100000,
      officialDesc: 'Theoretical state peg for essential cross-border government trade permits.',
      realDesc: 'Actual Bangkok-Yangon daily remittance rate used by cross-border workers and traders.'
    },
    SGD: {
      currency: 'SGD',
      symbol: 'S$',
      flag: '🇸🇬',
      name: 'Singapore Dollar',
      officialRate: 1560,
      realRate: 3445,
      unit: 'SGD',
      step: 200,
      maxSlider: 20000,
      officialDesc: 'Statutory state rate without commercial banking allocation.',
      realDesc: 'Real corporate treasury, education tuition, and remittance exchange rate.'
    },
    EUR: {
      currency: 'EUR',
      symbol: '€',
      flag: '🇪🇺',
      name: 'Euro',
      officialRate: 2280,
      realRate: 4965,
      unit: 'EUR',
      step: 100,
      maxSlider: 10000,
      officialDesc: 'Official diplomatic and sovereign accounting reference rate.',
      realDesc: 'Open market liquidity for trade import financing and overseas transfers.'
    },
    CNY: {
      currency: 'CNY',
      symbol: '¥',
      flag: '🇨🇳',
      name: 'Chinese Yuan',
      officialRate: 290,
      realRate: 635,
      unit: 'CNY',
      step: 1000,
      maxSlider: 50000,
      officialDesc: 'Border trade portal official rate with strict regulatory quotas.',
      realDesc: 'Muse-Ruili border OTC and digital WeChat/Alipay parallel clearing rate.'
    }
  };

  const currentPair = comparisonData[activeCurrencyPair] || comparisonData['USD'];
  const spreadDeltaPercent = (((currentPair.realRate - currentPair.officialRate) / currentPair.officialRate) * 100).toFixed(1);

  // Calculations for simulated remittance
  const officialTotal = remittanceAmount * currentPair.officialRate;
  const realTotal = remittanceAmount * currentPair.realRate;
  const extraRetained = realTotal - officialTotal;

  // Height scaling for bars (relative ratio)
  const maxRate = currentPair.realRate * 1.15;
  const officialHeightPct = Math.round((currentPair.officialRate / maxRate) * 100);
  const realHeightPct = Math.round((currentPair.realRate / maxRate) * 100);

  return (
    <section id="disparity-section" className="py-16 md:py-24 border-b border-black/10">
      {/* Editorial Section Header (Like TrumpRx) */}
      <div className="max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block mb-3">
          [ INDEX II • RATE DISPARITY ANALYSIS &amp; IMPACT ]
        </span>
        <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.02] font-normal text-[#141413]">
          Official exchange rates were concealing the real cost of living.
        </h2>
        <p className="mt-4 text-[#63625D] text-base md:text-lg leading-relaxed max-w-2xl">
          While sovereign authorities maintain artificial pegs, commercial banks ration foreign exchange. Real people and enterprises trade at open-market equilibrium. Here is the verified difference.
        </p>
      </div>

      {/* Pair Switcher Chips */}
      <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[#8C8A84] uppercase tracking-wider mr-1">Benchmark Pair:</span>
        {Object.keys(comparisonData).map((key) => {
          const item = comparisonData[key];
          const isActive = activeCurrencyPair === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveCurrencyPair(key);
                setRemittanceAmount(key === 'THB' ? 10000 : key === 'CNY' ? 5000 : 1000);
              }}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#141413] text-[#FAF9F5] font-semibold shadow-xs'
                  : 'bg-[#F2EFE9] text-[#63625D] hover:bg-black/10'
              }`}
            >
              <span>{item.flag}</span>
              <span>{item.currency}/{baseCurrency}</span>
            </button>
          );
        })}
      </div>

      {/* TrumpRx-Style Cost Comparison Graphic */}
      <div className="mt-10 bg-[#F2EFE9] rounded-2xl p-6 sm:p-10 md:p-14 border border-black/10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 border-b border-black/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84]">
              PARALLEL MARKET SPREAD BENCHMARK
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#141413] mt-1">
              {currentPair.name} ({currentPair.currency}) vs {baseCurrency}
            </h3>
          </div>

          <div className="flex items-center space-x-2 bg-[#FAF9F5] px-4 py-2 rounded-full border border-black/10">
            <span className="font-mono text-xs text-[#8C8A84]">Parallel Gap:</span>
            <span className="font-mono text-sm font-bold text-[#A82828]">
              +{spreadDeltaPercent}% Real Premium
            </span>
          </div>
        </div>

        {/* The Two Bars (TrumpRx Style with animated height) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Column 1: Central Bank Official Peg */}
          <div className="flex flex-col justify-end space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8C8A84]">
                State Central Bank Peg (Indicative Only)
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#63625D] font-mono-num">
                  {currentPair.officialRate.toLocaleString()}
                </span>
                <span className="font-mono text-sm text-[#8C8A84]">{baseCurrency} / {currentPair.unit}</span>
              </div>
            </div>

            {/* Graphic Bar */}
            <div
              className="w-full bg-[#E5E2D8] rounded-t-lg relative overflow-hidden transition-all duration-700 ease-out"
              style={{ height: `${Math.max(120, officialHeightPct * 3.4)}px` }}
            >
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center p-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#63625D] text-center">
                  Restricted Access &bull; Fixed Peg
                </span>
              </div>
            </div>

            <p className="text-xs text-[#63625D] leading-relaxed">
              {currentPair.officialDesc}
            </p>
          </div>

          {/* Column 2: SuperRich Verified Open Market Rate */}
          <div className="flex flex-col justify-end space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#1B6B38] font-bold">
                  ● SuperRich Real Market Rate (Liquid)
                </span>
                <span className="text-[10px] font-mono bg-[#1B6B38]/10 text-[#1B6B38] px-2 py-0.5 rounded-full font-semibold">
                  ACTIVE SETTLEMENT
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#141413] font-mono-num">
                  {currentPair.realRate.toLocaleString()}
                </span>
                <span className="font-mono text-sm text-[#141413] font-bold">{baseCurrency} / {currentPair.unit}</span>
              </div>
            </div>

            {/* Graphic Bar */}
            <div
              className="w-full bg-[#141413] rounded-t-lg relative overflow-hidden flex flex-col justify-between p-5 transition-all duration-700 ease-out shadow-sm"
              style={{ height: `${Math.max(220, realHeightPct * 3.4)}px` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#FAF9F5] font-semibold">
                  True Clearing Liquidity
                </span>
                <span className="font-mono text-xs text-[#FAF9F5]/70">
                  Est. Daily Vol: ~$3.4M
                </span>
              </div>
              <div className="font-mono text-xs text-[#FAF9F5]/90">
                100% Cash / Digital P2P Realization
              </div>
            </div>

            <p className="text-xs text-[#141413] font-medium leading-relaxed">
              {currentPair.realDesc}
            </p>
          </div>
        </div>

        {/* Interactive Remittance Impact Simulator (New Up-to-Date Feature!) */}
        <div className="mt-12 pt-8 border-t border-black/10 bg-[#FAF9F5] rounded-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block">
                INTERACTIVE IMPACT CALCULATOR
              </span>
              <h4 className="font-serif text-2xl text-[#141413] mt-0.5">
                Simulate Real Remittance Difference
              </h4>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-[#63625D]">Converting:</span>
              <span className="font-serif text-2xl text-[#141413] font-mono-num font-semibold">
                {currentPair.symbol}{remittanceAmount.toLocaleString()} {currentPair.unit}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="py-5 space-y-2">
            <div className="flex justify-between text-[11px] font-mono text-[#8C8A84]">
              <span>Min: {currentPair.symbol}{currentPair.step}</span>
              <span>Slide to adjust amount</span>
              <span>Max: {currentPair.symbol}{currentPair.maxSlider.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={currentPair.step}
              max={currentPair.maxSlider}
              step={currentPair.step}
              value={remittanceAmount}
              onChange={(e) => setRemittanceAmount(Number(e.target.value))}
              aria-label="Adjust conversion amount"
              className="w-full accent-[#141413] cursor-pointer"
            />
          </div>

          {/* 3 Outcome Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#FFFFFF] border border-black/10 rounded-xl p-4">
              <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider block">
                Official Central Bank Peg
              </span>
              <div className="font-serif text-2xl text-[#63625D] font-mono-num mt-1">
                {officialTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} {baseCurrency}
              </div>
              <span className="font-mono text-[10px] text-[#8C8A84] mt-1 block">
                Commercial counter return
              </span>
            </div>

            <div className="bg-[#FFFFFF] border border-black/10 rounded-xl p-4">
              <span className="font-mono text-[10px] text-[#1B6B38] uppercase tracking-wider font-semibold block">
                SuperRich Open Market
              </span>
              <div className="font-serif text-2xl text-[#141413] font-mono-num mt-1">
                {realTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} {baseCurrency}
              </div>
              <span className="font-mono text-[10px] text-[#1B6B38] mt-1 block">
                Actual received liquidity
              </span>
            </div>

            <div className="bg-[#141413] text-[#FAF9F5] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#FAF9F5]/70 block">
                  Net Family Value Retained
                </span>
                <div className="font-serif text-2xl text-[#4ADE80] font-mono-num mt-1">
                  +{extraRetained.toLocaleString(undefined, { maximumFractionDigits: 0 })} {baseCurrency}
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#FAF9F5]/80 mt-1 block">
                Preserved purchasing power
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
