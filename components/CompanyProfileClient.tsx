"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  Globe,
  Users,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Briefcase,
  DollarSign,
  Share2,
  ExternalLink,
} from "lucide-react";
import { CompanyData } from "@/data/companies";
import { CompanyLogo } from "@/components/CompanyLogo";

interface Props {
  company: CompanyData;
}

export default function CompanyProfileClient({ company: initialCompany }: Props) {
  const [company, setCompany] = useState<CompanyData>(initialCompany);
  const [activeTab, setActiveTab] = useState<"overview" | "billionaires" | "financials">("overview");

  const companyGrokSlug = company.name
    .replace(/\s*Inc\.?/gi, "")
    .replace(/\s*Corp\.?/gi, "")
    .replace(/\s*Ltd\.?/gi, "")
    .replace(/\s*Co\.?/gi, "")
    .replace(/\s*Plc\.?/gi, "")
    .replace(/\s*N\.V\.?/gi, "")
    .replace(/\s*S\.A\.?/gi, "")
    .trim()
    .replace(/\s+/g, "_");
  const grokipediaUrl = `https://grokipedia.com/page/${encodeURIComponent(companyGrokSlug)}`;
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(company.name.replace(/\s+/g, "_"))}`;

  // Real-time live update for this company
  useEffect(() => {
    async function syncCompany() {
      if (["PRIVATE", "SPACEX", "BYTEDANCE", "OPENAI"].includes(initialCompany.ticker)) return;
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const json = await res.json();
          const match = json?.companies?.find((c: CompanyData) => c.slug === initialCompany.slug);
          if (match) setCompany(match);
        }
      } catch (err) {
        console.warn("[CompanyProfile] Live sync failed:", err);
      }
    }
    syncCompany();
  }, [initialCompany.slug, initialCompany.ticker]);

  const isPositive = company.changeDayPercent >= 0;

  // Format valuation
  const formatValuation = (billions: number) => {
    if (billions >= 1000) {
      return `$${(billions / 1000).toFixed(2)} Trillion`;
    }
    return `$${billions.toFixed(1)} Billion`;
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <nav className="flex items-center justify-between text-xs text-neutral-500">
        <Link
          href="/companies"
          className="inline-flex items-center space-x-1.5 hover:text-black dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Top 100 Companies Leaderboard</span>
        </Link>
        <span className="font-mono text-[11px]">Rank #{company.rank} Worldwide</span>
      </nav>

      {/* Header Profile Hero Card */}
      <section className="bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Rank Badge */}
          <span className="px-3 py-1 rounded-full font-mono font-bold bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm">
            #{company.rank} Most Valued Worldwide
          </span>

          {/* Ticker & Exchange */}
          <span className="px-3 py-1 rounded-full font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
            {company.ticker} • {company.exchange}
          </span>

          {/* Sector Pill */}
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/80">
            {company.sector}
          </span>

          {/* Read on Grokipedia Chip */}
          <a
            href={grokipediaUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-full text-xs font-semibold hover:bg-purple-500/15 dark:hover:bg-purple-900/40 flex items-center space-x-1.5 transition-all border border-purple-500/40 text-purple-600 dark:text-purple-300 shadow-sm group"
            title="Read company intelligence on xAI Grokipedia"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform" />
            <span>Read on Grokipedia</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Wikipedia Chip */}
          <a
            href={wikipediaUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1.5 transition-colors border border-neutral-200/80 dark:border-neutral-700/80 text-blue-600 dark:text-blue-400"
            title="Read article on Wikipedia"
          >
            <span className="font-serif font-bold text-xs">W</span>
            <span>Wikipedia</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Real-time sync badge */}
          <span className="ml-auto inline-flex items-center space-x-1.5 text-[11px] font-mono text-gain">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gain"></span>
            </span>
            <span>Live Market Capitalization</span>
          </span>
        </div>

        {/* Company Title & Valuation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
          <div className="flex items-start sm:items-center space-x-4">
            <CompanyLogo
              slug={company.slug}
              ticker={company.ticker}
              name={company.name}
              containerClassName="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 shadow-md"
            />
            <div>
              <h1 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {company.name}
              </h1>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl font-sans">
                Headquartered in {company.headquarters} • Led by CEO {company.ceo}
              </p>
            </div>
          </div>

          {/* Big Market Cap Display */}
          <div className="bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-700/80 rounded-2xl p-5 sm:p-6 lg:min-w-[320px] space-y-2 text-right">
            <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium font-sans">
              Enterprise Market Capitalization
            </div>
            <div className="text-3xl sm:text-4xl font-sans font-extrabold text-neutral-900 dark:text-white tracking-tight">
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
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200 dark:border-neutral-800 font-sans">
              Share Price: <span className="text-neutral-900 dark:text-white font-mono font-semibold">${company.sharePrice.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Financial & Operating Metrics Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium font-sans">Share Price</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">${company.sharePrice.toFixed(2)}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{company.ticker}</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium font-sans">P/E Ratio</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.peRatio ? `${company.peRatio.toFixed(1)}x` : "N/A"}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">Price to Earnings</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium font-sans">Annual Revenue</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">
            {company.annualRevenueBillion ? `$${company.annualRevenueBillion.toFixed(1)}B` : "N/A"}
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">TTM Revenue</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium font-sans">Founded</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.foundedYear}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">{new Date().getFullYear() - company.foundedYear} Years Active</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium font-sans">Employees</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.employees}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">Global Workforce</div>
        </div>

        <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium font-sans">Exchange</div>
          <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-white">{company.exchange}</div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">{company.country}</div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-sm font-semibold space-x-6 font-sans">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === "overview"
              ? "border-accent text-neutral-900 dark:text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Overview & Divisions</span>
        </button>

        <button
          onClick={() => setActiveTab("billionaires")}
          className={`pb-3 transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === "billionaires"
              ? "border-accent text-neutral-900 dark:text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Billionaire Stakeholders ({company.majorBillionaires.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("financials")}
          className={`pb-3 transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === "financials"
              ? "border-accent text-neutral-900 dark:text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Financial & Trading Multiples</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-sans font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-accent" />
              <span>Corporate Overview</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base font-sans">
              {company.description}
            </p>
            <div className="pt-2 text-[11px] text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-neutral-100 dark:border-neutral-800/80">
              <span>Source: SEC Filings & Global Market Exchanges</span>
              <span>•</span>
              <a
                href={wikipediaUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:underline inline-flex items-center space-x-1 font-sans"
              >
                <span>Read full article on Wikipedia</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <span>•</span>
              <a
                href={grokipediaUrl}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline inline-flex items-center space-x-1 font-sans"
              >
                <span>Read on Grokipedia</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Key Divisions & Products */}
          <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-sans font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-accent" />
              <span>Core Business Divisions & Flagship Offerings</span>
            </h2>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {company.keyProducts.map((prod) => (
                <div
                  key={prod}
                  className="px-4 py-2 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center space-x-2 font-sans"
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
              <h2 className="text-xl font-sans font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-accent" />
                <span>Billionaire Equity Ownership & Executive Control</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
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
                        <span className="font-sans font-bold text-lg text-neutral-900 dark:text-white">
                          {stake.name}
                        </span>
                        {stake.stakePercent && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gain/15 text-gain">
                            {stake.stakePercent}% Equity
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium font-sans">
                        {stake.role}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between">
                      <div className="text-xs font-mono">
                        <span className="text-neutral-400 text-[11px]">Beneficial Stake Value: </span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {stake.stakeValueBillion
                            ? `$${stake.stakeValueBillion.toFixed(2)}B USD`
                            : "Substantial Holdings"}
                        </span>
                      </div>
                      <Link
                        href={`/p/${stake.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 font-sans"
                      >
                        <span>View Dossier</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-2 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl font-sans">
                <Users className="w-8 h-8 text-neutral-400 mx-auto" />
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Institutional Ownership Predominant
                </div>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  {company.name} is primarily held by public institutional index funds (Vanguard, BlackRock, State Street) with no single individual holding a qualifying billionaire equity block.
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
            <h2 className="text-xl font-sans font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-accent" />
              <span>Valuation & Financial Multiples</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold font-sans">Market Cap</div>
                <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">${company.marketCapBillion.toFixed(1)}B USD</div>
                <div className="text-[10px] text-neutral-500 font-sans">Total Enterprise Equity Value</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold font-sans">Share Price</div>
                <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">${company.sharePrice.toFixed(2)} USD</div>
                <div className="text-[10px] text-neutral-500 font-mono">{company.exchange}:{company.ticker}</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold font-sans">P/E Ratio</div>
                <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">{company.peRatio ? `${company.peRatio}x` : "N/A"}</div>
                <div className="text-[10px] text-neutral-500 font-sans">Trailing Twelve Months</div>
              </div>

              {company.fiftyTwoWeekHigh && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold font-sans">52-Week Range</div>
                  <div className="text-base font-mono font-bold text-neutral-900 dark:text-white">
                    ${company.fiftyTwoWeekLow} - ${company.fiftyTwoWeekHigh}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-sans">1-Year High / Low</div>
                </div>
              )}

              {company.annualRevenueBillion && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold font-sans">Annual Revenue</div>
                  <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white">${company.annualRevenueBillion.toFixed(1)}B</div>
                  <div className="text-[10px] text-neutral-500 font-sans">Consolidated Top-Line</div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold font-sans">Trading Status</div>
                <div className="text-base font-mono font-bold text-gain flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
                  <span>Active & Liquid</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-sans">{company.exchange} Real-Time Feed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Strip */}
      <section className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div>
          <h3 className="font-sans font-bold text-lg text-neutral-900 dark:text-white">
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
            Billionaires Leaderboard
          </Link>
        </div>
      </section>
    </div>
  );
}
