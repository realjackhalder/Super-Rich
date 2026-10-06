"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  LayoutGrid,
  List,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Globe2,
  ExternalLink,
  DollarSign,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { CompanyData } from "@/data/companies";

interface Props {
  initialCompanies: CompanyData[];
}

export default function CompaniesListClient({ initialCompanies }: Props) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [sortBy, setSortBy] = useState<"marketCapDesc" | "marketCapAsc" | "gainers" | "losers" | "rank">(
    "rank"
  );
  const [layoutView, setLayoutView] = useState<"grid" | "table">("grid");

  // Summary statistics
  const totalMarketCap = useMemo(() => {
    return initialCompanies.reduce((acc, c) => acc + c.marketCapBillion, 0);
  }, [initialCompanies]);

  const topGainer = useMemo(() => {
    return [...initialCompanies].sort((a, b) => b.changeDayPercent - a.changeDayPercent)[0];
  }, [initialCompanies]);

  const topCompany = initialCompanies[0];

  // Sector list
  const sectors = [
    "all",
    "Technology",
    "Consumer & Retail",
    "Financials",
    "Healthcare",
    "Energy",
    "Industrials",
    "Communication & Media",
    "Automotive",
  ];

  // Filtering & Sorting
  const filteredCompanies = useMemo(() => {
    let result = initialCompanies.filter((company) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.shortName.toLowerCase().includes(q) ||
        company.ticker.toLowerCase().includes(q) ||
        company.ceo.toLowerCase().includes(q) ||
        company.country.toLowerCase().includes(q);

      const matchesSector =
        selectedSector === "all" ||
        company.sector.toLowerCase() === selectedSector.toLowerCase();

      return matchesSearch && matchesSector;
    });

    return result.sort((a, b) => {
      if (sortBy === "marketCapDesc") return b.marketCapBillion - a.marketCapBillion;
      if (sortBy === "marketCapAsc") return a.marketCapBillion - b.marketCapBillion;
      if (sortBy === "gainers") return b.changeDayPercent - a.changeDayPercent;
      if (sortBy === "losers") return a.changeDayPercent - b.changeDayPercent;
      return a.rank - b.rank;
    });
  }, [initialCompanies, searchQuery, selectedSector, sortBy]);

  // Format valuation
  const formatValuation = (billions: number) => {
    if (billions >= 1000) {
      return `$${(billions / 1000).toFixed(2)}T`;
    }
    return `$${billions.toFixed(1)}B`;
  };

  return (
    <div className="space-y-10">
      {/* Real-time Status Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-neutral-200/40 dark:border-neutral-800/60 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gain animate-pulse"></span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
            SuperRich Global Enterprise Valuation Index
          </span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span className="text-neutral-500 font-mono text-[11px]">
            Tracking Top 100 Most Valued Public Corporations
          </span>
        </div>

        <div className="flex items-center space-x-3 text-neutral-500">
          <span className="text-[11px] font-mono">Live Market Capitalization Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
        </div>
      </section>

      {/* Hero Stats KPI Banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Aggregate Market Cap */}
        <div className="bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 shadow-sm dark:shadow-none space-y-2">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span className="font-medium uppercase tracking-wider text-[11px]">Top 100 Combined Value</span>
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            ${(totalMarketCap / 1000).toFixed(1)} Trillion
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Combined global market capitalization of all 100 index companies
          </p>
        </div>

        {/* KPI 2: #1 Most Valued */}
        <div className="bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 shadow-sm dark:shadow-none space-y-2">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span className="font-medium uppercase tracking-wider text-[11px]">#1 Most Valued Company</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight flex items-baseline space-x-2">
            <span>{topCompany.name}</span>
          </div>
          <p className="text-[11px] text-gain font-mono">
            {formatValuation(topCompany.marketCapBillion)} ({topCompany.ticker})
          </p>
        </div>

        {/* KPI 3: Top Daily Mover */}
        <div className="bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 shadow-sm dark:shadow-none space-y-2">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span className="font-medium uppercase tracking-wider text-[11px]">Top 24h Gainer</span>
            <TrendingUp className="w-4 h-4 text-gain" />
          </div>
          <div className="text-2xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight truncate">
            {topGainer.shortName}
          </div>
          <p className="text-[11px] text-gain font-mono">
            +{topGainer.changeDayPercent.toFixed(2)}% (+${topGainer.changeDayBillion.toFixed(1)}B)
          </p>
        </div>

        {/* KPI 4: Index Universe */}
        <div className="bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 shadow-sm dark:shadow-none space-y-2">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span className="font-medium uppercase tracking-wider text-[11px]">Global Exchanges</span>
            <Globe2 className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            100 Public Giants
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            NASDAQ, NYSE, EURONEXT, HKEX, TSE, KRX, BME
          </p>
        </div>
      </section>

      {/* Main Leaderboard Section */}
      <section className="space-y-6">
        {/* Title & Search / Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              {t("companies.title")}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t("companies.subtitle")}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t("filter.searchCompany")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1c1c1e] text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-full border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 shadow-sm dark:shadow-none transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Sector Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSector === sec
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold shadow-sm"
                    : "bg-white dark:bg-[#1c1c1e] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200/90 dark:border-neutral-800"
                }`}
              >
                {sec === "all" ? t("filter.allSectors") : sec}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative ml-auto sm:ml-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white dark:bg-[#1c1c1e] text-neutral-800 dark:text-neutral-200 text-xs rounded-full pl-4 pr-8 py-2 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 cursor-pointer shadow-sm dark:shadow-none"
            >
              <option value="rank">{t("filter.sortRank")}</option>
              <option value="marketCapDesc">{t("filter.sortCapDesc")}</option>
              <option value="marketCapAsc">{t("filter.sortCapAsc")}</option>
              <option value="gainers">{t("filter.sortGainers")}</option>
              <option value="losers">{t("filter.sortLosers")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Layout Toggle (Grid vs Table) */}
          <div className="flex items-center ml-auto">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono hidden sm:inline mr-3">
              {t("filter.showingCompanies", { current: filteredCompanies.length })}
            </span>
            <div className="flex items-center bg-white dark:bg-[#1c1c1e] rounded-full p-1 border border-neutral-200/90 dark:border-neutral-800 shadow-sm dark:shadow-none">
              <button
                onClick={() => setLayoutView("table")}
                className={`p-1.5 rounded-full transition-colors ${
                  layoutView === "table"
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutView("grid")}
                className={`p-1.5 rounded-full transition-colors ${
                  layoutView === "grid"
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Display: Card Grid OR Table */}
        {layoutView === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCompanies.map((company) => {
              const isPositive = company.changeDayBillion >= 0;

              return (
                <Link
                  key={company.id}
                  href={`/c/${company.slug}`}
                  className="group relative bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col justify-between shadow-sm p-5 space-y-4"
                >
                  {/* Top Header: Rank & Ticker */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      #{company.rank}
                    </span>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                      {company.ticker} • {company.exchange}
                    </span>
                  </div>

                  {/* Company Title & Sector */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white group-hover:text-accent transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate mt-0.5">
                      {company.sector} • {company.country}
                    </p>
                  </div>

                  {/* Market Cap & 24h Change */}
                  <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                        {formatValuation(company.marketCapBillion)}
                      </span>
                      <span
                        className={`text-xs font-semibold flex items-center space-x-0.5 font-mono ${
                          isPositive ? "text-gain" : "text-loss"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>
                          {isPositive ? "+" : ""}
                          {company.changeDayPercent.toFixed(2)}%
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                      <span>Share Price:</span>
                      <span className="text-neutral-800 dark:text-neutral-300 font-semibold">
                        ${company.sharePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Major Billionaires Section */}
                  {company.majorBillionaires.length > 0 && (
                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                      <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider mb-1.5 flex items-center space-x-1">
                        <UserCheck className="w-3 h-3 text-accent" />
                        <span>Key Billionaire Stakeholder</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {company.majorBillionaires.slice(0, 2).map((stake) => (
                          <span
                            key={stake.slug}
                            onClick={(e) => {
                              // Allow opening billionaire profile without triggering card link
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/p/${stake.slug}`;
                            }}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            title={`View `}
                          >
                            <span>{stake.name}</span>
                            {stake.stakePercent && (
                              <span className="text-neutral-500 dark:text-neutral-400">
                                ({stake.stakePercent}%)
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer CEO & Link indicator */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="truncate max-w-[170px]">CEO: {company.ceo}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="liquid-glass rounded-3xl overflow-hidden border border-surface-borderLight dark:border-surface-borderDark shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-900/40 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">{t("th.rank")}</th>
                    <th className="py-3.5 px-4">{t("th.company")}</th>
                    <th className="py-3.5 px-4">{t("th.marketCap")}</th>
                    <th className="py-3.5 px-4">{t("th.change24h")}</th>
                    <th className="py-3.5 px-4">{t("th.sharePrice")}</th>
                    <th className="py-3.5 px-4">{t("th.sector")}</th>
                    <th className="py-3.5 px-4">Country & HQ</th>
                    <th className="py-3.5 px-4">Major Billionaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 dark:divide-neutral-800/60">
                  {filteredCompanies.map((company) => {
                    const isPositive = company.changeDayBillion >= 0;

                    return (
                      <tr
                        key={company.id}
                        onClick={() => window.location.href = `/c/${company.slug}`}
                        className="hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 transition-colors group cursor-pointer"
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300 font-mono">
                            #{company.rank}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                          <Link
                            href={`/c/${company.slug}`}
                            className="flex items-center space-x-3 hover:text-accent transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-bold font-mono text-neutral-800 dark:text-neutral-200 shrink-0">
                              {company.ticker.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5 font-serif font-bold text-sm">
                                <span>{company.name}</span>
                              </div>
                              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                                {company.ticker} • {company.exchange}
                              </div>
                            </div>
                          </Link>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                          <div className="flex items-center space-x-1.5 font-serif text-sm">
                            <span>{formatValuation(company.marketCapBillion)}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            ${company.marketCapBillion.toFixed(1)}B USD
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold">
                          <span
                            className={`inline-flex items-center space-x-0.5 font-mono ${
                              isPositive ? "text-gain" : "text-loss"
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span>
                              {isPositive ? "+" : ""}
                              {company.changeDayPercent.toFixed(2)}%
                            </span>
                          </span>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {isPositive ? "+" : ""}${Math.abs(company.changeDayBillion).toFixed(1)}B
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-800 dark:text-neutral-300 font-semibold">
                          ${company.sharePrice.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                          {company.sector}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-500">
                          <div className="truncate max-w-[140px] text-neutral-800 dark:text-neutral-300 font-medium">
                            {company.country}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                            {company.headquarters}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {company.majorBillionaires.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {company.majorBillionaires.map((b) => (
                                <Link
                                  key={b.slug}
                                  href={`/p/${b.slug}`}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                >
                                  {b.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-400 italic">Institutional</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Corporate Intelligence Footnote */}
      <section className="bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-7 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent uppercase tracking-wider">
              <Building2 className="w-3 h-3 mr-1 inline" />
              <span>Real-Time Corporate Valuation Engine</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Cross-Linked Global Wealth & Equity Graph
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
              SuperRich indexes equity ownership from regulatory SEC Form 4 and 13F filings, cross-linking public enterprise valuations directly with global billionaire net worth portfolios.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity shadow-sm"
            >
              View Billionaires Index
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
