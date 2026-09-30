'use client';

import React from 'react';
import { Activity, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function CurrencyVolatilityRadar({
  rates = [],
  baseCurrency = 'MMK',
  onSelectCurrency
}) {
  const baseItem = rates.find((r) => r.currency === baseCurrency) || { mid: 1 };

  // Sort gainers & losers
  const sortedByChange = [...rates]
    .filter((r) => r.currency !== baseCurrency)
    .sort((a, b) => b.change24h - a.change24h);

  const topGainers = sortedByChange.slice(0, 4);
  const topLosers = [...sortedByChange].reverse().slice(0, 4);

  return (
    <section className="py-14 border-b border-black/10">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-black/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block mb-1">
            [ TELEMETRY • VOLATILITY &amp; STRENGTH RADAR ]
          </span>
          <h3 className="font-serif text-3xl text-[#141413]">
            24h Currency Strength Map vs. {baseCurrency}
          </h3>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-[#8C8A84]">
          <span className="w-2 h-2 rounded-full bg-[#1B6B38]"></span>
          <span>REAL-TIME PARALLEL DISPATCH</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Outperforming / Stronger Currencies */}
        <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#1B6B38]" />
              <h4 className="font-serif text-xl text-[#141413]">
                Advancing Against {baseCurrency}
              </h4>
            </div>
            <span className="text-[10px] font-mono uppercase bg-[#1B6B38]/10 text-[#1B6B38] px-2 py-0.5 rounded font-semibold">
              BUY PRESSURE
            </span>
          </div>

          <div className="mt-4 divide-y divide-black/[0.08]">
            {topGainers.map((item) => {
              const rate = ((item.mid || 1) / (baseItem.mid || 1));
              return (
                <div
                  key={item.currency}
                  onClick={() => onSelectCurrency(item.currency)}
                  className="py-3 flex items-center justify-between hover:bg-black/[0.02] px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.flag}</span>
                    <div>
                      <div className="font-serif text-lg text-[#141413]">{item.country}</div>
                      <div className="font-mono text-xs text-[#8C8A84]">{item.currency}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-[#141413] font-mono-num">
                      {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="font-mono text-xs text-[#1B6B38] font-medium">
                      +{item.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Depreciating / Softer Currencies */}
        <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-[#A82828]" />
              <h4 className="font-serif text-xl text-[#141413]">
                Softening Against {baseCurrency}
              </h4>
            </div>
            <span className="text-[10px] font-mono uppercase bg-[#A82828]/10 text-[#A82828] px-2 py-0.5 rounded font-semibold">
              VALUE PULLBACK
            </span>
          </div>

          <div className="mt-4 divide-y divide-black/[0.08]">
            {topLosers.map((item) => {
              const rate = ((item.mid || 1) / (baseItem.mid || 1));
              return (
                <div
                  key={item.currency}
                  onClick={() => onSelectCurrency(item.currency)}
                  className="py-3 flex items-center justify-between hover:bg-black/[0.02] px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.flag}</span>
                    <div>
                      <div className="font-serif text-lg text-[#141413]">{item.country}</div>
                      <div className="font-mono text-xs text-[#8C8A84]">{item.currency}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-[#141413] font-mono-num">
                      {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="font-mono text-xs text-[#A82828] font-medium">
                      {item.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
