'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Moon, ChevronDown, Check, Sparkles } from 'lucide-react';

export default function Navbar({ activeNav = 'RATES', onNavChange, onOpenAI }) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const navItems = ['RATES', 'COUNTRIES', 'TOOLS', 'ABOUT', 'HELP'];

  return (
    <header className="w-full bg-[#070707] border-b border-[#18191e] px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Brand Logo & Live status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onNavChange && onNavChange('RATES')}
          className="flex items-center space-x-2.5 text-left group focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[#151912] border border-[#a3e635]/40 group-hover:border-[#a3e635] shadow-[0_0_12px_rgba(163,230,53,0.2)] transition-all">
            <Image
              src="/logo.png"
              alt="SuperRich Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="text-white font-black text-xl tracking-tight flex items-center group-hover:text-[#a3e635] transition-colors">
            SuperRich
          </span>
        </button>
        <div className="flex items-center space-x-1.5 pl-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a3e635]"></span>
          </span>
          <span className="text-[#a3e635] text-[11px] font-bold tracking-widest uppercase">
            LIVE
          </span>
        </div>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => {
          const isActive = activeNav === item;
          return (
            <button
              key={item}
              onClick={() => onNavChange && onNavChange(item)}
              className={`text-xs font-semibold uppercase tracking-[0.14em] transition-colors py-1 ${
                isActive
                  ? 'text-white'
                  : 'text-[#6b7280] hover:text-[#d1d5db]'
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>

      {/* Right: AI Advisor, Theme Toggle & Language Selector */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* AI Advisor Button */}
        <button
          onClick={onOpenAI}
          aria-label="Open AI Market Advisor"
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg border border-[#a3e635]/40 text-[#a3e635] bg-[#141913] hover:bg-[#1c241a] hover:border-[#a3e635] transition-all shadow-[0_0_10px_rgba(163,230,53,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Advisor</span>
        </button>

        {/* Dark theme toggle icon */}
        <button
          aria-label="Toggle theme"
          className="p-1.5 text-[#9ca3af] hover:text-white transition-colors rounded-lg"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#22252d] text-[#e5e7eb] bg-[#101216] hover:border-[#374151] transition-colors"
          >
            <span>{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-[#9ca3af]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-24 bg-[#14161c] border border-[#262a34] rounded-lg shadow-2xl py-1 z-50 text-xs text-[#d1d5db]">
              {['EN', 'MM', 'TH'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLang(lang);
                    setLangMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1f232d] flex items-center justify-between"
                >
                  <span>{lang}</span>
                  {currentLang === lang && <Check className="w-3 h-3 text-[#a3e635]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
