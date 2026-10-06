import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Server-side in-memory theme store shared across all local subdomains (localhost, docs.localhost, admin.localhost)
let sharedGlobalTheme = "system";

export async function GET(request: NextRequest) {
  const cookieTheme = request.cookies.get("superrich-theme")?.value;
  const theme = (cookieTheme && cookieTheme !== "undefined") ? cookieTheme : sharedGlobalTheme;

  return NextResponse.json(
    { theme },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    if (theme === "dark" || theme === "light" || theme === "system") {
      sharedGlobalTheme = theme;

      const response = NextResponse.json(
        { success: true, theme },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        }
      );

      // Set cookie on the current host
      response.cookies.set("superrich-theme", theme, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });

      return response;
    }
  } catch {}

  return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
