/**
 * Helper to resolve dynamic URLs across SuperRich subdomains:
 * - superrich.tech (Main site)
 * - docs.superrich.tech (Documentation)
 * - api.superrich.tech (Public read-only API)
 * - admin.superrich.tech (Admin management portal)
 */

export type SubdomainType = "main" | "docs" | "api" | "admin";

export function getDomainUrl(
  subdomain: SubdomainType = "main",
  pathOrTheme?: string,
  maybeTheme?: string
): string {
  let path = "/";
  let theme = maybeTheme;

  if (pathOrTheme) {
    if (pathOrTheme === "dark" || pathOrTheme === "light" || pathOrTheme === "system") {
      theme = pathOrTheme;
    } else {
      path = pathOrTheme.startsWith("/") ? pathOrTheme : `/${pathOrTheme}`;
    }
  }

  let base = "";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;

    // Local development support (e.g. docs.localhost:3000 or localhost:3000)
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      if (subdomain === "main") {
        base = `${protocol}//localhost${port}`;
      } else {
        base = `${protocol}//${subdomain}.localhost${port}`;
      }
    }
  }

  // Production URLs
  if (!base) {
    if (subdomain === "main") {
      base = "https://www.superrich.tech";
    } else {
      base = `https://${subdomain}.superrich.tech`;
    }
  }

  let url = `${base}${path}`;

  // Attach theme parameter to preserve theme across subdomains during navigation
  const domTheme =
    typeof document !== "undefined"
      ? (document.documentElement.classList.contains("dark") ? "dark" : "light")
      : undefined;

  const effectiveTheme =
    theme ||
    domTheme ||
    (typeof window !== "undefined"
      ? localStorage.getItem("theme") || undefined
      : undefined);

  if (
    effectiveTheme &&
    (effectiveTheme === "dark" || effectiveTheme === "light" || effectiveTheme === "system")
  ) {
    const sep = url.includes("?") ? "&" : "?";
    url = `${url}${sep}theme=${encodeURIComponent(effectiveTheme)}`;
  }

  return url;
}
