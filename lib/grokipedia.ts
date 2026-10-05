/**
 * Grokipedia API Client
 * Unofficial client for accessing xAI's Grokipedia knowledge base
 * Compatible with https://github.com/jasonniebauer/grokipedia-api & PyPI grokipedia-api
 */

export interface GrokipediaReference {
  number: number;
  url: string;
}

export interface GrokipediaPage {
  title: string;
  slug: string;
  url: string;
  content_text: string;
  char_count: number;
  word_count: number;
  references_count: number;
  references: GrokipediaReference[];
}

export interface GrokipediaFetchOptions {
  truncateChars?: number;
  cacheTtlSeconds?: number;
}

const BASE_URL =
  process.env.GROKIPEDIA_API_BASE_URL || "https://grokipedia-api.com";
const API_KEY = process.env.GROKIPEDIA_API_KEY || "";

/**
 * Normalizes a topic or name into a valid Grokipedia URL slug
 * e.g. "Elon Musk" -> "Elon_Musk", "Austin, Texas" -> "Austin,_Texas"
 */
export function normalizeGrokipediaSlug(nameOrTopic: string): string {
  if (!nameOrTopic) return "";
  return nameOrTopic
    .trim()
    .replace(/\s+/g, "_")
    .replace(/&/g, "and");
}

/**
 * Fetch full parsed article from Grokipedia
 * @param slug - Article slug (e.g., "Elon_Musk" or "Larry_Ellison")
 * @param options - Optional settings (e.g. truncation, custom cache TTL)
 */
export async function getGrokipediaPage(
  slug: string,
  options?: GrokipediaFetchOptions
): Promise<GrokipediaPage | null> {
  const normalizedSlug = normalizeGrokipediaSlug(slug);
  const endpoint = `${BASE_URL.replace(/\/$/, "")}/page/${encodeURIComponent(
    normalizedSlug
  )}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "SuperRich-Billionaires-Index/1.0",
  };

  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
    headers["X-API-Key"] = API_KEY;
  }

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });

    if (res.status === 404) {
      console.warn(`[Grokipedia] Article not found for slug: ${normalizedSlug}`);
      return null;
    }

    if (!res.ok) {
      console.error(
        `[Grokipedia] Error ${res.status}: Failed to fetch ${endpoint}`
      );
      return null;
    }

    const data: GrokipediaPage = await res.json();

    if (options?.truncateChars && data.content_text) {
      data.content_text = data.content_text.slice(0, options.truncateChars);
    }

    return data;
  } catch (error) {
    console.error(
      `[Grokipedia] Connection error fetching ${normalizedSlug}:`,
      error
    );
    return null;
  }
}

/**
 * Convenience helper to get citation reference URLs for fact-checking
 */
export async function getGrokipediaReferences(
  slug: string
): Promise<GrokipediaReference[]> {
  const page = await getGrokipediaPage(slug);
  return page?.references || [];
}

/**
 * Extracts a concise biographical summary from a Grokipedia article
 */
export async function getGrokipediaSummary(
  slug: string,
  maxChars = 400
): Promise<string | null> {
  const page = await getGrokipediaPage(slug, { truncateChars: maxChars * 2 });
  if (!page || !page.content_text) return null;

  // Clean lead paragraph
  const paragraphs = page.content_text.split(/\n+/).map((p) => p.trim());
  const lead = paragraphs.find((p) => p.length > 50) || paragraphs[0] || "";

  if (lead.length <= maxChars) return lead;
  return lead.slice(0, maxChars).trim() + "...";
}
