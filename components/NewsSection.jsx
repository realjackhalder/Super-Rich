'use client';

import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Clock, Tag } from 'lucide-react';

export default function NewsSection() {
  const [activeFilter, setActiveFilter] = useState('All');

  const dispatches = [
    {
      date: 'September 2026',
      source: 'CBM Monetary Bureau',
      title: 'Central Bank of Myanmar expands bilateral local currency trade clearing with Thailand & Singapore',
      excerpt: 'Direct Baht-Kyat and SGD-Kyat swap facilities seek to lower corporate reliance on third-party US dollar conversions and ease import delays.',
      category: 'Central Banking',
      readTime: '3 min read'
    },
    {
      date: 'August 2026',
      source: 'SuperRich Intelligence',
      title: 'Sub-second WebSocket orderbook feeds deployed for parallel cash & digital liquidity',
      excerpt: 'New low-latency proxy relays in Singapore and Bangkok eliminate quote stale-times for parallel exchange counters and border merchants.',
      category: 'Infrastructure',
      readTime: '4 min read'
    },
    {
      date: 'July 2026',
      source: 'ASEAN FX Monitor',
      title: 'Cross-border worker remittance volume via PromptPay-to-KBZPay channels hits record peak',
      excerpt: 'Retail transfers and merchant payments increasingly flow through direct digital payment switches, narrowing unofficial black market broker cuts.',
      category: 'Remittance',
      readTime: '2 min read'
    },
    {
      date: 'June 2026',
      source: 'Regional Commodity Desk',
      title: 'Domestic gold market settles near 6,240,000 MMK/tical amid updated physical reserve metrics',
      excerpt: 'Yangon Gold Entrepreneurs Association adjustments align domestic spot trading with international bullion benchmarks and parallel FX movements.',
      category: 'Gold & Bullion',
      readTime: '3 min read'
    }
  ];

  const categories = ['All', 'Central Banking', 'Infrastructure', 'Remittance', 'Gold & Bullion'];

  const filteredDispatches = activeFilter === 'All'
    ? dispatches
    : dispatches.filter(d => d.category === activeFilter);

  return (
    <section className="py-16 md:py-24 border-b border-black/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 border-b border-black/10">
        <div className="flex items-center space-x-6 text-[#141413]">
          <span className="font-mono text-sm tracking-widest text-[#8C8A84]">II</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-[#141413]">
            Market Dispatches &amp; Regulatory Index
          </h2>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-[#8C8A84]">
          <Clock className="w-3.5 h-3.5" />
          <span>CURATED MONETARY RESEARCH &bull; 2026</span>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="mt-6 flex items-center space-x-2 font-mono text-xs overflow-x-auto no-scrollbar pb-1">
        <span className="text-[10px] uppercase text-[#8C8A84] mr-1">Topic:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-[#141413] text-[#FAF9F5] font-semibold'
                : 'bg-[#F2EFE9] text-[#63625D] hover:bg-black/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Dispatches (Like ndstudio.gov News section) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDispatches.map((item, idx) => (
          <article
            key={idx}
            className="group flex flex-col justify-between p-6 rounded-xl bg-[#F2EFE9] border border-black/10 hover:border-black/30 transition-all text-left cursor-pointer"
          >
            <div>
              {/* Date & Arrow */}
              <div className="flex items-center justify-between font-mono text-xs text-[#8C8A84] pb-3 border-b border-black/10">
                <span>{item.date}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#141413] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Tag & Source */}
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF9F5] border border-black/10 text-[#63625D]">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-[#8C8A84]">
                  {item.readTime}
                </span>
              </div>

              <div className="mt-2 text-[11px] font-mono text-[#8C8A84]">
                Source: {item.source}
              </div>

              {/* Headline */}
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] mt-2 leading-snug group-hover:underline underline-offset-4 decoration-black/40">
                {item.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-3 text-xs text-[#63625D] leading-relaxed">
                {item.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#8C8A84]">
              <span>Read research memorandum</span>
              <span>→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
