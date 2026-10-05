import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      name: "SuperRich Global Billionaires API",
      version: "v1.0.0",
      status: "operational",
      domain: "https://api.superrich.tech",
      docs: "https://docs.superrich.tech",
      endpoints: {
        rtb_list: {
          url: "https://api.superrich.tech/rtb/list",
          description: "Real-time list of 3,400+ global billionaires with live daily changes",
          method: "GET",
        },
        rtb_profile: {
          url: "https://api.superrich.tech/rtb/profile/{slug}",
          description: "Comprehensive profile, stock assets, career timeline & biographical data",
          method: "GET",
        },
        v1_rankings: {
          url: "https://api.superrich.tech/v1/rankings",
          description: "Structured rankings with query filters (limit, country, sort)",
          method: "GET",
        },
        v1_people: {
          url: "https://api.superrich.tech/v1/people",
          description: "Curated profiles for top tech titans with court archives & verified emails",
          method: "GET",
        },
        v1_person: {
          url: "https://api.superrich.tech/v1/people/{slug}",
          description: "Single curated billionaire dossier",
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
