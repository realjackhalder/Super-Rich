import { NextResponse } from "next/server";
import { getBillionaireBySlugFromDB } from "@/lib/db-people";
import { getRTBFullProfile } from "@/lib/rtb";
import { getGrokipediaPage, getGrokipediaUrl, normalizeGrokipediaSlug } from "@/lib/grokipedia";
import { getWikipediaSummary } from "@/lib/wikipedia";
import { getBloombergForPerson } from "@/lib/bloomberg";
import { formatCountryName } from "@/lib/countries";
import { getBillionaireSocials } from "@/lib/billionaire-socials";
import { getBillionaireTimeline } from "@/lib/billionaire-timelines";
import { getBillionaireCourtEmails, getBillionaireContactEmails } from "@/lib/billionaire-emails";
import { getBillionaireLegal } from "@/lib/billionaire-legal";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug.toLowerCase().trim();

  // 1. Try Supabase Postgres database
  const dbPerson = await getBillionaireBySlugFromDB(slug);

  const fallbackName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const searchName = dbPerson?.name || fallbackName;

  // 2. Fetch live enrichment
  const [rtbProfile, grokData, wikiData, bloombergData] = await Promise.allSettled([
    getRTBFullProfile(slug),
    getGrokipediaPage(searchName),
    getWikipediaSummary(searchName),
    getBloombergForPerson(slug),
  ]);

  if (!dbPerson && rtbProfile.status !== "fulfilled") {
    return NextResponse.json(
      { status: "error", message: `Billionaire profile '${slug}' not found` },
      { status: 404 }
    );
  }

  const rtb = rtbProfile.status === "fulfilled" ? rtbProfile.value : null;
  const grok = grokData.status === "fulfilled" ? grokData.value : null;
  const wiki = wikiData.status === "fulfilled" ? wikiData.value : null;
  const bloomberg = bloombergData.status === "fulfilled" ? bloombergData.value : null;

  const combinedName = dbPerson?.name || rtb?.info?.name || fallbackName;

  const netWorth = rtb?.latest?.networth
    ? Math.round((rtb.latest.networth / 1000) * 100) / 100
    : dbPerson?.netWorth || 0;

  const combinedData = {
    slug,
    name: combinedName,
    rank:
      dbPerson?.rank ||
      (rtb?.latest?.rank && rtb.latest.rank < 10000 ? rtb.latest.rank : (slug === "elon-musk" ? 1 : 999)),
    netWorthBillion: netWorth,
    netWorthChangeDayBillion: rtb?.latest?.change?.value
      ? Math.round((rtb.latest.change.value / 1000) * 100) / 100
      : dbPerson?.netWorthChangeDay || 0,
    netWorthChangePercent: rtb?.latest?.change?.pct ?? dbPerson?.netWorthChangePercent ?? 0,
    bloombergValuation: bloomberg
      ? {
        netWorthBillion: bloomberg.netWorth,
        rank: bloomberg.rank,
        changeDayBillion: bloomberg.changeDay,
      }
      : null,
    citizenship:
      formatCountryName(
        dbPerson?.citizenship ||
        rtb?.info?.citizenship ||
        rtb?.latest?.citizenship ||
        dbPerson?.currentCountry
      ) || "United States",
    currentCountry:
      formatCountryName(
        dbPerson?.currentCountry ||
        rtb?.info?.residence?.country
      ) || "United States",
    currentCity:
      (dbPerson?.currentCity && dbPerson.currentCity.toLowerCase() !== "global")
        ? dbPerson.currentCity
        : rtb?.info?.residence?.city || "",
    mainCompany: dbPerson?.mainCompany || rtb?.info?.source?.join(" & ") || "Enterprise",
    photoUrl: wiki?.photoUrl || dbPerson?.photoUrl,
    bio: wiki?.extract || dbPerson?.bio,
    grokipedia: {
      title: grok?.title || combinedName,
      url: grok?.url || getGrokipediaUrl(combinedName),
      summary: grok?.description || dbPerson?.grokipediaSummary || null,
      referencesCount: grok?.references_count || (grok?.references?.length ?? 0),
      references: grok?.references || [],
    },
    wikipedia: {
      url: wiki?.pageUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(normalizeGrokipediaSlug(combinedName))}`,
      wikidataId: wiki?.wikidataId || null,
      description: wiki?.description || null,
    },
    rtbLiveAssets: rtb?.assets || [],
    rtbAnnualHistory: rtb?.annual || null,
    socials: getBillionaireSocials(slug),
    stocks: [],
    timeline: getBillionaireTimeline(slug, combinedName, dbPerson, rtb),
    legal: getBillionaireLegal(slug),
    courtEmails: getBillionaireCourtEmails(slug),
    contactEmails: getBillionaireContactEmails(slug, dbPerson?.mainCompany || rtb?.info?.source?.join(" & ")),
    source: "Supabase + Forbes RTB + Grokipedia + Wikipedia + Bloomberg",
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(
    {
      status: "success",
      license: "Free public access with attribution to superrich.tech",
      data: combinedData,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
