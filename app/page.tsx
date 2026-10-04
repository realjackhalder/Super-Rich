"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  TrendingUp,
  TrendingDown,
  Code,
  ShieldCheck,
  ExternalLink,
  Activity,
} from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [rtbStats, setRtbStats] = useState<{
    date?: string;
    total?: number;
    count?: number;
    topGainers?: any[];
    topLosers?: any[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/rtb/list")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.list) {
          const list = json.data.list;
          const sortedByGain = [...list].sort(
            (a, b) => (b.change?.value || 0) - (a.change?.value || 0)
          );
          const sortedByLoss = [...list].sort(
            (a, b) => (a.change?.value || 0) - (b.change?.value || 0)
          );

          setRtbStats({
            date: json.data.date,
            total: json.data.total,
            count: json.data.count,
            topGainers: sortedByGain.slice(0, 3),
            topLosers: sortedByLoss.slice(0, 3),
          });
        }
      })
      .catch((err) => console.warn("RTB list fetch skipped:", err));
  }, []);

  const totalWealth = INITIAL_50_BILLIONAIRES.reduce((acc, curr) => acc + curr.netWorth, 0);

  const filteredPeople = INITIAL_50_BILLIONAIRES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mainCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.currentCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "all" || p.currentCountry === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const uniqueCountries = Array.from(
    new Set(INITIAL_50_BILLIONAIRES.map((p) => p.currentCountry))
  );

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-6 md:py-10 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs liquid-glass text-neutral-600 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
          <span>
            {rtbStats?.count
              ? `Real-Time CDN Tracking ${rtbStats.count} Global Billionaires (${rtbStats.date})`
              : "Tracking Top 50 Tech Titans Across 12 Countries"}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white">
          The Real-Time Wealth Index
        </h1>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Childhood-to-present timelines, SEC equity filings, verified municipal residences, and real-time data powered by RTB API & Grokipedia.
        </p>

        {/* Global Wealth Stats Card */}
        <div className="max-w-2xl mx-auto pt-4">
          <div className="liquid-glass rounded-3xl p-6 shadow-sm flex items-center justify-around text-center">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Top 50 Combined
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
                ${(totalWealth / 1000).toFixed(2)}T
              </div>
            </div>
            <div className="h-10 w-[1px] bg-neutral-300 dark:bg-neutral-800"></div>
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Global Total (Forbes RTB)
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
                {rtbStats?.total
                  ? `$${(rtbStats.total / 1e6).toFixed(2)}T`
                  : "$20.4T"}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-neutral-300 dark:bg-neutral-800"></div>
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Live Status
              </div>
              <div className="text-sm md:text-base font-semibold text-gain flex items-center justify-center mt-1">
                <span className="w-2 h-2 rounded-full bg-gain mr-1.5"></span>
                Active Sync
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Movers Strip (inspired by realtimebillionaires.de) */}
      {rtbStats?.topGainers && rtbStats.topGainers.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold px-2">
            <span className="uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-gain" />
              <span>Today's Top Daily Movers (RTB CDN)</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              realtimebillionaires.de sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {rtbStats.topGainers.map((mover, idx) => (
              <div
                key={idx}
                className="liquid-glass rounded-2xl p-3 space-y-1 text-xs border border-apple-borderLight dark:border-apple-borderDark"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{mover.name}</span>
                  <span className="text-neutral-400 text-[10px]">#{mover.rank}</span>
                </div>
                <div className="flex items-center justify-between text-gain font-semibold">
                  <span>${(mover.networth / 1000).toFixed(1)}B</span>
                  <span className="text-[11px] flex items-center">
                    <ArrowUpRight className="w-3 h-3" />
                    +${(mover.change?.value / 1000).toFixed(1)}B
                  </span>
                </div>
              </div>
            ))}
            {rtbStats.topLosers?.map((mover, idx) => (
              <div
                key={idx}
                className="liquid-glass rounded-2xl p-3 space-y-1 text-xs border border-apple-borderLight dark:border-apple-borderDark"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{mover.name}</span>
                  <span className="text-neutral-400 text-[10px]">#{mover.rank}</span>
                </div>
                <div className="flex items-center justify-between text-loss font-semibold">
                  <span>${(mover.networth / 1000).toFixed(1)}B</span>
                  <span className="text-[11px] flex items-center">
                    <ArrowDownRight className="w-3 h-3" />
                    -${Math.abs(mover.change?.value / 1000).toFixed(1)}B
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top 3 Spotlight Cards (Apple Liquid Glass) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_50_BILLIONAIRES.slice(0, 3).map((person) => {
          const isPositive = person.netWorthChangeDay >= 0;
          return (
            <Link
              key={person.id}
              href={`/p/${person.slug}`}
              className="group liquid-glass rounded-3xl p-6 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black flex items-center justify-center text-xs font-bold">
                    #{person.rank}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>
                      {person.currentCity}, {person.currentCountry}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-accent transition-colors flex items-center space-x-1.5">
                    <span>{person.name}</span>
                    <ShieldCheck className="w-4 h-4 text-accent inline" />
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{person.mainCompany}</p>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                    ${person.netWorth.toFixed(1)}B
                  </div>
                  <div
                    className={`text-xs font-semibold mt-1 flex items-center ${
                      isPositive ? "text-gain" : "text-loss"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {isPositive ? "+" : ""}
                    ${Math.abs(person.netWorthChangeDay).toFixed(1)}B today ({isPositive ? "+" : ""}
                    {person.netWorthChangePercent}%)
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>View Full Timeline & Legal</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Leaderboard Section */}
      <section className="space-y-6" id="leaderboard">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">The 50 Tech Titans Leaderboard</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Live calculated valuation based on verified public shares, private rounds, and SEC filings.
            </p>
          </div>

          {/* Search & Country Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search name, company, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="liquid-glass rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent w-56 placeholder-neutral-400"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent bg-transparent cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-black">
                All Countries ({uniqueCountries.length})
              </option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-black">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Billionaires */}
        <div className="liquid-glass rounded-3xl overflow-hidden border border-apple-borderLight dark:border-apple-borderDark">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-900/40 text-neutral-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Net Worth</th>
                  <th className="py-3.5 px-4">24h Change</th>
                  <th className="py-3.5 px-4">Current Residence</th>
                  <th className="py-3.5 px-4">Primary Company</th>
                  <th className="py-3.5 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/40 dark:divide-neutral-800/60">
                {filteredPeople.map((person) => {
                  const isPositive = person.netWorthChangeDay >= 0;
                  return (
                    <tr
                      key={person.id}
                      className="hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-400">
                        #{person.rank}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        <Link
                          href={`/p/${person.slug}`}
                          className="hover:underline flex items-center space-x-1.5"
                        >
                          <span>{person.name}</span>
                          {person.rank <= 5 && (
                            <ShieldCheck className="w-3.5 h-3.5 text-accent inline" />
                          )}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        ${person.netWorth.toFixed(1)}B
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center font-semibold ${
                            isPositive ? "text-gain" : "text-loss"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          ${Math.abs(person.netWorthChangeDay).toFixed(1)}B
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>
                            {person.currentCity}, {person.currentCountry}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-medium">
                        {person.mainCompany}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/p/${person.slug}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium liquid-glass hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Free Public API Section */}
      <section className="solid-card rounded-3xl p-8 space-y-4" id="api">
        <div className="flex items-center space-x-2 text-accent">
          <Code className="w-5 h-5" />
          <span className="font-semibold text-xs uppercase tracking-wider">
            Free Public API & RTB CDN Sync
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Integrate SuperRich Live Data For Free
        </h2>
        <p className="text-xs text-neutral-500 max-w-xl">
          Integrate real-time rankings, asset breakdowns, and billionaire data into your own applications with zero subscription costs.
        </p>

        <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200 border border-apple-borderLight dark:border-apple-borderDark">
          <div className="text-neutral-400">// Fetch Top Tech Billionaires Live</div>
          <div className="text-accent mt-1">
            curl -X GET https://superrich.tech/api/v1/rankings
          </div>
          <div className="text-neutral-400 mt-2">// Fetch Real-Time CDN Assets</div>
          <div className="text-accent mt-1">
            curl -X GET https://superrich.tech/api/rtb/profile/elon-musk
          </div>
        </div>
      </section>
    </div>
  );
}
