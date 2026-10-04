import { NextResponse } from "next/server";
import { getGrokipediaPage, normalizeGrokipediaSlug } from "@/lib/grokipedia";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json(
      { status: "error", message: "Missing slug parameter" },
      { status: 400 }
    );
  }

  const normalized = normalizeGrokipediaSlug(slug);
  const data = await getGrokipediaPage(normalized);

  if (!data) {
    return NextResponse.json(
      {
        status: "error",
        message: `Article '${normalized}' not found on Grokipedia or API currently unavailable`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      status: "success",
      source: "Grokipedia (xAI)",
      data,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    }
  );
}
