'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, HelpCircle, QrCode } from 'lucide-react';

export default function HelpView({ onZoomImage }) {
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const btcAddress = '12yhkkbbjjqC2cdujWFfCggrDGLmqta262';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'How frequently are parallel exchange rates refreshed?',
      a: 'Rates update dynamically every 15–30 seconds via real-time P2P liquidity orderbooks, OTC remittance broker feeds, and regional cross-border clearing channels.'
    },
    {
      q: 'Can I benchmark rates against currencies other than Myanmar Kyat (MMK)?',
      a: 'Yes. SuperRich allows comparing all rates against any base currency (USD, THB, SGD, EUR, CNY, JPY, GBP, etc.) with real-time cross-currency triangulation.'
    },
    {
      q: 'How does the AI Market Advisor formulate its analysis?',
      a: 'The advisor is powered by advanced LLM reasoning (Qwen 3.8-27B) trained on macroeconomic trends, regional central bank policy shifts, and historical parallel market spreads.'
    },
    {
      q: 'Are these rates legally binding or indicative?',
      a: 'Rates published on SuperRich represent open-market reference clearing levels. Actual counter transactions may carry small physical handling margins.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-24 text-left">
      {/* Title */}
      <div className="space-y-4 pt-6 border-b border-black/10 pb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84] block">
          [ MODULE 06 • SETTLEMENT &amp; SUPPORT ]
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#141413]">
          Settlement, Questions &amp; Support
        </h1>
        <p className="text-sm sm:text-base text-[#63625D] leading-relaxed">
          Technical documentation, payment settlement channels, and answers to common operational questions.
        </p>
      </div>

      {/* Accordion FAQs (TechForce.gov Style) */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-black/10 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#141413]">
            Frequently Answered Questions
          </h2>
          <span className="font-mono text-xs text-[#8C8A84]">{faqs.length} INQUIRIES</span>
        </div>

        <div className="divide-y divide-black/10">
          {faqs.map((faq, i) => {
            const isOpen = expandedFaq === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => setExpandedFaq(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-serif text-xl sm:text-2xl text-[#141413] group-hover:underline underline-offset-4 decoration-black/30">
                    {faq.q}
                  </span>
                  <span className="font-mono text-lg text-[#8C8A84] group-hover:text-[#141413] transition-colors ml-4 shrink-0">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#63625D] leading-relaxed pr-8 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-Border Settlement & Donation Channels */}
      <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8C8A84]">
            SETTLEMENT RAILS &amp; PUBLIC SUPPORT
          </span>
          <h3 className="font-serif text-3xl text-[#141413] mt-1">
            Community Support &amp; Direct QR Rails
          </h3>
          <p className="text-xs text-[#63625D] mt-1">
            Keep this platform 100% ad-free and uncompromised by private exchange syndicates.
          </p>
        </div>

        {/* QR Code Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* PromptPay */}
          <div
            onClick={() => onZoomImage && onZoomImage('/promptpay.jpg')}
            className="group cursor-pointer bg-[#FAF9F5] border border-black/10 hover:border-black/30 rounded-xl p-4 flex flex-col items-center text-center transition-all"
          >
            <div className="relative w-36 h-36 bg-white border border-black/10 rounded-lg overflow-hidden flex items-center justify-center p-1">
              <Image
                src="/promptpay.jpg"
                alt="PromptPay QR"
                width={140}
                height={140}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-lg text-[#141413] mt-3">PromptPay THB</span>
            <span className="font-mono text-[10px] text-[#8C8A84] uppercase mt-0.5">Click to Zoom QR</span>
          </div>

          {/* KBZPay */}
          <div
            onClick={() => onZoomImage && onZoomImage('/kbzpay.jpg')}
            className="group cursor-pointer bg-[#FAF9F5] border border-black/10 hover:border-black/30 rounded-xl p-4 flex flex-col items-center text-center transition-all"
          >
            <div className="relative w-36 h-36 bg-white border border-black/10 rounded-lg overflow-hidden flex items-center justify-center p-1">
              <Image
                src="/kbzpay.jpg"
                alt="KBZPay QR"
                width={140}
                height={140}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-lg text-[#141413] mt-3">KBZPay MMK</span>
            <span className="font-mono text-[10px] text-[#8C8A84] uppercase mt-0.5">Click to Zoom QR</span>
          </div>

          {/* Community Donation */}
          <div
            onClick={() => onZoomImage && onZoomImage('/donate.jpg')}
            className="group cursor-pointer bg-[#FAF9F5] border border-black/10 hover:border-black/30 rounded-xl p-4 flex flex-col items-center text-center transition-all"
          >
            <div className="relative w-36 h-36 bg-white border border-black/10 rounded-lg overflow-hidden flex items-center justify-center p-1">
              <Image
                src="/donate.jpg"
                alt="Donation QR"
                width={140}
                height={140}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-lg text-[#141413] mt-3">Community Fund</span>
            <span className="font-mono text-[10px] text-[#8C8A84] uppercase mt-0.5">Click to Zoom QR</span>
          </div>
        </div>

        {/* Bitcoin Address Box */}
        <div className="bg-[#FAF9F5] border border-black/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div>
            <span className="text-[#8C8A84] uppercase text-[10px] block">On-Chain Settlement (Bitcoin)</span>
            <span className="text-[#141413] font-mono-num select-all font-medium">{btcAddress}</span>
          </div>
          <button
            onClick={() => handleCopy(btcAddress)}
            className="px-4 py-2 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-black text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#FAF9F5]" /> : <Copy className="w-3.5 h-3.5 text-[#FAF9F5]" />}
            <span>{copied ? 'Copied' : 'Copy BTC'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
