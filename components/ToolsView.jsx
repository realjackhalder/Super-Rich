'use client';

import React, { useState } from 'react';
import ChartWidgetNext from './ChartWidgetNext';
import OrderBookNext from './OrderBookNext';
import MarketTradesNext from './MarketTradesNext';
import { Star, TrendingUp, ShieldCheck, Activity, BarChart2 } from 'lucide-react';

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
  const [marketTab, setMarketTab] = useState('All'); // 'All', 'crypto', 'commodity', 'fiat', 'favorites'
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
    <div className="w-full space-y-6 pb-16">
      {/* Ticker Bar */}
      <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs text-[#717684] uppercase font-bold tracking-wider">
              Market Pair
            </span>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              aria-label="Select market pair"
              className="bg-[#181a22] border border-[#272c3a] text-white font-black text-lg sm:text-xl rounded-xl px-3 py-1 outline-none mt-1"
            >
              {availableMarkets.map((m) => (
                <option key={m.symbol} value={m.symbol}>
                  {m.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="h-10 w-[1px] bg-[#1e222b] hidden sm:block" />

          <div className="flex flex-col">
            <span className="text-xs text-[#717684] uppercase font-bold tracking-wider">
              Live Price
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {currentMarket.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-[#717684] uppercase font-bold tracking-wider">
              24h Change
            </span>
            <span
              className={`text-sm sm:text-base font-bold mt-1 ${
                currentMarket.change >= 0 ? 'text-[#a3e635]' : 'text-[#ef4444]'
              }`}
            >
              {currentMarket.change >= 0 ? `+${currentMarket.change}%` : `${currentMarket.change}%`}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-[#8b94a5]">
          <div className="flex flex-col">
            <span className="text-[#646b7a] uppercase font-bold text-[10px]">24h High</span>
            <span className="text-white font-semibold">{currentMarket.high.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#646b7a] uppercase font-bold text-[10px]">24h Low</span>
            <span className="text-white font-semibold">{currentMarket.low.toLocaleString()}</span>
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="text-[#646b7a] uppercase font-bold text-[10px]">24h Volume</span>
            <span className="text-white font-semibold">{currentMarket.volume}</span>
          </div>
        </div>
      </div>

      {/* Main Trading View: Chart (Center/Left) + Order Book & Trades (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pro Chart (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <ChartWidgetNext
            symbol={selectedMarket}
            interval={chartInterval}
            onIntervalChange={setChartInterval}
            currentPrice={currentMarket.price}
          />

          {/* Markets Directory Table */}
          <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#a3e635]" />
                <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                  Markets Directory
                </h3>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center space-x-1.5 bg-[#171922] p-1 rounded-xl border border-[#232734] text-xs">
                {[
                  { id: 'All', label: 'All Markets' },
                  { id: 'fiat', label: 'Fiat & Rates' },
                  { id: 'crypto', label: 'Crypto Spot' },
                  { id: 'commodity', label: 'Commodities' },
                  { id: 'favorites', label: 'Favorites' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMarketTab(t.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      marketTab === t.id
                        ? 'bg-[#a3e635] text-black font-bold'
                        : 'text-[#8b94a5] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1c202a] text-[10px] font-bold text-[#686f7e] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Pair</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">24h Change</th>
                    <th className="py-2.5 px-3">24h High/Low</th>
                    <th className="py-2.5 px-3 text-right">Trade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161922]">
                  {filteredMarkets.map((m) => (
                    <tr
                      key={m.symbol}
                      onClick={() => setSelectedMarket(m.symbol)}
                      className={`hover:bg-[#151821] cursor-pointer transition-colors ${
                        m.symbol === selectedMarket ? 'bg-[#181d19]' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => toggleFavorite(m.symbol, e)}
                            className="text-[#646b7a] hover:text-[#facc15]"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                favorites.includes(m.symbol) ? 'fill-[#facc15] text-[#facc15]' : ''
                              }`}
                            />
                          </button>
                          <span className="text-white font-bold tracking-wide">{m.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1c202a] text-[#8b94a5]">
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {m.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold ${
                            m.change >= 0 ? 'text-[#a3e635]' : 'text-[#ef4444]'
                          }`}
                        >
                          {m.change >= 0 ? `+${m.change}%` : `${m.change}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#8b94a5]">
                        {m.high.toLocaleString()} / {m.low.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMarket(m.symbol);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#1a2018] border border-[#a3e635]/40 text-[#a3e635] hover:bg-[#a3e635] hover:text-black transition-all"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Order Book & Live Trades (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <OrderBookNext currentPrice={currentMarket.price} symbol={selectedMarket} />
          <MarketTradesNext currentPrice={currentMarket.price} />
        </div>
      </div>
    </div>
  );
}
