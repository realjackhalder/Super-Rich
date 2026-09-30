'use client';

import React, { useState } from 'react';
import { Search, Globe, ArrowUpRight, TrendingUp } from 'lucide-react';
import Sparkline from './Sparkline';

export default function CountriesView({
  rates = [],
  baseCurrency = 'MMK',
  onSelectCountryToConvert
}) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');

  const baseItem = rates.find((r) => r.currency === baseCurrency) || { mid: 1 };

  const regionsMap = {
    Asia: ['MMK', 'THB', 'SGD', 'CNY', 'JPY', 'KRW', 'MYR', 'INR', 'TWD', 'VND'],
    Europe: ['EUR', 'GBP', 'CHF', 'RUB'],
    Americas: ['USD', 'CAD'],
    'Middle East & Oceania': ['AUD', 'NZD', 'AED', 'BDT']
  };

  const filtered = rates.filter((r) => {
    const matchesSearch =
      r.country.toLowerCase().includes(search.toLowerCase()) ||
      r.currency.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (region === 'All') return true;
    return regionsMap[region]?.includes(r.currency);
  });

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block mb-2">
            [ DIRECTORY 04 • GLOBAL SOVEREIGN ARCHIVE ]
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#141413]">
            Sovereign Currencies Directory
          </h1>
          <p className="text-sm text-[#63625D] mt-2">
            Comprehensive clearing directory benchmarked against <span className="font-semibold text-[#141413]">{baseCurrency}</span>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8A84] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search country or currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-black/15 text-[#141413] text-xs rounded-full pl-10 pr-4 py-2.5 outline-none font-mono focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[#8C8A84] uppercase tracking-wider mr-2">Region:</span>
        {['All', 'Asia', 'Europe', 'Americas', 'Middle East & Oceania'].map((reg) => (
          <button
            key={reg}
            onClick={() => setRegion(reg)}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              region === reg
                ? 'bg-[#141413] text-[#FAF9F5] font-semibold'
                : 'bg-[#F2EFE9] text-[#63625D] hover:bg-black/10 hover:text-[#141413]'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Cards Grid (NDS Minimal Paper Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => {
          const crossRate = ((item.mid || 1) / (baseItem.mid || 1));
          const isPositive = (item.change24h || 0) >= 0;

          return (
            <div
              key={item.currency}
              onClick={() => onSelectCountryToConvert && onSelectCountryToConvert(item.currency)}
              className="group bg-[#FFFFFF] border border-black/10 hover:border-black/30 rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-xs text-left"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{item.flag}</span>
                  <div className="flex items-center space-x-1.5 font-mono text-xs">
                    <span className="font-semibold text-[#141413]">{item.currency}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#8C8A84] group-hover:text-[#141413] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-2xl text-[#141413] leading-snug group-hover:underline underline-offset-4 decoration-black/30">
                    {item.country}
                  </h3>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="font-serif text-3xl text-[#141413] font-mono-num font-normal">
                      {crossRate.toLocaleString(undefined, {
                        minimumFractionDigits: crossRate < 10 ? 3 : 2,
                        maximumFractionDigits: crossRate < 10 ? 3 : 2
                      })}
                    </span>
                    <span className="font-mono text-xs text-[#8C8A84]">{baseCurrency}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                <span
                  className={`px-2 py-0.5 rounded ${
                    isPositive
                      ? 'bg-[#1B6B38]/10 text-[#1B6B38]'
                      : 'bg-[#A82828]/10 text-[#A82828]'
                  }`}
                >
                  {isPositive ? '+' : ''}{item.change24h?.toFixed(2)}%
                </span>
                <span className="text-[#8C8A84] group-hover:text-[#141413]">
                  Convert Rate →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
