import { NextResponse } from "next/server";
import { getRTBFullProfile, normalizeRTBUri } from "@/lib/rtb";

export async function GET(
  request: Request,
  { params }: { params: { uri: string } }
) {
  const uri = normalizeRTBUri(params.uri);
  const data = await getRTBFullProfile(uri);

  if (!data) {
    return NextResponse.json(
      { status: "error", message: `Profile '${uri}' not found in Real-Time Billionaires index` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      status: "success",
      source: "Real-Time Billionaires API (komed3/rtb-api)",
      data,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    }
  );
}
