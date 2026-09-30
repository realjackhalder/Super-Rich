'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Footer({ onSelectTab }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const btcAddress = '12yhkkbbjjqC2cdujWFfCggrDGLmqta262';

  const handleCopy = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#FAF9F5] text-[#141413] border-t border-black/10 pt-16 md:pt-24 pb-12 mt-auto">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Monumental NDS SVG Wordmark */}
        <div className="w-full overflow-hidden pb-12 border-b border-black/10 select-none">
          <svg
            viewBox="0 0 1000 120"
            className="w-full h-auto text-[#141413] fill-current"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="SUPERRICH"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="var(--font-serif), 'Instrument Serif', Georgia, serif"
              fontSize="120"
              letterSpacing="-4"
              fontWeight="400"
            >
              SUPERRICH
            </text>
          </svg>
        </div>

        {/* 4-Column Editorial Info Grid (Exact NDStudio Layout) */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Col 1: Bureau Coordinates */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs text-[#63625D]">
            <p className="font-semibold text-[#141413] uppercase tracking-wider">
              SuperRich Currency Intelligence Bureau
            </p>
            <address className="not-italic leading-relaxed">
              Strand Road Financial Quarters<br />
              Kyauktada Township, Yangon<br />
              Republic of the Union of Myanmar
            </address>
            <p className="text-[11px] text-[#8C8A84] pt-2">
              Bilateral Desks: Silom Rd, Bangkok &bull; Marina Bay, Singapore
            </p>
            <div className="pt-3">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#F2EFE9] border border-black/10 text-[10px] uppercase font-mono text-[#141413]">
                <ShieldCheck className="w-3 h-3 text-[#1B6B38]" />
                <span>Independent Public Telemetry</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <span className="font-semibold text-[#141413] uppercase tracking-wider block">
              Systems
            </span>
            <ul className="space-y-2 text-[#63625D]">
              <li>
                <button
                  onClick={() => onSelectTab('OVERVIEW')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('RATES')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Live Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('TOOLS')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Trading Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('COUNTRIES')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Sovereign Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Intelligence */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <span className="font-semibold text-[#141413] uppercase tracking-wider block">
              Intelligence
            </span>
            <ul className="space-y-2 text-[#63625D]">
              <li>
                <button
                  onClick={() => onSelectTab('ABOUT')}
                  className="hover:text-[#141413] transition-colors"
                >
                  About Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('HELP')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Settlement &amp; Support
                </button>
              </li>
              <li>
                <a
                  href="https://x.com/superrich_tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#141413] transition-colors"
                >
                  Follow on X ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1CzKSYWA5q/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#141413] transition-colors"
                >
                  Facebook Desk ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Bitcoin Community Support */}
          <div className="md:col-span-4 space-y-6">
            {/* Newsletter */}
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#141413] font-semibold">
                Receive Rate Volatility Alerts
              </p>
              <form onSubmit={handleSubscribe} className="mt-3">
                <div className="flex items-center justify-between border-b border-black/20 pb-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email for rate alerts"
                    className="bg-transparent text-xs font-mono text-[#141413] placeholder:text-[#8C8A84] outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="text-xs font-mono uppercase tracking-wider text-[#141413] hover:opacity-70 transition-opacity pl-2 shrink-0 flex items-center space-x-1"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                {subscribed && (
                  <p className="text-[10px] font-mono text-[#1B6B38] mt-1.5">
                    Subscribed to rate volatility briefs.
                  </p>
                )}
              </form>
            </div>

            {/* Bitcoin Community Support Widget */}
            <div className="bg-[#F2EFE9] border border-black/10 rounded-xl p-3 space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#141413]">
                <span>Community BTC Support</span>
                <span className="text-[#8C8A84]">Network: BTC</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px] text-[#63625D]">
                <span className="truncate select-all font-mono-num">{btcAddress}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-black/5 text-[#141413] flex-shrink-0 transition-colors"
                  title="Copy Bitcoin address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#1B6B38]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#8C8A84]">
          <p>
            &copy; {new Date().getFullYear()} SuperRich Currency Intelligence. Redesigned to National Design Studio standards.
          </p>
          <p className="text-[#A82828] text-[10px] uppercase tracking-wider">
            Not affiliated with Super Rich Thailand
          </p>
        </div>
      </div>
    </footer>
  );
}
