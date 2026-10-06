"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  TrendingUp,
  Globe2,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  DollarSign,
  Share2,
  Calendar,
  Users,
  MapPin,
  Layers,
  Sparkles,
} from "lucide-react";
import { CompanyData } from "@/data/companies";

interface Props {
  company: CompanyData;
}

export default function CompanyProfileClient({ company }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "billionaires" | "financials">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "billionaires" || tabParam === "financials" || tabParam === "overview") {
        return tabParam;
      }
    }
    return "overview";
  });
  const [copied, setCopied] = useState(false);

  const isPositive = company.changeDayBillion >= 0;

  const formatValuation = (billions: number) => {
    if (billions >= 1000) {
      return `$${(billions / 1000).toFixed(2)} Trillion`;
    }
    return `$${billions.toFixed(1)} Billion`;
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex items-center justify-between">
        <Link
          href="/companies"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Top 100 Companies</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#1c1c1e] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? "Link Copied!" : "Share Profile"}</span>
        </button>
      </div>

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#18181c] dark:to-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Rank Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm">
            #{company.rank} Most Valued Worldwide
          </span>

          {/* Ticker & Exchange Pill */}
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-50 dark:bg-[#222226] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            {company.ticker} • {company.exchange}
          </span>

          {/* Sector Pill */}
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/80">
            {company.sector}
          </span>

          {/* Real-time sync badge */}
          <span className="ml-auto inline-flex items-center space-x-1.5 text-[11px] font-mono text-gain">
            <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
            <span>Live Market Capitalization</span>
          </span>
        </div>

        {/* Company Title & Valuation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
          <div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              {company.name}
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
              Headquartered in {company.headquarters} • Led by CEO {company.ceo}
            </p>
          </div>

          {/* Big Market Cap Display */}
          <div className="bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-700/80 rounded-2xl p-5 sm:p-6 lg:min-w-[320px] space-y-2 text-right">
            <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
              Enterprise Market Capitalization
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              {formatValuation(company.marketCapBillion)}
            </div>
            <div className="flex items-center justify-end space-x-2 text-xs font-mono">
              <span
                className={`inline-flex items-center space-x-0.5 font-bold ${
                  isPositive ? "text-gain" : "text-loss"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {company.changeDayPercent.toFixed(2)}% ({isPositive ? "+" : ""}${Math.abs(company.changeDayBillion).toFixed(1)}B 24h)
                </span>
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              Share Price: <span className="text-neutral-900 dark:text-white font-mono font-semibold">${company.sharePrice.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Financial & Operating Metrics Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Share Price</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">${company.sharePrice.toFixed(2)}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{company.ticker}</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">P/E Ratio</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.peRatio ? `${company.peRatio.toFixed(1)}x` : "N/A"}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Price to Earnings</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Annual Revenue</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">
            {company.annualRevenueBillion ? `$${company.annualRevenueBillion.toFixed(1)}B` : "N/A"}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">TTM Revenue</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Founded</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.foundedYear}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{new Date().getFullYear() - company.foundedYear} Years Active</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Employees</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.employees}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Global Workforce</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Exchange</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.exchange}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{company.country}</div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === "overview"
              ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-white dark:bg-[#1c1c1e] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
          }`}
        >
          Company Overview & Divisions
        </button>

        <button
          onClick={() => setActiveTab("billionaires")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
            activeTab === "billionaires"
              ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-white dark:bg-[#1c1c1e] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Billionaire Stakeholders ({company.majorBillionaires.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("financials")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === "financials"
              ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
              : "bg-white dark:bg-[#1c1c1e] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
          }`}
        >
          Financial & Trading Multiples
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-accent" />
              <span>Corporate Overview</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
              {company.description}
            </p>
          </div>

          {/* Key Divisions & Products */}
          <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-accent" />
              <span>Core Business Divisions & Flagship Offerings</span>
            </h2>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {company.keyProducts.map((prod) => (
                <div
                  key={prod}
                  className="px-4 py-2 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>{prod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Billionaire Stakeholders */}
      {activeTab === "billionaires" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-accent" />
                <span>Billionaire Equity Ownership & Executive Control</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Individual shareholders with substantial beneficial ownership and corporate control in {company.name}.
              </p>
            </div>

            {company.majorBillionaires.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.majorBillionaires.map((stake) => (
                  <div
                    key={stake.slug}
                    className="bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
                          {stake.name}
                        </span>
                        {stake.stakePercent && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gain/15 text-gain">
                            {stake.stakePercent}% Equity
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {stake.role}
                      </p>
                    </div>

                    {stake.stakeValueBillion && (
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-baseline justify-between text-xs font-mono">
                        <span className="text-neutral-500 dark:text-neutral-400">Estimated Stake Value:</span>
                        <span className="text-neutral-900 dark:text-white font-bold text-sm">
                          ${stake.stakeValueBillion.toFixed(2)} Billion
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        href={`/p/${stake.slug}`}
                        className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                      >
                        <span>View {stake.name}&apos;s Profile</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-neutral-600" />
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Widely Distributed Public Equity
                </p>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  {company.name} is primarily held by institutional asset managers (e.g. Vanguard, BlackRock, State Street) with no individual single billionaire controlling a &gt;1% block.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Financials */}
      {activeTab === "financials" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-accent" />
              <span>Valuation & Financial Multiples</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Market Cap</div>
                <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">${company.marketCapBillion.toFixed(1)}B USD</div>
                <div className="text-[10px] text-neutral-500">Total Enterprise Equity Value</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Share Price</div>
                <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">${company.sharePrice.toFixed(2)} USD</div>
                <div className="text-[10px] text-neutral-500">{company.exchange}:{company.ticker}</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">P/E Ratio</div>
                <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">{company.peRatio ? `${company.peRatio}x` : "N/A"}</div>
                <div className="text-[10px] text-neutral-500">Trailing Twelve Months</div>
              </div>

              {company.fiftyTwoWeekHigh && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">52-Week Range</div>
                  <div className="text-base font-mono font-bold text-neutral-900 dark:text-white">
                    ${company.fiftyTwoWeekLow} - ${company.fiftyTwoWeekHigh}
                  </div>
                  <div className="text-[10px] text-neutral-500">1-Year High / Low</div>
                </div>
              )}

              {company.annualRevenueBillion && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Annual Revenue</div>
                  <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">${company.annualRevenueBillion.toFixed(1)}B</div>
                  <div className="text-[10px] text-neutral-500">Consolidated Top-Line</div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Trading Status</div>
                <div className="text-base font-mono font-bold text-gain flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
                  <span>Active & Liquid</span>
                </div>
                <div className="text-[10px] text-neutral-500">{company.exchange} Real-Time Feed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Strip */}
      <section className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
            Explore All 100 Most Valued Companies
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Compare market caps, sector distribution, and major shareholder networks.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/companies"
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
          >
            Companies Leaderboard
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-full text-xs font-semibold bg-neutral-50 dark:bg-[#222226] text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-[#2c2c30] transition-colors"
          >
            Billionaires Leaderboard (/p/)
          </Link>
        </div>
      </section>
    </div>
  );
}
