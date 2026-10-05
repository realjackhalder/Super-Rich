/**
 * Server-side verification for Cloudflare Turnstile tokens.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export async function verifyTurnstile(
  token?: string | null,
  visitorIp?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  // Use user-configured secret key or default to Cloudflare's always-pass testing secret
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    "1x0000000000000000000000000000000AA";

  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (visitorIp && visitorIp !== "127.0.0.1") {
      formData.append("remoteip", visitorIp);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    if (!res.ok) {
      console.error(
        `[Turnstile] Verification endpoint returned HTTP ${res.status}`
      );
      return { success: false, errorCodes: [`http-status-${res.status}`] };
    }

    const data = await res.json();
    return {
      success: !!data.success,
      errorCodes: data["error-codes"],
    };
  } catch (err: any) {
    console.error("[Turnstile] Server verification request error:", err);
    return {
      success: false,
      errorCodes: [err?.message || "verification-fetch-failed"],
    };
  }
}
