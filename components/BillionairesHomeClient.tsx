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

export const VERIFIED_PORTRAITS: Record<string, string> = {
  // Top Billionaires with custom high-grade framed portraits
  "elon-musk": "https://upload.wikimedia.org/wikipedia/commons/9/95/Elon_Musk_%2854816836217%29_%28cropped_5%29.jpg",
  "larry-ellison": "https://upload.wikimedia.org/wikipedia/commons/4/47/Larry_Ellison_2016.png",
  "mark-zuckerberg": "https://upload.wikimedia.org/wikipedia/commons/0/0e/F20250904AH-2824_%2854778373111%29_%283x4_cropped_on_Zuckerberg_following_the_rule_of_thirds%29.jpg",

  // Top 100 global billionaires with verified CDN portraits
  "francoise-bettencourt-meyers": "https://imageio.forbes.com/specials-images/imageserve/605e26e3c65f7c2596bd3e15/0x0.jpg?format=jpg&crop=1080,1080,x0,y0,safe&height=416&width=416&fit=bounds",
  "jeff-yass": "https://imageio.forbes.com/specials-images/imageserve/60649a21472ae5b09dad20b1/0x0.jpg?format=jpg&crop=816,816,x3,y0,safe&height=416&width=416&fit=bounds",
  "german-larrea-mota-velasco": "https://imageio.forbes.com/specials-images/imageserve/597a47174bbe6f3eb800b6b8/0x0.jpg?format=jpg&crop=1702,1701,x1901,y368,safe&height=416&width=416&fit=bounds",
  "zhong-shanshan": "https://imageio.forbes.com/specials-images/imageserve/60380e390357bc1fbfc0bc32/0x0.jpg?format=jpg&crop=1211,1212,x116,y201,safe&height=416&width=416&fit=bounds",
  "dieter-schwarz": "https://imageio.forbes.com/specials-images/imageserve/6050f48ca1ab099ed6e290cc/0x0.jpg?format=jpg&crop=800,800,x0,y0,safe&height=416&width=416&fit=bounds",
  "john-mars": "https://imageio.forbes.com/specials-images/imageserve/5ba41e08a7ea434e4c6948eb/0x0.jpg?format=jpg&crop=1348,1348,x53,y9,safe&height=416&width=416&fit=bounds",
  "iris-fontbona": "https://imageio.forbes.com/specials-images/imageserve/5c6db2974bbe6f0ec75418f0/0x0.jpg?format=jpg&crop=367,367,x124,y0,safe&height=416&width=416&fit=bounds",
  "giovanni-ferrero": "https://imageio.forbes.com/specials-images/imageserve/5b11bc5ca7ea436b547f29cb/0x0.jpg?format=jpg&crop=1222,1221,x622,y361,safe&height=416&width=416&fit=bounds",
  "mark-mateschitz": "https://imageio.forbes.com/specials-images/imageserve/642b2ae09caa113a6ce1c15e/0x0.jpg?format=jpg&crop=2478,2475,x898,y239,safe&height=416&width=416&fit=bounds",
  "lukas-walton": "https://imageio.forbes.com/specials-images/imageserve/5d89f3c36de3150009a4e5bd/0x0.jpg?format=jpg&crop=454,454,x122,y26,safe&height=416&width=416&fit=bounds",
  "andrea-pignataro": "https://imageio.forbes.com/specials-images/imageserve/660c251294ad0b108cfcdf06/0x0.jpg?format=jpg&crop=1304,1304,x711,y56,safe&height=416&width=416&fit=bounds",
  "liang-wenfeng": "https://imageio.forbes.com/specials-images/imageserve/67e5dca4efa69302e39783b9/0x0.jpg?format=jpg&crop=975,975,x1196,y293,safe&height=416&width=416&fit=bounds",
  "lyndal-stephens-greth": "https://imageio.forbes.com/specials-images/imageserve/66fb2bd596806737569ab7ef/0x0.jpg?format=jpg&crop=2143,2143,x0,y180,safe&height=416&width=416&fit=bounds",
  "colin-huang": "https://imageio.forbes.com/specials-images/imageserve/5dc0500b3195ed0007eab3f7/0x0.jpg?format=jpg&crop=2640,2638,x1059,y45,safe&height=416&width=416&fit=bounds",
  "francois-pinault": "https://imageio.forbes.com/specials-images/imageserve/5f1eeca8e77f92a058fb1a81/0x0.jpg?format=jpg&crop=2095,2097,x1806,y36,safe&height=416&width=416&fit=bounds",
  "chen-tianshi": "https://imageio.forbes.com/specials-images/imageserve/690240ad85f168b25a40e248/0x0.jpg?format=jpg&crop=704,704,x316,y54,safe&height=416&width=416&fit=bounds",
  "huang-shilin": "https://imageio.forbes.com/specials-images/imageserve/6724f66a677dfa37e85e605f/0x0.jpg?format=jpg&crop=798,798,x2,y2,safe&height=416&width=416&fit=bounds",
  "emmanuel-besnier": "https://imageio.forbes.com/specials-images/imageserve/5e759e31c7b02d000666c445/0x0.jpg?format=jpg&crop=1413,1412,x283,y1002,safe&height=416&width=416&fit=bounds",
  "phil-knight": "https://imageio.forbes.com/specials-images/imageserve/6488d5874961598251b12f50/0x0.jpg?format=jpg&crop=2746,2747,x598,y0,safe&height=416&width=416&fit=bounds",
  "prince-alwaleed-bin-talal-alsaud": "https://imageio.forbes.com/specials-images/imageserve/5e779508d8e1ae0007b72f3e/0x0.jpg?format=jpg&crop=3321,3320,x950,y14,safe&height=416&width=416&fit=bounds",
  "suleiman-kerimov-family": "https://imageio.forbes.com/specials-images/imageserve/62471d5c3ff014e6ce2b15f6/0x0.jpg?format=jpg&crop=2639,2639,x146,y0,safe&height=416&width=416&fit=bounds",
  "suleiman-kerimov": "https://imageio.forbes.com/specials-images/imageserve/62471d5c3ff014e6ce2b15f6/0x0.jpg?format=jpg&crop=2639,2639,x146,y0,safe&height=416&width=416&fit=bounds",
  "gina-rinehart": "https://imageio.forbes.com/specials-images/imageserve/67aa659166c227f5f4d5062f/0x0.jpg?format=jpg&crop=1326,1328,x102,y416&height=416&width=416&fit=bounds",
  "zheng-shuliang": "https://imageio.forbes.com/specials-images/imageserve/6724f9cdf203631b720a86fe/0x0.jpg?format=jpg&crop=798,798,x2,y1,safe&height=416&width=416&fit=bounds",
  "vladimir-lisin": "https://imageio.forbes.com/specials-images/imageserve/5e77914ec7b02d000666d900/0x0.jpg?format=jpg&crop=2410,2409,x825,y50,safe&height=416&width=416&fit=bounds",
  "susanne-klatten": "https://imageio.forbes.com/specials-images/imageserve/605e281e4f49584f571c9c42/0x0.jpg?format=jpg&crop=1080,1080,x0,y0,safe&height=416&width=416&fit=bounds",
  "vinod-adani": "https://imageio.forbes.com/specials-images/imageserve/6397397b9ee9056d354b17e4/0x0.jpg?format=jpg&crop=1786,1787,x458,y225,safe&height=416&width=416&fit=bounds",

  // Tech & Global Titans in INITIAL_50
  "jack-ma": "https://imageio.forbes.com/specials-images/imageserve/69023fd7dbc29e6c2ee6b085/0x0.jpg?format=jpg&crop=1459,1458,x151,y279,safe&height=416&width=416&fit=bounds",
  "william-ding": "https://imageio.forbes.com/specials-images/imageserve/65496210455fdb2807b461fc/0x0.jpg?format=jpg&crop=1337,1338,x376,y341,safe&height=416&width=416&fit=bounds",
  "robin-zeng": "https://imageio.forbes.com/specials-images/imageserve/690239904c2185472de3db28/0x0.jpg?format=jpg&crop=1002,1002,x305,y145,safe&height=416&width=416&fit=bounds",
  "wang-chuanfu": "https://imageio.forbes.com/specials-images/imageserve/6902404b2ffc12e03e0d702e/0x0.jpg?format=jpg&crop=1442,1442,x201,y58,safe&height=416&width=416&fit=bounds",
  "masayoshi-son": "https://imageio.forbes.com/specials-images/imageserve/5e8b632801879f000703e485/0x0.jpg?format=jpg&crop=4500,4497,x0,y833,safe&height=416&width=416&fit=bounds",
  "lee-jae-yong": "https://imageio.forbes.com/specials-images/imageserve/69d92071f818bcd1553283ed/0x0.jpg?format=jpg&crop=1299,1300,x141,y78,safe&height=416&width=416&fit=bounds",
  "kim-beom-su": "https://imageio.forbes.com/specials-images/imageserve/69d9245f9f14fa2e40c70736/0x0.jpg?format=jpg&crop=719,719,x206,y151,safe&height=416&width=416&fit=bounds",
  "shiv-nadar": "https://imageio.forbes.com/specials-images/imageserve/68e696c624e6cebf6aa2b00a/0x0.jpg?format=jpg&crop=940,939,x693,y144,safe&height=416&width=416&fit=bounds",
  "azim-premji": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Azim_H._Premji_World_Economic_Forum_2013.jpg",
  "changpeng-zhao": "https://imageio.forbes.com/specials-images/imageserve/61115ac5b4c5d23845419c4e/0x0.jpg?format=jpg&crop=911,911,x0,y0,safe&height=416&width=416&fit=bounds",
  "pavel-durov": "https://imageio.forbes.com/specials-images/imageserve/605e44a746821557fdbd3e15/0x0.jpg?format=jpg&crop=1080,1080,x0,y0,safe&height=416&width=416&fit=bounds",
  "daniel-ek": "https://imageio.forbes.com/specials-images/imageserve/619e6309d734b7239959f54f/0x0.jpg?format=jpg&crop=1529,1530,x607,y186,safe&height=416&width=416&fit=bounds",
  "tobi-lutke": "https://imageio.forbes.com/specials-images/imageserve/65e8c56a05c1e4c93a490920/0x0.jpg?format=jpg&crop=2234,2233,x451,y297,safe&height=416&width=416&fit=bounds",
  "hasso-plattner": "https://imageio.forbes.com/specials-images/imageserve/5e762726d8e1ae0007b71a6b/0x0.jpg?format=jpg&crop=1826,1827,x1757,y0,safe&height=416&width=416&fit=bounds",
};

export function isValidPhoto(url?: string | null): boolean {
  if (!url) return false;
  if (url.includes("unsplash.com")) return false;
  if (url.includes("blank-m.jpg") || url.includes("blank-f.jpg")) return false;
  return url.startsWith("http") || url.startsWith("/");
}

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
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Oct 06, 2026, 12:45am EDT");
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
      const sortedByGain = [...serverRtbData.list].sort(
        (a, b) => (b.change?.value || 0) - (a.change?.value || 0)
      );
      const sortedByLoss = [...serverRtbData.list].sort(
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

  // Trigger background sync
  const triggerLiveSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/v1/rankings?limit=100");
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
          setLastSyncedTime(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " EDT"
          );
        }
      }

      const rtbRes = await fetch("/api/rtb/list");
      if (rtbRes.ok) {
        const rtbJson = await rtbRes.json();
        if (rtbJson?.data?.list) {
          const liveItems: any[] = rtbJson.data.list;
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
        }
      }
    } catch (err) {
      console.warn("Live sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(triggerLiveSync, 60000);
    return () => clearInterval(interval);
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
              <span>{lastSyncedTime}</span>
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
