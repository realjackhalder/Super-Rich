'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ChartWidgetNext({
  symbol = 'USDT/MMK',
  interval = '1m',
  onIntervalChange,
  currentPrice = 4595
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];

  useEffect(() => {
    if (!isClient || !chartContainerRef.current) return;

    let chartInstance = null;

    // Dynamically import lightweight-charts to ensure no SSR errors
    import('lightweight-charts').then(({ createChart }) => {
      if (!chartContainerRef.current) return;

      chartInstance = createChart(chartContainerRef.current, {
        layout: {
          background: { type: 'solid', color: '#0f1115' },
          textColor: '#848E9C',
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: '#1a1d25' },
          horzLines: { color: '#1a1d25' },
        },
        crosshair: {
          mode: 1,
          vertLine: { color: '#848E9C', width: 1, style: 1 },
          horzLine: { color: '#848E9C', width: 1, style: 1 },
        },
        timeScale: {
          borderColor: '#1f232c',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#1f232c',
        },
        width: chartContainerRef.current.clientWidth,
        height: 380,
      });

      chartRef.current = chartInstance;

      const candlestickSeries = chartInstance.addCandlestickSeries({
        upColor: '#a3e635',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#a3e635',
        wickDownColor: '#ef4444',
      });
      candlestickSeriesRef.current = candlestickSeries;

      const volumeSeries = chartInstance.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      volumeSeriesRef.current = volumeSeries;

      // Generate realistic candle data around currentPrice
      const basePrice = currentPrice || 4595;
      const now = Math.floor(Date.now() / 1000);
      const stepSeconds = interval === '1m' ? 60 : interval === '5m' ? 300 : interval === '15m' ? 900 : 3600;
      const count = 60;
      const candleData = [];
      const volumeData = [];

      let runningPrice = basePrice * 0.985;
      for (let i = count; i >= 0; i--) {
        const time = now - i * stepSeconds;
        const change = (Math.random() - 0.48) * (basePrice * 0.004);
        const open = runningPrice;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
        const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);
        runningPrice = close;

        candleData.push({ time, open, high, low, close });
        volumeData.push({
          time,
          value: Math.random() * 50000 + 10000,
          color: close >= open ? 'rgba(163, 230, 53, 0.4)' : 'rgba(239, 68, 68, 0.4)'
        });
      }

      candlestickSeries.setData(candleData);
      volumeSeries.setData(volumeData);

      const handleResize = () => {
        if (chartInstance && chartContainerRef.current) {
          chartInstance.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance?.remove();
      };
    });

    return () => {
      if (chartInstance) {
        chartInstance.remove();
      }
    };
  }, [isClient, symbol, interval, currentPrice]);

  return (
    <div className="w-full flex flex-col bg-[#0f1115] border border-[#1e222b] rounded-2xl overflow-hidden shadow-xl">
      {/* Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[#1b1e26] bg-[#12141a]">
        <div className="flex items-center space-x-3">
          <span className="text-white font-bold text-sm tracking-wider">
            {symbol}
          </span>
          <span className="text-xs text-[#a3e635] font-semibold">
            TradingView
          </span>
        </div>

        {/* Time Interval Tabs */}
        <div className="flex items-center space-x-1 bg-[#181b22] p-1 rounded-lg border border-[#232734]">
          {intervals.map((int) => (
            <button
              key={int}
              onClick={() => onIntervalChange && onIntervalChange(int)}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                interval === int
                  ? 'bg-[#a3e635] text-black font-bold'
                  : 'text-[#8b94a5] hover:text-white'
              }`}
            >
              {int}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full h-[380px] relative">
        {!isClient && (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#686f7e]">
            Loading interactive chart engine...
          </div>
        )}
      </div>
    </div>
  );
}
