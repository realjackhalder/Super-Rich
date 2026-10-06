/**
 * Live Stock Market API Client
 * Fetches real-time market prices, changes, and percentage moves for key billionaire companies.
 */

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketCap?: number;
  updatedAt: string;
}

const stockCache = new Map<string, { data: StockQuote; expiry: number }>();

export async function getLiveStockQuote(ticker: string): Promise<StockQuote | null> {
  const sym = ticker.toUpperCase().trim();
  if (!sym) return null;

  const cached = stockCache.get(sym);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const endpoint = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    sym
  )}?interval=1d&range=1d`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result || !result.meta) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice || meta.chartPreviousClose || 0;
    const prevClose = meta.previousClose || meta.chartPreviousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

    const quote: StockQuote = {
      symbol: sym,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      currency: meta.currency || "USD",
      updatedAt: new Date().toISOString(),
    };

    // Cache for 60 seconds
    stockCache.set(sym, { data: quote, expiry: Date.now() + 60 * 1000 });
    return quote;
  } catch (err) {
    console.warn(`[Stock API] Failed to fetch quote for ${sym}:`, err);
    return null;
  }
}

/**
 * Fetch quotes for multiple tickers in parallel
 */
export async function getMultipleStockQuotes(
  tickers: string[]
): Promise<Record<string, StockQuote>> {
  const results: Record<string, StockQuote> = {};
  const promises = tickers.map(async (t) => {
    const q = await getLiveStockQuote(t);
    if (q) results[t.toUpperCase()] = q;
  });
  await Promise.all(promises);
  return results;
}
