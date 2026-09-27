'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Copy, Check, ExternalLink } from 'lucide-react';

export default function Footer({ onSelectTab }) {
  const [copied, setCopied] = useState(false);
  const btcAddress = '12yhkkbbjjqC2cdujWFfCggrDGLmqta262';

  const handleCopy = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#0b0c10] border-t border-[#181a22] mt-auto py-10 px-4 sm:px-6 lg:px-12 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Description */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2.5 text-white font-extrabold text-lg tracking-tight">
            <div className="relative w-6 h-6 rounded-md overflow-hidden flex items-center justify-center bg-[#151912] border border-[#a3e635]/30 shadow-[0_0_8px_rgba(163,230,53,0.15)]">
              <Image
                src="/logo.png"
                alt="SuperRich Logo"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span>SuperRich</span>
            <span className="text-[#a3e635] text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#161d15] border border-[#a3e635]/30">
              LIVE
            </span>
          </div>
          <p className="text-[#848d9f] leading-relaxed text-xs max-w-sm">
            Real-time multi-currency exchange rates, professional TradingView charting, and AI-powered
            forex analysis for Myanmar and global traders.
          </p>
          <p className="text-[#ef4444] text-[10px] font-bold uppercase tracking-wider">
            Not affiliated with Super Rich Thailand
          </p>
        </div>

        {/* Quick Links & API */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">
            Platform &amp; Developers
          </h4>
          <ul className="space-y-2 text-[#848d9f]">
            <li>
              <button
                onClick={() => onSelectTab('RATES')}
                className="hover:text-[#a3e635] transition-colors"
              >
                Live Exchange Board
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('TOOLS')}
                className="hover:text-[#a3e635] transition-colors"
              >
                Pro TradingView Chart &amp; Order Book
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('COUNTRIES')}
                className="hover:text-[#a3e635] transition-colors"
              >
                Global Currencies Directory
              </button>
            </li>
            <li className="pt-1 flex items-center space-x-2">
              <span className="text-white font-semibold">API:</span>
              <span className="font-mono text-[#a3e635]">api.superrich.tech</span>
            </li>
          </ul>

          {/* Social Links */}
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="https://www.facebook.com/share/1CzKSYWA5q/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#848d9f] hover:text-white transition-colors"
              aria-label="Facebook community"
            >
              Facebook
            </a>
            <span className="text-[#323642]">&bull;</span>
            <a
              href="https://x.com/superrich_tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#848d9f] hover:text-white transition-colors"
              aria-label="X Twitter"
            >
              X (Twitter)
            </a>
          </div>
        </div>

        {/* Support & Bitcoin */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">
            Support the Development
          </h4>
          <p className="text-[#848d9f] text-xs leading-relaxed">
            Keep this platform 100% ad-free and open for the community.
          </p>

          <div className="bg-[#12141a] border border-[#202532] rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase">
              <span className="text-white">Bitcoin</span>
              <span className="text-[#facc15]">Network: BTC</span>
            </div>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#a3e635]">
              <span className="truncate select-all">{btcAddress}</span>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-[#1f261d] text-[#a3e635] flex-shrink-0 transition-colors"
                title="Copy BTC Address"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#161821] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#555c6c] gap-2">
        <span>&copy; {new Date().getFullYear()} SuperRich Myanmar. All rights reserved.</span>
        <span>Empowering traders with transparent global rates.</span>
      </div>
    </footer>
  );
}
