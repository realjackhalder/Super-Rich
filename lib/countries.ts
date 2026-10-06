/**
 * Country code to full name mapping
 * Used to normalize 2-letter ISO country codes into specific country names
 * and prevent generic "Global" citizenship labels.
 */

export const COUNTRY_MAP: Record<string, string> = {
  us: "United States",
  usa: "United States",
  cn: "China",
  fr: "France",
  in: "India",
  de: "Germany",
  jp: "Japan",
  gb: "United Kingdom",
  uk: "United Kingdom",
  ca: "Canada",
  mx: "Mexico",
  br: "Brazil",
  es: "Spain",
  it: "Italy",
  ch: "Switzerland",
  ru: "Russia",
  au: "Australia",
  sg: "Singapore",
  kr: "South Korea",
  id: "Indonesia",
  tw: "Taiwan",
  hk: "Hong Kong",
  se: "Sweden",
  nl: "Netherlands",
  il: "Israel",
  za: "South Africa",
  sa: "Saudi Arabia",
  ae: "United Arab Emirates",
  at: "Austria",
  cz: "Czech Republic",
  cl: "Chile",
  th: "Thailand",
  my: "Malaysia",
  ph: "Philippines",
  eg: "Egypt",
  ng: "Nigeria",
  no: "Norway",
  dk: "Denmark",
  ie: "Ireland",
  be: "Belgium",
  nz: "New Zealand",
  tr: "Turkey",
  co: "Colombia",
  ar: "Argentina",
  pl: "Poland",
  cy: "Cyprus",
  is: "Iceland",
  ee: "Estonia",
  vn: "Vietnam",
  mc: "Monaco",
  pt: "Portugal",
  gr: "Greece",
  fi: "Finland",
  ua: "Ukraine",
  kz: "Kazakhstan",
  qa: "Qatar",
  kw: "Kuwait",
  om: "Oman",
  bh: "Bahrain",
  lb: "Lebanon",
  jo: "Jordan",
  ve: "Venezuela",
  ge: "Georgia",
  ro: "Romania",
  pe: "Peru",
  hu: "Hungary",
  bz: "Belize",
  dz: "Algeria",
  gg: "Guernsey",
  sk: "Slovakia",
  bg: "Bulgaria",
  pk: "Pakistan",
  zw: "Zimbabwe",
  hr: "Croatia",
  tz: "Tanzania",
  np: "Nepal",
  al: "Albania",
  ma: "Morocco",
  af: "Afghanistan",
  li: "Liechtenstein",
  am: "Armenia",
  lu: "Luxembourg",
  uy: "Uruguay",
  bb: "Barbados",
  kn: "Saint Kitts and Nevis",
  bm: "Bermuda",
  ky: "Cayman Islands",
  bs: "Bahamas",
  pa: "Panama",
};

function toTitleCase(str: string): string {
  return str.replace(/\b\w+/g, (txt) => {
    const l = txt.toLowerCase();
    if (l === "and" || l === "of") return l;
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

/**
 * Format any code or name into a clean, human-readable country name
 */
export function formatCountryName(codeOrName?: string | null): string {
  if (!codeOrName) return "";
  const clean = codeOrName.trim();
  const lower = clean.toLowerCase();
  if (lower === "global" || lower === "unknown") return "";

  // Handle multi-citizenship with slash (e.g. "us / fr" or "United States / France")
  if (clean.includes("/")) {
    return clean
      .split("/")
      .map((part) => {
        const p = part.trim();
        const pLower = p.toLowerCase();
        if (pLower === "global" || pLower === "unknown") return "";
        return COUNTRY_MAP[pLower] || toTitleCase(p);
      })
      .filter(Boolean)
      .join(" / ");
  }

  if (COUNTRY_MAP[lower]) return COUNTRY_MAP[lower];
  return toTitleCase(clean);
}
