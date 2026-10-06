import { notFound } from "next/navigation";
import { getBillionaireBySlugFromDB } from "@/lib/db-people";
import { getRTBFullProfile } from "@/lib/rtb";
import { getGrokipediaPage } from "@/lib/grokipedia";
import { getWikipediaSummary } from "@/lib/wikipedia";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";
import BillionaireProfileClient from "@/components/BillionaireProfileClient";

export const dynamic = "force-dynamic";

const VERIFIED_PORTRAITS: Record<string, string> = {
  "elon-musk": "/images/billionaires/elon-musk.jpg",
  "larry-ellison": "/images/billionaires/larry-ellison.jpg",
  "mark-zuckerberg": "/images/billionaires/mark-zuckerberg.jpg",
};

export default async function BillionaireProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug.toLowerCase().trim();

  // 1. Fetch from Supabase Postgres database
  const dbPerson = await getBillionaireBySlugFromDB(slug);
  const staticPerson = INITIAL_50_BILLIONAIRES.find((p) => p.slug === slug);

  // 2. Fetch live RTB full profile & external enrichment
  const [rtbProfile, grokData, wikiData] = await Promise.allSettled([
    getRTBFullProfile(slug),
    getGrokipediaPage(dbPerson?.name || staticPerson?.name || slug),
    getWikipediaSummary(dbPerson?.name || staticPerson?.name || slug),
  ]);

  const rtb = rtbProfile.status === "fulfilled" ? rtbProfile.value : null;
  const grok = grokData.status === "fulfilled" ? grokData.value : null;
  const wiki = wikiData.status === "fulfilled" ? wikiData.value : null;

  if (!dbPerson && !staticPerson && !rtb) {
    notFound();
  }

  const netWorth = rtb?.latest?.networth
    ? Math.round((rtb.latest.networth / 1000) * 100) / 100
    : dbPerson?.netWorth || staticPerson?.netWorth || 0;

  const serverProfile = {
    slug,
    name: dbPerson?.name || rtb?.info?.name || staticPerson?.name || slug,
    rank:
      dbPerson?.rank ||
      staticPerson?.rank ||
      (rtb?.latest?.rank && rtb.latest.rank < 10000 ? rtb.latest.rank : (slug === "elon-musk" ? 1 : 999)),
    netWorthBillion: netWorth,
    netWorthChangeDayBillion: rtb?.latest?.change?.value
      ? Math.round((rtb.latest.change.value / 1000) * 100) / 100
      : dbPerson?.netWorthChangeDay || 0,
    netWorthChangePercent: rtb?.latest?.change?.pct ?? dbPerson?.netWorthChangePercent ?? 0,
    bloombergValuation: null,
    currentCountry: dbPerson?.currentCountry || staticPerson?.currentCountry || "Global",
    currentCity: dbPerson?.currentCity || staticPerson?.currentCity || "Global",
    mainCompany: dbPerson?.mainCompany || staticPerson?.mainCompany || rtb?.info?.source?.join(" & ") || "Enterprise",
    photoUrl: VERIFIED_PORTRAITS[slug] || wiki?.photoUrl || dbPerson?.photoUrl || staticPerson?.photoUrl,
    bio: wiki?.extract || dbPerson?.bio || staticPerson?.bio,
    grokipedia: grok
      ? {
          title: grok.title,
          url: grok.url,
          summary: grok.description,
          referencesCount: grok.references_count,
          references: grok.references,
        }
      : null,
    wikipedia: wiki
      ? {
          url: wiki.pageUrl,
          wikidataId: wiki.wikidataId,
          description: wiki.description,
        }
      : null,
    socials: staticPerson?.socials || [],
    stocks: staticPerson?.stocks || [],
    timeline: staticPerson?.timeline || [],
    legal: staticPerson?.legal || [],
    courtEmails: staticPerson?.courtEmails || [],
    contactEmails: staticPerson?.contactEmails || [],
  };

  return (
    <BillionaireProfileClient
      serverProfile={serverProfile}
      serverRtb={rtb}
      slug={slug}
    />
  );
}
