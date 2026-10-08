import { NextResponse } from "next/server";
import { TOP_100_COMPANIES, CompanyData } from "@/data/companies";

export const dynamic = "force-dynamic";

interface CacheEntry {
  data: {
    success: boolean;
    isLive: boolean;
    timestamp: string;
    totalMarketCapBillion: number;
    companies: CompanyData[];
  };
  expiresAt: number;
}

let memoryCache: CacheEntry | null = null;

async function fetchLiveTicker(ticker: string): Promise<{
  price: number;
  changePercent: number;
  high52?: number;
  low52?: number;
} | null> {
  const sym = ticker.toUpperCase().trim();
  // Skip non-public or synthetic tickers
  if (["PRIVATE", "SPACEX", "BYTEDANCE", "OPENAI", "STRIPE"].includes(sym)) {
    return null;
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      sym
    )}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    return {
      price: Math.round(meta.regularMarketPrice * 100) / 100,
      changePercent:
        typeof meta.regularMarketChangePercent === "number"
          ? Math.round(meta.regularMarketChangePercent * 100) / 100
          : 0,
      high52: meta.fiftyTwoWeekHigh ? Math.round(meta.fiftyTwoWeekHigh * 100) / 100 : undefined,
      low52: meta.fiftyTwoWeekLow ? Math.round(meta.fiftyTwoWeekLow * 100) / 100 : undefined,
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  const now = Date.now();
  if (!forceRefresh && memoryCache && memoryCache.expiresAt > now) {
    return NextResponse.json(memoryCache.data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=60",
      },
    });
  }

  // Clone base company records
  const updatedCompanies: CompanyData[] = TOP_100_COMPANIES.map((c) => ({ ...c }));

  // Process live internet ticker fetches in chunks of 25 for fast parallel resolution
  const chunkSize = 25;
  for (let i = 0; i < updatedCompanies.length; i += chunkSize) {
    const chunk = updatedCompanies.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (company) => {
        const live = await fetchLiveTicker(company.ticker);
        if (live && live.price > 0) {
          company.sharePrice = live.price;
          company.changeDayPercent = live.changePercent;
          company.changeDayBillion =
            Math.round(((company.marketCapBillion * live.changePercent) / 100) * 10) / 10;
          company.marketCapBillion =
            Math.round(company.marketCapBillion * (1 + live.changePercent / 100) * 10) / 10;
          if (live.high52) company.fiftyTwoWeekHigh = live.high52;
          if (live.low52) company.fiftyTwoWeekLow = live.low52;
        }
      })
    );
  }

  // Sort descending by current market capitalization
  updatedCompanies.sort((a, b) => b.marketCapBillion - a.marketCapBillion);

  // Re-rank 1..N
  updatedCompanies.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  const totalMarketCap = updatedCompanies.reduce((acc, c) => acc + c.marketCapBillion, 0);

  const payload = {
    success: true,
    isLive: true,
    timestamp: new Date().toISOString(),
    totalMarketCapBillion: Math.round(totalMarketCap * 10) / 10,
    companies: updatedCompanies,
  };

  // Cache in memory for 45 seconds
  memoryCache = {
    data: payload,
    expiresAt: now + 45 * 1000,
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=60",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
