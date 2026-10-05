"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  TrendingUp,
  Code,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export interface DisplayBillionaire {
  id: string | number;
  slug: string;
  name: string;
  rank: number;
  rankDiff?: number;
  flag?: string;
  netWorth: number; // in billions
  netWorthChangeDay: number; // in billions
  netWorthChangePercent: number;
  currentCountry: string;
  currentCity: string;
  mainCompany: string;
  photoUrl?: string;
  isTechTitan: boolean;
  hasFullProfile: boolean;
  isLive: boolean;
}

const COUNTRY_NAMES: Record<string, string> = {
  us: "United States",
  cn: "China",
  fr: "France",
  in: "India",
  de: "Germany",
  jp: "Japan",
  gb: "United Kingdom",
  uk: "United Kingdom",
  ca: "Canada",
  mx: "Mexico",
  br: "Brazil",
  es: "Spain",
  it: "Italy",
  ch: "Switzerland",
  ru: "Russia",
  au: "Australia",
  sg: "Singapore",
  kr: "South Korea",
  id: "Indonesia",
  tw: "Taiwan",
  hk: "Hong Kong",
  se: "Sweden",
  nl: "Netherlands",
  il: "Israel",
  za: "South Africa",
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [viewMode, setViewMode] = useState<"tech" | "global">("tech");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");
  const [isLiveActive, setIsLiveActive] = useState(false);

  // Stats from the Real-Time Billionaires API
  const [rtbStats, setRtbStats] = useState<{
    date?: string;
    total?: number;
    count?: number;
    topGainers?: any[];
    topLosers?: any[];
  } | null>(null);

  // Dynamic live lists
  const [techTitans, setTechTitans] = useState<DisplayBillionaire[]>(() =>
    INITIAL_50_BILLIONAIRES.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      rank: p.rank,
      netWorth: p.netWorth,
      netWorthChangeDay: p.netWorthChangeDay,
      netWorthChangePercent: p.netWorthChangePercent,
      currentCountry: p.currentCountry,
      currentCity: p.currentCity,
      mainCompany: p.mainCompany,
      photoUrl: p.photoUrl,
      isTechTitan: true,
      hasFullProfile: true,
      isLive: false,
    }))
  );

  const [globalList, setGlobalList] = useState<DisplayBillionaire[]>([]);

  // Real-time fetch handler
  const fetchRealtimeData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/rtb/list");
      if (!res.ok) throw new Error("Failed to load RTB feed");
      const json = await res.json();

      if (json?.data?.list && Array.isArray(json.data.list)) {
        const liveItems: any[] = json.data.list;

        // 1. Sort movers
        const sortedByGain = [...liveItems].sort(
          (a, b) => (b.change?.value || 0) - (a.change?.value || 0)
        );
        const sortedByLoss = [...liveItems].sort(
          (a, b) => (a.change?.value || 0) - (b.change?.value || 0)
        );

        setRtbStats({
          date: json.data.date,
          total: json.data.total,
          count: json.data.count,
          topGainers: sortedByGain.slice(0, 3),
          topLosers: sortedByLoss.slice(0, 3),
        });

        // 2. Map INITIAL_50_BILLIONAIRES with live RTB data
        const updatedTech = INITIAL_50_BILLIONAIRES.map((person) => {
          const match = liveItems.find(
            (item) =>
              item.uri?.toLowerCase() === person.slug.toLowerCase() ||
              item.name?.toLowerCase().trim() === person.name.toLowerCase().trim()
          );

          if (match && match.networth) {
            return {
              id: person.id,
              slug: person.slug,
              name: person.name,
              rank: match.rank || person.rank,
              rankDiff: match.diff ?? 0,
              flag: match.flag || "unchanged",
              netWorth: match.networth / 1000,
              netWorthChangeDay: match.change?.value
                ? match.change.value / 1000
                : person.netWorthChangeDay,
              netWorthChangePercent: match.change?.pct ?? person.netWorthChangePercent,
              currentCountry: person.currentCountry,
              currentCity: person.currentCity,
              mainCompany:
                match.source && match.source.length > 0
                  ? match.source.join(" & ")
                  : person.mainCompany,
              photoUrl: person.photoUrl,
              isTechTitan: true,
              hasFullProfile: true,
              isLive: true,
            };
          }

          return {
            id: person.id,
            slug: person.slug,
            name: person.name,
            rank: person.rank,
            netWorth: person.netWorth,
            netWorthChangeDay: person.netWorthChangeDay,
            netWorthChangePercent: person.netWorthChangePercent,
            currentCountry: person.currentCountry,
            currentCity: person.currentCity,
            mainCompany: person.mainCompany,
            photoUrl: person.photoUrl,
            isTechTitan: true,
            hasFullProfile: true,
            isLive: false,
          };
        });

        // Sort tech titans by their live net worth descending
        updatedTech.sort((a, b) => b.netWorth - a.netWorth);
        setTechTitans(updatedTech);

        // 3. Build global Top 100 live list
        const updatedGlobal: DisplayBillionaire[] = liveItems.slice(0, 100).map((item, idx) => {
          const matchedInitial = INITIAL_50_BILLIONAIRES.find(
            (p) =>
              p.slug.toLowerCase() === item.uri?.toLowerCase() ||
              p.name.toLowerCase().trim() === item.name?.toLowerCase().trim()
          );

          const countryCode = (item.citizenship || "").toLowerCase();
          const country =
            matchedInitial?.currentCountry ||
            COUNTRY_NAMES[countryCode] ||
            item.citizenship?.toUpperCase() ||
            "Global";

          const city =
            matchedInitial?.currentCity ||
            (country !== "Global" ? country : "International");

          return {
            id: matchedInitial?.id ?? `rtb-${item.rank || idx}`,
            slug: matchedInitial?.slug || item.uri || item.name.toLowerCase().replace(/\s+/g, "-"),
            name: item.name,
            rank: item.rank || idx + 1,
            rankDiff: item.diff ?? 0,
            flag: item.flag || "unchanged",
            netWorth: item.networth ? item.networth / 1000 : 0,
            netWorthChangeDay: item.change?.value ? item.change.value / 1000 : 0,
            netWorthChangePercent: item.change?.pct || 0,
            currentCountry: country,
            currentCity: city,
            mainCompany:
              item.source && item.source.length > 0
                ? item.source.join(" & ")
                : matchedInitial?.mainCompany || item.industry?.[0] || "Global Enterprise",
            photoUrl: matchedInitial?.photoUrl,
            isTechTitan: Boolean(matchedInitial),
            hasFullProfile: Boolean(matchedInitial),
            isLive: true,
          };
        });

        setGlobalList(updatedGlobal);
        setIsLiveActive(true);
        setLastSyncedTime(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      }
    } catch (err) {
      console.warn("RTB live fetch error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 60000); // 60s background sync
    return () => clearInterval(interval);
  }, [fetchRealtimeData]);

  // Current active list based on view mode
  const activeList = viewMode === "tech" ? techTitans : globalList;

  // Filter based on search & country
  const filteredPeople = activeList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mainCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.currentCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "all" || p.currentCountry === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  // Extract unique countries from active list
  const uniqueCountries = Array.from(
    new Set(activeList.map((p) => p.currentCountry).filter(Boolean))
  ).sort();

  // Dynamically calculated combined wealth of the displayed list
  const displayedCombinedWealth = filteredPeople.reduce(
    (acc, curr) => acc + curr.netWorth,
    0
  );

  // Real-time top 3 spotlight cards
  const topThreeSpotlight = activeList.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-6 md:py-10 space-y-4">
        {/* Live Status Badge & Sync Control */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs liquid-glass text-neutral-700 dark:text-neutral-300 border border-surface-borderLight dark:border-surface-borderDark">
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveActive ? "bg-gain animate-pulse" : "bg-amber-400"
            }`}
          ></span>
          <span className="font-semibold">
            {isLiveActive
              ? `Real-Time CDN Tracking ${rtbStats?.count ? rtbStats.count.toLocaleString() : "3,400+"} Global Billionaires`
              : "Connecting to Real-Time Billionaires Feed..."}
          </span>
          <span className="text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-[11px] text-neutral-500 font-mono">
            {isSyncing ? "Syncing..." : `Updated ${lastSyncedTime}`}
          </span>
          <button
            onClick={fetchRealtimeData}
            disabled={isSyncing}
            className="ml-1 hover:text-black dark:hover:text-white transition-transform active:rotate-180 disabled:opacity-50"
            title="Refresh Real-Time Data"
          >
            <RefreshCw
              className={`w-3 h-3 text-neutral-500 hover:text-accent ${
                isSyncing ? "animate-spin text-accent" : ""
              }`}
            />
          </button>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white">
          The Real-Time Wealth Index
        </h1>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Live valuations, verified SEC shareholdings, historical progression, and global billionaire intelligence powered by real-time RTB feeds.
        </p>

        {/* Global Wealth Stats Card */}
        <div className="max-w-2xl mx-auto pt-4">
          <div className="liquid-glass rounded-3xl p-6 shadow-sm flex items-center justify-around text-center border border-surface-borderLight dark:border-surface-borderDark">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {viewMode === "tech" ? "Top 50 Tech Titans" : "Top 100 Global"}
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
                ${(displayedCombinedWealth / 1000).toFixed(2)}T
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
                  : "$20.43T"}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-neutral-300 dark:bg-neutral-800"></div>
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Feed Status
              </div>
              <div className="text-sm md:text-base font-semibold text-gain flex items-center justify-center mt-1">
                <span className="w-2 h-2 rounded-full bg-gain mr-1.5 animate-pulse"></span>
                {isLiveActive ? "Live Sync Active" : "Initializing"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Movers Strip */}
      {rtbStats?.topGainers && rtbStats.topGainers.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold px-2">
            <span className="uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-gain" />
              <span>Today's Top Daily Movers (RTB Live CDN)</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              real-time feed • {rtbStats.date}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {rtbStats.topGainers.map((mover, idx) => (
              <div
                key={`gain-${idx}`}
                className="liquid-glass rounded-2xl p-3 space-y-1 text-xs border border-surface-borderLight dark:border-surface-borderDark"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{mover.name}</span>
                  <span className="text-neutral-400 text-[10px]">#{mover.rank}</span>
                </div>
                <div className="flex items-center justify-between text-gain font-semibold">
                  <span>${(mover.networth / 1000).toFixed(1)}B</span>
                  <span className="text-[11px] flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +${(mover.change?.value / 1000).toFixed(1)}B
                  </span>
                </div>
              </div>
            ))}
            {rtbStats.topLosers?.map((mover, idx) => (
              <div
                key={`loss-${idx}`}
                className="liquid-glass rounded-2xl p-3 space-y-1 text-xs border border-surface-borderLight dark:border-surface-borderDark"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{mover.name}</span>
                  <span className="text-neutral-400 text-[10px]">#{mover.rank}</span>
                </div>
                <div className="flex items-center justify-between text-loss font-semibold">
                  <span>${(mover.networth / 1000).toFixed(1)}B</span>
                  <span className="text-[11px] flex items-center">
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    -${Math.abs(mover.change?.value / 1000).toFixed(1)}B
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top 3 Spotlight Cards (Dynamically populated from live feed) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThreeSpotlight.map((person, idx) => {
          const isPositive = person.netWorthChangeDay >= 0;
          return (
            <Link
              key={person.id}
              href={`/p/${person.slug}`}
              className="group liquid-glass rounded-3xl p-6 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between border border-surface-borderLight dark:border-surface-borderDark relative overflow-hidden"
            >
              {/* Subtle accent glow for #1 */}
              {idx === 0 && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gain/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8"></div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black flex items-center justify-center text-xs font-bold shadow-sm">
                      #{person.rank}
                    </span>
                    {person.isLive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gain/15 text-gain">
                        <span className="w-1.5 h-1.5 rounded-full bg-gain mr-1 animate-pulse"></span>
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate max-w-[140px]">
                      {person.currentCity}, {person.currentCountry}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-accent transition-colors flex items-center space-x-1.5">
                    <span>{person.name}</span>
                    <ShieldCheck className="w-4 h-4 text-accent inline shrink-0" />
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{person.mainCompany}</p>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-baseline space-x-2">
                    <span>${person.netWorth.toFixed(1)}B</span>
                  </div>
                  <div
                    className={`text-xs font-semibold mt-1 flex items-center ${
                      isPositive ? "text-gain" : "text-loss"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}${Math.abs(person.netWorthChangeDay).toFixed(1)}B today ({isPositive ? "+" : ""}
                      {person.netWorthChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>View Full Profile & Dossier</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Leaderboard Section */}
      <section className="space-y-6" id="leaderboard">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {viewMode === "tech" ? "Top 50 Tech Titans" : "Global Billionaires Leaderboard"}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
                {filteredPeople.length} Listed
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Live calculated net worth synced from global exchange valuations, asset portfolios, and RTB API.
            </p>
          </div>

          {/* View Mode Toggle + Search & Country Filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center rounded-full p-1 bg-neutral-200/60 dark:bg-neutral-800/60 text-xs font-semibold">
              <button
                onClick={() => setViewMode("tech")}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === "tech"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Tech Titans
              </button>
              <button
                onClick={() => setViewMode("global")}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === "global"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Global Top 100
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search name, company, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="liquid-glass rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent w-48 sm:w-56 placeholder-neutral-400 border border-surface-borderLight dark:border-surface-borderDark"
              />
            </div>

            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent bg-transparent cursor-pointer border border-surface-borderLight dark:border-surface-borderDark"
            >
              <option value="all" className="bg-white dark:bg-neutral-900">
                All Countries ({uniqueCountries.length})
              </option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-neutral-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Billionaires with Live Indicators */}
        <div className="liquid-glass rounded-3xl overflow-hidden border border-surface-borderLight dark:border-surface-borderDark shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-900/40 text-neutral-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Net Worth</th>
                  <th className="py-3.5 px-4">24h Change</th>
                  <th className="py-3.5 px-4">Current Residence</th>
                  <th className="py-3.5 px-4">Primary Company / Source</th>
                  <th className="py-3.5 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/40 dark:divide-neutral-800/60">
                {filteredPeople.map((person) => {
                  const isPositive = person.netWorthChangeDay >= 0;
                  return (
                    <tr
                      key={person.id}
                      className="hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 transition-colors group"
                    >
                      {/* Rank & Diff Flag */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">
                            #{person.rank}
                          </span>
                          {person.rankDiff && person.rankDiff !== 0 ? (
                            <span
                              className={`text-[10px] font-semibold ${
                                person.rankDiff > 0 ? "text-gain" : "text-loss"
                              }`}
                              title={`${person.rankDiff > 0 ? "Up" : "Down"} ${Math.abs(
                                person.rankDiff
                              )} positions`}
                            >
                              {person.rankDiff > 0 ? `+${person.rankDiff}` : person.rankDiff}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        <Link
                          href={`/p/${person.slug}`}
                          className="hover:underline flex items-center space-x-1.5"
                        >
                          <span>{person.name}</span>
                          {person.hasFullProfile && (
                            <span
                              title="Verified Dossier & Timeline"
                              className="inline-flex items-center"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-accent inline shrink-0" />
                            </span>
                          )}
                        </Link>
                      </td>

                      {/* Net Worth */}
                      <td className="py-3.5 px-4 font-extrabold text-neutral-900 dark:text-white">
                        <span className="inline-flex items-center space-x-1.5">
                          <span>${person.netWorth.toFixed(1)}B</span>
                          {person.isLive && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse inline-block"
                              title="Live sync verified"
                            ></span>
                          )}
                        </span>
                      </td>

                      {/* 24h Change */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center font-semibold ${
                            isPositive ? "text-gain" : "text-loss"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
                          )}
                          {isPositive ? "+" : ""}
                          ${Math.abs(person.netWorthChangeDay).toFixed(1)}B
                          <span className="text-[10px] opacity-75 ml-1">
                            ({isPositive ? "+" : ""}
                            {person.netWorthChangePercent.toFixed(2)}%)
                          </span>
                        </span>
                      </td>

                      {/* Residence */}
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {person.currentCity}, {person.currentCountry}
                          </span>
                        </div>
                      </td>

                      {/* Primary Company */}
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-medium">
                        <span className="truncate max-w-[200px] block">
                          {person.mainCompany}
                        </span>
                      </td>

                      {/* Profile Button */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/p/${person.slug}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium liquid-glass hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors border border-surface-borderLight dark:border-surface-borderDark"
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

      {/* API Overview Section */}
      <section className="solid-card rounded-3xl p-8 space-y-4" id="api">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-accent">
            <Code className="w-5 h-5" />
            <span className="font-semibold text-xs uppercase tracking-wider">
              API Overview
            </span>
          </div>
          <Link
            href="/docs"
            className="text-xs font-semibold text-accent hover:underline flex items-center space-x-1"
          >
            <span>View Full API Docs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Integrate SuperRich Live Data
        </h2>
        <p className="text-xs text-neutral-500 max-w-xl">
          Integrate real-time rankings, asset breakdowns, and billionaire data into your own applications with zero subscription costs.
        </p>

        <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200 border border-surface-borderLight dark:border-surface-borderDark">
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
