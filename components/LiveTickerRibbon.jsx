'use client';

import React from 'react';

export default function LiveTickerRibbon({
  rates = [],
  baseCurrency = 'MMK',
  onSelectCurrency
}) {
  const tickerItems = [
    { pair: 'USD/MMK', price: '4,595.00', delta: '+0.35%', isPositive: true },
    { pair: 'THB/MMK', price: '126.60', delta: '+0.18%', isPositive: true },
    { pair: 'SGD/MMK', price: '3,445.00', delta: '-0.12%', isPositive: false },
    { pair: 'EUR/MMK', price: '4,965.00', delta: '+0.22%', isPositive: true },
    { pair: 'CNY/MMK', price: '635.00', delta: '-0.08%', isPositive: false },
    { pair: 'JPY/MMK', price: '29.85', delta: '+0.05%', isPositive: true },
    { pair: 'GBP/MMK', price: '5,855.00', delta: '+0.15%', isPositive: true },
    { pair: 'AED/MMK', price: '1,250.00', delta: '+0.05%', isPositive: true },
    { pair: 'GOLD/MMK', price: '6,240,000/tcl', delta: '+0.42%', isPositive: true },
    { pair: 'BTC/USDT', price: '$64,250.00', delta: '+1.84%', isPositive: true },
    { pair: 'USDT/MMK', price: '4,592.50', delta: '+0.28%', isPositive: true },
    { pair: 'AUD/MMK', price: '3,002.50', delta: '+0.28%', isPositive: true },
  ];

  // Duplicate for seamless infinite loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-[#141413] text-[#FAF9F5] border-b border-black/20 overflow-hidden py-1.5 select-none text-[11px] font-mono">
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              const code = item.pair.split('/')[0];
              if (onSelectCurrency && code) onSelectCurrency(code);
            }}
            className="flex items-center space-x-2.5 px-5 cursor-pointer hover:bg-white/10 transition-colors py-0.5"
          >
            <span className="text-[#8C8A84] font-medium">{item.pair}</span>
            <span className="font-semibold font-mono-num">{item.price}</span>
            <span
              className={`text-[10px] px-1 rounded ${
                item.isPositive ? 'text-[#4ADE80] bg-[#4ADE80]/10' : 'text-[#F87171] bg-[#F87171]/10'
              }`}
            >
              {item.delta}
            </span>
            <span className="text-[#8C8A84]/40 pl-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
