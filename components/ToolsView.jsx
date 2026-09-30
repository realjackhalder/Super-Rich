'use client';

import React, { useState } from 'react';
import ChartWidgetNext from './ChartWidgetNext';
import OrderBookNext from './OrderBookNext';
import MarketTradesNext from './MarketTradesNext';
import { Star, TrendingUp, ShieldCheck, Activity, BarChart2, ArrowUpRight } from 'lucide-react';

const availableMarkets = [
  { symbol: 'USDT/MMK', type: 'fiat', price: 4595, change: 0.35, high: 4620, low: 4560, volume: '12.4M USDT' },
  { symbol: 'BTC/USDT', type: 'crypto', price: 64250, change: 1.84, high: 64900, low: 63100, volume: '482.1M USDT' },
  { symbol: 'ETH/USDT', type: 'crypto', price: 3480, change: -0.65, high: 3540, low: 3420, volume: '210.5M USDT' },
  { symbol: 'SOL/USDT', type: 'crypto', price: 148.5, change: 3.20, high: 152.0, low: 142.3, volume: '95.2M USDT' },
  { symbol: 'GOLD/USDT', type: 'commodity', price: 2385, change: 0.42, high: 2398, low: 2370, volume: '18.9M USDT' },
  { symbol: 'OIL/USDT', type: 'commodity', price: 82.4, change: -1.15, high: 84.1, low: 81.8, volume: '34.6M USDT' },
  { symbol: 'THB/MMK', type: 'fiat', price: 126.6, change: 0.18, high: 127.4, low: 125.8, volume: '45.8M THB' },
  { symbol: 'EUR/MMK', type: 'fiat', price: 4965, change: 0.22, high: 5000, low: 4930, volume: '8.2M EUR' },
];

export default function ToolsView() {
  const [selectedMarket, setSelectedMarket] = useState('USDT/MMK');
  const [chartInterval, setChartInterval] = useState('1m');
  const [marketTab, setMarketTab] = useState('All');
  const [favorites, setFavorites] = useState(['USDT/MMK', 'BTC/USDT', 'GOLD/USDT']);

  const currentMarket = availableMarkets.find((m) => m.symbol === selectedMarket) || availableMarkets[0];

  const toggleFavorite = (sym, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const filteredMarkets = availableMarkets.filter((m) => {
    if (marketTab === 'All') return true;
    if (marketTab === 'favorites') return favorites.includes(m.symbol);
    return m.type === marketTab;
  });

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-black/10">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block mb-2">
          [ MODULE 03 &bull; MARKET INFRASTRUCTURE ]
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#141413]">
          Professional Trading Terminal &amp; Depth
        </h1>
        <p className="mt-2 text-sm text-[#63625D] max-w-2xl leading-relaxed">
          Sub-second orderbook telemetry, live transaction tape, and TradingView charting for parallel foreign exchange, crypto, and sovereign commodity pairs.
        </p>
      </div>

      {/* NDS Ticker Bar */}
      <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* Pair Chooser */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider">
              Target Market
            </span>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              aria-label="Select market pair"
              className="bg-[#F2EFE9] border border-black/10 text-[#141413] font-serif text-xl rounded-lg px-3 py-1 outline-none mt-1 font-medium cursor-pointer"
            >
              {availableMarkets.map((m) => (
                <option key={m.symbol} value={m.symbol}>
                  {m.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="h-10 w-[1px] bg-black/10 hidden sm:block" />

          {/* Live Price */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider">
              Clearing Price
            </span>
            <span className="text-xl sm:text-2xl font-serif text-[#141413] font-mono-num mt-0.5">
              {currentMarket.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* 24h Delta */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8C8A84] uppercase tracking-wider">
              24h Delta
            </span>
            <span
              className={`text-sm sm:text-base font-mono font-semibold mt-1 ${
                currentMarket.change >= 0 ? 'text-[#1B6B38]' : 'text-[#A82828]'
              }`}
            >
              {currentMarket.change >= 0 ? `+${currentMarket.change}%` : `${currentMarket.change}%`}
            </span>
          </div>
        </div>

        {/* High / Low / Volume */}
        <div className="flex items-center space-x-6 font-mono text-xs text-[#63625D]">
          <div className="flex flex-col">
            <span className="text-[#8C8A84] uppercase text-[10px]">24h High</span>
            <span className="text-[#141413] font-mono-num font-medium">{currentMarket.high.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#8C8A84] uppercase text-[10px]">24h Low</span>
            <span className="text-[#141413] font-mono-num font-medium">{currentMarket.low.toLocaleString()}</span>
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="text-[#8C8A84] uppercase text-[10px]">24h Volume</span>
            <span className="text-[#141413] font-mono-num font-medium">{currentMarket.volume}</span>
          </div>
        </div>
      </div>

      {/* Main Trading View: Chart (Center/Left) + Order Book & Trades (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pro Chart (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm bg-[#141413]">
            <ChartWidgetNext
              symbol={selectedMarket}
              interval={chartInterval}
              onIntervalChange={setChartInterval}
              currentPrice={currentMarket.price}
            />
          </div>

          {/* Markets Directory Table */}
          <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-black/10">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#141413]" />
                <h3 className="font-serif text-xl text-[#141413]">
                  Monitored Liquidity Pools
                </h3>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center space-x-1.5 bg-[#F2EFE9] p-1 rounded-full text-xs font-mono">
                {[
                  { id: 'All', label: 'All' },
                  { id: 'fiat', label: 'Fiat' },
                  { id: 'crypto', label: 'Crypto' },
                  { id: 'commodity', label: 'Commodities' },
                  { id: 'favorites', label: 'Starred' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMarketTab(t.id)}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      marketTab === t.id
                        ? 'bg-[#141413] text-[#FAF9F5]'
                        : 'text-[#63625D] hover:text-[#141413]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-black/10 text-[10px] text-[#8C8A84] uppercase tracking-wider">
                    <th className="pb-2.5 font-normal">Pair</th>
                    <th className="pb-2.5 font-normal text-right">Price</th>
                    <th className="pb-2.5 font-normal text-right">24h Change</th>
                    <th className="pb-2.5 font-normal text-right hidden sm:table-cell">24h High / Low</th>
                    <th className="pb-2.5 font-normal text-right">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {filteredMarkets.map((m) => {
                    const isSelected = selectedMarket === m.symbol;
                    const isFav = favorites.includes(m.symbol);
                    return (
                      <tr
                        key={m.symbol}
                        onClick={() => setSelectedMarket(m.symbol)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-black/[0.04]' : 'hover:bg-black/[0.02]'
                        }`}
                      >
                        <td className="py-3 font-semibold text-[#141413]">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => toggleFavorite(m.symbol, e)}
                              className="text-[#8C8A84] hover:text-[#141413]"
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#141413] text-[#141413]' : ''}`} />
                            </button>
                            <span className="font-serif text-base">{m.symbol}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right font-mono-num font-medium text-[#141413]">
                          {m.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`font-semibold ${
                              m.change >= 0 ? 'text-[#1B6B38]' : 'text-[#A82828]'
                            }`}
                          >
                            {m.change >= 0 ? `+${m.change}%` : `${m.change}%`}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[#8C8A84] font-mono-num hidden sm:table-cell">
                          {m.high.toLocaleString()} / {m.low.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-[#63625D] font-mono-num">
                          {m.volume}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Order Book & Trades (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm bg-[#141413] text-white">
            <OrderBookNext
              currentPrice={currentMarket.price}
              symbol={selectedMarket}
            />
          </div>

          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm bg-[#141413] text-white">
            <MarketTradesNext
              currentPrice={currentMarket.price}
              symbol={selectedMarket}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
