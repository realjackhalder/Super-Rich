import { notFound } from "next/navigation";
import { getBillionaireBySlugFromDB } from "@/lib/db-people";
import { getRTBFullProfile } from "@/lib/rtb";
import { getGrokipediaPage, getGrokipediaUrl, normalizeGrokipediaSlug } from "@/lib/grokipedia";
import { getWikipediaSummary } from "@/lib/wikipedia";
import { formatCountryName } from "@/lib/countries";
import BillionaireProfileClient from "@/components/BillionaireProfileClient";
import { VERIFIED_PORTRAITS } from "@/lib/portraits";

import { getBillionaireSocials } from "@/lib/billionaire-socials";
import { getBillionaireTimeline } from "@/lib/billionaire-timelines";

export const dynamic = "force-dynamic";

export default async function BillionaireProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug.toLowerCase().trim();

  // 1. Fetch from Supabase Postgres database
  const dbPerson = await getBillionaireBySlugFromDB(slug);

  const fallbackName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const searchName = dbPerson?.name || fallbackName;

  // 2. Fetch live RTB full profile & external enrichment
  const [rtbProfile, grokData, wikiData] = await Promise.allSettled([
    getRTBFullProfile(slug),
    getGrokipediaPage(searchName),
    getWikipediaSummary(searchName),
  ]);

  const rtb = rtbProfile.status === "fulfilled" ? rtbProfile.value : null;
  const grok = grokData.status === "fulfilled" ? grokData.value : null;
  const wiki = wikiData.status === "fulfilled" ? wikiData.value : null;

  if (!dbPerson && !rtb) {
    notFound();
  }

  const personName = dbPerson?.name || rtb?.info?.name || fallbackName;

  const netWorth = rtb?.latest?.networth
    ? Math.round((rtb.latest.networth / 1000) * 100) / 100
    : dbPerson?.netWorth || 0;

  const serverProfile = {
    slug,
    name: personName,
    rank:
      dbPerson?.rank ||
      (rtb?.latest?.rank && rtb.latest.rank < 10000 ? rtb.latest.rank : (slug === "elon-musk" ? 1 : 999)),
    netWorthBillion: netWorth,
    netWorthChangeDayBillion: rtb?.latest?.change?.value
      ? Math.round((rtb.latest.change.value / 1000) * 100) / 100
      : dbPerson?.netWorthChangeDay || 0,
    netWorthChangePercent: rtb?.latest?.change?.pct ?? dbPerson?.netWorthChangePercent ?? 0,
    bloombergValuation: null,
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
    photoUrl: VERIFIED_PORTRAITS[slug] || wiki?.photoUrl || dbPerson?.photoUrl,
    bio: wiki?.extract || dbPerson?.bio,
    grokipedia: {
      title: grok?.title || personName,
      url: grok?.url || getGrokipediaUrl(personName),
      summary: grok?.description || dbPerson?.grokipediaSummary || null,
      referencesCount: grok?.references_count || (grok?.references?.length ?? 0),
      references: grok?.references || [],
    },
    wikipedia: {
      url: wiki?.pageUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(normalizeGrokipediaSlug(personName))}`,
      wikidataId: wiki?.wikidataId || null,
      description: wiki?.description || null,
    },
    socials: getBillionaireSocials(slug),
    stocks: [],
    timeline: getBillionaireTimeline(slug, personName, dbPerson, rtb),
    legal: [],
    courtEmails: [],
    contactEmails: [],
  };

  return (
    <BillionaireProfileClient
      serverProfile={serverProfile}
      serverRtb={rtb}
      slug={slug}
    />
  );
}
