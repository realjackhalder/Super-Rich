import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limiting store for api.superrich.tech
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit: number, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs, limit };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime, limit };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime, limit };
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Extract host from x-forwarded-host or host header
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const hostname = rawHost.split(":")[0].toLowerCase();

  // Determine subdomain
  // Supports:
  // - status.superrich.tech, docs.superrich.tech, admin.superrich.tech, api.superrich.tech
  // - status.localhost, docs.localhost, admin.localhost, api.localhost
  // - Or query override for testing: ?__subdomain=docs
  let subdomain: string | null = null;

  const testOverride = url.searchParams.get("__subdomain");
  if (testOverride) {
    subdomain = testOverride.toLowerCase();
  } else if (hostname.endsWith(".superrich.tech")) {
    subdomain = hostname.replace(".superrich.tech", "");
  } else if (hostname.endsWith(".localhost")) {
    subdomain = hostname.replace(".localhost", "");
  } else if (rawHost.includes("status.")) {
    subdomain = "status";
  } else if (rawHost.includes("docs.")) {
    subdomain = "docs";
  } else if (rawHost.includes("admin.")) {
    subdomain = "admin";
  } else if (rawHost.includes("api.")) {
    subdomain = "api";
  }

  // Handle CORS preflight for API requests
  if (request.method === "OPTIONS" && (subdomain === "api" || pathname.startsWith("/api"))) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key, X-Requested-With",
      },
    });
  }

  // 1. Subdomain: api.superrich.tech (Public read-only API with rate limiting)
  if (subdomain === "api") {
    // Enforce Read-Only API (only GET & OPTIONS allowed)
    if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") {
      return NextResponse.json(
        {
          status: "error",
          code: 405,
          message: "Method Not Allowed. SuperRich Public API is strictly read-only. Data modifications are not permitted.",
        },
        {
          status: 405,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Allow": "GET, HEAD, OPTIONS",
          },
        }
      );
    }

    // Rate Limiting (IP or API Key)
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      url.searchParams.get("api_key");

    const clientIp =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "127.0.0.1";

    const rateKey = apiKey ? `key:${apiKey}` : `ip:${clientIp}`;
    const limit = apiKey ? 500 : 60; // 500 req/min for keys, 60 req/min for public IP

    const { allowed, remaining, resetTime } = checkRateLimit(rateKey, limit, 60000);
    const resetSeconds = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));

    if (!allowed) {
      return NextResponse.json(
        {
          status: "error",
          code: 429,
          message: "Too Many Requests. Rate limit exceeded for public tier. Pass an X-API-Key header to increase limits.",
          limit,
          retry_after_seconds: resetSeconds,
          docs: "https://docs.superrich.tech",
        },
        {
          status: 429,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetSeconds.toString(),
            "Retry-After": resetSeconds.toString(),
          },
        }
      );
    }

    let rewritePath = pathname;
    if (pathname === "/") {
      rewritePath = "/api";
    } else if (!pathname.startsWith("/api")) {
      rewritePath = `/api${pathname}`;
    }

    url.pathname = rewritePath;
    const response = NextResponse.rewrite(url);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", resetSeconds.toString());
    return response;
  }

  // 2. Subdomain: docs.superrich.tech
  if (subdomain === "docs") {
    // If it's an API request originating from docs, let it pass through
    if (!pathname.startsWith("/api")) {
      let rewritePath = pathname;
      if (pathname === "/") {
        rewritePath = "/docs";
      } else if (!pathname.startsWith("/docs")) {
        rewritePath = `/docs${pathname}`;
      }
      url.pathname = rewritePath;
      return NextResponse.rewrite(url);
    }
  }

  // 3. Subdomain: status.superrich.tech
  if (subdomain === "status") {
    if (!pathname.startsWith("/api")) {
      let rewritePath = pathname;
      if (pathname === "/") {
        rewritePath = "/status";
      } else if (!pathname.startsWith("/status")) {
        rewritePath = `/status${pathname}`;
      }
      url.pathname = rewritePath;
      return NextResponse.rewrite(url);
    }
  }

  // 4. Subdomain: admin.superrich.tech
  if (subdomain === "admin") {
    if (!pathname.startsWith("/api")) {
      let rewritePath = pathname;
      if (pathname === "/") {
        rewritePath = "/admin";
      } else if (!pathname.startsWith("/admin")) {
        rewritePath = `/admin${pathname}`;
      }
      url.pathname = rewritePath;
      return NextResponse.rewrite(url);
    }
  }

  // Default Apex Domain routing (superrich.tech / localhost:3000)
  const response = NextResponse.next();
  if (pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
