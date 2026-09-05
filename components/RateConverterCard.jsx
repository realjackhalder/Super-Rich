'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpDown, ChevronDown, Sparkles, Check } from 'lucide-react';

export default function RateConverterCard({
  allRates = [],
  fromCurrency = 'USD',
  toCurrency = 'MMK',
  onChangeFromCurrency,
  onChangeToCurrency,
  source = 'SUPER RICH',
  updatedAt,
  onOpenAI
}) {
  const [sendAmount, setSendAmount] = useState('1,000.00');
  const [formattedTime, setFormattedTime] = useState('10:23 AM');
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    const now = updatedAt ? new Date(updatedAt) : new Date();
    setFormattedTime(
      now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
  }, [updatedAt]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) setFromDropdownOpen(false);
      if (toRef.current && !toRef.current.contains(e.target)) setToDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fromItem = allRates.find((r) => r.currency === fromCurrency) || {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    mid: 4595
  };

  const toItem = allRates.find((r) => r.currency === toCurrency) || {
    country: 'Myanmar',
    currency: 'MMK',
    flag: '🇲🇲',
    mid: 1
  };

  // Cross rate calculation against MMK:
  // 1 FromCurrency = fromItem.mid MMK
  // 1 ToCurrency = toItem.mid MMK
  // Hence: 1 FromCurrency = (fromItem.mid / toItem.mid) ToCurrency
  const rawMidRate = (fromItem.mid || 1) / (toItem.mid || 1);
  const buyRate = rawMidRate * 0.9945;
  const sellRate = rawMidRate * 1.0055;

  const rawAmount = parseFloat((sendAmount || '').replace(/,/g, '')) || 0;
  const receiveAmount = rawAmount * sellRate;

  // Formatting helpers
  const formatNumber = (num, minDec = 2, maxDec = 4) => {
    if (isNaN(num)) return '0.00';
    const dec = num < 1 ? maxDec : minDec;
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    const cleaned = val.replace(/[^0-9.]/g, '');
    setSendAmount(cleaned);
  };

  const handleBlur = () => {
    if (!sendAmount || isNaN(rawAmount)) {
      setSendAmount('0.00');
    } else {
      setSendAmount(formatNumber(rawAmount, 2, 2));
    }
  };

  const handleSwap = () => {
    onChangeFromCurrency(toCurrency);
    onChangeToCurrency(fromCurrency);
  };

  return (
    <div className="w-full bg-[#101115] border border-[#1e2129] rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden">
      {/* Glow highlight in corner */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#a3e635]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header: LIVE, Timestamp & Pair */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1b1e25]">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#a3e635] inline-block animate-pulse" />
            <span className="text-[#a3e635] font-bold tracking-widest text-[11px] uppercase">
              LIVE
            </span>
          </div>
          <span className="text-[#646b7a] text-[11px] font-medium tracking-wide uppercase">
            UPDATE {formattedTime}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAI}
            className="flex items-center space-x-1 text-[11px] font-bold text-[#a3e635] bg-[#1a2118] border border-[#a3e635]/30 hover:border-[#a3e635] px-2 py-0.5 rounded-full transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Outlook</span>
          </button>
          <span className="text-[11px] font-bold text-[#8c94a4] tracking-widest uppercase">
            {fromCurrency} / {toCurrency}
          </span>
        </div>
      </div>

      {/* Dual Rate Columns: BUYING & SELLING */}
      <div className="grid grid-cols-2 gap-4 py-5">
        <div>
          <div className="text-[11px] font-bold text-[#646b7a] uppercase tracking-wider">
            BUYING
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {formatNumber(buyRate)}
          </div>
          <div className="text-[10px] font-semibold text-[#646b7a] uppercase tracking-widest mt-1">
            {toCurrency} PER {fromCurrency}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-[#646b7a] uppercase tracking-wider">
            SELLING
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {formatNumber(sellRate)}
          </div>
          <div className="text-[10px] font-semibold text-[#646b7a] uppercase tracking-widest mt-1">
            {toCurrency} PER {fromCurrency}
          </div>
        </div>
      </div>

      {/* Interactive Converter */}
      <div className="space-y-1 relative pt-1">
        {/* YOU SEND */}
        <div className="relative" ref={fromRef}>
          <label className="block text-[10px] font-bold text-[#646b7a] uppercase tracking-[0.16em] mb-1.5">
            YOU SEND
          </label>
          <div className="bg-[#15171d] border border-[#232731] focus-within:border-[#383e4e] rounded-xl px-4 py-3 flex items-center justify-between transition-colors">
            <input
              type="text"
              value={sendAmount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
              aria-label="You send amount"
              className="w-full bg-transparent text-white font-bold text-lg sm:text-xl outline-none placeholder-[#4b5563]"
              placeholder="1,000.00"
            />
            <button
              type="button"
              onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
              className="flex items-center space-x-2 pl-3 flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="text-base">{fromItem.flag}</span>
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                {fromCurrency}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#646b7a]" />
            </button>
          </div>

          {/* From Currency Selector Dropdown */}
          {fromDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 bg-[#14161d] border border-[#282d3b] rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-bold text-[#6b7280] px-2 py-1 uppercase">
                Select Send Currency
              </div>
              {allRates.map((c) => (
                <button
                  key={c.currency}
                  onClick={() => {
                    onChangeFromCurrency(c.currency);
                    setFromDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    c.currency === fromCurrency
                      ? 'bg-[#1e251b] text-white font-bold'
                      : 'text-[#9ca3af] hover:bg-[#1a1d26] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{c.flag}</span>
                    <span>{c.currency}</span>
                    <span className="text-[10px] text-[#6b7280]">({c.country})</span>
                  </div>
                  {c.currency === fromCurrency && <Check className="w-3 h-3 text-[#a3e635]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="relative flex justify-center z-10 -my-2.5">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap currencies"
            className="w-9 h-9 rounded-full bg-[#111216] border border-[#a3e635] text-[#a3e635] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(163,230,53,0.25)] cursor-pointer"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* YOU RECEIVE */}
        <div className="relative" ref={toRef}>
          <label className="block text-[10px] font-bold text-[#646b7a] uppercase tracking-[0.16em] mb-1.5">
            YOU RECEIVE (APPROX.)
          </label>
          <div className="bg-[#15171d] border border-[#232731] rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="w-full text-white font-bold text-lg sm:text-xl overflow-x-auto no-scrollbar py-0.5">
              {formatNumber(receiveAmount, 2, 4)}
            </div>
            <button
              type="button"
              onClick={() => setToDropdownOpen(!toDropdownOpen)}
              className="flex items-center space-x-2 pl-3 flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="text-base">{toItem.flag}</span>
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                {toCurrency}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#646b7a]" />
            </button>
          </div>

          {/* To Currency Selector Dropdown */}
          {toDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 bg-[#14161d] border border-[#282d3b] rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-bold text-[#6b7280] px-2 py-1 uppercase">
                Select Receive Currency
              </div>
              {allRates.map((c) => (
                <button
                  key={c.currency}
                  onClick={() => {
                    onChangeToCurrency(c.currency);
                    setToDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    c.currency === toCurrency
                      ? 'bg-[#1e251b] text-white font-bold'
                      : 'text-[#9ca3af] hover:bg-[#1a1d26] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{c.flag}</span>
                    <span>{c.currency}</span>
                    <span className="text-[10px] text-[#6b7280]">({c.country})</span>
                  </div>
                  {c.currency === toCurrency && <Check className="w-3 h-3 text-[#a3e635]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Mid rate & Source */}
      <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#1b1e25] text-[11px] font-semibold text-[#788091] uppercase tracking-wider">
        <div>
          MID RATE{' '}
          <span className="text-white font-bold ml-1">
            {formatNumber(rawMidRate)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span>SOURCE</span>
          <span className="text-white font-bold">{source}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] inline-block" />
        </div>
      </div>
    </div>
  );
}
