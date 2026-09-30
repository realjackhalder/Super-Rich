'use client';

import React, { useState, useEffect } from 'react';

export default function MarketTradesNext({ currentPrice = 4595, symbol = 'USDT/MMK' }) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const base = currentPrice || 4595;
    const initialTrades = Array.from({ length: 15 }).map((_, i) => ({
      price: base + (Math.random() - 0.48) * (base * 0.003),
      amount: Math.floor(Math.random() * 5000 + 100),
      time: new Date(Date.now() - i * 4000),
      isBuyer: Math.random() > 0.45,
    }));
    setTrades(initialTrades);

    const interval = setInterval(() => {
      const newTrade = {
        price: base + (Math.random() - 0.48) * (base * 0.003),
        amount: Math.floor(Math.random() * 5000 + 100),
        time: new Date(),
        isBuyer: Math.random() > 0.45,
      };
      setTrades((prev) => [newTrade, ...prev].slice(0, 30));
    }, 2500);

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="flex flex-col h-[450px] bg-[#141413] border border-white/10 rounded-2xl text-xs overflow-hidden shadow-xl font-mono text-[#FAF9F5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1A1A19]">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[#FAF9F5]">Live Market Trades</span>
          <span className="text-[10px] text-[#8C8A84]">({symbol})</span>
        </div>
        <span className="text-[10px] text-[#4ADE80] font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping" />
          Sub-second Stream
        </span>
      </div>

      {/* Table Headers */}
      <div className="flex justify-between px-4 py-2 text-[10px] font-mono text-[#8C8A84] uppercase border-b border-white/5">
        <span className="w-1/3">Price</span>
        <span className="w-1/3 text-right">Amount</span>
        <span className="w-1/3 text-right">Time</span>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        {trades.map((trade, index) => {
          const timeString = trade.time.toLocaleTimeString([], {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          return (
            <div
              key={index}
              className="flex justify-between items-center px-2 py-1 text-[11px] rounded hover:bg-white/5 font-mono-num transition-colors"
            >
              <span className={`w-1/3 font-semibold ${trade.isBuyer ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="w-1/3 text-right text-[#FAF9F5]/90">
                {trade.amount.toLocaleString()}
              </span>
              <span className="w-1/3 text-right text-[#8C8A84] text-[10px]">
                {timeString}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
