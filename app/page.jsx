'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SelectedWorkSection from '../components/SelectedWorkSection';
import PriceDisparitySection from '../components/PriceDisparitySection';
import CurrencyVolatilityRadar from '../components/CurrencyVolatilityRadar';
import RateConverterCard from '../components/RateConverterCard';
import RatesTable from '../components/RatesTable';
import NewsSection from '../components/NewsSection';
import ToolsView from '../components/ToolsView';
import CountriesView from '../components/CountriesView';
import AboutView from '../components/AboutView';
import HelpView from '../components/HelpView';
import Footer from '../components/Footer';
import AIAssistantModal from '../components/AIAssistantModal';
import QRZoomModal from '../components/QRZoomModal';

const initialRates = [
  {
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    flagSvg: 'https://flagcdn.com/w80/us.png',
    buy: 4570.00,
    sell: 4620.00,
    mid: 4595.00,
    change24h: 0.35,
    sparkline: [4560, 4565, 4558, 4572, 4580, 4575, 4588, 4590, 4585, 4592, 4595]
  },
  {
    country: 'Myanmar',
    currency: 'MMK',
    flag: '🇲🇲',
    flagSvg: 'https://flagcdn.com/w80/mm.png',
    buy: 1.00,
    sell: 1.00,
    mid: 1.00,
    change24h: 0.00,
    sparkline: [1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    country: 'Thailand',
    currency: 'THB',
    flag: '🇹🇭',
    flagSvg: 'https://flagcdn.com/w80/th.png',
    buy: 125.80,
    sell: 127.40,
    mid: 126.60,
    change24h: 0.18,
    sparkline: [126.0, 126.1, 125.9, 126.3, 126.2, 126.5, 126.4, 126.7, 126.5, 126.6]
  },
  {
    country: 'Singapore',
    currency: 'SGD',
    flag: '🇸🇬',
    flagSvg: 'https://flagcdn.com/w80/sg.png',
    buy: 3420.00,
    sell: 3470.00,
    mid: 3445.00,
    change24h: -0.12,
    sparkline: [3460, 3455, 3458, 3450, 3448, 3452, 3440, 3442, 3446, 3445]
  },
  {
    country: 'Eurozone',
    currency: 'EUR',
    flag: '🇪🇺',
    flagSvg: 'https://flagcdn.com/w80/eu.png',
    buy: 4930.00,
    sell: 5000.00,
    mid: 4965.00,
    change24h: 0.22,
    sparkline: [4940, 4945, 4950, 4948, 4955, 4960, 4958, 4962, 4960, 4965]
  },
  {
    country: 'China',
    currency: 'CNY',
    flag: '🇨🇳',
    flagSvg: 'https://flagcdn.com/w80/cn.png',
    buy: 630.00,
    sell: 640.00,
    mid: 635.00,
    change24h: -0.08,
    sparkline: [638, 637, 636, 637, 635, 636, 634, 635, 634, 635]
  },
  {
    country: 'Japan',
    currency: 'JPY',
    flag: '🇯🇵',
    flagSvg: 'https://flagcdn.com/w80/jp.png',
    buy: 29.60,
    sell: 30.10,
    mid: 29.85,
    change24h: 0.05,
    sparkline: [29.75, 29.78, 29.72, 29.80, 29.79, 29.82, 29.81, 29.86, 29.83, 29.85]
  },
  {
    country: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    flagSvg: 'https://flagcdn.com/w80/gb.png',
    buy: 5820.00,
    sell: 5890.00,
    mid: 5855.00,
    change24h: 0.15,
    sparkline: [5830, 5840, 5835, 5845, 5850, 5842, 5858, 5852, 5855]
  },
  {
    country: 'Australia',
    currency: 'AUD',
    flag: '🇦🇺',
    flagSvg: 'https://flagcdn.com/w80/au.png',
    buy: 2980.00,
    sell: 3025.00,
    mid: 3002.50,
    change24h: 0.28,
    sparkline: [2985, 2990, 2995, 2992, 3000, 2998, 3005, 3001, 3002.5]
  },
  {
    country: 'South Korea',
    currency: 'KRW',
    flag: '🇰🇷',
    flagSvg: 'https://flagcdn.com/w80/kr.png',
    buy: 3.32,
    sell: 3.41,
    mid: 3.36,
    change24h: -0.04,
    sparkline: [3.38, 3.37, 3.38, 3.36, 3.37, 3.35, 3.37, 3.36]
  },
  {
    country: 'Malaysia',
    currency: 'MYR',
    flag: '🇲🇾',
    flagSvg: 'https://flagcdn.com/w80/my.png',
    buy: 1020.00,
    sell: 1045.00,
    mid: 1032.50,
    change24h: 0.11,
    sparkline: [1025, 1028, 1026, 1030, 1032, 1029, 1034, 1032.5]
  },
  {
    country: 'India',
    currency: 'INR',
    flag: '🇮🇳',
    flagSvg: 'https://flagcdn.com/w80/in.png',
    buy: 53.40,
    sell: 54.60,
    mid: 54.00,
    change24h: -0.02,
    sparkline: [54.1, 54.2, 54.0, 54.1, 53.9, 54.0, 54.1, 54.0]
  },
  {
    country: 'Taiwan',
    currency: 'TWD',
    flag: '🇹🇼',
    flagSvg: 'https://flagcdn.com/w80/tw.png',
    buy: 141.00,
    sell: 143.50,
    mid: 142.25,
    change24h: 0.09,
    sparkline: [141.5, 141.8, 142.0, 141.9, 142.3, 142.1, 142.25]
  },
  {
    country: 'Canada',
    currency: 'CAD',
    flag: '🇨🇦',
    flagSvg: 'https://flagcdn.com/w80/ca.png',
    buy: 3310.00,
    sell: 3360.00,
    mid: 3335.00,
    change24h: 0.14,
    sparkline: [3320, 3325, 3330, 3328, 3335, 3332, 3338, 3335]
  },
  {
    country: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪',
    flagSvg: 'https://flagcdn.com/w80/ae.png',
    buy: 1240.00,
    sell: 1260.00,
    mid: 1250.00,
    change24h: 0.05,
    sparkline: [1245, 1248, 1249, 1250, 1249, 1251, 1250]
  }
];

export default function HomePage() {
  const [rates, setRates] = useState(initialRates);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [baseCurrency, setBaseCurrency] = useState('MMK');
  const [source, setSource] = useState('SUPER RICH');
  const [updatedAt, setUpdatedAt] = useState(new Date().toISOString());
  const [activeNav, setActiveNav] = useState('OVERVIEW');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Fetch live rates
  const fetchRates = async () => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        if (data.rates && data.rates.length > 0) {
          setRates(data.rates);
        }
        if (data.updatedAt) {
          setUpdatedAt(data.updatedAt);
        }
        if (data.source && data.source.includes('3001')) {
          setSource('LOCALHOST 3001');
        } else {
          setSource('SUPER RICH');
        }
      }
    } catch (err) {
      console.warn('Using baseline exchange rates:', err);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const targetItem = rates.find((r) => r.currency === targetCurrency) || rates[0];
  const baseItem = rates.find((r) => r.currency === baseCurrency) || { mid: 1 };
  const currentCrossRate = ((targetItem?.mid || 1) / (baseItem?.mid || 1)).toFixed(2);

  const handleCountrySelectToConvert = (currencyCode) => {
    setTargetCurrency(currencyCode);
    setActiveNav('OVERVIEW');
    setTimeout(() => {
      const el = document.getElementById('converter-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigateSection = (sec) => {
    if (sec === 'RATES_SECTION' || sec === 'RATES') {
      if (activeNav !== 'OVERVIEW') setActiveNav('OVERVIEW');
      setTimeout(() => {
        const el = document.getElementById('rates-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (sec === 'CONVERTER_SECTION') {
      if (activeNav !== 'OVERVIEW') setActiveNav('OVERVIEW');
      setTimeout(() => {
        const el = document.getElementById('converter-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (sec === 'DISPARITY') {
      if (activeNav !== 'OVERVIEW') setActiveNav('OVERVIEW');
      setTimeout(() => {
        const el = document.getElementById('disparity-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActiveNav(sec);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413]">
      {/* NDS Navigation Header with Live Ticker Ribbon */}
      <Navbar
        activeNav={activeNav}
        onNavChange={handleNavigateSection}
        onOpenAI={() => setIsAIOpen(true)}
        rates={rates}
        baseCurrency={baseCurrency}
        onSelectCurrency={setTargetCurrency}
      />

      {/* Main Content Area */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full flex-1">
        {/* VIEW 1: NDStudio.gov Style Sovereign Portfolio Homepage */}
        {activeNav === 'OVERVIEW' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Monumental Hero Section */}
            <HeroSection
              rates={rates}
              selectedCurrency={targetCurrency}
              onSelectCurrency={setTargetCurrency}
              baseCurrency={baseCurrency}
              onSelectBaseCurrency={setBaseCurrency}
              onNavigateToSection={handleNavigateSection}
            />

            {/* NDStudio "Selected Work" Portfolio Grid */}
            <SelectedWorkSection
              onSelectFeature={handleNavigateSection}
              onOpenAI={() => setIsAIOpen(true)}
            />

            {/* TrumpRx-Style Cost / Price Disparity Comparison Graphic with interactive simulator */}
            <PriceDisparitySection
              rates={rates}
              baseCurrency={baseCurrency}
              onExploreRates={() => handleNavigateSection('RATES_SECTION')}
            />

            {/* Fresh 24h Currency Strength & Volatility Radar */}
            <CurrencyVolatilityRadar
              rates={rates}
              baseCurrency={baseCurrency}
              onSelectCurrency={(cur) => {
                setTargetCurrency(cur);
                const convEl = document.getElementById('converter-section');
                if (convEl) convEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Live Interactive Exchange Board & Precision Converter */}
            <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <RatesTable
                  rates={rates}
                  baseCurrency={baseCurrency}
                  onSelectBaseCurrency={setBaseCurrency}
                  selectedCurrency={targetCurrency}
                  onSelectCurrency={setTargetCurrency}
                />
              </div>

              <div className="lg:col-span-5 sticky top-28">
                <RateConverterCard
                  allRates={rates}
                  fromCurrency={targetCurrency}
                  toCurrency={baseCurrency}
                  onChangeFromCurrency={setTargetCurrency}
                  onChangeToCurrency={setBaseCurrency}
                  source={source}
                  updatedAt={updatedAt}
                  onOpenAI={() => setIsAIOpen(true)}
                />
              </div>
            </div>

            {/* NDStudio-Style News / Market Dispatches */}
            <NewsSection />
          </div>
        )}

        {/* VIEW 2: DEDICATED LIVE EXCHANGE BOARD */}
        {activeNav === 'RATES' && (
          <div className="pt-8 space-y-12 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <RatesTable
                  rates={rates}
                  baseCurrency={baseCurrency}
                  onSelectBaseCurrency={setBaseCurrency}
                  selectedCurrency={targetCurrency}
                  onSelectCurrency={setTargetCurrency}
                />
              </div>
              <div className="lg:col-span-5 pt-8 sticky top-28">
                <RateConverterCard
                  allRates={rates}
                  fromCurrency={targetCurrency}
                  toCurrency={baseCurrency}
                  onChangeFromCurrency={setTargetCurrency}
                  onChangeToCurrency={setBaseCurrency}
                  source={source}
                  updatedAt={updatedAt}
                  onOpenAI={() => setIsAIOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: PRICE DISPARITY DEEP-DIVE */}
        {activeNav === 'DISPARITY' && (
          <div className="pt-8 animate-in fade-in duration-300">
            <PriceDisparitySection
              rates={rates}
              baseCurrency={baseCurrency}
              onExploreRates={() => handleNavigateSection('RATES_SECTION')}
            />
          </div>
        )}

        {/* VIEW 4: TRADINGVIEW TERMINAL */}
        {activeNav === 'TOOLS' && (
          <div className="pt-8 animate-in fade-in duration-300">
            <ToolsView />
          </div>
        )}

        {/* VIEW 5: SOVEREIGN DIRECTORY */}
        {activeNav === 'COUNTRIES' && (
          <div className="pt-8 animate-in fade-in duration-300">
            <CountriesView
              rates={rates}
              baseCurrency={baseCurrency}
              onSelectCountryToConvert={handleCountrySelectToConvert}
            />
          </div>
        )}

        {/* VIEW 6: ABOUT CHARTER */}
        {activeNav === 'ABOUT' && (
          <div className="pt-8 animate-in fade-in duration-300">
            <AboutView onOpenAI={() => setIsAIOpen(true)} />
          </div>
        )}

        {/* VIEW 7: HELP & SETTLEMENT */}
        {activeNav === 'HELP' && (
          <div className="pt-8 animate-in fade-in duration-300">
            <HelpView onZoomImage={setZoomedImage} />
          </div>
        )}
      </main>

      {/* Monumental NDStudio Footer */}
      <Footer onSelectTab={handleNavigateSection} />

      {/* AI Market Advisor Modal (Google Gemini / Qwen) */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        targetCurrency={targetCurrency}
        baseCurrency={baseCurrency}
        currentRate={currentCrossRate}
      />

      {/* Fullscreen QR Zoom Modal */}
      <QRZoomModal
        imageSrc={zoomedImage}
        onClose={() => setZoomedImage(null)}
      />
    </div>
  );
}
