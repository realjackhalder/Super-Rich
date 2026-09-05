'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldAlert, HeartHandshake, HelpCircle } from 'lucide-react';

export default function HelpView({ onZoomImage }) {
  const [copied, setCopied] = useState(false);

  const btcAddress = '12yhkkbbjjqC2cdujWFfCggrDGLmqta262';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'How often are the exchange rates updated?',
      a: 'Rates update dynamically every 15–30 seconds via real-time P2P liquidity orderbooks and regional market spreads.'
    },
    {
      q: 'Can I compare rates against currencies other than MMK?',
      a: 'Yes! SuperRich supports comparing all rates against any base currency (USD, THB, SGD, EUR, CNY, JPY, etc.) with real-time cross-currency calculations.'
    },
    {
      q: 'How does the AI Market Advisor work?',
      a: 'The AI Analyst is powered by Qwen 3.8-27B hosted on ExperientialLabs, giving you real-time market sentiment, volatility analysis, and currency conversion tips.'
    },
    {
      q: 'Are the displayed rates indicative or guaranteed?',
      a: 'Rates are indicative market reference points. Always verify the final rate directly with your currency counter or counterparty before executing trades.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-20">
      {/* Title */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Help &amp; Community Support
        </h1>
        <p className="text-xs sm:text-sm text-[#8e95a5] max-w-xl mx-auto leading-relaxed">
          Frequently asked questions, developer API resources, and community donation options to keep
          the SuperRich platform free and open for everyone.
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#a3e635]" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#151821] border border-[#232836] rounded-xl p-4 space-y-1.5">
              <h4 className="text-white font-bold text-xs sm:text-sm">{faq.q}</h4>
              <p className="text-xs text-[#8e95a5] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Section */}
      <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1e28] pb-4">
          <div>
            <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#a3e635]" />
              Support Platform Development
            </h3>
            <p className="text-xs text-[#8b94a5] mt-1">
              SuperRich is 100% free and open. Your contributions help cover server, API proxy, and AI infrastructure costs.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] bg-[#1a2318] border border-[#a3e635]/30 px-2.5 py-1 rounded-full self-start sm:self-auto">
            Community Funded
          </span>
        </div>

        {/* QR Code Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          {/* Binance Pay */}
          <div className="bg-[#151821] border border-[#232836] rounded-xl p-4 flex flex-col items-center space-y-3 hover:border-[#a3e635]/40 transition-colors">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Binance Pay</span>
            <div
              onClick={() => onZoomImage('/donate.jpg')}
              className="w-36 h-36 bg-white rounded-lg p-1.5 cursor-zoom-in hover:opacity-90 transition-opacity shadow-md flex items-center justify-center"
            >
              <img src="/donate.jpg" alt="Binance Pay QR" className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] text-[#6b7280]">Click image to expand</span>
          </div>

          {/* PromptPay */}
          <div className="bg-[#151821] border border-[#232836] rounded-xl p-4 flex flex-col items-center space-y-3 hover:border-[#a3e635]/40 transition-colors">
            <span className="text-xs font-bold text-white uppercase tracking-wider">PromptPay</span>
            <div
              onClick={() => onZoomImage('/promptpay.jpg')}
              className="w-36 h-36 bg-white rounded-lg p-1.5 cursor-zoom-in hover:opacity-90 transition-opacity shadow-md flex items-center justify-center"
            >
              <img src="/promptpay.jpg" alt="PromptPay QR" className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] text-[#6b7280]">Click image to expand</span>
          </div>

          {/* KBZ Pay */}
          <div className="bg-[#151821] border border-[#232836] rounded-xl p-4 flex flex-col items-center space-y-3 hover:border-[#a3e635]/40 transition-colors">
            <span className="text-xs font-bold text-white uppercase tracking-wider">KBZ Pay</span>
            <div
              onClick={() => onZoomImage('/kbzpay.jpg')}
              className="w-36 h-36 bg-white rounded-lg p-1.5 cursor-zoom-in hover:opacity-90 transition-opacity shadow-md flex items-center justify-center"
            >
              <img src="/kbzpay.jpg" alt="KBZ Pay QR" className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] text-[#6b7280]">Click image to expand</span>
          </div>
        </div>

        {/* Bitcoin Address */}
        <div className="bg-[#151821] border border-[#232836] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Bitcoin (BTC)
              </span>
              <span className="text-[10px] font-bold text-[#facc15] bg-[#292211] px-2 py-0.5 rounded">
                Network: BTC
              </span>
            </div>
            <span className="text-xs font-mono text-[#a3e635] mt-1 select-all break-all">
              {btcAddress}
            </span>
          </div>

          <button
            onClick={() => handleCopy(btcAddress)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#a3e635] text-black font-bold text-xs hover:bg-[#bef264] active:scale-95 transition-all self-start sm:self-auto flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
        </div>
      </div>

      {/* Official Community Channels */}
      <div className="bg-[#101217] border border-[#1e222b] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-white font-bold text-sm">Join Our Official Community</h4>
          <p className="text-xs text-[#8b94a5] mt-0.5">Stay informed with daily market reports and updates.</p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://www.facebook.com/share/1CzKSYWA5q/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#161922] border border-[#252936] hover:border-[#a3e635] text-white text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://x.com/superrich_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#161922] border border-[#252936] hover:border-[#a3e635] text-white text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>X (Twitter)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
