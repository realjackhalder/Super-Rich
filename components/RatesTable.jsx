'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
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
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState('volume'); // 'volume', 'country', 'mid', 'change'
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

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

  const categoryCurrencies = {
    'G10': ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD'],
    'ASEAN': ['THB', 'SGD', 'MYR', 'VND', 'MMK'],
    'Asia': ['CNY', 'JPY', 'KRW', 'INR', 'TWD', 'SGD', 'THB']
  };

  // Compute table rows against the selected base currency
  let tableRows = rates
    .filter((r) => r.currency !== baseCurrency)
    .filter((r) => {
      const matchSearch =
        r.country.toLowerCase().includes(filterQuery.toLowerCase()) ||
        r.currency.toLowerCase().includes(filterQuery.toLowerCase());
      if (!matchSearch) return false;
      if (categoryFilter === 'All') return true;
      return categoryCurrencies[categoryFilter]?.includes(r.currency);
    })
    .map((row) => {
      const mid = (row.mid || 1) / (baseItem.mid || 1);
      const buy = mid * 0.9945;
      const sell = mid * 1.0055;
      const spread = sell - buy;
      const spreadPct = (spread / mid) * 100;
      const isPositive = row.change24h >= 0;

      // Adjust sparkline points relative to the base currency
      const sparkline = (row.sparkline || []).map((val) => val / (baseItem.mid || 1));

      return {
        ...row,
        buy,
        sell,
        mid,
        spread,
        spreadPct,
        isPositive,
        sparkline
      };
    });

  // Sorting
  tableRows.sort((a, b) => {
    let factor = sortAsc ? 1 : -1;
    if (sortField === 'country') return a.country.localeCompare(b.country) * factor;
    if (sortField === 'mid') return (a.mid - b.mid) * factor;
    if (sortField === 'change') return (a.change24h - b.change24h) * factor;
    return 0; // Default order
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const displayedRates = showAll ? tableRows : tableRows.slice(0, 8);

  return (
    <section id="rates-section" className="w-full py-16 md:py-24 border-b border-black/10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block mb-2">
            [ SECTION 03 • SOVEREIGN EXCHANGE BOARD ]
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
            Verified Exchange Rates vs. {baseCurrency}
          </h2>
          <p className="text-sm text-[#63625D] mt-1">
            Real-time interbank reference and open-market parallel settlement figures.
          </p>
        </div>

        {/* Controls: Base Switcher & Filter Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8C8A84] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter currency..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-[#FFFFFF] border border-black/15 text-[#141413] text-xs rounded-full pl-8 pr-3 py-1.5 outline-none font-mono focus:border-black transition-colors"
            />
          </div>

          {/* Base Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setBaseMenuOpen(!baseMenuOpen)}
              className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-mono rounded-full border border-black/15 bg-[#FFFFFF] text-[#141413] hover:border-black/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>{baseItem.flag}</span>
              <span className="font-semibold">Base: {baseCurrency}</span>
              <ChevronDown className="w-3 h-3 text-[#63625D]" />
            </button>

            {baseMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-[#FFFFFF] border border-black/15 rounded-xl shadow-2xl z-40 p-1.5 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-mono text-[#8C8A84] px-2 py-1 uppercase">
                  Select Base Currency:
                </div>
                {rates.map((c) => (
                  <button
                    key={c.currency}
                    onClick={() => {
                      onSelectBaseCurrency(c.currency);
                      setBaseMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono cursor-pointer ${
                      baseCurrency === c.currency ? 'bg-[#141413] text-[#FAF9F5]' : 'hover:bg-black/5 text-[#141413]'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{c.flag}</span>
                      <span>{c.currency}</span>
                    </span>
                    <span className="text-[10px] text-[#8C8A84]">{c.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Preset Pills */}
      <div className="mt-6 flex items-center space-x-2 font-mono text-xs overflow-x-auto no-scrollbar pb-1">
        <span className="text-[10px] uppercase text-[#8C8A84] mr-1">Filter Group:</span>
        {['All', 'G10', 'ASEAN', 'Asia'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#141413] text-[#FAF9F5] font-semibold'
                : 'bg-[#F2EFE9] text-[#63625D] hover:bg-black/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table (NDS Editorial Style) */}
      <div className="mt-6 overflow-x-auto no-scrollbar bg-[#FFFFFF] rounded-2xl border border-black/10 p-4 sm:p-6 shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/15 text-[11px] font-mono uppercase tracking-wider text-[#8C8A84]">
              <th
                onClick={() => handleSort('country')}
                className="py-3 px-3 font-normal cursor-pointer hover:text-[#141413]"
              >
                <div className="flex items-center space-x-1">
                  <span>Currency / Sovereign</span>
                  {sortField === 'country' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-3 font-normal text-right">Buy Rate ({baseCurrency})</th>
              <th className="py-3 px-3 font-normal text-right">Sell Rate ({baseCurrency})</th>
              <th
                onClick={() => handleSort('mid')}
                className="py-3 px-3 font-normal text-right cursor-pointer hover:text-[#141413]"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Mid Rate</span>
                  {sortField === 'mid' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('change')}
                className="py-3 px-3 font-normal text-right cursor-pointer hover:text-[#141413]"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>24h Net</span>
                  {sortField === 'change' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-3 font-normal text-right hidden sm:table-cell">Trend (7d)</th>
              <th className="py-3 px-3 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.08] text-sm">
            {displayedRates.map((row) => {
              const isSelected = row.currency === selectedCurrency;
              const isExpanded = expandedRow === row.currency;

              return (
                <React.Fragment key={row.currency}>
                  <tr
                    onClick={() => {
                      onSelectCurrency(row.currency);
                      setExpandedRow(isExpanded ? null : row.currency);
                    }}
                    className={`cursor-pointer transition-colors group ${
                      isSelected ? 'bg-[#141413]/[0.03]' : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    {/* Currency Name & Flag */}
                    <td className="py-4 px-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{row.flag}</span>
                        <div>
                          <div className="font-serif text-lg sm:text-xl text-[#141413] group-hover:underline underline-offset-4 decoration-black/30">
                            {row.country}
                          </div>
                          <div className="font-mono text-xs text-[#8C8A84]">
                            {row.currency}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Buy Rate */}
                    <td className="py-4 px-3 text-right font-mono text-sm sm:text-base font-normal text-[#141413] font-mono-num">
                      {formatValue(row.buy)}
                    </td>

                    {/* Sell Rate */}
                    <td className="py-4 px-3 text-right font-mono text-sm sm:text-base font-normal text-[#141413] font-mono-num">
                      {formatValue(row.sell)}
                    </td>

                    {/* Mid Rate */}
                    <td className="py-4 px-3 text-right font-mono text-sm sm:text-base font-bold text-[#141413] font-mono-num">
                      {formatValue(row.mid)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-4 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${
                          row.isPositive
                            ? 'bg-[#1B6B38]/10 text-[#1B6B38]'
                            : 'bg-[#A82828]/10 text-[#A82828]'
                        }`}
                      >
                        {row.isPositive ? '+' : ''}{row.change24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* Sparkline Trend */}
                    <td className="py-4 px-3 text-right hidden sm:table-cell">
                      <div className="flex justify-end">
                        <Sparkline data={row.sparkline} isPositive={row.isPositive} width={70} height={20} />
                      </div>
                    </td>

                    {/* Convert CTA */}
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCurrency(row.currency);
                          const convEl = document.getElementById('converter-section');
                          if (convEl) convEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-mono text-[#63625D] hover:text-[#141413] border border-black/10 hover:border-black/30 rounded-full px-3 py-1 transition-colors cursor-pointer"
                      >
                        <span>Convert</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row Breakdown */}
                  {isExpanded && (
                    <tr className="bg-[#FAF9F5]/70 animate-in fade-in">
                      <td colSpan={7} className="px-6 py-4 font-mono text-xs text-[#63625D] border-b border-black/10">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <span className="text-[#8C8A84] text-[10px] uppercase block">Spread Margin</span>
                            <span className="font-semibold text-[#141413] font-mono-num">
                              {formatValue(row.spread)} {baseCurrency} ({row.spreadPct.toFixed(2)}%)
                            </span>
                          </div>
                          <div>
                            <span className="text-[#8C8A84] text-[10px] uppercase block">Reciprocal Rate</span>
                            <span className="font-semibold text-[#141413] font-mono-num">
                              1 {baseCurrency} = {(1 / (row.mid || 1)).toFixed(5)} {row.currency}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#8C8A84] text-[10px] uppercase block">Market Status</span>
                            <span className="font-semibold text-[#1B6B38]">
                              Verified Liquid
                            </span>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => {
                                onSelectCurrency(row.currency);
                                const convEl = document.getElementById('converter-section');
                                if (convEl) convEl.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="text-xs text-[#141413] underline font-semibold hover:opacity-70"
                            >
                              Open in Calculator →
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show all toggle */}
      {tableRows.length > 8 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 rounded-full border border-black/15 bg-white text-xs font-mono uppercase tracking-wider text-[#141413] hover:bg-black/5 transition-colors cursor-pointer shadow-xs"
          >
            {showAll ? 'Show Fewer Currencies' : `View All (${tableRows.length}) Currencies`}
          </button>
        </div>
      )}
    </section>
  );
}
