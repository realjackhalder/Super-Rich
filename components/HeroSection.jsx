'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, ArrowDown, ArrowUpRight, Sparkles, RefreshCw, Zap } from 'lucide-react';

export default function HeroSection({
  rates = [],
  selectedCurrency = 'USD',
  onSelectCurrency,
  baseCurrency = 'MMK',
  onSelectBaseCurrency,
  onNavigateToSection
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState('just now');
  const dropdownRef = useRef(null);

  const selectedRate = rates.find((r) => r.currency === selectedCurrency) || rates[0] || {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    mid: 4595,
    buy: 4570,
    sell: 4620,
    change24h: 0.35
  };

  const selectedBase = rates.find((r) => r.currency === baseCurrency) || {
    country: 'Myanmar',
    currency: 'MMK',
    flag: '🇲🇲',
    mid: 1
  };

  const calculatedRate = ((selectedRate.mid || 1) / (selectedBase.mid || 1));
  const calculatedBuy = ((selectedRate.buy || calculatedRate * 0.9945) / (selectedBase.mid || 1));
  const calculatedSell = ((selectedRate.sell || calculatedRate * 1.0055) / (selectedBase.mid || 1));

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRates = rates.filter((r) =>
    r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularBases = ['MMK', 'USD', 'THB', 'SGD', 'EUR', 'CNY', 'JPY'];

  return (
    <section className="pt-10 sm:pt-14 md:pt-18 pb-16 md:pb-22 border-b border-black/10">
      {/* Top TrumpRx-style Stat / Impact Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="inline-flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-[#141413]">
          <span className="inline-flex items-center rounded-full bg-[#1B6B38]/10 text-[#1B6B38] border border-[#1B6B38]/25 px-3 py-1 font-semibold">
            $1,280,000,000+
          </span>
          <span className="text-[#63625D]">Verified Open-Market Liquidity Tracked</span>
          <span className="hidden md:inline text-black/20">•</span>
          <span className="hidden md:inline text-[#1B6B38] font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#1B6B38]" />
            SUB-SECOND PARALLEL TELEMETRY
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8C8A84]">
          <span className="w-2 h-2 rounded-full bg-[#1B6B38] animate-pulse"></span>
          <span>FEEDS ACTIVE: YANGON • BKK • SG</span>
        </div>
      </div>

      {/* Monumental Headline in Instrument Serif (NDStudio & TrumpRx signature style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-8">
          <h1 className="font-serif text-[clamp(2.75rem,5.2vw,5.5rem)] leading-[0.94] font-normal tracking-[-0.02em] text-[#141413] text-balance">
            SuperRich is redesigning how citizens and traders experience global exchange, returning <span className="italic font-serif">clarity and truth</span> to money.
          </h1>
        </div>

        {/* Live Spotlight Card right in the Hero */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-black/10 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="flex items-center space-x-2 font-mono text-xs text-[#8C8A84]">
              <span className="text-base">{selectedRate.flag}</span>
              <span className="font-semibold text-[#141413]">{selectedRate.currency} / {baseCurrency}</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-[#1B6B38]/10 text-[#1B6B38] px-2 py-0.5 rounded-full font-semibold">
              LIVE MID-RATE
            </span>
          </div>

          <div className="py-4">
            <div className="font-mono text-xs text-[#8C8A84]">1 {selectedRate.currency} Equals</div>
            <div className="font-serif text-4xl sm:text-5xl text-[#141413] font-mono-num font-normal mt-0.5">
              {calculatedRate.toLocaleString(undefined, {
                minimumFractionDigits: calculatedRate < 10 ? 3 : 2,
                maximumFractionDigits: calculatedRate < 10 ? 3 : 2
              })}
              <span className="font-mono text-sm text-[#8C8A84] ml-2">{baseCurrency}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-mono pt-3 border-t border-black/[0.08]">
              <div>
                <span className="text-[#8C8A84] text-[10px] block">BUY</span>
                <span className="font-medium text-[#141413] font-mono-num">
                  {calculatedBuy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#8C8A84] text-[10px] block">SELL</span>
                <span className="font-medium text-[#141413] font-mono-num">
                  {calculatedSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#8C8A84] text-[10px] block">24H CHANGE</span>
                <span className={`font-semibold font-mono-num ${selectedRate.change24h >= 0 ? 'text-[#1B6B38]' : 'text-[#A82828]'}`}>
                  {selectedRate.change24h >= 0 ? '+' : ''}{selectedRate.change24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSection && onNavigateToSection('CONVERTER_SECTION')}
            className="w-full mt-2 py-2 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-black text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-1 transition-all"
          >
            <span>Convert in Calculator</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editorial Narrative & Quick Action Bar (NDStudio style) */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-black/10">
        <div className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#8C8A84]">
            [ MISSION NO. 01 ]
          </p>
          <p className="font-serif text-2xl text-[#141413] mt-2">
            The Truth of the Rate
          </p>
        </div>

        <div className="md:col-span-6 space-y-4">
          <p className="text-[#403F3B] text-base md:text-lg leading-relaxed font-normal">
            Every year, millions lose hard-earned capital navigating opaque black markets, speculative spreads, and broken central bank pegs. Waiting, guessing, timing out. That isn’t just inefficient—it is an unnecessary burden on everyday lives and international trade.
          </p>
          <p className="text-[#63625D] text-sm md:text-base leading-relaxed">
            SuperRich restores transparency by publishing unvarnished open-market cash, P2P, and cross-border settlement rates in real-time. Complexity becomes clarity.
          </p>
        </div>

        {/* Quick CTA Actions */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <button
            onClick={() => onNavigateToSection && onNavigateToSection('RATES')}
            className="w-full inline-flex items-center justify-between px-4 py-3 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-black transition-all text-xs font-mono uppercase tracking-wider group cursor-pointer"
          >
            <span>Live Rate Board</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          </button>

          <button
            onClick={() => onNavigateToSection && onNavigateToSection('TOOLS')}
            className="w-full inline-flex items-center justify-between px-4 py-3 rounded-full border border-black/20 text-[#141413] hover:bg-black/5 transition-all text-xs font-mono uppercase tracking-wider group cursor-pointer"
          >
            <span>Trading Terminal</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Base Currency & Country Quick-Selector (Clean NDS Paper Style) */}
      <div className="mt-12 pt-8 border-t border-black/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Base Currency Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#8C8A84] uppercase tracking-wider">
              Base Reference:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {popularBases.map((code) => {
                const r = rates.find((item) => item.currency === code) || { currency: code, flag: '🌐' };
                const isSelected = baseCurrency === code;
                return (
                  <button
                    key={code}
                    onClick={() => onSelectBaseCurrency(code)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#141413] text-[#FAF9F5] font-semibold'
                        : 'bg-[#F2EFE9] text-[#63625D] hover:bg-black/10 hover:text-[#141413]'
                    }`}
                  >
                    <span>{r.flag}</span>
                    <span>{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Target Country Selector Dropdown */}
          <div className="relative min-w-[240px]" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#F2EFE9] hover:bg-[#EAE6DD] border border-black/10 rounded-full px-4 py-2 flex items-center justify-between text-left transition-colors text-xs font-mono cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">{selectedRate.flag}</span>
                <span className="font-medium text-[#141413]">{selectedRate.country}</span>
                <span className="text-[#8C8A84]">({selectedRate.currency})</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#63625D]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#FAF9F5] border border-black/15 rounded-xl shadow-2xl z-50 p-2 max-h-72 overflow-y-auto">
                <div className="p-1 mb-1 border-b border-black/10">
                  <input
                    type="text"
                    placeholder="Search sovereign currency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-white border border-black/15 text-[#141413] text-xs rounded-md px-2.5 py-1.5 outline-none font-mono focus:border-black"
                  />
                </div>
                <div className="space-y-0.5">
                  {filteredRates.map((item) => {
                    const isSelected = item.currency === selectedRate.currency;
                    return (
                      <button
                        key={item.currency}
                        onClick={() => {
                          onSelectCurrency(item.currency);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#141413] text-[#FAF9F5]'
                            : 'hover:bg-black/5 text-[#403F3B]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{item.flag}</span>
                          <span>{item.country}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[#8C8A84]">{item.currency}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FAF9F5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
