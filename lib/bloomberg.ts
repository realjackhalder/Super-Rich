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
const BLOOMBERG_SNAPSHOT: Record<string, { rank: number; worth: number; change: number }> = {
  "elon-musk": { rank: 1, worth: 976.9, change: 62.6 },
  "larry-page": { rank: 2, worth: 294.0, change: 3.8 },
  "jeff-bezos": { rank: 3, worth: 276.6, change: 2.1 },
  "sergey-brin": { rank: 4, worth: 273.4, change: 3.5 },
  "michael-dell": { rank: 5, worth: 259.9, change: 1.2 },
  "mark-zuckerberg": { rank: 6, worth: 257.4, change: 4.1 },
  "jensen-huang": { rank: 7, worth: 193.6, change: 5.4 },
  "larry-ellison": { rank: 8, worth: 192.2, change: -1.1 },
  "steve-ballmer": { rank: 9, worth: 180.2, change: 0.8 },
  "warren-buffett": { rank: 10, worth: 143.2, change: -0.4 },
  "bill-gates": { rank: 11, worth: 138.5, change: 0.2 },
  "bernard-arnault": { rank: 12, worth: 135.0, change: -0.9 },
  "amancio-ortega": { rank: 13, worth: 132.8, change: 0.6 },
  "mukesh-ambani": { rank: 14, worth: 112.4, change: 0.5 },
  "gautam-adani": { rank: 15, worth: 104.2, change: 1.1 },
};

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
