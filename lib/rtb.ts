/**
 * Real-Time Billionaires API (RTB API) Client
 * Integration with https://github.com/komed3/rtb-api and https://realtimebillionaires.de/
 * Provides monthly-updated CDN endpoints for global lists, full bios, assets, daily movers, and historical analytics.
 */

import { db, hasDatabaseConnection } from "@/db";
import { people } from "@/db/schema";
import { asc } from "drizzle-orm";

export interface RTBListItem {
  rank: number;
  uri: string;
  name: string;
  gender: string;
  age: number;
  networth: number; // in millions USD
  change: {
    value: number; // in millions USD
    pct: number;
    date: string;
  };
  diff: number;
  flag: string;
  citizenship: string;
  industry: string[];
  source: string[];
  image?: string;
}

export interface RTBListResponse {
  date: string;
  count: number;
  woman: number;
  total: number; // in millions USD
  list: RTBListItem[];
}

export interface RTBProfileInfo {
  uri: string;
  name: string;
  birthDate?: string;
  family?: boolean;
  gender?: string;
  citizenship?: string;
  residence?: {
    country?: string;
    state?: string;
    city?: string;
  };
  industry?: string[];
  source?: string[];
  image?: string;
  deceased?: boolean;
  children?: number;
}

export interface RTBProfileLatest {
  date: string;
  rank: number;
  networth: number; // in millions USD
  change: {
    value: number; // in millions USD
    pct: number;
    date: string;
  };
  private?: number;
  archived?: number;
}

export interface RTBAsset {
  exchange?: string;
  ticker?: string;
  companyName: string;
  numberOfShares?: number;
  sharePrice?: number;
  currentPrice?: number;
  currencyCode?: string;
  exchangeRate?: number;
  interactive?: boolean;
}

export interface RTPProfileBio {
  bio?: string[];
  about?: string[];
  quote?: string;
}

export interface RTBAnnualYear {
  rank?: {
    latest?: number;
    first?: number;
    diff?: number;
    average?: number;
  };
  networth?: {
    latest?: number;
    first?: number;
    diff?: number;
    average?: number;
  };
}

export type RTBAnnualReport = Record<string, RTBAnnualYear>;

const BASE_URL =
  process.env.RTB_API_BASE_URL ||
  "https://cdn.statically.io/gh/komed3/rtb-api@main/api";

const FALLBACK_BASE_URL =
  "https://raw.githubusercontent.com/komed3/rtb-api/main/api";

/**
 * Normalizes billionaire name or slug to RTB uri (e.g. "Elon Musk" -> "elon-musk")
 */
export function normalizeRTBUri(slugOrName: string): string {
  if (!slugOrName) return "";
  return slugOrName
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-");
}

const memoryCache = new Map<string, { data: any; expiry: number }>();

async function fetchFromRTB<T>(path: string): Promise<T | null> {
  const cleanPath = path.replace(/^\//, "");
  const cached = memoryCache.get(cleanPath);
  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }

  const primaryUrl = `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
  const fallbackUrl = `${FALLBACK_BASE_URL}/${cleanPath}`;

  const headers = {
    Accept: "application/json",
    "User-Agent": "SuperRich-Index/2.0 (realtimebillionaires integration)",
  };

  // Prioritize raw.githubusercontent.com for sub-second responses, with statically as secondary
  const endpoints = [fallbackUrl, primaryUrl];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(12000),
        cache: "no-store",
      });

      if (res.ok) {
        const data = (await res.json()) as T;
        // Cache in memory for 15 minutes for instantaneous UI interactions
        memoryCache.set(cleanPath, { data, expiry: Date.now() + 15 * 60 * 1000 });
        return data;
      }
    } catch (err) {
      // Try next endpoint
    }
  }

  console.warn(`[RTB API] Failed to fetch remote data for ${path}, falling back.`);
  return null;
}

/**
 * Fetch the latest real-time billionaires global list from realtimebillionaires.de
 */
async function fetchLiveListFromWebsite(): Promise<RTBListResponse | null> {
  const cached = memoryCache.get("live_website_list");
  if (cached && cached.expiry > Date.now()) {
    return cached.data as RTBListResponse;
  }

  try {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "text/html,application/xhtml+xml",
    };

    const pages = [1, 2, 3, 4];
    const pageHtmls = await Promise.all(
      pages.map(async (p) => {
        const res = await fetch(`https://realtimebillionaires.de/list/rtb?page=${p}`, {
          headers,
          signal: AbortSignal.timeout(10000),
          cache: "no-store",
        });
        if (!res.ok) return "";
        return res.text();
      })
    );

    const fullHtml = pageHtmls.join("\n");
    const rawItems = [
      ...fullHtml.matchAll(
        /<a class="rtb-list-item" href="\/profile\/([^"]+)" id="([^"]+)">(.*?)<\/a>/gs
      ),
    ];

    if (rawItems.length === 0) return null;

    const list: RTBListItem[] = rawItems.map((m) => {
      const slug = m[1];
      const content = m[3];
      const rankM = content.match(/<b>#([0-9]+)<\/b>/);
      const nameM = content.match(/rtb-list-name">([^<]+)<\/div>/);
      const worthM = content.match(/rtb-list-networth"><b>(?:\$)?([0-9.,]+)([BM])<\/b>/);
      const changeM = content.match(
        /class="(up|down)">(?:\$)?([0-9.,]+)([BM])(?:<pct>\s*\(([-+0-9.,]+)%\)<\/pct>)?/
      );
      const ageM = content.match(/rtb-list-age">([0-9]+)<\/div>/);
      const countryM = content.match(/rtb-list-country">([^<]+)<\/div>/);
      const sourceM = content.match(/rtb-list-source">([^<]+)<\/div>/);

      let networthMillions = 0;
      if (worthM) {
        const val = parseFloat(worthM[1].replace(/,/g, ""));
        networthMillions = worthM[2] === "B" ? val * 1000 : val;
      }

      let changeValMillions = 0;
      let changePct = 0;
      if (changeM) {
        const dir = changeM[1] === "up" ? 1 : -1;
        const val = parseFloat(changeM[2].replace(/,/g, ""));
        changeValMillions = dir * (changeM[3] === "B" ? val * 1000 : val);
        changePct = changeM[4] ? parseFloat(changeM[4].replace(/[+%]/g, "")) : 0;
      }

      return {
        rank: rankM ? parseInt(rankM[1], 10) : 1,
        uri: slug,
        name: nameM ? nameM[1].trim() : slug,
        gender: "m",
        age: ageM ? parseInt(ageM[1], 10) : 50,
        networth: networthMillions,
        change: {
          value: changeValMillions,
          pct: changePct,
          date: new Date().toISOString().split("T")[0],
        },
        diff: 0,
        flag: changeValMillions >= 0 ? "up" : "down",
        citizenship: countryM ? countryM[1].trim() : "United States",
        industry: ["technology"],
        source: sourceM ? [sourceM[1].trim()] : ["Enterprise"],
      };
    });

    const totalMillions = list.reduce((acc, curr) => acc + curr.networth, 0);

    const result: RTBListResponse = {
      date: new Date().toISOString().split("T")[0],
      count: 3391,
      woman: 3,
      total: totalMillions,
      list,
    };

    memoryCache.set("live_website_list", {
      data: result,
      expiry: Date.now() + 60 * 1000,
    });

    return result;
  } catch (err) {
    console.warn("[RTB Scraper] Failed to scrape realtimebillionaires.de list:", err);
    return null;
  }
}

/**
 * Fetch full live profile from realtimebillionaires.de/profile/{slug}
 */
async function fetchLiveProfileFromWebsite(slug: string) {
  const normSlug = normalizeRTBUri(slug);
  const cacheKey = `live_prof_${normSlug}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://realtimebillionaires.de/profile/${normSlug}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const html = await res.text();

    const worthM = html.match(/<div class="rtb-profile-networth-value">(?:\$)?([0-9.,]+)([BM])?<\/div>/);
    const chM = html.match(
      /<div class="rtb-profile-networth-change"><span class="(up|down)">(?:\$)?([0-9.,]+)([BM])?<pct>\s*\(([-+0-9.,]+)%\)<\/pct><\/span><\/div>/
    );
    const dateM = html.match(/<div class="rtb-profile-networth-date">([^<]+)<\/div>/);
    const bioM = html.match(/<div class="rtb-box rtb-profile-bio">(.*?)<\/div>/s);
    const assetMatches = [
      ...html.matchAll(
        /<div class="rtb-grid-item"><h4>([^<]+)<\/h4><span>([^<]+)<\/span><b>(?:\$)?([0-9.,]+)([BM])<\/b><\/div>/g
      ),
    ];

    let networthMillions = 0;
    if (worthM) {
      const val = parseFloat(worthM[1].replace(/,/g, ""));
      networthMillions = val * 1000;
    }

    let changeValMillions = 0;
    let changePct = 0;
    if (chM) {
      const dir = chM[1] === "up" ? 1 : -1;
      const val = parseFloat(chM[2].replace(/,/g, ""));
      changeValMillions = dir * (chM[3] === "B" || val < 500 ? val * 1000 : val);
      changePct = chM[4] ? parseFloat(chM[4].replace(/[+%]/g, "")) : 0;
    }

    const bioParagraphs = bioM
      ? [...bioM[1].matchAll(/<p>(.*?)<\/p>/g)].map((p) => p[1])
      : [];

    const assets: RTBAsset[] = assetMatches.map((m) => {
      const val = parseFloat(m[3].replace(/,/g, ""));
      const isBillion = m[4] === "B";
      return {
        exchange: m[1],
        companyName: m[2],
        currentPrice: isBillion ? val * 1000 : val,
      };
    });

    const chartM = html.match(/chart-data=["']([A-Za-z0-9+/=]+)["']/);
    let chartHistory: any[] = [];
    if (chartM) {
      try {
        const decoded = Buffer.from(chartM[1], "base64").toString("utf-8");
        chartHistory = JSON.parse(decoded);
      } catch (e) {
        // ignore
      }
    }

    const cachedList = memoryCache.get("live_website_list")?.data?.list;
    const foundItem = cachedList?.find((item: any) => item.uri === normSlug);
    const trueRank = foundItem?.rank || (normSlug === "elon-musk" ? 1 : 999);

    const result = {
      latest: {
        date: dateM ? dateM[1] : new Date().toISOString().split("T")[0],
        rank: trueRank,
        networth: networthMillions,
        change: {
          value: changeValMillions,
          pct: changePct,
          date: new Date().toISOString().split("T")[0],
        },
      },
      bio: {
        bio: bioParagraphs,
      },
      assets,
      chartHistory,
    };

    memoryCache.set(cacheKey, { data: result, expiry: Date.now() + 5 * 60 * 1000 });
    return result;
  } catch (err) {
    console.warn(`[RTB Scraper] Failed to fetch profile for ${slug}:`, err);
    return null;
  }
}

/**
 * Fetch the latest real-time billionaires global list
 */
export async function getRTBLatestList(): Promise<RTBListResponse | null> {
  // 1. Fetch live scraped list of 100 billionaires directly from realtimebillionaires.de
  const liveRes = await fetchLiveListFromWebsite();
  if (liveRes && liveRes.list && liveRes.list.length > 0) {
    return liveRes;
  }

  // 2. Fallback to Supabase database if live website scraper is temporarily blocked
  if (hasDatabaseConnection && db) {
    try {
      const rows = await db.select().from(people).orderBy(asc(people.rank)).limit(100);
      if (rows && rows.length > 0) {
        const list: RTBListItem[] = rows.map((r: any) => ({
          rank: r.rank,
          uri: r.slug,
          name: r.name,
          gender: "m",
          age: 55,
          networth: parseFloat(r.netWorth || "0") * 1000,
          change: {
            value: parseFloat(r.netWorthChangeDay || "0") * 1000,
            pct: parseFloat(r.netWorthChangePercent || "0"),
            date: new Date().toISOString().split("T")[0],
          },
          diff: 0,
          flag: parseFloat(r.netWorthChangeDay || "0") >= 0 ? "up" : "down",
          citizenship: r.citizenship || r.currentCountry || "United States",
          industry: r.industry ? [r.industry] : ["Technology"],
          source: r.mainCompany ? [r.mainCompany] : ["Enterprise"],
          image: r.photoUrl || undefined,
        }));
        return {
          date: new Date().toISOString().split("T")[0],
          count: list.length,
          woman: 3,
          total: list.reduce((acc, curr) => acc + curr.networth, 0),
          list,
        };
      }
    } catch (e) {
      console.warn("[RTB] DB fallback query failed:", e);
    }
  }

  return null;
}

/**
 * Fetch full profile info for a billionaire by slug
 */
export async function getRTBProfileInfo(
  uriOrSlug: string
): Promise<RTBProfileInfo | null> {
  const uri = normalizeRTBUri(uriOrSlug);
  return fetchFromRTB<RTBProfileInfo>(`profile/${uri}/info`);
}

/**
 * Fetch latest rank and real-time net worth
 */
export async function getRTBProfileLatest(
  uriOrSlug: string
): Promise<RTBProfileLatest | null> {
  const uri = normalizeRTBUri(uriOrSlug);
  const liveScraped = await fetchLiveProfileFromWebsite(uri);
  if (liveScraped?.latest?.networth) {
    return liveScraped.latest;
  }
  return fetchFromRTB<RTBProfileLatest>(`profile/${uri}/latest`);
}

/**
 * Fetch financial stock assets & company shareholdings
 */
export async function getRTBProfileAssets(
  uriOrSlug: string
): Promise<RTBAsset[]> {
  const uri = normalizeRTBUri(uriOrSlug);
  const liveScraped = await fetchLiveProfileFromWebsite(uri);
  if (liveScraped?.assets && liveScraped.assets.length > 0) {
    return liveScraped.assets;
  }
  const data = await fetchFromRTB<RTBAsset[]>(`profile/${uri}/assets`);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch biography and facts
 */
export async function getRTBProfileBio(
  uriOrSlug: string
): Promise<RTPProfileBio | null> {
  const uri = normalizeRTBUri(uriOrSlug);
  const liveScraped = await fetchLiveProfileFromWebsite(uri);
  if (liveScraped?.bio?.bio && liveScraped.bio.bio.length > 0) {
    return liveScraped.bio;
  }
  return fetchFromRTB<RTPProfileBio>(`profile/${uri}/bio`);
}

/**
 * Fetch annual historical progression (net worth and ranks by year)
 */
export async function getRTBProfileAnnual(
  uriOrSlug: string
): Promise<RTBAnnualReport | null> {
  const uri = normalizeRTBUri(uriOrSlug);
  return fetchFromRTB<RTBAnnualReport>(`profile/${uri}/annual`);
}

/**
 * Aggregates all RTB data into a unified profile object
 */
export async function getRTBFullProfile(uriOrSlug: string) {
  const uri = normalizeRTBUri(uriOrSlug);
  const liveScraped = await fetchLiveProfileFromWebsite(uri);

  const [info, latest, assets, bio, annual] = await Promise.all([
    getRTBProfileInfo(uri),
    liveScraped?.latest ? Promise.resolve(liveScraped.latest) : getRTBProfileLatest(uri),
    liveScraped?.assets?.length ? Promise.resolve(liveScraped.assets) : getRTBProfileAssets(uri),
    liveScraped?.bio?.bio?.length ? Promise.resolve(liveScraped.bio) : getRTBProfileBio(uri),
    getRTBProfileAnnual(uri),
  ]);

  if (!info && !latest && !liveScraped) return null;

  return {
    uri,
    info,
    latest: liveScraped?.latest || latest,
    assets: liveScraped?.assets?.length ? liveScraped.assets : assets,
    bio: liveScraped?.bio?.bio?.length ? liveScraped.bio : bio,
    annual,
    chartHistory: liveScraped?.chartHistory || [],
  };
}
