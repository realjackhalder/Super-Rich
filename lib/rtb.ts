/**
 * Real-Time Billionaires API (RTB API) Client
 * Integration with https://github.com/komed3/rtb-api and https://realtimebillionaires.de/
 * Provides monthly-updated CDN endpoints for global lists, full bios, assets, daily movers, and historical analytics.
 */

import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";

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
  "https://cdn.statically.io/gh/komed3/rtb-api/v1/api";

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

async function fetchFromRTB<T>(path: string): Promise<T | null> {
  const cleanPath = path.replace(/^\//, "");
  const primaryUrl = `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
  const fallbackUrl = `${FALLBACK_BASE_URL}/${cleanPath}`;

  const headers = {
    Accept: "application/json",
    "User-Agent": "SuperRich-Index/2.0 (realtimebillionaires integration)",
  };

  try {
    const res = await fetch(primaryUrl, {
      method: "GET",
      headers,
      next: { revalidate: 86400 }, // Cache 24h
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    console.warn(`[RTB API] Primary URL failed (${primaryUrl}), trying fallback.`);
  }

  // Fallback to raw GitHub
  try {
    const res = await fetch(fallbackUrl, {
      method: "GET",
      headers,
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    console.error(`[RTB API] Both primary and fallback failed for ${path}:`, err);
  }

  return null;
}

/**
 * Fetch the latest real-time billionaires global list
 */
export async function getRTBLatestList(): Promise<RTBListResponse | null> {
  const remote = await fetchFromRTB<RTBListResponse>("list/rtb/latest");
  if (remote) return remote;

  // Fallback to local 50 billionaires data if offline/sandboxed
  return {
    date: new Date().toISOString().split("T")[0],
    count: INITIAL_50_BILLIONAIRES.length,
    woman: 3,
    total: INITIAL_50_BILLIONAIRES.reduce((acc, curr) => acc + curr.netWorth * 1000, 0),
    list: INITIAL_50_BILLIONAIRES.map((p) => ({
      rank: p.rank,
      uri: p.slug,
      name: p.name,
      gender: "m",
      age: 50,
      networth: p.netWorth * 1000,
      change: {
        value: p.netWorthChangeDay * 1000,
        pct: p.netWorthChangePercent,
        date: new Date().toISOString().split("T")[0],
      },
      diff: 0,
      flag: "unchanged",
      citizenship: p.citizenship,
      industry: ["technology"],
      source: [p.mainCompany],
      image: p.photoUrl,
    })),
  };
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
  return fetchFromRTB<RTBProfileLatest>(`profile/${uri}/latest`);
}

/**
 * Fetch financial stock assets & company shareholdings
 */
export async function getRTBProfileAssets(
  uriOrSlug: string
): Promise<RTBAsset[]> {
  const uri = normalizeRTBUri(uriOrSlug);
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
  const [info, latest, assets, bio, annual] = await Promise.all([
    getRTBProfileInfo(uri),
    getRTBProfileLatest(uri),
    getRTBProfileAssets(uri),
    getRTBProfileBio(uri),
    getRTBProfileAnnual(uri),
  ]);

  if (!info && !latest) return null;

  return {
    uri,
    info,
    latest,
    assets,
    bio,
    annual,
  };
}
