/**
 * Cross-Subdomain & Cross-Tab Theme Synchronization Helper
 * Ensures light and dark themes stay 100% in sync across:
 * - superrich.tech (apex domain)
 * - docs.superrich.tech (docs subdomain)
 * - admin.superrich.tech (admin subdomain)
 * - api.superrich.tech
 * - Localhost environments (localhost:3000, docs.localhost:3000, admin.localhost:3000)
 * - All open tabs and browser windows
 */

export const THEME_COOKIE_NAME = "superrich-theme";
export const THEME_STORAGE_KEY = "theme";
export const THEME_BROADCAST_CHANNEL = "superrich-theme-channel";
export const LANG_COOKIE_NAME = "superrich-lang";

/**
 * Returns cookie domain attribute to enable sharing across all subdomains
 */
export function getCrossSubdomainCookieDomain(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.endsWith("superrich.tech")) {
    return "; domain=.superrich.tech";
  }
  return "";
}

/**
 * Read the current theme from document.cookie
 */
export function getThemeFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]+)`)
  );
  if (!match) return null;
  const val = decodeURIComponent(match[1]);
  if (val === "dark" || val === "light" || val === "system") {
    return val;
  }
  return null;
}

/**
 * Save theme to cross-subdomain cookie, host cookie, localStorage, and broadcast across tabs
 */
export function saveSharedTheme(theme: string) {
  if (typeof document === "undefined") return;
  if (!theme || (theme !== "dark" && theme !== "light" && theme !== "system")) return;

  const val = encodeURIComponent(theme);
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  const domainPart = getCrossSubdomainCookieDomain();

  // 1. Set root domain cookie for cross-subdomain sharing (*.superrich.tech)
  if (domainPart) {
    document.cookie = `${THEME_COOKIE_NAME}=${val}; path=/; max-age=${maxAge}; SameSite=Lax${domainPart}`;
  }

  // 2. Set host-level cookie as fallback / for localhost
  document.cookie = `${THEME_COOKIE_NAME}=${val}; path=/; max-age=${maxAge}; SameSite=Lax`;

  // 3. Keep localStorage in sync for next-themes
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}

  // 4. Broadcast across all open tabs on the same origin
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(THEME_BROADCAST_CHANNEL);
      bc.postMessage({ theme });
      bc.close();
    }
  } catch {}

  // 5. Notify server /api/theme so all local subdomains (localhost, docs.localhost) stay synchronized
  try {
    fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    }).catch(() => {});
  } catch {}
}
