import { NextResponse } from "next/server";
import { getBillionairesFromDB } from "@/lib/db-people";
import { getRTBLatestList } from "@/lib/rtb";
import { formatCountryName } from "@/lib/countries";
import { VERIFIED_PORTRAITS } from "@/lib/portraits";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 100);

  const [dbData, rtb] = await Promise.all([
    getBillionairesFromDB(100),
    getRTBLatestList(),
  ]);

  const rtbMap = new Map();
  if (rtb?.list) {
    for (const item of rtb.list) {
      if (item.uri) rtbMap.set(item.uri.toLowerCase().trim(), item);
      if (item.name) rtbMap.set(item.name.toLowerCase().trim(), item);
    }
  }

  const seen = new Set<string>();
  const combined: any[] = [];

  // 1. Enriched database records first
  if (dbData && dbData.length > 0) {
    for (const p of dbData) {
      const slugNorm = p.slug.toLowerCase().trim();
      const nameNorm = p.name.toLowerCase().trim();
      seen.add(slugNorm);
      seen.add(nameNorm);

      const live = rtbMap.get(slugNorm) || rtbMap.get(nameNorm);
      combined.push({
        ...p,
        netWorth: live ? Math.round((live.networth / 1000) * 100) / 100 : p.netWorth,
        netWorthChangeDay: live?.change ? Math.round((live.change.value / 1000) * 100) / 100 : p.netWorthChangeDay,
        netWorthChangePercent: live?.change ? Math.round(live.change.pct * 100) / 100 : p.netWorthChangePercent,
        mainCompany: live?.source?.[0] || p.mainCompany,
      });
    }
  }

  // 2. Supplement with live RTB feed so rankings ALWAYS provide a full top 100
  if (rtb?.list && Array.isArray(rtb.list)) {
    for (const item of rtb.list) {
      if (!item.uri) continue;
      const uriNorm = item.uri.toLowerCase().trim();
      const nameNorm = item.name ? item.name.toLowerCase().trim() : "";

      if (seen.has(uriNorm) || (nameNorm && seen.has(nameNorm))) {
        continue;
      }

      seen.add(uriNorm);
      if (nameNorm) seen.add(nameNorm);

      combined.push({
        id: item.uri,
        slug: item.uri,
        name: item.name,
        rank: item.rank || 9999,
        netWorth: Math.round((item.networth / 1000) * 100) / 100,
        netWorthChangeDay: item.change?.value ? Math.round((item.change.value / 1000) * 100) / 100 : 0,
        netWorthChangePercent: item.change?.pct ? Math.round(item.change.pct * 100) / 100 : 0,
        currentCountry: formatCountryName(item.citizenship) || "United States",
        currentCity: "",
        citizenship: formatCountryName(item.citizenship) || "United States",
        mainCompany: item.source?.[0] || "Enterprise",
        photoUrl: VERIFIED_PORTRAITS[item.uri] || item.image || undefined,
        isTechTitan: true,
        isLive: true,
        bio: `${item.name} is a global billionaire ranked #${item.rank}.`,
        grokipediaSummary: null,
        wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.name.replace(/ /g, "_"))}`,
      });
    }
  }

  let data = combined;

  if (country && country !== "all") {
    data = data.filter(
      (p) => p.currentCountry.toLowerCase() === country.toLowerCase()
    );
  }

  // Sort strictly by net worth descending and assign clean 1..limit sequential ranks
  const sorted = [...data].sort((a, b) => (b.netWorth || 0) - (a.netWorth || 0));

  const sanitized = sorted.slice(0, limit).map((p, idx) => ({
    rank: idx + 1,
    slug: p.slug,
    name: p.name,
    net_worth_billion: p.netWorth,
    bloomberg_net_worth_billion: p.bloombergNetWorth ?? null,
    change_day_billion: p.netWorthChangeDay,
    change_day_percent: p.netWorthChangePercent,
    current_city: p.currentCity?.toLowerCase() === "global" ? "" : p.currentCity,
    current_country: formatCountryName(p.currentCountry) || "United States",
    citizenship: formatCountryName(p.citizenship || p.currentCountry) || "United States",
    primary_company: p.mainCompany,
    photo_url: VERIFIED_PORTRAITS[p.slug] || p.photoUrl || null,
    bio: p.bio,
    grokipedia_summary: p.grokipediaSummary,
    wikipedia_url: p.wikipediaUrl,
    source: "Supabase Live Database + Real-Time Billionaires Feed",
    updated_at: new Date().toISOString(),
  }));

  return NextResponse.json(
    {
      status: "success",
      total: sanitized.length,
      source: "SuperRich Live Real-Time Index",
      license: "Free public access with attribution to superrich.tech",
      data: sanitized,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    }
  );
}
