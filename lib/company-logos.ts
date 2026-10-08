// Real-time verified CDN logo mappings and dynamic domain resolver for companies
// Prioritizes official SVGs and Google high-res 128px authenticated CDN icons with multi-tier fallback.

export const VERIFIED_COMPANY_LOGOS: Record<string, string> = {
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  nvidia: "https://cdn.simpleicons.org/nvidia",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  alphabet: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  meta: "https://cdn.simpleicons.org/meta",
  tesla: "https://cdn.simpleicons.org/tesla",
  visa: "https://cdn.simpleicons.org/visa",
  spacex: "https://cdn.simpleicons.org/spacex",
  bytedance: "https://cdn.simpleicons.org/bytedance",
  stripe: "https://cdn.simpleicons.org/stripe",
  netflix: "https://cdn.simpleicons.org/netflix",
  spotify: "https://cdn.simpleicons.org/spotify",
  shopify: "https://cdn.simpleicons.org/shopify",
  intel: "https://cdn.simpleicons.org/intel",
  amd: "https://cdn.simpleicons.org/amd",
  uber: "https://cdn.simpleicons.org/uber",
  airbnb: "https://cdn.simpleicons.org/airbnb",
  asml: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://asml.com&size=128",
  openai: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://openai.com&size=128",
};

export const COMPANY_DOMAINS: Record<string, string> = {
  apple: "apple.com",
  nvidia: "nvidia.com",
  microsoft: "microsoft.com",
  alphabet: "google.com",
  amazon: "amazon.com",
  "saudi-aramco": "aramco.com",
  meta: "meta.com",
  "berkshire-hathaway": "berkshirehathaway.com",
  tsmc: "tsmc.com",
  tesla: "tesla.com",
  broadcom: "broadcom.com",
  "eli-lilly": "lilly.com",
  walmart: "walmart.com",
  "jpmorgan-chase": "jpmorganchase.com",
  tencent: "tencent.com",
  oracle: "oracle.com",
  visa: "visa.com",
  exxonmobil: "exxonmobil.com",
  mastercard: "mastercard.com",
  costco: "costco.com",
  "novo-nordisk": "novonordisk.com",
  lvmh: "lvmh.com",
  "procter-gamble": "pg.com",
  asml: "asml.com",
  "johnson-johnson": "jnj.com",
  "home-depot": "homedepot.com",
  "bank-of-america": "bankofamerica.com",
  abbvie: "abbvie.com",
  netflix: "netflix.com",
  chevron: "chevron.com",
  salesforce: "salesforce.com",
  "coca-cola": "coca-cola.com",
  amd: "amd.com",
  qualcomm: "qualcomm.com",
  hermes: "hermes.com",
  samsung: "samsung.com",
  pepsico: "pepsico.com",
  cisco: "cisco.com",
  adobe: "adobe.com",
  linde: "linde.com",
  sap: "sap.com",
  "thermo-fisher": "thermofisher.com",
  accenture: "accenture.com",
  "wells-fargo": "wellsfargo.com",
  mcdonalds: "mcdonalds.com",
  reliance: "ril.com",
  abbott: "abbott.com",
  ibm: "ibm.com",
  spacex: "spacex.com",
  openai: "openai.com",
  bytedance: "bytedance.com",
  stripe: "stripe.com",
  servicenow: "servicenow.com",
  "walt-disney": "thewaltdisneycompany.com",
  "morgan-stanley": "morganstanley.com",
  caterpillar: "caterpillar.com",
  "general-electric": "ge.com",
  intuit: "intuit.com",
  verizon: "verizon.com",
  "goldman-sachs": "goldmansachs.com",
  "intuitive-surgical": "intuitive.com",
  "applied-materials": "appliedmaterials.com",
  pfizer: "pfizer.com",
  intel: "intel.com",
  "texas-instruments": "ti.com",
  amgen: "amgen.com",
  "union-pacific": "up.com",
  uber: "uber.com",
  "philip-morris": "pmi.com",
  honeywell: "honeywell.com",
  danaher: "danaher.com",
  "american-express": "americanexpress.com",
  rtx: "rtx.com",
  inditex: "inditex.com",
  comcast: "comcast.com",
  att: "att.com",
  medtronic: "medtronic.com",
  "lam-research": "lamresearch.com",
  "booking-holdings": "bookingholdings.com",
  dell: "dell.com",
  stryker: "stryker.com",
  blackrock: "blackrock.com",
  "palo-alto-networks": "paloaltonetworks.com",
  "boston-scientific": "bostonscientific.com",
  eaton: "eaton.com",
  micron: "micron.com",
  kla: "kla.com",
  "lockheed-martin": "lockheedmartin.com",
  synopsys: "synopsys.com",
  "analog-devices": "analog.com",
  cadence: "cadence.com",
  target: "target.com",
  boeing: "boeing.com",
  tjx: "tjx.com",
  lowes: "lowes.com",
  sony: "sony.com",
  dior: "dior.com",
  airbnb: "airbnb.com",
  "schneider-electric": "se.com",
  siemens: "siemens.com",
  shopify: "shopify.com",
  mercadolibre: "mercadolibre.com",
  ferrari: "ferrari.com",
  spotify: "spotify.com",
};

/**
 * Returns a high-resolution CDN logo URL for a given company slug.
 * Uses verified SVG if known, otherwise official Google Favicon V2 128px high-res icon.
 */
export function getCompanyLogoUrl(slug: string, _ticker?: string): string {
  if (VERIFIED_COMPANY_LOGOS[slug]) {
    return VERIFIED_COMPANY_LOGOS[slug];
  }
  const domain = COMPANY_DOMAINS[slug];
  if (domain) {
    return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
  }
  return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${slug}.com&size=128`;
}

/**
 * Returns a secondary fallback icon URL using DuckDuckGo CDN
 */
export function getCompanyFallbackLogoUrl(slug: string): string {
  const domain = COMPANY_DOMAINS[slug] || `${slug}.com`;
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}
