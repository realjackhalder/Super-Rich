import { NextResponse } from "next/server";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const person = INITIAL_50_BILLIONAIRES.find((p) => p.slug === params.slug);

  if (!person) {
    return NextResponse.json(
      { status: "error", message: "Billionaire profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      status: "success",
      license: "Free public access with attribution to superrich.tech",
      data: person,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
