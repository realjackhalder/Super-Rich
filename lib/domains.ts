/**
 * Helper to resolve dynamic URLs across SuperRich subdomains:
 * - superrich.tech (Main site)
 * - docs.superrich.tech (Documentation)
 * - status.superrich.tech (Uptime & telemetry)
 * - api.superrich.tech (Public read-only API)
 * - admin.superrich.tech (Admin management portal)
 */

export type SubdomainType = "main" | "docs" | "status" | "api" | "admin";

export function getDomainUrl(subdomain?: SubdomainType): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;

    // Local development support (e.g. docs.localhost:3000 or localhost:3000)
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      if (!subdomain || subdomain === "main") {
        return `${protocol}//localhost${port}`;
      }
      return `${protocol}//${subdomain}.localhost${port}`;
    }
  }

  // Production URLs
  if (!subdomain || subdomain === "main") {
    return "https://superrich.tech";
  }
  return `https://${subdomain}.superrich.tech`;
}
