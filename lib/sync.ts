/**
 * Synchronization Engine
 * Ingests live data from:
 * 1. Forbes Real-Time Billionaires (via realtimebillionaires.de / komed3/rtb-api)
 * 2. xAI Grokipedia (grokipedia.com)
 * 3. Wikipedia & Wikidata REST APIs
 * 4. Bloomberg Billionaires Index
 * 5. Yahoo Finance Live Stock Tickers
 *
 * Persists all normalized data directly into Supabase Postgres database.
 */

import { db } from "@/db";
import { people, companies, holdings, netWorthSnapshots } from "@/db/schema";
import { getRTBLatestList, RTBListItem } from "@/lib/rtb";
import { getGrokipediaSummary } from "@/lib/grokipedia";
import { getWikipediaSummary } from "@/lib/wikipedia";
import { getBloombergForPerson, fetchBloombergIndex } from "@/lib/bloomberg";
import { getLiveStockQuote } from "@/lib/stocks";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";

const TECH_KEYWORDS = [
  "technology",
  "software",
  "internet",
  "hardware",
  "semiconductors",
  "ai",
  "artificial intelligence",
  "crypto",
  "e-commerce",
  "tesla",
  "spacex",
  "microsoft",
  "amazon",
  "meta",
  "google",
  "alphabet",
  "oracle",
  "nvidia",
  "apple",
  "dell",
];

const KNOWN_TECH_SLUGS = new Set([
  "elon-musk",
  "larry-page",
  "jeff-bezos",
  "sergey-brin",
  "michael-dell",
  "mark-zuckerberg",
  "larry-ellison",
  "jensen-huang",
  "steve-ballmer",
  "bill-gates",
  "colin-huang",
  "zhang-yiming",
  "ma-huateng",
  "jack-ma",
  "eric-schmidt",
  "shiv-nadar",
  "azim-premji",
  "pierre-omidyar",
  "jan-koum",
  "brian-chesky",
  "pavel-durov",
  "sam-altman",
  "alexandr-wang",
  "marc-benioff",
  "reed-hastings",
  "robin-li",
  "lei-jun",
  "min-liang-tan",
  "david-duffield",
  "judy-faulkner",
  "satya-nadella",
  "tim-cook",
  "sundar-pichai",
  "vitalik-buterin",
]);

const COUNTRY_MAP: Record<string, string> = {
  us: "United States",
  cn: "China",
  fr: "France",
  in: "India",
  de: "Germany",
  jp: "Japan",
  gb: "United Kingdom",
  uk: "United Kingdom",
  ca: "Canada",
  mx: "Mexico",
  br: "Brazil",
  es: "Spain",
  it: "Italy",
  ch: "Switzerland",
  ru: "Russia",
  au: "Australia",
  sg: "Singapore",
  kr: "South Korea",
  id: "Indonesia",
  tw: "Taiwan",
  hk: "Hong Kong",
  se: "Sweden",
  nl: "Netherlands",
  il: "Israel",
  za: "South Africa",
};

export interface SyncResult {
  status: "success" | "partial" | "error";
  totalLiveFeed: number;
  syncedToDatabase: number;
  techTitansCount: number;
  topRanked: Array<{ rank: number; name: string; netWorthBillion: number }>;
  durationMs: number;
  timestamp: string;
}

/**
 * Executes a full database sync from all live sources into Supabase
 */
export async function syncBillionairesToSupabase(limit = 150): Promise<SyncResult> {
  const startTime = Date.now();
  console.log(`[Sync Engine] Starting live ingest from Forbes RTB & enrichment sources (limit: ${limit})...`);

  // 1. Fetch live RTB global list
  const rtbResponse = await getRTBLatestList();
  if (!rtbResponse || !rtbResponse.list || rtbResponse.list.length === 0) {
    throw new Error("Failed to retrieve real-time billionaires list from RTB feed");
  }

  const liveList = rtbResponse.list;
  console.log(`[Sync Engine] Retrieved ${liveList.length} global billionaires from RTB feed (dated ${rtbResponse.date}).`);

  // Map known rich static data for city/company fallback
  const staticMap = new Map(INITIAL_50_BILLIONAIRES.map((p) => [p.slug.toLowerCase(), p]));

  // Slice target list to sync (focusing on top billionaires to preserve rate limits)
  const targetList = liveList.slice(0, limit);
  let syncedCount = 0;
  let techCount = 0;
  const topRanked: Array<{ rank: number; name: string; netWorthBillion: number }> = [];

  // Pre-fetch Bloomberg Index once for all billionaires
  const bloombergList = await fetchBloombergIndex().catch(() => []);
  const bloombergMap = new Map(
    bloombergList.map((b) => [b.slug.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"), b])
  );

  for (let i = 0; i < targetList.length; i++) {
    const item: RTBListItem = targetList[i];
    const slug = (item.uri || item.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")).trim();
    const staticMatch = staticMap.get(slug) || staticMap.get(item.name.toLowerCase());

    const isTech =
      KNOWN_TECH_SLUGS.has(slug) ||
      Boolean(staticMatch) ||
      (item.industry && item.industry.some((ind) => TECH_KEYWORDS.some((kw) => ind.toLowerCase().includes(kw)))) ||
      (item.source && item.source.some((src) => TECH_KEYWORDS.some((kw) => src.toLowerCase().includes(kw))));

    if (isTech) techCount++;

    const netWorthBillion = Math.round((item.networth / 1000) * 100) / 100;
    const changeDayBillion = item.change?.value
      ? Math.round((item.change.value / 1000) * 100) / 100
      : 0;
    const changePct = item.change?.pct ? Math.round(item.change.pct * 100) / 100 : 0;

    const countryCode = (item.citizenship || "").toLowerCase();
    const country =
      staticMatch?.currentCountry ||
      COUNTRY_MAP[countryCode] ||
      item.citizenship?.toUpperCase() ||
      "Global";

    const city =
      staticMatch?.currentCity ||
      (country !== "Global" ? `${country}` : "Global");

    const mainCompany =
      item.source && item.source.length > 0
        ? item.source.join(" & ")
        : staticMatch?.mainCompany || (item.industry && item.industry[0]) || "Enterprise";

    // Bloomberg lookup from pre-fetched map
    const bMatch = bloombergMap.get(slug) || bloombergMap.get(item.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"));
    let bloombergWorth: number | null = bMatch ? bMatch.netWorth : null;
    let bloombergRank: number | null = bMatch ? bMatch.rank : null;

    // Enrichment (Wikipedia & Grokipedia & Forbes Real Image)
    let photoUrl: string | null =
      staticMatch?.photoUrl && !staticMatch.photoUrl.includes("unsplash")
        ? staticMatch.photoUrl
        : null;

    // 1. Try Forbes RTB image if not present
    if (!photoUrl && slug) {
      try {
        const rtbRes = await fetch(
          `https://raw.githubusercontent.com/komed3/rtb-api/master/api/profile/${slug}/info`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (rtbRes.ok) {
          const info = await rtbRes.json();
          if (info?.image && typeof info.image === "string" && info.image.includes("forbesimg.com")) {
            photoUrl = info.image.replace(/https:\/\/\/\//g, "https://").replace(/https:\/\/\//g, "https://");
          }
        }
      } catch {}
    }

    // 2. Try Wikipedia if still not found
    if (!photoUrl) {
      try {
        const cleanName = item.name.replace(/\s*&\s*family/gi, "").replace(/\s*\(.*?\)/g, "").trim();
        const wikiUrlFetch = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName)}&gsrlimit=1&prop=pageimages&pithumbsize=500&format=json`;
        const wRes = await fetch(wikiUrlFetch, {
          headers: { "User-Agent": "SuperRichBot/2.0 (contact@superrich.tech)" },
          signal: AbortSignal.timeout(4000),
        });
        if (wRes.ok) {
          const wJson = await wRes.json();
          const pages = wJson?.query?.pages || {};
          for (const k of Object.keys(pages)) {
            if (pages[k]?.thumbnail?.source) {
              photoUrl = pages[k].thumbnail.source;
              break;
            }
          }
        }
      } catch {}
    }

    let bio = staticMatch?.bio || `${item.name} is a global billionaire ranked #${item.rank}.`;
    let grokSummary: string | null = null;
    let wikiUrl: string | undefined = undefined;
    let wikidataId: string | undefined = undefined;

    if (i < 40) {
      try {
        const [wikiRes, grokRes] = await Promise.allSettled([
          getWikipediaSummary(item.name),
          getGrokipediaSummary(item.name),
        ]);

        if (wikiRes.status === "fulfilled" && wikiRes.value) {
          if (!photoUrl && wikiRes.value.photoUrl) photoUrl = wikiRes.value.photoUrl;
          if (wikiRes.value.extract) bio = wikiRes.value.extract;
          wikiUrl = wikiRes.value.pageUrl;
          wikidataId = wikiRes.value.wikidataId;
        }

        if (grokRes.status === "fulfilled" && grokRes.value) {
          grokSummary = grokRes.value;
        }
      } catch (err) {
        console.warn(`[Sync Engine] Enrichment skipped for ${item.name}:`, err);
      }
    }

    try {
      // Upsert into Supabase `people` table
      await db
        .insert(people)
        .values({
          slug,
          name: item.name,
          rank: item.rank || i + 1,
          netWorth: netWorthBillion.toFixed(2),
          netWorthChangeDay: changeDayBillion.toFixed(2),
          netWorthChangePercent: changePct.toFixed(2),
          currentCountry: country,
          currentCity: city,
          residenceAsOf: "2026",
          residenceSource: "Forbes Real-Time Billionaires / SEC Filings",
          citizenship: item.citizenship || "US",
          photoUrl: photoUrl || null,
          bio,
          grokipediaSummary: grokSummary,
          wikipediaUrl: wikiUrl,
          wikidataId,
          mainCompany,
          industry: (item.industry && item.industry.join(", ")) || "Technology",
          source: "Forbes RTB & Grokipedia",
          bloombergNetWorth: bloombergWorth ? bloombergWorth.toFixed(2) : null,
          bloombergRank,
          isTechTitan: isTech,
          isVerified: true,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: people.slug,
          set: {
            name: item.name,
            rank: item.rank || i + 1,
            netWorth: netWorthBillion.toFixed(2),
            netWorthChangeDay: changeDayBillion.toFixed(2),
            netWorthChangePercent: changePct.toFixed(2),
            currentCountry: country,
            currentCity: city,
            photoUrl: photoUrl || null,
            bio: bio || undefined,
            grokipediaSummary: grokSummary || undefined,
            wikipediaUrl: wikiUrl || undefined,
            wikidataId: wikidataId || undefined,
            mainCompany,
            bloombergNetWorth: bloombergWorth ? bloombergWorth.toFixed(2) : undefined,
            bloombergRank: bloombergRank || undefined,
            isTechTitan: isTech,
            updatedAt: new Date(),
          },
        });

      syncedCount++;

      if (i < 5) {
        topRanked.push({
          rank: item.rank || i + 1,
          name: item.name,
          netWorthBillion,
        });
      }
    } catch (err: any) {
      console.error(`[Sync Engine] Error upserting ${item.name} (${slug}):`, err.message);
    }
  }

  // 2. Sync Companies & Stock quotes for top public corporations
  const topTickers = [
    { name: "Tesla Inc", ticker: "TSLA", cik: "0001318605" },
    { name: "Microsoft Corporation", ticker: "MSFT", cik: "0000789019" },
    { name: "Amazon.com Inc", ticker: "AMZN", cik: "0001018724" },
    { name: "Alphabet Inc", ticker: "GOOGL", cik: "0001652044" },
    { name: "Meta Platforms Inc", ticker: "META", cik: "0001326801" },
    { name: "Oracle Corporation", ticker: "ORCL", cik: "0001341439" },
    { name: "Nvidia Corporation", ticker: "NVDA", cik: "0001045810" },
    { name: "Dell Technologies", ticker: "DELL", cik: "0001571996" },
  ];

  for (const comp of topTickers) {
    try {
      const quote = await getLiveStockQuote(comp.ticker);
      await db
        .insert(companies)
        .values({
          name: comp.name,
          ticker: comp.ticker,
          exchange: "NASDAQ",
          isPublic: true,
          currentPrice: quote ? quote.price.toFixed(2) : "0",
          priceChangePercent: quote ? quote.changePercent.toFixed(2) : "0",
          cik: comp.cik,
          lastUpdated: new Date(),
        })
        .onConflictDoUpdate({
          target: companies.id,
          set: {
            currentPrice: quote ? quote.price.toFixed(2) : undefined,
            priceChangePercent: quote ? quote.changePercent.toFixed(2) : undefined,
            lastUpdated: new Date(),
          },
        });
    } catch (err) {
      // ignore company sync errors
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`[Sync Engine] Successfully synced ${syncedCount} billionaires into Supabase in ${durationMs}ms.`);

  return {
    status: syncedCount > 0 ? "success" : "error",
    totalLiveFeed: liveList.length,
    syncedToDatabase: syncedCount,
    techTitansCount: techCount,
    topRanked,
    durationMs,
    timestamp: new Date().toISOString(),
  };
}
