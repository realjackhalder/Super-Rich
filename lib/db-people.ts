/**
 * Database Billionaires Repository
 * Reads directly from Supabase Postgres `people` table.
 * Automatically initiates sync if database is empty or cold.
 */

import { db, hasDatabaseConnection } from "@/db";
import { people } from "@/db/schema";
import { desc, asc, eq, sql } from "drizzle-orm";
import { syncBillionairesToSupabase } from "@/lib/sync";
import { formatCountryName } from "@/lib/countries";
import { VERIFIED_PORTRAITS } from "@/lib/portraits";


export interface DBBillionaire {
  id: number;
  slug: string;
  name: string;
  rank: number;
  netWorth: number; // in billions USD
  netWorthChangeDay: number; // in billions USD
  netWorthChangePercent: number;
  bloombergNetWorth?: number;
  bloombergRank?: number;
  currentCountry: string;
  currentCity: string;
  citizenship?: string;
  mainCompany: string;
  industry?: string;
  photoUrl?: string;
  bio?: string;
  grokipediaSummary?: string;
  wikipediaUrl?: string;
  wikidataId?: string;
  isTechTitan: boolean;
  isLive: boolean;
  updatedAt?: string;
}

// In-memory request cache for 30s to keep SSR rendering sub-millisecond
let memoryCachePeople: { data: DBBillionaire[]; expiry: number } | null = null;
let isSyncInProgress = false;

/**
 * Fetch all billionaires from Supabase database with instant fallback
 */
export async function getBillionairesFromDB(limit = 100): Promise<DBBillionaire[]> {
  if (memoryCachePeople && memoryCachePeople.expiry > Date.now() && memoryCachePeople.data.length >= limit) {
    return memoryCachePeople.data.slice(0, limit);
  }

  if (hasDatabaseConnection && db) {
    try {
      const rows = await db
        .select()
        .from(people)
        .orderBy(asc(people.rank))
        .limit(limit);

      if (rows && rows.length > 0) {
        const formatted: DBBillionaire[] = (rows as any[]).map((r: any) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          rank: r.rank,
          netWorth: parseFloat(r.netWorth || "0"),
          netWorthChangeDay: parseFloat(r.netWorthChangeDay || "0"),
          netWorthChangePercent: parseFloat(r.netWorthChangePercent || "0"),
          bloombergNetWorth: r.bloombergNetWorth ? parseFloat(r.bloombergNetWorth) : undefined,
          bloombergRank: r.bloombergRank ?? undefined,
          currentCountry: formatCountryName(r.currentCountry) || "United States",
          currentCity: r.currentCity?.toLowerCase() === "global" ? "" : (r.currentCity || ""),
          citizenship: r.citizenship ? formatCountryName(r.citizenship) : formatCountryName(r.currentCountry) || "United States",
          mainCompany: r.mainCompany || "Enterprise",
          industry: r.industry ?? undefined,
          photoUrl: VERIFIED_PORTRAITS[r.slug] || r.photoUrl || undefined,
          bio: r.bio ?? undefined,
          grokipediaSummary: r.grokipediaSummary ?? undefined,
          wikipediaUrl: r.wikipediaUrl ?? undefined,
          wikidataId: r.wikidataId ?? undefined,
          isTechTitan: Boolean(r.isTechTitan),
          isLive: true,
          updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
        }));

        // Cache for 30 seconds
        memoryCachePeople = {
          data: formatted,
          expiry: Date.now() + 30 * 1000,
        };

        return formatted.slice(0, limit);
      }
    } catch (err: any) {
      console.warn("[DB Repo] Failed to query people from database:", err.message);
    }
  }

  return [];
}

/**
 * Fetch a single billionaire dossier by slug from Supabase
 */
export async function getBillionaireBySlugFromDB(slug: string): Promise<DBBillionaire | null> {
  const normSlug = slug.toLowerCase().trim();

  if (hasDatabaseConnection && db) {
    try {
      const rows = await db
        .select()
        .from(people)
        .where(eq(people.slug, normSlug))
        .limit(1);

      if (rows && rows.length > 0) {
        const r: any = rows[0];
        return {
          id: r.id,
          slug: r.slug,
          name: r.name,
          rank: r.rank,
          netWorth: parseFloat(r.netWorth || "0"),
          netWorthChangeDay: parseFloat(r.netWorthChangeDay || "0"),
          netWorthChangePercent: parseFloat(r.netWorthChangePercent || "0"),
          bloombergNetWorth: r.bloombergNetWorth ? parseFloat(r.bloombergNetWorth) : undefined,
          bloombergRank: r.bloombergRank ?? undefined,
          currentCountry: formatCountryName(r.currentCountry) || "United States",
          currentCity: r.currentCity?.toLowerCase() === "global" ? "" : (r.currentCity || ""),
          citizenship: r.citizenship ? formatCountryName(r.citizenship) : formatCountryName(r.currentCountry) || "United States",
          mainCompany: r.mainCompany || "Enterprise",
          industry: r.industry ?? undefined,
          photoUrl: VERIFIED_PORTRAITS[r.slug] || r.photoUrl || undefined,
          bio: r.bio ?? undefined,
          grokipediaSummary: r.grokipediaSummary ?? undefined,
          wikipediaUrl: r.wikipediaUrl ?? undefined,
          wikidataId: r.wikidataId ?? undefined,
          isTechTitan: Boolean(r.isTechTitan),
          isLive: true,
          updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
        };
      }
    } catch (err) {
      console.warn(`[DB Repo] Lookup failed for slug ${slug}:`, err);
    }
  }

  return null;
}
