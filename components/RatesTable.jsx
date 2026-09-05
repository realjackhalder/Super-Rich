'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import Sparkline from './Sparkline';

export default function RatesTable({
  rates = [],
  baseCurrency = 'MMK',
  onSelectBaseCurrency,
  selectedCurrency = 'USD',
  onSelectCurrency
}) {
  const [showAll, setShowAll] = useState(false);
  const [baseMenuOpen, setBaseMenuOpen] = useState(false);

  const baseItem = rates.find((r) => r.currency === baseCurrency) || {
    country: 'Myanmar',
    currency: 'MMK',
    flag: '🇲🇲',
    mid: 1
  };

  const formatValue = (num) => {
    if (isNaN(num)) return '0.00';
    if (num < 0.01) {
      return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 5
      });
    }
    if (num < 10) {
      return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3
      });
    }
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Compute table rows against the selected base currency
  const tableRows = rates
    .filter((r) => r.currency !== baseCurrency)
    .map((row) => {
      const mid = (row.mid || 1) / (baseItem.mid || 1);
      const buy = mid * 0.9945;
      const sell = mid * 1.0055;
      const isPositive = row.change24h >= 0;

      // Adjust sparkline points relative to the base currency
      const sparkline = (row.sparkline || []).map((val) => val / (baseItem.mid || 1));

      return {
        ...row,
        buy,
        sell,
        mid,
        isPositive,
        sparkline
      };
    });

  const displayedRates = showAll ? tableRows : tableRows.slice(0, 6);

  return (
    <div className="w-full mt-10 lg:mt-14 pt-6 pb-16">
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-3">
          <h2 className="text-white font-extrabold text-sm sm:text-base tracking-[0.14em] uppercase">
            LIVE RATES VS {baseCurrency}
          </h2>

          {/* Inline Base Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setBaseMenuOpen(!baseMenuOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-[#262b36] bg-[#121419] text-[#a3e635] hover:border-[#a3e635]/40 transition-colors"
            >
              <span>{baseItem.flag}</span>
              <span>{baseCurrency}</span>
              <ChevronDown className="w-3 h-3 text-[#788091]" />
            </button>

            {baseMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-48 bg-[#14161d] border border-[#282d3b] rounded-xl shadow-2xl z-40 p-1.5 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-bold text-[#6b7280] px-2 py-1 uppercase">
                  Compare VS Currency:
                </div>
                {rates.map((c) => (
                  <button
                    key={c.currency}
                    onClick={() => {
                      onSelectBaseCurrency(c.currency);
                      setBaseMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      c.currency === baseCurrency
                        ? 'bg-[#1b2218] text-white font-bold'
                        : 'text-[#9ca3af] hover:bg-[#1a1d26] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{c.flag}</span>
                      <span>{c.currency}</span>
                      <span className="text-[10px] text-[#6b7280]">({c.country})</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center space-x-1.5 text-xs font-bold text-[#a3e635] hover:opacity-85 transition-opacity tracking-wider uppercase group cursor-pointer self-start sm:self-auto"
        >
          <span>{showAll ? 'SHOW LESS' : 'VIEW ALL COUNTRIES'}</span>
          {showAll ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>

      {/* Table Structure */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[#1b1e26] text-[10.5px] font-bold text-[#5c6475] uppercase tracking-[0.14em]">
              <th className="py-3 px-2 font-bold">COUNTRY</th>
              <th className="py-3 px-2 font-bold">CURRENCY</th>
              <th className="py-3 px-2 font-bold">BUYING ({baseCurrency})</th>
              <th className="py-3 px-2 font-bold">SELLING ({baseCurrency})</th>
              <th className="py-3 px-2 font-bold">MID RATE</th>
              <th className="py-3 px-2 font-bold text-right pr-6">CHANGE (24H)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#15171f] text-xs">
            {displayedRates.map((row) => {
              const isSelected = row.currency === selectedCurrency;

              return (
                <tr
                  key={row.currency}
                  onClick={() => onSelectCurrency(row.currency)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#141818]/60 hover:bg-[#161d18]'
                      : 'hover:bg-[#111317]'
                  }`}
                >
                  {/* Country */}
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-[#1c1f28] flex-shrink-0 shadow-sm">
                        <span className="text-base">{row.flag}</span>
                      </div>
                      <span className="font-semibold text-white tracking-wide text-xs">
                        {row.country}
                      </span>
                    </div>
                  </td>

                  {/* Currency */}
                  <td className="py-4 px-2">
                    <span className="font-semibold text-[#8b949e] tracking-wider text-xs uppercase">
                      {row.currency}
                    </span>
                  </td>

                  {/* Buying */}
                  <td className="py-4 px-2 font-semibold text-white tracking-tight">
                    {formatValue(row.buy)}
                  </td>

                  {/* Selling */}
                  <td className="py-4 px-2 font-semibold text-white tracking-tight">
                    {formatValue(row.sell)}
                  </td>

                  {/* Mid Rate */}
                  <td className="py-4 px-2 font-semibold text-[#a0a8b9] tracking-tight">
                    {formatValue(row.mid)}
                  </td>

                  {/* Change (24H) & Sparkline */}
                  <td className="py-4 px-2 pr-6">
                    <div className="flex items-center justify-end space-x-4">
                      <span
                        className={`font-semibold tracking-wide text-xs ${
                          row.isPositive ? 'text-[#a3e635]' : 'text-[#ff3b69]'
                        }`}
                      >
                        {row.isPositive ? `+${row.change24h.toFixed(2)}%` : `${row.change24h.toFixed(2)}%`}
                      </span>

                      <div className="w-[80px] flex justify-end">
                        <Sparkline
                          data={row.sparkline}
                          isPositive={row.isPositive}
                          width={75}
                          height={22}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
