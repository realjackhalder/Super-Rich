/**
 * Wikipedia & Wikidata API Client
 * Fetches verified high-resolution portraits, biographical summaries, and Wikidata IDs.
 */

export interface WikipediaSummary {
  title: string;
  extract: string;
  description?: string;
  photoUrl?: string;
  photoWidth?: number;
  photoHeight?: number;
  wikidataId?: string;
  pageUrl: string;
}

const wikiCache = new Map<string, { data: WikipediaSummary | null; expiry: number }>();

export function normalizeWikipediaTitle(name: string): string {
  if (!name) return "";
  return name
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_");
}

export async function getWikipediaSummary(
  nameOrTitle: string
): Promise<WikipediaSummary | null> {
  const title = normalizeWikipediaTitle(nameOrTitle);
  if (!title) return null;

  const cached = wikiCache.get(title);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "SuperRich-Index/2.0 (Wikipedia Enrichment; contact@superrich.tech)",
      },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });

    if (!res.ok) {
      wikiCache.set(title, { data: null, expiry: Date.now() + 60 * 1000 });
      return null;
    }

    const json = await res.json();
    if (!json || json.type === "disambiguation") {
      return null;
    }

    const summary: WikipediaSummary = {
      title: json.title || title.replace(/_/g, " "),
      extract: json.extract || "",
      description: json.description,
      photoUrl:
        json.originalimage?.source ||
        json.thumbnail?.source ||
        undefined,
      photoWidth: json.thumbnail?.width,
      photoHeight: json.thumbnail?.height,
      wikidataId: json.wikibase_item,
      pageUrl:
        json.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };

    wikiCache.set(title, { data: summary, expiry: Date.now() + 3600 * 1000 });
    return summary;
  } catch (err) {
    console.warn(`[Wikipedia] Failed to fetch summary for ${title}:`, err);
    return null;
  }
}
