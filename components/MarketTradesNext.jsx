'use client';

import React, { useState, useEffect } from 'react';

export default function MarketTradesNext({ currentPrice = 4595 }) {
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
    <div className="flex flex-col h-[450px] bg-[#0f1115] border border-[#1e222b] rounded-2xl text-xs overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1b1e26] bg-[#12141a]">
        <h3 className="text-white font-bold tracking-wide">Live Market Trades</h3>
        <span className="text-[10px] text-[#a3e635] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-ping" />
          Streaming
        </span>
      </div>

      {/* Table Headers */}
      <div className="flex justify-between px-4 py-2 text-[10px] font-bold text-[#686f7e] uppercase tracking-wider border-b border-[#181b22]">
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
              className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-[#181b24] transition-colors"
            >
              <span
                className={`w-1/3 font-semibold ${
                  trade.isBuyer ? 'text-[#a3e635]' : 'text-[#ef4444]'
                }`}
              >
                {trade.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="w-1/3 text-right text-white font-medium">
                {trade.amount.toLocaleString()}
              </span>
              <span className="w-1/3 text-right text-[#686f7e] font-mono">
                {timeString}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
