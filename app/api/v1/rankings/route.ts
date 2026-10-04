import { NextResponse } from "next/server";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  let data = INITIAL_50_BILLIONAIRES;

  if (country) {
    data = data.filter(
      (p) => p.currentCountry.toLowerCase() === country.toLowerCase()
    );
  }

  const sanitized = data.slice(0, limit).map((p) => ({
    rank: p.rank,
    slug: p.slug,
    name: p.name,
    net_worth_billion: p.netWorth,
    change_day_billion: p.netWorthChangeDay,
    change_day_percent: p.netWorthChangePercent,
    current_city: p.currentCity,
    current_country: p.currentCountry,
    primary_company: p.mainCompany,
    residence_as_of: p.residenceAsOf,
    updated_at: new Date().toISOString(),
  }));

  return NextResponse.json(
    {
      status: "success",
      total: sanitized.length,
      license: "Free public access with attribution to superrich.tech",
      data: sanitized,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
