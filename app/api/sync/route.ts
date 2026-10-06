import { NextResponse } from "next/server";
import { db } from "@/db";
import { people as peopleTable } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import { syncBillionairesToSupabase } from "@/lib/sync";
import { getBillionairesFromDB } from "@/lib/db-people";

const FORBES_HERO_PHOTOS: Record<string, string> = {
  "elon-musk": "https://imageio.forbes.com/specials-images/imageserve/62d700cd6094d2c180f269b9/0x0.jpg?format=jpg&crop=959,959,x0,y0,safe&height=416&width=416&fit=bounds",
  "jeff-bezos": "https://imageio.forbes.com/specials-images/imageserve/67531eb2b5f7c9e191f632d7/0x0.jpg?format=jpg&crop=711,713,x316,y125,safe&height=416&width=416&fit=bounds",
  "mark-zuckerberg": "https://imageio.forbes.com/specials-images/imageserve/5c76b7d331358e35dd2773a9/0x0.jpg?format=jpg&crop=4401,4401,x0,y0,safe&height=416&width=416&fit=bounds",
  "jensen-huang": "https://imageio.forbes.com/specials-images/imageserve/68750a2d250de42ce7c5301b/0x0.jpg?format=jpg&crop=1800,1799,x832,y152,safe&height=416&width=416&fit=bounds",
  "larry-ellison": "https://imageio.forbes.com/specials-images/imageserve/5e8b62cfc095010007bffea0/0x0.jpg?format=jpg&crop=4529,4532,x0,y652,safe&height=416&width=416&fit=bounds",
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trigger = searchParams.get("trigger");
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  if (trigger === "fix-photos") {
    try {
      for (const [slug, url] of Object.entries(FORBES_HERO_PHOTOS)) {
        await db.update(peopleTable).set({ photoUrl: url }).where(eq(peopleTable.slug, slug));
      }
      await db.update(peopleTable).set({ photoUrl: null }).where(like(peopleTable.photoUrl, "%unsplash%"));
      return NextResponse.json({
        status: "success",
        message: "Forbes CDN photos updated & unsplash completely cleared",
      });
    } catch (err: any) {
      return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
    }
  }

  if (trigger === "now") {
    try {
      const result = await syncBillionairesToSupabase(limit);
      return NextResponse.json({
        status: "success",
        message: "Live synchronization completed successfully",
        data: result,
      });
    } catch (err: any) {
      return NextResponse.json(
        { status: "error", message: err.message },
        { status: 500 }
      );
    }
  }

  // Return status of current database records
  const people = await getBillionairesFromDB(limit);
  return NextResponse.json({
    status: "success",
    countInDatabase: people.length,
    latestUpdated: people[0]?.updatedAt,
    sampleTop3: people.slice(0, 3).map((p) => ({
      rank: p.rank,
      name: p.name,
      netWorthBillion: p.netWorth,
      bloombergNetWorth: p.bloombergNetWorth,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 120;
    const result = await syncBillionairesToSupabase(limit);
    return NextResponse.json({
      status: "success",
      message: "Sync completed",
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}
