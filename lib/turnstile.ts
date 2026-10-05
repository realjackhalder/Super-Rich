/**
 * Canonical Server-side verification for Cloudflare Turnstile tokens.
 * Spec: https://developers.cloudflare.com/turnstile/spin/prompt.md
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export interface VerifyTurnstileOptions {
  action?: string;
  expectedHostnames?: string[];
}

export interface VerifyTurnstileResult {
  success: boolean;
  errorCodes?: string[];
  action?: string;
  hostname?: string;
  challengeTs?: string;
}

export async function verifyTurnstile(
  token?: string | null,
  visitorIp?: string,
  options?: VerifyTurnstileOptions
): Promise<VerifyTurnstileResult> {
  // 1. Token validation constraints
  if (
    typeof token !== "string" ||
    token.trim().length === 0 ||
    token.length > 2048
  ) {
    return {
      success: false,
      errorCodes: ["missing-input-response"],
    };
  }

  // 2. Secret key resolution (standard TURNSTILE_SECRET with fallbacks)
  const secretKey =
    process.env.TURNSTILE_SECRET ||
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    "0x4AAAAAAFOpJrZvDpxppUZE2TTeNVpOwAA";

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (visitorIp && visitorIp !== "127.0.0.1" && visitorIp !== "::1") {
      formData.append("remoteip", visitorIp);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        signal: AbortSignal.timeout(10_000),
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

    if (!data.success) {
      return {
        success: false,
        errorCodes: data["error-codes"] || ["siteverify-failed"],
      };
    }

    // 3. Action validation (if expected action is specified)
    const expectedAction = options?.action || "login";
    if (data.action && expectedAction && data.action !== expectedAction) {
      console.warn(
        `[Turnstile] Action mismatch: expected '${expectedAction}', got '${data.action}'`
      );
      return {
        success: false,
        errorCodes: ["action-mismatch"],
        action: data.action,
        hostname: data.hostname,
      };
    }

    // 4. Hostname validation (if TURNSTILE_HOSTNAMES is configured)
    const configuredHostnames =
      options?.expectedHostnames ||
      (process.env.TURNSTILE_HOSTNAMES
        ? process.env.TURNSTILE_HOSTNAMES.split(",")
            .map((h) => h.trim().toLowerCase())
            .filter(Boolean)
        : []);

    if (configuredHostnames.length > 0 && data.hostname) {
      const allowedSet = new Set(configuredHostnames);
      const incomingHost = data.hostname.toLowerCase();
      if (!allowedSet.has(incomingHost)) {
        console.warn(
          `[Turnstile] Hostname '${data.hostname}' not in allowed hostnames:`,
          configuredHostnames
        );
        return {
          success: false,
          errorCodes: ["hostname-mismatch"],
          action: data.action,
          hostname: data.hostname,
        };
      }
    }

    return {
      success: true,
      action: data.action,
      hostname: data.hostname,
      challengeTs: data.challenge_ts,
    };
  } catch (err: any) {
    console.error("[Turnstile] Server verification request error:", err);
    return {
      success: false,
      errorCodes: [err?.name === "TimeoutError" ? "timeout" : err?.message || "verification-fetch-failed"],
    };
  }
}
