/**
 * Bloomberg Billionaires Index Client
 * Tracks Bloomberg's real-time valuations to contrast against Forbes RTB.
 */

import { formatCountryName } from "@/lib/countries";

export interface BloombergBillionaire {
  rank: number;
  name: string;
  slug: string;
  country: string;
  industry: string;
  netWorth: number; // in billions
  changeDay: number; // in billions
  changePercent: number;
}

// Cached top Bloomberg valuations snapshot

let bloombergCache: BloombergBillionaire[] | null = null;
let lastBloombergFetch = 0;

/**
 * Fetch live Bloomberg Billionaires Index
 */
export async function fetchBloombergIndex(): Promise<BloombergBillionaire[]> {
  if (bloombergCache && Date.now() - lastBloombergFetch < 3600 * 1000) {
    return bloombergCache;
  }

  try {
    const res = await fetch("https://www.bloomberg.com/billionaires/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });

    if (res.ok) {
      const html = await res.text();
      // Look for TSV block
      const marker = "\\tage\\tgender";
      const idx = html.indexOf(marker);
      if (idx !== -1) {
        const end = html.indexOf('"', idx);
        const raw = html.slice(idx, end);
        const unescaped = raw.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        const lines = unescaped.split("\n");
        const list: BloombergBillionaire[] = [];

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split("\t");
          if (parts.length >= 15 && parts[2]) {
            const rawWorth = Number(parts[13]) || 0;
            const rawChange = Number(parts[14]) || 0;
            const pct = Number(parts[15]) || 0;

            list.push({
              rank: Number(parts[0]) || i,
              name: parts[2].trim(),
              slug: parts[4] || parts[2].toLowerCase().replace(/\s+/g, "-"),
              country: formatCountryName(parts[7]) || "United States",
              industry: parts[9] || "Technology",
              netWorth: Math.round((rawWorth / 1e9) * 10) / 10,
              changeDay: Math.round((rawChange / 1e9) * 10) / 10,
              changePercent: pct,
            });
          }
        }

        if (list.length > 50) {
          bloombergCache = list;
          lastBloombergFetch = Date.now();
          return list;
        }
      }
    }
  } catch (err) {
    console.warn("[Bloomberg] Live scraper timed out or blocked, using snapshot cache:", err);
  }

  // Return formatted snapshot
  return Object.entries(BLOOMBERG_SNAPSHOT).map(([slug, data]) => ({
    rank: data.rank,
    slug,
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    country: "United States",
    industry: "Technology",
    netWorth: data.worth,
    changeDay: data.change,
    changePercent: Math.round((data.change / (data.worth - data.change)) * 1000) / 10,
  }));
}

/**
 * Lookup Bloomberg valuation by name or slug
 */
export async function getBloombergForPerson(
  nameOrSlug: string
): Promise<BloombergBillionaire | null> {
  const norm = nameOrSlug.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  if (BLOOMBERG_SNAPSHOT[norm]) {
    const s = BLOOMBERG_SNAPSHOT[norm];
    return {
      rank: s.rank,
      slug: norm,
      name: nameOrSlug,
      country: "United States",
      industry: "Technology",
      netWorth: s.worth,
      changeDay: s.change,
      changePercent: 0,
    };
  }

  const list = await fetchBloombergIndex();
  return (
    list.find(
      (p) =>
        p.slug.toLowerCase() === norm ||
        p.name.toLowerCase().trim() === nameOrSlug.toLowerCase().trim()
    ) || null
  );
}
