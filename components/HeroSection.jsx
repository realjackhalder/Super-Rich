'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Check } from 'lucide-react';

export default function HeroSection({
  rates = [],
  selectedCurrency = 'USD',
  onSelectCurrency,
  baseCurrency = 'MMK',
  onSelectBaseCurrency
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBaseDropdownOpen, setIsBaseDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const baseDropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const selectedRate = rates.find((r) => r.currency === selectedCurrency) || rates[0] || {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
  };

  const selectedBase = rates.find((r) => r.currency === baseCurrency) || {
    country: 'Myanmar',
    currency: 'MMK',
    flag: '🇲🇲'
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (baseDropdownRef.current && !baseDropdownRef.current.contains(e.target)) {
        setIsBaseDropdownOpen(false);
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

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col justify-between py-2 lg:py-4">
      {/* Huge Display Heading */}
      <div>
        <h1 className="text-white font-condensed font-black uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] tracking-tight leading-[0.88]">
          THE WORLD,<br />
          IN ONE RATE.
        </h1>

        {/* Subtitle */}
        <p className="text-[#8e95a5] text-sm sm:text-base mt-4 max-w-lg leading-relaxed font-normal">
          Live currency exchange rates for {selectedBase.country} ({selectedBase.currency}) and global markets.<br className="hidden sm:inline" />
          Choose any country to see live buy &amp; sell rates and convert instantly.
        </p>

        {/* Base Currency Selection Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#686f7e] uppercase tracking-wider">
            BASE CURRENCY:
          </span>
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {popularBases.map((code) => {
              const r = rates.find((item) => item.currency === code) || { currency: code, flag: '🌐' };
              const isSelected = baseCurrency === code;
              return (
                <button
                  key={code}
                  onClick={() => onSelectBaseCurrency(code)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#a3e635] text-black font-bold shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                      : 'bg-[#15171e] text-[#8e95a5] border border-[#22252e] hover:text-white hover:border-[#383d4a]'
                  }`}
                >
                  <span className="text-xs">{r.flag}</span>
                  <span>{code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Country Selector Area */}
      <div className="mt-7 lg:mt-9">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold text-[#686f7e] uppercase tracking-[0.18em]">
            CHOOSE A COUNTRY
          </label>
          <span className="text-[10px] text-[#8b949e]">
            Comparing vs <strong className="text-white">{baseCurrency}</strong>
          </span>
        </div>

        {/* Search / Select Bar */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[#121316] border border-[#23262f] hover:border-[#383d4a] rounded-xl px-4 py-3.5 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-[#686f7e]" />
              <span className="text-xl leading-none">{selectedRate.flag}</span>
              <span className="text-sm font-semibold text-white tracking-wide">
                {selectedRate.country}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[#8b949e]">
              <span className="text-xs font-semibold uppercase">{selectedRate.currency}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Search Dropdown Popup */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121317] border border-[#282c37] rounded-xl shadow-2xl z-50 p-2 max-h-72 overflow-y-auto">
              <div className="px-2 pb-2 mb-2 border-b border-[#21242d]">
                <input
                  type="text"
                  placeholder="Search any country or currency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#191b22] border border-[#2b303c] text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-[#a3e635]"
                />
              </div>

              <div className="space-y-1">
                {filteredRates.length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#686f7e]">
                    No country found
                  </div>
                ) : (
                  filteredRates.map((item) => {
                    const isSelected = item.currency === selectedRate.currency;
                    return (
                      <button
                        key={item.currency}
                        onClick={() => {
                          onSelectCurrency(item.currency);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#1b2218] text-white font-bold'
                            : 'hover:bg-[#181a20] text-[#c9d1d9]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{item.flag}</span>
                          <span>{item.country}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#8b949e] font-mono uppercase">
                            {item.currency}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#a3e635]" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick-Select Country Chips */}
        <div className="flex items-center space-x-2 mt-4">
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1"
          >
            {rates.filter(r => r.currency !== baseCurrency).slice(0, 7).map((item) => {
              const isSelected = item.currency === selectedRate.currency;
              return (
                <button
                  key={item.currency}
                  onClick={() => onSelectCurrency(item.currency)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left flex-shrink-0 transition-all ${
                    isSelected
                      ? 'border-2 border-[#a3e635] bg-[#141913] shadow-[0_0_14px_rgba(163,230,53,0.22)]'
                      : 'border border-[#22252e] bg-[#111216] hover:border-[#333845] hover:bg-[#15171d]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-[#1e2129] flex-shrink-0">
                    <span className="text-sm">{item.flag}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white leading-tight whitespace-nowrap">
                      {item.country}
                    </span>
                    <span className="text-[10px] text-[#717684] font-medium leading-none mt-0.5">
                      {item.currency}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={scrollRight}
            aria-label="Scroll more countries"
            className="flex-shrink-0 w-9 h-11 bg-[#121316] border border-[#22252e] hover:border-[#383d4c] rounded-xl flex items-center justify-center text-[#8e95a5] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
