import { NextResponse } from "next/server";
import { getRTBLatestList } from "@/lib/rtb";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getRTBLatestList();

  if (!data) {
    return NextResponse.json(
      { status: "error", message: "Failed to load real-time billionaires list" },
      { status: 502 }
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
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    }
  );
}
