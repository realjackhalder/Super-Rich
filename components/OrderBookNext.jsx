'use client';

import React, { useState, useEffect } from 'react';

export default function OrderBookNext({ currentPrice = 4595, symbol = 'USDT/MMK' }) {
  const [viewMode, setViewMode] = useState('all');
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    const base = currentPrice || 4595;
    const generateOrders = () => {
      const newAsks = Array.from({ length: 12 }).map((_, i) => {
        const price = base * (1 + (i + 1) * 0.0008);
        const amount = Math.floor(Math.random() * 4500 + 500);
        return {
          price: price.toFixed(2),
          amount: amount.toLocaleString(),
          total: (amount * price).toLocaleString(undefined, { maximumFractionDigits: 0 }),
          rawTotal: amount * price
        };
      }).reverse();

      const newBids = Array.from({ length: 12 }).map((_, i) => {
        const price = base * (1 - (i + 1) * 0.0008);
        const amount = Math.floor(Math.random() * 4500 + 500);
        return {
          price: price.toFixed(2),
          amount: amount.toLocaleString(),
          total: (amount * price).toLocaleString(undefined, { maximumFractionDigits: 0 }),
          rawTotal: amount * price
        };
      });

      setAsks(newAsks);
      setBids(newBids);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 3500);
    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="flex flex-col bg-[#141413] border border-white/10 rounded-2xl w-full h-[450px] overflow-hidden text-xs shadow-xl font-mono text-[#FAF9F5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1A1A19]">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[#FAF9F5]">Order Book Depth</span>
          <span className="text-[10px] text-[#8C8A84] font-mono">({symbol})</span>
        </div>
        <div className="flex space-x-1 text-[10px]">
          {['all', 'bids', 'asks'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2 py-0.5 rounded uppercase transition-colors cursor-pointer ${
                viewMode === mode
                  ? 'bg-[#FAF9F5] text-[#141413] font-bold'
                  : 'text-[#8C8A84] hover:text-[#FAF9F5] bg-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Table Headers */}
      <div className="flex justify-between px-4 py-2 text-[10px] font-mono text-[#8C8A84] uppercase border-b border-white/5">
        <span className="w-1/3">Price</span>
        <span className="w-1/3 text-right">Amount</span>
        <span className="w-1/3 text-right">Total Value</span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        {/* Asks (Sell Orders - Red) */}
        {(viewMode === 'all' || viewMode === 'asks') &&
          asks.slice(viewMode === 'all' ? 6 : 0).map((ask, idx) => (
            <div
              key={`ask-${idx}`}
              className="relative flex justify-between items-center px-2 py-1 text-[11px] rounded hover:bg-white/5 font-mono-num"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-[#F87171]/15 rounded"
                style={{ width: `${Math.min(100, (ask.rawTotal / 25000000) * 100)}%` }}
              />
              <span className="w-1/3 text-[#F87171] font-medium relative z-10">{ask.price}</span>
              <span className="w-1/3 text-right text-[#FAF9F5]/90 relative z-10">{ask.amount}</span>
              <span className="w-1/3 text-right text-[#8C8A84] relative z-10">{ask.total}</span>
            </div>
          ))}

        {/* Current Mid Price Indicator */}
        <div className="my-1.5 py-1 px-3 bg-white/5 border-y border-white/10 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[#8C8A84] text-[10px] uppercase">MID:</span>
            <span className="font-bold text-sm text-[#4ADE80] font-mono-num">
              {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-[#8C8A84]">VERIFIED OTC DEPTH</span>
        </div>

        {/* Bids (Buy Orders - Green) */}
        {(viewMode === 'all' || viewMode === 'bids') &&
          bids.slice(0, viewMode === 'all' ? 6 : 12).map((bid, idx) => (
            <div
              key={`bid-${idx}`}
              className="relative flex justify-between items-center px-2 py-1 text-[11px] rounded hover:bg-white/5 font-mono-num"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-[#4ADE80]/15 rounded"
                style={{ width: `${Math.min(100, (bid.rawTotal / 25000000) * 100)}%` }}
              />
              <span className="w-1/3 text-[#4ADE80] font-medium relative z-10">{bid.price}</span>
              <span className="w-1/3 text-right text-[#FAF9F5]/90 relative z-10">{bid.amount}</span>
              <span className="w-1/3 text-right text-[#8C8A84] relative z-10">{bid.total}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
