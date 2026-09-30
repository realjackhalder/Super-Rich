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

    import('lightweight-charts').then(({ createChart }) => {
      if (!chartContainerRef.current) return;

      chartInstance = createChart(chartContainerRef.current, {
        layout: {
          background: { type: 'solid', color: '#141413' },
          textColor: '#8C8A84',
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        crosshair: {
          mode: 1,
          vertLine: { color: 'rgba(255, 255, 255, 0.2)', width: 1, style: 1 },
          horzLine: { color: 'rgba(255, 255, 255, 0.2)', width: 1, style: 1 },
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        width: chartContainerRef.current.clientWidth,
        height: 380,
      });

      chartRef.current = chartInstance;

      const candlestickSeries = chartInstance.addCandlestickSeries({
        upColor: '#4ADE80',
        downColor: '#F87171',
        borderVisible: false,
        wickUpColor: '#4ADE80',
        wickDownColor: '#F87171',
      });
      candlestickSeriesRef.current = candlestickSeries;

      const volumeSeries = chartInstance.addHistogramSeries({
        color: 'rgba(74, 222, 128, 0.3)',
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
          color: close >= open ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'
        });
      }

      candlestickSeries.setData(candleData);
      volumeSeries.setData(volumeData);
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [isClient, symbol, interval, currentPrice]);

  return (
    <div className="flex flex-col bg-[#141413] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1A1A19] gap-3">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-xl font-normal text-[#FAF9F5]">{symbol}</span>
          <span className="font-mono text-xs text-[#8C8A84] font-mono-num">
            {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4ADE80]/15 text-[#4ADE80]">
            LIVE FEED
          </span>
        </div>

        {/* Intervals */}
        <div className="flex items-center space-x-1 font-mono text-xs">
          {intervals.map((int) => (
            <button
              key={int}
              onClick={() => onIntervalChange && onIntervalChange(int)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                interval === int
                  ? 'bg-[#FAF9F5] text-[#141413] font-bold'
                  : 'text-[#8C8A84] hover:text-[#FAF9F5] hover:bg-white/5'
              }`}
            >
              {int}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div ref={chartContainerRef} className="w-full relative" style={{ minHeight: '380px' }}>
        {!isClient && (
          <div className="h-[380px] w-full flex items-center justify-center font-mono text-xs text-[#8C8A84]">
            Initializing TradingView Canvas...
          </div>
        )}
      </div>
    </div>
  );
}
