'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Check, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import LiveTickerRibbon from './LiveTickerRibbon';

export default function Navbar({
  activeNav = 'RATES',
  onNavChange,
  onOpenAI,
  rates = [],
  baseCurrency = 'MMK',
  onSelectCurrency
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'OVERVIEW', label: 'Overview' },
    { id: 'RATES', label: 'Live Exchange' },
    { id: 'DISPARITY', label: 'Price Disparity' },
    { id: 'TOOLS', label: 'Terminal' },
    { id: 'COUNTRIES', label: 'Directory' },
    { id: 'ABOUT', label: 'About' },
    { id: 'HELP', label: 'Help' },
  ];

  const handleNavClick = (id) => {
    if (onNavChange) onNavChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#FAF9F5] text-[#141413] sticky top-0 z-50 border-b border-black/10 transition-colors backdrop-blur-md bg-[#FAF9F5]/95">
      {/* NDS Sovereign Micro-Ribbon */}
      <div className="border-b border-black/[0.08] px-4 sm:px-6 md:px-8 lg:px-12 py-1.5 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#63625D]">
        <div className="flex items-center space-x-2">
          {/* Subtle flag / seal emblem */}
          <span className="inline-flex items-center justify-center w-3.5 h-2.5 bg-[#141413] text-[#FAF9F5] rounded-xs font-black text-[8px] leading-none">
            SR
          </span>
          <span className="uppercase tracking-[0.08em] hidden sm:inline">
            An Independent Foreign Exchange Intelligence Bureau
          </span>
          <span className="uppercase tracking-[0.08em] sm:hidden">
            SuperRich FX Bureau
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-mono uppercase">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B6B38] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1B6B38]"></span>
            </span>
            <span className="text-[#1B6B38] font-semibold tracking-wider">LIVE TELEMETRY</span>
          </div>
          <span className="text-black/20 hidden md:inline">•</span>
          <span className="hidden md:inline text-[#8C8A84]">LATENCY: &lt;50MS</span>
        </div>
      </div>

      {/* Gliding Live Marquee Ticker */}
      <LiveTickerRibbon
        rates={rates}
        baseCurrency={baseCurrency}
        onSelectCurrency={onSelectCurrency}
      />

      {/* Main NDS Navigation Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Brand Monogram & Title */}
        <div className="flex items-center space-x-5">
          <button
            onClick={() => handleNavClick('OVERVIEW')}
            className="flex items-center space-x-3 text-left group focus:outline-none cursor-pointer"
            aria-label="SuperRich Homepage"
          >
            {/* Geometric NDS-style 3-stripe currency seal */}
            <div className="w-7 h-5 flex flex-col justify-between py-0.5">
              <span className="block h-[2.5px] w-full bg-[#141413] transition-transform group-hover:scale-x-110 origin-left"></span>
              <span className="block h-[2.5px] w-3/4 bg-[#141413] transition-transform group-hover:w-full"></span>
              <span className="block h-[2.5px] w-full bg-[#141413] transition-transform group-hover:scale-x-110 origin-left"></span>
            </div>

            <div className="flex flex-col">
              <span className="text-[#141413] font-serif text-2xl tracking-normal leading-none font-normal">
                SuperRich
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#8C8A84] mt-0.5">
                Currency Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Center: Editorial Links with Sliding Underline Animation */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-[13px] tracking-wide font-normal transition-colors group cursor-pointer ${
                  isActive ? 'text-[#141413] font-medium' : 'text-[#63625D] hover:text-[#141413]'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-[#141413] transition-transform duration-300 ease-out origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Language, AI Advisor, Terminal CTA) */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* AI Advisor Button */}
          <button
            onClick={onOpenAI}
            aria-label="Open AI Market Advisor"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono tracking-wider rounded border border-black/15 text-[#141413] bg-transparent hover:bg-black/5 hover:border-black/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#141413]" />
            <span>AI ADVISOR</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono rounded border border-black/15 text-[#141413] hover:border-black/30 transition-colors cursor-pointer"
            >
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-[#63625D]" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-[#FAF9F5] border border-black/15 rounded-md shadow-xl py-1 z-50 text-xs text-[#141413]">
                {['EN', 'MM', 'TH'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 flex items-center justify-between font-mono cursor-pointer"
                  >
                    <span>{lang}</span>
                    {currentLang === lang && <Check className="w-3 h-3 text-[#141413]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Launch Terminal CTA Button (NDS Pill Style) */}
          <button
            onClick={() => handleNavClick('TOOLS')}
            className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-black/85 transition-all shadow-xs group cursor-pointer"
          >
            <span className="hidden sm:inline">Launch</span>
            <span>Terminal</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#141413] lg:hidden hover:bg-black/5 rounded cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (NDS Minimal Style) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/10 bg-[#FAF9F5] px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-lg font-serif py-1 flex items-center justify-between cursor-pointer ${
                  activeNav === item.id ? 'text-[#141413] font-medium' : 'text-[#63625D]'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs font-mono text-[#8C8A84]">↗</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-black/10 flex items-center justify-between">
            <button
              onClick={() => {
                if (onOpenAI) onOpenAI();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center space-x-2 text-xs font-mono uppercase px-3.5 py-2 rounded border border-black/15 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Market Advisor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
