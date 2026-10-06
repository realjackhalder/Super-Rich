import { NextResponse } from "next/server";
import { getBillionairesFromDB } from "@/lib/db-people";
import { getRTBLatestList } from "@/lib/rtb";
import { formatCountryName } from "@/lib/countries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

  let data = await getBillionairesFromDB(limit);

  // Fallback to RTB live feed if DB is warming up
  if (!data || data.length === 0) {
    const rtb = await getRTBLatestList();
    if (rtb?.list) {
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
        isTechTitan: true,
        isLive: true,
      }));
    }
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
    photo_url: p.photoUrl,
    bio: p.bio,
    grokipedia_summary: p.grokipediaSummary,
    wikipedia_url: p.wikipediaUrl,
    source: "Supabase Live Database (Forbes RTB, Grokipedia & Bloomberg)",
    updated_at: p.updatedAt || new Date().toISOString(),
  }));

  return NextResponse.json(
    {
      status: "success",
      total: sanitized.length,
      source: "SuperRich Live Database (Supabase + Forbes RTB + Grokipedia + Bloomberg)",
      license: "Free public access with attribution to superrich.tech",
      data: sanitized,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
