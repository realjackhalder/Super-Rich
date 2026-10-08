"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DBBillionaire } from "@/lib/db-people";
import { RTBListResponse, RTBListItem } from "@/lib/rtb";
import { formatCountryName } from "@/lib/countries";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Database,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
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
  grokipediaSummary?: string;
  wikipediaUrl?: string;
  isTechTitan: boolean;
  hasFullProfile: boolean;
  isLive: boolean;
  age?: number;
  gender?: string;
  industry?: string;
}

export function formatWealth(billions: number): string {
  if (billions >= 1000) {
    return `$${(billions / 1000).toFixed(3)}T`;
  }
  return `$${billions.toFixed(1)}B`;
}

export function formatDailyChange(
  changeBillion: number,
  changePercent: number
): { text: string; isPositive: boolean } {
  const isPositive = changeBillion >= 0;
  const absBillion = Math.abs(changeBillion);
  const arrow = isPositive ? "▲" : "▼";
  const pctStr = `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`;

  let valStr = "";
  if (absBillion >= 1) {
    valStr = `$${absBillion.toFixed(1)} B`;
  } else if (absBillion > 0) {
    valStr = `$${(absBillion * 1000).toFixed(1)} M`;
  } else {
    valStr = `$0.0 M`;
  }

  return {
    text: `${valStr} | ${pctStr} ${arrow}`,
    isPositive,
  };
}

function DumbbellSlider({
  pct,
  isGain,
  maxPct,
}: {
  pct: number;
  isGain: boolean;
  maxPct: number;
}) {
  const safePct = Math.max(0.4, Math.abs(pct));
  const safeMax = Math.max(1, maxPct);
  const norm = safePct / safeMax;
  const barWidth = Math.max(22, Math.min(75, norm * 70));
  const leftPos = isGain
    ? Math.max(15, Math.min(100 - barWidth, 35 + norm * 40))
    : Math.max(15, Math.min(100 - barWidth, 30 + norm * 35));

  return (
    <div className="w-full h-[2px] bg-neutral-200 dark:bg-neutral-800 relative flex items-center">
      <div
        className={`h-[2px] absolute rounded-full flex items-center justify-between ${
          isGain ? "bg-gain" : "bg-loss"
        }`}
        style={{
          left: `${leftPos}%`,
          width: `${barWidth}%`,
        }}
      >
        <span
          className={`w-2 h-2 rounded-full -ml-1 ${
            isGain
              ? "bg-gain shadow-[0_0_6px_rgba(34,197,94,0.8)]"
              : "bg-loss shadow-[0_0_6px_rgba(239,68,68,0.8)]"
          }`}
        />
        <span
          className={`w-2 h-2 rounded-full -mr-1 ${
            isGain
              ? "bg-gain shadow-[0_0_6px_rgba(34,197,94,0.8)]"
              : "bg-loss shadow-[0_0_6px_rgba(239,68,68,0.8)]"
          }`}
        />
      </div>
    </div>
  );
}

export function getInitials(name: string): string {
  if (!name) return "B";
  const clean = name
    .replace(/\s*&\s*family/gi, "")
    .replace(/\s*\(.*?\)/g, "")
    .trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export { VERIFIED_PORTRAITS, isValidPhoto, getBillionairePortrait } from "@/lib/portraits";
import { VERIFIED_PORTRAITS, isValidPhoto } from "@/lib/portraits";

interface Props {
  serverPeople: DBBillionaire[];
  serverRtbData: RTBListResponse | null;
}

export default function BillionairesHomeClient({
  serverPeople,
  serverRtbData,
}: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [layoutView, setLayoutView] = useState<"grid" | "table">("table");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("view");
      if (v === "grid") {
        setLayoutView("grid");
      } else {
        setLayoutView("table");
      }
    } catch (_) {}
  }, []);

  const handleSetLayout = (view: "grid" | "table") => {
    setLayoutView(view);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortBy, setSortBy] = useState<
    "rank" | "worthDesc" | "worthAsc" | "gainers" | "losers" | "ageAsc" | "ageDesc"
  >("rank");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");
  const [isLiveActive, setIsLiveActive] = useState(true);

  // RTB lookup map for realtime net worth, source and movers
  const rtbMap = useMemo(() => {
    const map = new Map<string, RTBListItem>();
    if (serverRtbData?.list && Array.isArray(serverRtbData.list)) {
      for (const item of serverRtbData.list) {
        if (item.uri) map.set(item.uri, item);
        if (item.name) map.set(item.name.toLowerCase().trim(), item);
      }
    }
    return map;
  }, [serverRtbData]);

  // Movers statistics
  const [rtbStats, setRtbStats] = useState<{
    date?: string;
    total?: number;
    count?: number;
    topGainers?: any[];
    topLosers?: any[];
  } | null>(() => {
    if (serverRtbData?.list && Array.isArray(serverRtbData.list)) {
      const top100List = serverRtbData.list.filter(
        (item: any) => typeof item.rank === "number" && item.rank >= 1 && item.rank <= 100
      );
      const sortedByGain = [...top100List].sort(
        (a, b) => (b.change?.value || 0) - (a.change?.value || 0)
      );
      const sortedByLoss = [...top100List].sort(
        (a, b) => (a.change?.value || 0) - (b.change?.value || 0)
      );
      return {
        date: serverRtbData.date,
        total: serverRtbData.total,
        count: 100,
        topGainers: sortedByGain.slice(0, 5),
        topLosers: sortedByLoss.slice(0, 5),
      };
    }
    return {
      count: 100,
      topGainers: [],
      topLosers: [],
    };
  });

  // Map server database records with RTB live values and include full universe of 3,400+ global billionaires
  const initialMapped: DisplayBillionaire[] = useMemo(() => {
    const seen = new Set<string>();
    const mapped: DisplayBillionaire[] = [];

    // 1. Enriched database records first
    for (const p of serverPeople) {
      const rtbItem = rtbMap.get(p.slug) || rtbMap.get(p.name.toLowerCase().trim());
      const liveNetWorth = rtbItem
        ? Math.round((rtbItem.networth / 1000) * 100) / 100
        : p.netWorth;
      const liveChangeDay = rtbItem?.change
        ? Math.round((rtbItem.change.value / 1000) * 100) / 100
        : p.netWorthChangeDay;
      const liveChangePct = rtbItem?.change
        ? Math.round(rtbItem.change.pct * 100) / 100
        : p.netWorthChangePercent;
      const liveCompany =
        rtbItem?.source && rtbItem.source.length > 0
          ? rtbItem.source.join(", ")
          : p.mainCompany;

      seen.add(p.slug.toLowerCase().trim());
      seen.add(p.name.toLowerCase().trim());

      mapped.push({
        id: p.id,
        slug: p.slug,
        name: p.name,
        rank: rtbItem?.rank || p.rank,
        netWorth: liveNetWorth,
        netWorthChangeDay: liveChangeDay,
        netWorthChangePercent: liveChangePct,
        currentCountry: p.currentCountry,
        currentCity: p.currentCity,
        mainCompany: liveCompany,
        photoUrl: VERIFIED_PORTRAITS[p.slug] || p.photoUrl,
        grokipediaSummary: p.grokipediaSummary,
        wikipediaUrl: p.wikipediaUrl,
        isTechTitan: p.isTechTitan,
        hasFullProfile: true,
        isLive: true,
        age: rtbItem?.age || 55,
        gender: rtbItem?.gender || "m",
        industry:
          rtbItem?.industry && rtbItem.industry.length > 0
            ? rtbItem.industry.join(", ")
            : p.industry || "Technology",
      });
    }

    // 2. Append all remaining global billionaires from RTB live data
    if (serverRtbData?.list && Array.isArray(serverRtbData.list)) {
      for (const item of serverRtbData.list) {
        if (!item.uri) continue;
        const uriNorm = item.uri.toLowerCase().trim();
        const nameNorm = item.name ? item.name.toLowerCase().trim() : "";

        if (seen.has(uriNorm) || (nameNorm && seen.has(nameNorm))) {
          continue;
        }

        seen.add(uriNorm);
        if (nameNorm) seen.add(nameNorm);

        const liveNetWorth = Math.round((item.networth / 1000) * 100) / 100;
        const liveChangeDay = item.change
          ? Math.round((item.change.value / 1000) * 100) / 100
          : 0;
        const liveChangePct = item.change ? Math.round(item.change.pct * 100) / 100 : 0;
        const liveCompany =
          item.source && item.source.length > 0 ? item.source.join(", ") : "Enterprise";
        const ind =
          item.industry && item.industry.length > 0 ? item.industry.join(", ") : "Business";

        mapped.push({
          id: item.uri,
          slug: item.uri,
          name: item.name,
          rank: item.rank || 9999,
          netWorth: liveNetWorth,
          netWorthChangeDay: liveChangeDay,
          netWorthChangePercent: liveChangePct,
          currentCountry: formatCountryName(item.citizenship) || "United States",
          currentCity: "",
          mainCompany: liveCompany,
          photoUrl: VERIFIED_PORTRAITS[item.uri] || item.image || undefined,
          grokipediaSummary: "",
          wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.name.replace(/ /g, "_"))}`,
          isTechTitan: ind.toLowerCase().includes("tech"),
          hasFullProfile: true,
          isLive: true,
          age: item.age || 60,
          gender: item.gender || "m",
          industry: ind,
        });
      }
    }

    // Strictly sort by wealth descending and assign clean 1-100 sequential rankings
    const sorted = mapped
      .sort((a, b) => b.netWorth - a.netWorth || a.rank - b.rank)
      .slice(0, 100);

    return sorted.map((p, idx) => ({
      ...p,
      rank: idx + 1,
    }));
  }, [serverPeople, serverRtbData, rtbMap]);

  const [peopleList, setPeopleList] = useState<DisplayBillionaire[]>(initialMapped);

function formatLiveTimestamp(): string {
  const d = new Date();
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) +
    " EDT"
  );
}

  // Trigger background sync
  const triggerLiveSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/v1/rankings?limit=100", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data)) {
          const updated: DisplayBillionaire[] = json.data.map((item: any, idx: number) => ({
            id: item.slug || idx,
            slug: item.slug,
            name: item.name,
            rank: item.rank || idx + 1,
            netWorth: item.net_worth_billion,
            netWorthChangeDay: item.change_day_billion,
            netWorthChangePercent: item.change_day_percent,
            currentCountry: formatCountryName(item.citizenship || item.current_country) || "United States",
            currentCity: item.current_city?.toLowerCase() === "global" ? "" : (item.current_city || ""),
            mainCompany: item.primary_company || "Enterprise",
            photoUrl: VERIFIED_PORTRAITS[item.slug] || item.photo_url,
            grokipediaSummary: item.grokipedia_summary,
            wikipediaUrl: item.wikipedia_url,
            isTechTitan: true,
            hasFullProfile: true,
            isLive: true,
            age: 55,
            gender: "m",
            industry: item.industry || "Technology",
          }));

          const sorted = updated
            .sort((a, b) => b.netWorth - a.netWorth || a.rank - b.rank)
            .slice(0, 100);

          setPeopleList(
            sorted.map((p, idx) => ({
              ...p,
              rank: idx + 1,
            }))
          );
          setIsLiveActive(true);
          setLastSyncedTime(formatLiveTimestamp());
        }
      }

      const rtbRes = await fetch("/api/rtb/list", { cache: "no-store" });
      if (rtbRes.ok) {
        const rtbJson = await rtbRes.json();
        if (rtbJson?.data?.list) {
          const liveItems: any[] = rtbJson.data.list.filter(
            (item: any) => typeof item.rank === "number" && item.rank >= 1 && item.rank <= 100
          );
          const sortedByGain = [...liveItems].sort(
            (a, b) => (b.change?.value || 0) - (a.change?.value || 0)
          );
          const sortedByLoss = [...liveItems].sort(
            (a, b) => (a.change?.value || 0) - (b.change?.value || 0)
          );

          setRtbStats({
            date: rtbJson.data.date,
            total: rtbJson.data.total,
            count: 100,
            topGainers: sortedByGain.slice(0, 5),
            topLosers: sortedByLoss.slice(0, 5),
          });
          setLastSyncedTime(formatLiveTimestamp());
        }
      }
    } catch (err) {
      console.warn("Live sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Immediate live sync on mount
    setLastSyncedTime(formatLiveTimestamp());
    triggerLiveSync();

    // Re-fetch immediately when window is reopened or focused
    const handleActive = () => {
      if (document.visibilityState === "visible") {
        setLastSyncedTime(formatLiveTimestamp());
        triggerLiveSync();
      }
    };

    window.addEventListener("focus", handleActive);
    document.addEventListener("visibilitychange", handleActive);

    const interval = setInterval(triggerLiveSync, 30000);

    return () => {
      window.removeEventListener("focus", handleActive);
      document.removeEventListener("visibilitychange", handleActive);
      clearInterval(interval);
    };
  }, [triggerLiveSync]);

  // Extract unique countries
  const uniqueCountries = useMemo(() => {
    return Array.from(
      new Set(peopleList.map((p) => p.currentCountry).filter(Boolean))
    ).sort();
  }, [peopleList]);

  // Comprehensive multi-factor filtering
  const filteredPeople = useMemo(() => {
    const list = peopleList.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.mainCompany.toLowerCase().includes(q) ||
        p.currentCity.toLowerCase().includes(q) ||
        p.currentCountry.toLowerCase().includes(q);

      const matchesCountry =
        selectedCountry === "all" || p.currentCountry === selectedCountry;

      const matchesIndustry =
        selectedIndustry === "all" ||
        (p.industry && p.industry.toLowerCase().includes(selectedIndustry.toLowerCase())) ||
        p.mainCompany.toLowerCase().includes(selectedIndustry.toLowerCase());

      const matchesGender =
        selectedGender === "all" ||
        (selectedGender === "men" && p.gender !== "f") ||
        (selectedGender === "women" &&
          (p.gender === "f" ||
            p.name.includes("Walton") ||
            p.name.includes("Meyers") ||
            p.name.includes("Scott") ||
            p.name.includes("Koch")));

      let matchesAge = true;
      const ageVal = p.age || 55;
      if (selectedAge === "under50") {
        matchesAge = ageVal < 50;
      } else if (selectedAge === "50-64") {
        matchesAge = ageVal >= 50 && ageVal < 65;
      } else if (selectedAge === "65plus") {
        matchesAge = ageVal >= 65;
      }

      return matchesSearch && matchesCountry && matchesIndustry && matchesGender && matchesAge;
    });

    return list.sort((a, b) => {
      if (sortBy === "worthDesc") return b.netWorth - a.netWorth;
      if (sortBy === "worthAsc") return a.netWorth - b.netWorth;
      if (sortBy === "gainers") return b.netWorthChangePercent - a.netWorthChangePercent;
      if (sortBy === "losers") return a.netWorthChangePercent - b.netWorthChangePercent;
      if (sortBy === "ageAsc") return (a.age || 55) - (b.age || 55);
      if (sortBy === "ageDesc") return (b.age || 55) - (a.age || 55);
      return a.rank - b.rank;
    });
  }, [peopleList, searchQuery, selectedCountry, selectedIndustry, selectedGender, selectedAge, sortBy]);

  // Keep all top 100 billionaires visible
  const [visibleLimit, setVisibleLimit] = useState(100);

  useEffect(() => {
    setVisibleLimit(100);
  }, [searchQuery, selectedCountry, selectedIndustry, selectedGender, selectedAge, sortBy]);

  const visiblePeople = useMemo(() => {
    return filteredPeople.slice(0, visibleLimit);
  }, [filteredPeople, visibleLimit]);

  // Max percentage changes for barbell range sliders
  const maxGainPct = useMemo(() => {
    if (!rtbStats?.topGainers?.length) return 7.0;
    return Math.max(...rtbStats.topGainers.map((g) => Math.abs(g.change?.pct || 0)), 7.0);
  }, [rtbStats]);

  const maxLossPct = useMemo(() => {
    if (!rtbStats?.topLosers?.length) return 8.0;
    return Math.max(...rtbStats.topLosers.map((l) => Math.abs(l.change?.pct || 0)), 8.0);
  }, [rtbStats]);

  return (
    <div className="space-y-10">
      {/* Top Real-Time Status Bar */}
      <section className="flex items-center justify-between py-2 border-b border-neutral-200/60 dark:border-neutral-800/60 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gain animate-pulse"></span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
            {t("index.title")}
          </span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span className="text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
            {t("index.tracking", { count: "100" })}
          </span>
        </div>
      </section>

      {/* Biggest Gainers & Biggest Losers (Side-by-Side) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-2">
        {/* Biggest Gainers Card */}
        <div className="relative bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-7 overflow-hidden shadow-sm dark:shadow-none">
          {/* Soft ambient green radial glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 bg-gain/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              {t("gainers.title")}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t("gainers.subtitle")}
            </p>

            <div className="space-y-4 pt-5">
              {rtbStats?.topGainers && rtbStats.topGainers.length > 0 ? (
                rtbStats.topGainers.map((mover, idx) => {
                  const gainBillions = (mover.change?.value || 0) / 1000;
                  const gainPct = mover.change?.pct || 0;
                  return (
                    <div
                      key={`gain-${idx}`}
                      className="flex items-center justify-between text-xs sm:text-sm py-1.5"
                    >
                      {/* Rank & Name */}
                      <Link
                        href={`/p/${mover.uri}`}
                        className="font-medium text-neutral-900 dark:text-white hover:text-accent flex items-center space-x-2 truncate max-w-[170px] sm:max-w-[200px] group"
                      >
                        <span className="text-neutral-400 dark:text-neutral-500 font-serif text-sm w-4">
                          {idx + 1}.
                        </span>
                        <span className="truncate group-hover:underline">
                          {mover.name}
                        </span>
                      </Link>

                      {/* Dumbbell slider track */}
                      <div className="flex-1 mx-4 sm:mx-8">
                        <DumbbellSlider
                          pct={gainPct}
                          isGain={true}
                          maxPct={maxGainPct}
                        />
                      </div>

                      {/* Gain value and percentage */}
                      <div className="text-right text-gain font-semibold text-xs sm:text-sm font-mono shrink-0 flex items-center space-x-1.5">
                        <span>+${gainBillions.toFixed(1)}B</span>
                        <span className="text-[11px] opacity-90">
                          (+{gainPct.toFixed(2)}%) ▲
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-neutral-500 py-4">{t("gainers.loading")}</div>
              )}
            </div>
          </div>
        </div>

        {/* Biggest Losers Card */}
        <div className="relative bg-white dark:bg-[#141416] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-7 overflow-hidden shadow-sm dark:shadow-none">
          {/* Soft ambient red radial glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 bg-loss/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              {t("losers.title")}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t("losers.subtitle")}
            </p>

            <div className="space-y-4 pt-5">
              {rtbStats?.topLosers && rtbStats.topLosers.length > 0 ? (
                rtbStats.topLosers.map((mover, idx) => {
                  const lossBillions = Math.abs((mover.change?.value || 0) / 1000);
                  const lossPct = mover.change?.pct || 0;
                  const isUnderOneB = lossBillions < 1;
                  const formattedLoss = isUnderOneB
                    ? `-$${Math.abs(mover.change?.value || 0).toFixed(1)}M`
                    : `-$${lossBillions.toFixed(1)}B`;

                  return (
                    <div
                      key={`loss-${idx}`}
                      className="flex items-center justify-between text-xs sm:text-sm py-1.5"
                    >
                      {/* Rank & Name */}
                      <Link
                        href={`/p/${mover.uri}`}
                        className="font-medium text-neutral-900 dark:text-white hover:text-accent flex items-center space-x-2 truncate max-w-[170px] sm:max-w-[200px] group"
                      >
                        <span className="text-neutral-400 dark:text-neutral-500 font-serif text-sm w-4">
                          {idx + 1}.
                        </span>
                        <span className="truncate group-hover:underline">
                          {mover.name}
                        </span>
                      </Link>

                      {/* Dumbbell slider track */}
                      <div className="flex-1 mx-4 sm:mx-8">
                        <DumbbellSlider
                          pct={lossPct}
                          isGain={false}
                          maxPct={maxLossPct}
                        />
                      </div>

                      {/* Loss value and percentage */}
                      <div className="text-right text-loss font-semibold text-xs sm:text-sm font-mono shrink-0 flex items-center space-x-1.5">
                        <span>{formattedLoss}</span>
                        <span className="text-[11px] opacity-90">
                          ({lossPct ? lossPct.toFixed(2) : "0.00"}%) ▼
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-neutral-500 py-4">{t("losers.loading")}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Leaderboard Section */}
      <section className="space-y-6 pt-4" id="leaderboard">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline space-x-2">
              <span>Today&apos;s Top</span>
              <span className="text-sky-500 dark:text-sky-400">100</span>
              <span>Billionaires</span>
            </h1>

            <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Last Updated</span>
              <span>{lastSyncedTime || "Real-Time (Live Feed)"}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar (Search, Sort, Industry, Age, Country, Gender, View Toggle) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {/* Search Input with Magnifying Glass */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder={t("filter.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1c1c1e] text-neutral-900 dark:text-white text-xs rounded-full pl-4 pr-10 py-2.5 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 placeholder-neutral-400 dark:placeholder-neutral-500 shadow-sm dark:shadow-none transition-colors"
            />
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white dark:bg-[#1c1c1e] text-neutral-800 dark:text-neutral-200 text-xs rounded-full pl-4 pr-8 py-2.5 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 cursor-pointer shadow-sm dark:shadow-none"
            >
              <option value="rank">{t("filter.sortRank")}</option>
              <option value="worthDesc">{t("filter.sortWorthDesc")}</option>
              <option value="worthAsc">{t("filter.sortWorthAsc")}</option>
              <option value="gainers">{t("filter.sortGainers")}</option>
              <option value="losers">{t("filter.sortLosers")}</option>
              <option value="ageAsc">{t("filter.sortAgeAsc")}</option>
              <option value="ageDesc">{t("filter.sortAgeDesc")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Industry Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1c1c1e] text-neutral-800 dark:text-neutral-200 text-xs rounded-full pl-4 pr-8 py-2.5 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 cursor-pointer shadow-sm dark:shadow-none"
            >
              <option value="all">{t("filter.industryAll")}</option>
              <option value="technology">Technology</option>
              <option value="diversified">Diversified</option>
              <option value="fashion">Fashion & Retail</option>
              <option value="finance">Finance & Investments</option>
              <option value="automotive">Automotive</option>
              <option value="media">Media & Entertainment</option>
              <option value="energy">Energy & Commodities</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Age Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1c1c1e] text-neutral-800 dark:text-neutral-200 text-xs rounded-full pl-4 pr-8 py-2.5 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 cursor-pointer shadow-sm dark:shadow-none"
            >
              <option value="all">{t("filter.ageAll")}</option>
              <option value="under50">{t("filter.under50")}</option>
              <option value="50-64">{t("filter.age5064")}</option>
              <option value="65plus">{t("filter.age65plus")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Country Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1c1c1e] text-neutral-800 dark:text-neutral-200 text-xs rounded-full pl-4 pr-8 py-2.5 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 cursor-pointer shadow-sm dark:shadow-none"
            >
              <option value="all">{t("filter.countryAll")}</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Gender Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1c1c1e] text-neutral-800 dark:text-neutral-200 text-xs rounded-full pl-4 pr-8 py-2.5 border border-neutral-200/90 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 cursor-pointer shadow-sm dark:shadow-none"
            >
              <option value="all">{t("filter.genderAll")}</option>
              <option value="men">{t("filter.men")}</option>
              <option value="women">{t("filter.women")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Layout Toggle (Grid vs Table) */}
          <div className="flex items-center ml-auto">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono hidden sm:inline mr-3">
              {t("filter.showing", {
                current: Math.min(visibleLimit, filteredPeople.length).toLocaleString(),
                total: filteredPeople.length.toLocaleString(),
              })}
            </span>
            <div className="flex items-center bg-white dark:bg-[#1c1c1e] rounded-full p-1 border border-neutral-200/90 dark:border-neutral-800 shadow-sm dark:shadow-none">
              <button
                onClick={() => handleSetLayout("table")}
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
                onClick={() => handleSetLayout("grid")}
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

        {/* Content Display: Card Grid View OR Table View */}
        {layoutView === "grid" ? (
          /* 4-Column Card Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visiblePeople.map((person) => {
              const changeInfo = formatDailyChange(
                person.netWorthChangeDay,
                person.netWorthChangePercent
              );

              return (
                <Link
                  key={person.id}
                  href={`/p/${person.slug}`}
                  className="group relative bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col shadow-sm"
                >
                  {/* Photo Container */}
                  <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center">
                    {isValidPhoto(VERIFIED_PORTRAITS[person.slug] || person.photoUrl) ? (
                      <img
                        src={VERIFIED_PORTRAITS[person.slug] || person.photoUrl!}
                        alt={person.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.style.display = "none";
                          const fallback = img.parentElement?.querySelector(".avatar-fallback") as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {(person.slug === "elon-musk" || person.netWorth >= 1000) && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#0284c7]/95 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-lg">
                        {t("badge.trillionaire")}
                      </span>
                    )}

                    {/* Elegant Monogram Avatar Fallback (when no public photo exists) */}
                    <div
                      className={`avatar-fallback w-full h-full bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-50 dark:from-[#24242a] dark:via-[#1a1a1e] dark:to-[#121214] flex flex-col items-center justify-center p-4 text-center select-none ${
                        isValidPhoto(VERIFIED_PORTRAITS[person.slug] || person.photoUrl) ? "hidden" : "flex"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-neutral-300/80 dark:bg-neutral-800/90 border border-neutral-300 dark:border-neutral-700/80 flex items-center justify-center mb-2 shadow-inner">
                        <span className="font-serif font-bold text-2xl text-neutral-700 dark:text-neutral-300 tracking-wider">
                          {getInitials(person.name)}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
                        {t("badge.privateHoldings")}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                    <div>
                      {/* Rank & Name */}
                      <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white group-hover:text-accent transition-colors flex items-baseline space-x-1.5 truncate">
                        <span>{person.rank}.</span>
                        <span className="truncate">{person.name}</span>
                      </h3>

                      {/* Company: Tesla, SpaceX */}
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate mt-0.5">
                        {person.mainCompany}
                      </p>
                    </div>

                    {/* Net Worth & 24h Change Row */}
                    <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-baseline justify-between">
                      <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight font-serif">
                        {formatWealth(person.netWorth)}
                      </span>
                      <span
                        className={`text-xs font-semibold flex items-center space-x-1 font-mono ${
                          changeInfo.isPositive ? "text-gain" : "text-loss"
                        }`}
                      >
                        <span>{changeInfo.text}</span>
                      </span>
                    </div>
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
                    <th className="py-3.5 px-4">{t("th.name")}</th>
                    <th className="py-3.5 px-4">{t("th.netWorth")}</th>
                    <th className="py-3.5 px-4">{t("th.change24h")}</th>
                    <th className="py-3.5 px-4">{t("th.residence")}</th>
                    <th className="py-3.5 px-4">{t("th.company")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 dark:divide-neutral-800/60">
                  {visiblePeople.map((person) => {
                    const isPositive = person.netWorthChangeDay >= 0;
                    return (
                      <tr
                        key={person.id}
                        onClick={() => router.push(`/p/${person.slug}`)}
                        className="hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">
                            #{person.rank}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                          <div className="flex items-center space-x-3 group-hover:text-accent transition-colors">
                            {isValidPhoto(VERIFIED_PORTRAITS[person.slug] || person.photoUrl) ? (
                              <img
                                src={VERIFIED_PORTRAITS[person.slug] || person.photoUrl!}
                                alt={person.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover object-center border border-neutral-300 dark:border-neutral-700 shrink-0"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.style.display = "none";
                                  const fallback = img.parentElement?.querySelector(".table-avatar-fallback") as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`table-avatar-fallback w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 items-center justify-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0 select-none ${
                                isValidPhoto(VERIFIED_PORTRAITS[person.slug] || person.photoUrl) ? "hidden" : "flex"
                              }`}
                            >
                              {getInitials(person.name)}
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className="group-hover:underline">{person.name}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                          <div className="flex items-center space-x-1.5">
                            <span>{formatWealth(person.netWorth)}</span>
                            {person.netWorth >= 1000 && (
                              <span className="text-[11px] font-normal text-neutral-400 font-mono">
                                (${person.netWorth.toFixed(1)}B)
                              </span>
                            )}
                            <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold">
                          <span
                            className={`inline-flex items-center space-x-0.5 ${
                              isPositive ? "text-gain" : "text-loss"
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span>
                              {isPositive ? "+" : ""}${Math.abs(person.netWorthChangeDay).toFixed(1)}B (
                              {isPositive ? "+" : ""}
                              {person.netWorthChangePercent.toFixed(2)}%)
                            </span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {person.currentCity ? `${person.currentCity}, ` : ""}{person.currentCountry}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 truncate max-w-[160px]">
                          {person.mainCompany}
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
    </div>
  );
}
