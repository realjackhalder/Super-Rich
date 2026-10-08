import { NextResponse } from "next/server";
import { getBillionairesFromDB } from "@/lib/db-people";
import { getRTBLatestList } from "@/lib/rtb";
import { formatCountryName } from "@/lib/countries";
import { VERIFIED_PORTRAITS } from "@/lib/portraits";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

  const [dbData, rtb] = await Promise.all([
    getBillionairesFromDB(limit),
    getRTBLatestList(),
  ]);

  const rtbMap = new Map();
  if (rtb?.list) {
    for (const item of rtb.list) {
      if (item.uri) rtbMap.set(item.uri.toLowerCase().trim(), item);
      if (item.name) rtbMap.set(item.name.toLowerCase().trim(), item);
    }
  }

  let data = dbData && dbData.length > 0
    ? dbData.map((p) => {
        const live = rtbMap.get(p.slug.toLowerCase().trim()) || rtbMap.get(p.name.toLowerCase().trim());
        return {
          ...p,
          netWorth: live ? Math.round((live.networth / 1000) * 100) / 100 : p.netWorth,
          netWorthChangeDay: live?.change ? Math.round((live.change.value / 1000) * 100) / 100 : p.netWorthChangeDay,
          netWorthChangePercent: live?.change ? Math.round(live.change.pct * 100) / 100 : p.netWorthChangePercent,
        };
      })
    : [];

  // Fallback to RTB live feed if DB is empty
  if (data.length === 0 && rtb?.list) {
    data = rtb.list.slice(0, limit).map((p, idx) => ({
      id: idx + 1,
      slug: p.uri,
      name: p.name,
      rank: p.rank,
      netWorth: Math.round((p.networth / 1000) * 100) / 100,
      netWorthChangeDay: p.change?.value ? Math.round((p.change.value / 1000) * 100) / 100 : 0,
      netWorthChangePercent: p.change?.pct || 0,
      currentCountry: formatCountryName(p.citizenship) || "United States",
      currentCity: "",
      citizenship: formatCountryName(p.citizenship) || "United States",
      mainCompany: p.source?.[0] || "Enterprise",
      photoUrl: VERIFIED_PORTRAITS[p.uri] || p.image || undefined,
      isTechTitan: true,
      isLive: true,
    }));
  }

  if (country && country !== "all") {
    data = data.filter(
      (p) => p.currentCountry.toLowerCase() === country.toLowerCase()
    );
  }

  // Sort by net worth descending and assign clean 1..N sequential ranks
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
