import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, turnstileToken } = body;
    const token = turnstileToken || body["cf-turnstile-response"];

    // 1. Validate Cloudflare Turnstile bot verification
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "127.0.0.1";

    const turnstileResult = await verifyTurnstile(token, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Security verification failed. Please complete the Cloudflare Turnstile challenge.",
          errorCodes: turnstileResult.errorCodes,
        },
        { status: 403 }
      );
    }

    // 2. Validate Admin Credentials
    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json(
        { status: "error", message: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createAdminSession(username);

    return NextResponse.json({ status: "success", message: "Authenticated" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}
