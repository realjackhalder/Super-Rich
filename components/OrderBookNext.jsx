'use client';

import React, { useState, useEffect } from 'react';

export default function OrderBookNext({ currentPrice = 4595, symbol = 'USDT/MMK' }) {
  const [viewMode, setViewMode] = useState('all'); // 'all', 'bids', 'asks'
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    const base = currentPrice || 4595;
    const generateOrders = () => {
      const newAsks = Array.from({ length: 14 }).map((_, i) => {
        const price = base * (1 + (i + 1) * 0.0008);
        const amount = Math.floor(Math.random() * 4500 + 500);
        return {
          price: price.toFixed(2),
          amount: amount.toLocaleString(),
          total: (amount * price).toLocaleString(undefined, { maximumFractionDigits: 0 }),
          rawTotal: amount * price
        };
      }).reverse();

      const newBids = Array.from({ length: 14 }).map((_, i) => {
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

  const maxTotal = 30000000;

  return (
    <div className="flex flex-col bg-[#0f1115] border border-[#1e222b] rounded-2xl w-full h-[450px] overflow-hidden text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1b1e26] bg-[#12141a]">
        <h3 className="text-white font-bold tracking-wide">Order Book Depth</h3>
        <div className="flex space-x-1.5 text-[11px] font-semibold">
          {['all', 'bids', 'asks'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2 py-0.5 rounded-md uppercase transition-colors ${
                viewMode === mode
                  ? 'bg-[#a3e635] text-black font-bold'
                  : 'text-[#8b94a5] hover:text-white bg-[#181b22]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3">
        {/* Table Header */}
        <div className="flex justify-between text-[10px] font-bold text-[#686f7e] uppercase tracking-wider px-2 pb-2">
          <div className="w-1/3 text-left">Price</div>
          <div className="w-1/3 text-right">Amount</div>
          <div className="w-1/3 text-right">Total</div>
        </div>

        {/* Asks (Sell Orders - Red) */}
        {(viewMode === 'all' || viewMode === 'asks') && (
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-end space-y-0.5">
            {asks.slice(viewMode === 'all' ? 6 : 0).map((ask, i) => (
              <div
                key={`ask-${i}`}
                className="flex justify-between text-[11px] px-2 py-1 hover:bg-[#1a1d26] cursor-pointer relative group rounded"
              >
                <div
                  className="absolute right-0 top-0 h-full bg-[#ef4444]/15 rounded transition-all pointer-events-none"
                  style={{ width: `${Math.min(100, (ask.rawTotal / maxTotal) * 100)}%` }}
                />
                <div className="w-1/3 text-left text-[#ef4444] font-semibold z-10">{ask.price}</div>
                <div className="w-1/3 text-right text-white z-10">{ask.amount}</div>
                <div className="w-1/3 text-right text-[#8b94a5] z-10">{ask.total}</div>
              </div>
            ))}
          </div>
        )}

        {/* Current Mid Price Display */}
        <div className="flex items-center justify-between py-2 px-3 my-1.5 bg-[#14171f] border border-[#202531] rounded-lg">
          <span className="text-base font-extrabold text-[#a3e635] tracking-tight">
            {Number(currentPrice || 4595).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-[#8b94a5] uppercase font-bold tracking-wider">
            {symbol} &bull; Live Spread
          </span>
        </div>

        {/* Bids (Buy Orders - Green) */}
        {(viewMode === 'all' || viewMode === 'bids') && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5">
            {bids.slice(0, viewMode === 'all' ? 8 : 14).map((bid, i) => (
              <div
                key={`bid-${i}`}
                className="flex justify-between text-[11px] px-2 py-1 hover:bg-[#1a1d26] cursor-pointer relative group rounded"
              >
                <div
                  className="absolute right-0 top-0 h-full bg-[#a3e635]/15 rounded transition-all pointer-events-none"
                  style={{ width: `${Math.min(100, (bid.rawTotal / maxTotal) * 100)}%` }}
                />
                <div className="w-1/3 text-left text-[#a3e635] font-semibold z-10">{bid.price}</div>
                <div className="w-1/3 text-right text-white z-10">{bid.amount}</div>
                <div className="w-1/3 text-right text-[#8b94a5] z-10">{bid.total}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
