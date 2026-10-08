import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      name: "SuperRich Global Billionaires API",
      status: "operational",
      domain: "https://api.superrich.tech",
      docs: "https://docs.superrich.tech",
      endpoints: {
        rankings: {
          url: "https://api.superrich.tech/rankings",
          description: "Structured rankings with query filters (limit, country, sort)",
          method: "GET",
        },
        people: {
          url: "https://api.superrich.tech/people",
          description: "Global billionaire directory with live net worth and verified profiles",
          method: "GET",
        },
        person: {
          url: "https://api.superrich.tech/people/{slug}",
          description: "Comprehensive billionaire dossier, live valuations, and biographical data",
          method: "GET",
        },
        rtb_list: {
          url: "https://api.superrich.tech/rtb/list",
          description: "Real-time list of 3,400+ global billionaires with live daily changes",
          method: "GET",
        },
        rtb_profile: {
          url: "https://api.superrich.tech/rtb/profile/{slug}",
          description: "Deep wealth breakdown, asset holdings, career timeline & archives",
          method: "GET",
        },
      },
      rate_limit: {
        public: "1,000 requests / day",
        burst: "30 requests / minute",
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
