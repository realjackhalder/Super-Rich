import { NextResponse } from "next/server";
import { db } from "@/db";
import { people as peopleTable } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import { syncBillionairesToSupabase } from "@/lib/sync";
import { getBillionairesFromDB } from "@/lib/db-people";



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
