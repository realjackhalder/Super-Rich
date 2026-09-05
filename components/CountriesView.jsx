'use client';

import React, { useState } from 'react';
import { Search, Globe, ArrowRight, TrendingUp } from 'lucide-react';
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
    <div className="w-full space-y-6 pb-16">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight">
            Global Currencies &amp; Countries Directory
          </h2>
          <p className="text-xs text-[#8b94a5] mt-1">
            Browse real-time exchange rates calculated relative to <strong className="text-white">{baseCurrency}</strong>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search country or currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12141a] border border-[#232733] focus:border-[#a3e635] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {['All', 'Asia', 'Europe', 'Americas', 'Middle East & Oceania'].map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              region === r
                ? 'bg-[#a3e635] text-black font-bold shadow-[0_0_10px_rgba(163,230,53,0.2)]'
                : 'bg-[#12141a] border border-[#20242f] text-[#8b94a5] hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Grid of Country Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const mid = (item.mid || 1) / (baseItem.mid || 1);
          const buy = mid * 0.9945;
          const sell = mid * 1.0055;
          const isPositive = item.change24h >= 0;

          return (
            <div
              key={item.currency}
              className="bg-[#101217] border border-[#1e222b] hover:border-[#383f50] rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg hover:shadow-2xl group"
            >
              <div>
                {/* Top Row: Flag, Name, Code */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1b1e28] flex items-center justify-center text-xl overflow-hidden shadow-inner">
                      {item.flag}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-tight">
                        {item.country}
                      </h4>
                      <span className="text-[11px] font-bold text-[#8b94a5] tracking-wider uppercase">
                        {item.currency}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      isPositive ? 'text-[#a3e635]' : 'text-[#ef4444]'
                    }`}
                  >
                    {isPositive ? `+${item.change24h.toFixed(2)}%` : `${item.change24h.toFixed(2)}%`}
                  </span>
                </div>

                {/* Rates Row */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#181a22]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#646b7a]">
                      Buy ({baseCurrency})
                    </span>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      {buy < 10
                        ? buy.toLocaleString(undefined, { maximumFractionDigits: 3 })
                        : buy.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#646b7a]">
                      Sell ({baseCurrency})
                    </span>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      {sell < 10
                        ? sell.toLocaleString(undefined, { maximumFractionDigits: 3 })
                        : sell.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Sparkline Visual */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#646b7a]">24h Trendline</span>
                  <Sparkline
                    data={item.sparkline}
                    isPositive={isPositive}
                    width={70}
                    height={20}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCountryToConvert(item.currency)}
                className="mt-4 w-full py-2 rounded-xl bg-[#14181f] border border-[#232938] hover:border-[#a3e635]/50 text-white font-bold text-xs flex items-center justify-center space-x-1.5 group-hover:bg-[#1a2318] group-hover:text-[#a3e635] transition-all"
              >
                <span>Convert on Board</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
