'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpDown, ChevronDown, Sparkles, Check, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';

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
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [copied, setCopied] = useState(false);

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
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromDropdownOpen(false);
        setFromSearch('');
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToDropdownOpen(false);
        setToSearch('');
      }
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

  const rawMidRate = (fromItem.mid || 1) / (toItem.mid || 1);
  const rawAmount = parseFloat((sendAmount || '').replace(/,/g, '')) || 0;
  const receiveAmount = rawAmount * rawMidRate;

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

  const handlePresetClick = (amount) => {
    setSendAmount(formatNumber(amount, 2, 2));
  };

  const handleSwap = () => {
    onChangeFromCurrency(toCurrency);
    onChangeToCurrency(fromCurrency);
  };

  const handleCopyResult = () => {
    const text = `${sendAmount} ${fromItem.currency} = ${formatNumber(receiveAmount)} ${toItem.currency} (Rate: 1 ${fromItem.currency} = ${formatNumber(rawMidRate, 2, 4)} ${toItem.currency})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFromRates = allRates.filter((r) =>
    r.country.toLowerCase().includes(fromSearch.toLowerCase()) ||
    r.currency.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToRates = allRates.filter((r) =>
    r.country.toLowerCase().includes(toSearch.toLowerCase()) ||
    r.currency.toLowerCase().includes(toSearch.toLowerCase())
  );

  return (
    <div id="converter-section" className="w-full bg-[#FFFFFF] border border-black/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8C8A84] block">
              PRECISION CLEARING ENGINE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#141413] mt-0.5">
              Live Rate Converter
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1B6B38] animate-pulse"></span>
            <span className="font-mono text-[11px] text-[#1B6B38] font-semibold uppercase">
              {source}
            </span>
          </div>
        </div>

        {/* Preset Amount Pills */}
        <div className="mt-4 flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono uppercase text-[#8C8A84] mr-1">Presets:</span>
          {[100, 500, 1000, 5000, 10000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handlePresetClick(amt)}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#F2EFE9] hover:bg-black/10 text-[#63625D] hover:text-[#141413] transition-colors cursor-pointer"
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Input: You Send */}
        <div className="mt-4 bg-[#FAF9F5] border border-black/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8A84] mb-1">
            <span>YOU CONVERT</span>
            <span>BASE SOURCE</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={sendAmount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
              aria-label="Conversion Amount"
              className="bg-transparent font-serif text-3xl sm:text-4xl text-[#141413] outline-none w-full font-mono-num font-normal"
            />

            {/* Currency Selector */}
            <div className="relative" ref={fromRef}>
              <button
                type="button"
                onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                className="flex items-center space-x-2 bg-[#FFFFFF] border border-black/15 hover:border-black/30 px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer shadow-xs"
              >
                <span>{fromItem.flag}</span>
                <span className="font-semibold text-[#141413]">{fromItem.currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#63625D]" />
              </button>

              {fromDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#FFFFFF] border border-black/15 rounded-xl shadow-2xl z-50 p-2 max-h-64 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                    autoFocus
                    className="w-full bg-[#FAF9F5] border border-black/10 rounded-md px-2.5 py-1 text-xs font-mono mb-1.5 outline-none"
                  />
                  {filteredFromRates.map((r) => (
                    <button
                      key={r.currency}
                      onClick={() => {
                        onChangeFromCurrency(r.currency);
                        setFromDropdownOpen(false);
                        setFromSearch('');
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-black/5 rounded-md text-xs font-mono cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{r.flag}</span>
                        <span className="font-medium text-[#141413]">{r.currency}</span>
                        <span className="text-[#8C8A84] text-[10px]">({r.country})</span>
                      </span>
                      {fromCurrency === r.currency && <Check className="w-3.5 h-3.5 text-[#141413]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swap Divider Button */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10"></div>
          </div>
          <button
            onClick={handleSwap}
            aria-label="Swap currencies"
            className="relative z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-black/15 hover:border-black/40 flex items-center justify-center text-[#141413] hover:rotate-180 transition-all shadow-xs cursor-pointer"
            title="Invert conversion"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Output: You Receive */}
        <div className="bg-[#FAF9F5] border border-black/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8A84] mb-1">
            <span>YOU RECEIVE (ESTIMATED)</span>
            <span className="text-[#1B6B38] font-semibold">0.00% SPREAD BIAS</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="font-serif text-3xl sm:text-4xl text-[#141413] font-mono-num font-normal overflow-hidden text-ellipsis whitespace-nowrap">
              {formatNumber(receiveAmount)}
            </div>

            {/* Currency Selector */}
            <div className="relative" ref={toRef}>
              <button
                type="button"
                onClick={() => setToDropdownOpen(!toDropdownOpen)}
                className="flex items-center space-x-2 bg-[#FFFFFF] border border-black/15 hover:border-black/30 px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer shadow-xs"
              >
                <span>{toItem.flag}</span>
                <span className="font-semibold text-[#141413]">{toItem.currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#63625D]" />
              </button>

              {toDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#FFFFFF] border border-black/15 rounded-xl shadow-2xl z-50 p-2 max-h-64 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                    autoFocus
                    className="w-full bg-[#FAF9F5] border border-black/10 rounded-md px-2.5 py-1 text-xs font-mono mb-1.5 outline-none"
                  />
                  {filteredToRates.map((r) => (
                    <button
                      key={r.currency}
                      onClick={() => {
                        onChangeToCurrency(r.currency);
                        setToDropdownOpen(false);
                        setToSearch('');
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-black/5 rounded-md text-xs font-mono cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{r.flag}</span>
                        <span className="font-medium text-[#141413]">{r.currency}</span>
                        <span className="text-[#8C8A84] text-[10px]">({r.country})</span>
                      </span>
                      {toCurrency === r.currency && <Check className="w-3.5 h-3.5 text-[#141413]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Result & Transparency Breakdown */}
      <div className="mt-5 pt-4 border-t border-black/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8C8A84]">Direct Rate:</span>
          <span className="font-semibold text-[#141413] font-mono-num">
            1 {fromItem.currency} = {formatNumber(rawMidRate, 2, 4)} {toItem.currency}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8C8A84]">Reciprocal Rate:</span>
          <span className="text-[#63625D] font-mono-num">
            1 {toItem.currency} = {formatNumber(1 / (rawMidRate || 1), 4, 6)} {fromItem.currency}
          </span>
        </div>

        {/* Copy Result Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleCopyResult}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-[#FAF9F5] hover:bg-black/5 text-xs font-mono text-[#141413] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1B6B38]" /> : <Copy className="w-3.5 h-3.5 text-[#63625D]" />}
            <span>{copied ? 'Calculation Copied' : 'Copy Calculation'}</span>
          </button>

          <button
            onClick={onOpenAI}
            className="text-xs font-mono text-[#141413] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#1B6B38]" />
            <span>Consult AI Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
