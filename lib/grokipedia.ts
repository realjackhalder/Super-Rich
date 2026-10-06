/**
 * Grokipedia API Client
 * Connects to xAI's Grokipedia knowledge base (https://grokipedia.com)
 * Fetches AI-curated dossiers, biographical infoboxes, and citations.
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
  description?: string;
  char_count: number;
  word_count: number;
  references_count: number;
  references: GrokipediaReference[];
  metadata?: Record<string, any>;
  images?: Array<{ url: string; caption?: string }>;
}

export interface GrokipediaFetchOptions {
  truncateChars?: number;
  cacheTtlSeconds?: number;
}

const GROKIPEDIA_API_BASE = "https://grokipedia.com/api/page-preview";
const GROKIPEDIA_WEB_BASE = "https://grokipedia.com/page";

// In-memory cache to guarantee fast response times
const grokCache = new Map<string, { data: GrokipediaPage; expiry: number }>();

/**
 * Normalizes a billionaire or company name to a Grokipedia slug
 * e.g. "Elon Musk" -> "Elon_Musk", "Larry Page" -> "Larry_Page"
 */
export function normalizeGrokipediaSlug(nameOrTopic: string): string {
  if (!nameOrTopic) return "";
  return nameOrTopic
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/&/g, "and");
}

/**
 * Fetch full parsed article from Grokipedia
 */
export async function getGrokipediaPage(
  slugOrName: string,
  options?: GrokipediaFetchOptions
): Promise<GrokipediaPage | null> {
  const slug = normalizeGrokipediaSlug(slugOrName);
  if (!slug) return null;

  const cached = grokCache.get(slug);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const endpoint = `${GROKIPEDIA_API_BASE}?slug=${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "SuperRich-Index/2.0 (Grokipedia Integration)",
      },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`[Grokipedia] Article not found: ${slug}`);
      }
      return null;
    }

    const json = await res.json();
    if (!json?.found || !json.page) {
      return null;
    }

    const page = json.page;
    const rawContent: string = page.content || page.description || "";

    // Clean markdown headings, infobox tags, and extract clean text
    const cleanText = rawContent
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\[\[(.*?)\]\]/g, "$1")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/\|.*?\n/g, "")
      .trim();

    const references: GrokipediaReference[] = Array.isArray(page.citations)
      ? page.citations.map((c: any, idx: number) => ({
          number: idx + 1,
          url: typeof c === "string" ? c : c.url || c.uri || "",
        }))
      : [];

    const result: GrokipediaPage = {
      title: page.title || slug.replace(/_/g, " "),
      slug,
      url: `${GROKIPEDIA_WEB_BASE}/${slug}`,
      content_text: cleanText,
      description: page.description || cleanText.slice(0, 300),
      char_count: cleanText.length,
      word_count: cleanText ? cleanText.split(/\s+/).length : 0,
      references_count: references.length,
      references,
      metadata: page.metadata,
      images: Array.isArray(page.images) ? page.images : [],
    };

    // Cache for 10 minutes
    const ttl = (options?.cacheTtlSeconds || 600) * 1000;
    grokCache.set(slug, { data: result, expiry: Date.now() + ttl });

    return result;
  } catch (error) {
    console.warn(`[Grokipedia] Fetch failed for ${slug}:`, error);
    return null;
  }
}

/**
 * Extracts a concise biographical summary from Grokipedia
 */
export async function getGrokipediaSummary(
  slugOrName: string,
  maxChars = 350
): Promise<string | null> {
  const page = await getGrokipediaPage(slugOrName);
  if (!page) return null;

  if (page.description && page.description.length > 40) {
    return page.description.slice(0, maxChars).trim();
  }

  const paragraphs = page.content_text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 50 && !p.startsWith("#"));

  const lead = paragraphs[0] || page.content_text;
  if (!lead) return null;

  if (lead.length <= maxChars) return lead;
  return lead.slice(0, maxChars).trim() + "...";
}
