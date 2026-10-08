/**
 * Verified Social Media Directory for Global Billionaires & Tech Titans
 * Official public profiles on X, Instagram, Threads, LinkedIn, YouTube, Facebook, Telegram, etc.
 */

export interface SocialProfile {
  platform: "x" | "instagram" | "threads" | "linkedin" | "youtube" | "facebook" | "telegram" | "website";
  handle: string;
  url: string;
  verified: boolean;
  followerCount?: string;
  note?: string;
}

export const VERIFIED_BILLIONAIRE_SOCIALS: Record<string, SocialProfile[]> = {
  "elon-musk": [
    {
      platform: "x",
      handle: "@elonmusk",
      url: "https://x.com/elonmusk",
      verified: true,
      followerCount: "205M+",
      note: "Owner & CTO of X, CEO of Tesla, SpaceX & xAI",
    },
    {
      platform: "website",
      handle: "x.com",
      url: "https://x.com",
      verified: true,
      note: "Executive communications & official launches",
    },
  ],
  "mark-zuckerberg": [
    {
      platform: "threads",
      handle: "@zuck",
      url: "https://www.threads.net/@zuck",
      verified: true,
      followerCount: "4.5M+",
      note: "Founder, Chairman & CEO of Meta",
    },
    {
      platform: "instagram",
      handle: "@zuck",
      url: "https://www.instagram.com/zuck",
      verified: true,
      followerCount: "14.2M+",
    },
    {
      platform: "facebook",
      handle: "zuck",
      url: "https://www.facebook.com/zuck",
      verified: true,
      followerCount: "119M+",
    },
  ],
  "jeff-bezos": [
    {
      platform: "x",
      handle: "@JeffBezos",
      url: "https://x.com/JeffBezos",
      verified: true,
      followerCount: "6.5M+",
      note: "Founder & Executive Chair of Amazon, Founder of Blue Origin",
    },
    {
      platform: "instagram",
      handle: "@jeffbezos",
      url: "https://www.instagram.com/jeffbezos",
      verified: true,
      followerCount: "4.4M+",
    },
    {
      platform: "threads",
      handle: "@jeffbezos",
      url: "https://www.threads.net/@jeffbezos",
      verified: true,
    },
  ],
  "bill-gates": [
    {
      platform: "x",
      handle: "@BillGates",
      url: "https://x.com/BillGates",
      verified: true,
      followerCount: "64.2M+",
      note: "Co-chair of the Gates Foundation, Founder of Microsoft",
    },
    {
      platform: "linkedin",
      handle: "williamhgates",
      url: "https://www.linkedin.com/in/williamhgates",
      verified: true,
      followerCount: "36.5M+",
    },
    {
      platform: "youtube",
      handle: "@BillGates",
      url: "https://www.youtube.com/@BillGates",
      verified: true,
      followerCount: "3.3M+",
    },
    {
      platform: "instagram",
      handle: "@thisisbillgates",
      url: "https://www.instagram.com/thisisbillgates",
      verified: true,
      followerCount: "8.6M+",
    },
    {
      platform: "website",
      handle: "GatesNotes.com",
      url: "https://www.gatesnotes.com",
      verified: true,
      note: "Official personal blog & book reviews",
    },
  ],
  "sam-altman": [
    {
      platform: "x",
      handle: "@sama",
      url: "https://x.com/sama",
      verified: true,
      followerCount: "3.2M+",
      note: "Co-Founder & CEO of OpenAI",
    },
    {
      platform: "website",
      handle: "blog.samaltman.com",
      url: "https://blog.samaltman.com",
      verified: true,
      note: "Personal essays & technology thesis",
    },
  ],
  "tim-cook": [
    {
      platform: "x",
      handle: "@tim_cook",
      url: "https://x.com/tim_cook",
      verified: true,
      followerCount: "14.6M+",
      note: "CEO of Apple Inc.",
    },
  ],
  "satya-nadella": [
    {
      platform: "x",
      handle: "@satyanadella",
      url: "https://x.com/satyanadella",
      verified: true,
      followerCount: "3.1M+",
      note: "Chairman and CEO of Microsoft",
    },
    {
      platform: "linkedin",
      handle: "satyanadella",
      url: "https://www.linkedin.com/in/satyanadella",
      verified: true,
      followerCount: "10.4M+",
    },
  ],
  "sundar-pichai": [
    {
      platform: "x",
      handle: "@sundarpichai",
      url: "https://x.com/sundarpichai",
      verified: true,
      followerCount: "5.4M+",
      note: "CEO of Alphabet and Google",
    },
    {
      platform: "instagram",
      handle: "@sundarpichai",
      url: "https://www.instagram.com/sundarpichai",
      verified: true,
      followerCount: "2.7M+",
    },
  ],
  "jensen-huang": [
    {
      platform: "linkedin",
      handle: "NVIDIA",
      url: "https://www.linkedin.com/company/nvidia",
      verified: true,
      note: "Founder and CEO of NVIDIA",
    },
    {
      platform: "website",
      handle: "nvidia.com/ceo",
      url: "https://www.nvidia.com",
      verified: true,
      note: "Official Keynotes & Computex Addresses",
    },
  ],
  "larry-ellison": [
    {
      platform: "x",
      handle: "@larryellison",
      url: "https://x.com/larryellison",
      verified: true,
      followerCount: "125K+",
      note: "Co-Founder, Executive Chairman & CTO of Oracle",
    },
  ],
  "michael-bloomberg": [
    {
      platform: "x",
      handle: "@MikeBloomberg",
      url: "https://x.com/MikeBloomberg",
      verified: true,
      followerCount: "2.8M+",
      note: "Founder of Bloomberg LP & Bloomberg Philanthropies",
    },
    {
      platform: "instagram",
      handle: "@mikebloomberg",
      url: "https://www.instagram.com/mikebloomberg",
      verified: true,
      followerCount: "680K+",
    },
    {
      platform: "linkedin",
      handle: "mikebloomberg",
      url: "https://www.linkedin.com/in/mikebloomberg",
      verified: true,
      followerCount: "1.2M+",
    },
  ],
  "richard-branson": [
    {
      platform: "x",
      handle: "@richardbranson",
      url: "https://x.com/richardbranson",
      verified: true,
      followerCount: "12.4M+",
      note: "Founder of Virgin Group",
    },
    {
      platform: "linkedin",
      handle: "rbranson",
      url: "https://www.linkedin.com/in/rbranson",
      verified: true,
      followerCount: "19.5M+",
    },
    {
      platform: "instagram",
      handle: "@richardbranson",
      url: "https://www.instagram.com/richardbranson",
      verified: true,
      followerCount: "4.9M+",
    },
  ],
  "brian-chesky": [
    {
      platform: "x",
      handle: "@bchesky",
      url: "https://x.com/bchesky",
      verified: true,
      followerCount: "530K+",
      note: "Co-Founder & CEO of Airbnb",
    },
    {
      platform: "instagram",
      handle: "@bchesky",
      url: "https://www.instagram.com/bchesky",
      verified: true,
      followerCount: "140K+",
    },
    {
      platform: "threads",
      handle: "@bchesky",
      url: "https://www.threads.net/@bchesky",
      verified: true,
    },
  ],
  "jack-dorsey": [
    {
      platform: "x",
      handle: "@jack",
      url: "https://x.com/jack",
      verified: true,
      followerCount: "6.4M+",
      note: "Co-Founder of Twitter & Block (Square)",
    },
    {
      platform: "website",
      handle: "nostr:npub1sg6...",
      url: "https://primal.net/p/npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m",
      verified: true,
      note: "Decentralized social presence on Nostr",
    },
  ],
  "marc-benioff": [
    {
      platform: "x",
      handle: "@Benioff",
      url: "https://x.com/Benioff",
      verified: true,
      followerCount: "1.1M+",
      note: "Chair & CEO of Salesforce",
    },
    {
      platform: "linkedin",
      handle: "marcbenioff",
      url: "https://www.linkedin.com/in/marcbenioff",
      verified: true,
      followerCount: "1.6M+",
    },
  ],
  "mark-cuban": [
    {
      platform: "x",
      handle: "@mcuban",
      url: "https://x.com/mcuban",
      verified: true,
      followerCount: "8.8M+",
      note: "Co-Founder of Cost Plus Drugs, Investor & Shark Tank Star",
    },
    {
      platform: "instagram",
      handle: "@mcuban",
      url: "https://www.instagram.com/mcuban",
      verified: true,
      followerCount: "2.1M+",
    },
  ],
  "pavel-durov": [
    {
      platform: "telegram",
      handle: "@durov",
      url: "https://t.me/durov",
      verified: true,
      followerCount: "2.5M+",
      note: "Founder & CEO of Telegram Messenger",
    },
    {
      platform: "x",
      handle: "@durov",
      url: "https://x.com/durov",
      verified: true,
      followerCount: "1.4M+",
    },
  ],
  "changpeng-zhao": [
    {
      platform: "x",
      handle: "@cz_binance",
      url: "https://x.com/cz_binance",
      verified: true,
      followerCount: "8.9M+",
      note: "Founder of Binance & Giggle Academy",
    },
  ],
  "vitalik-buterin": [
    {
      platform: "x",
      handle: "@VitalikButerin",
      url: "https://x.com/VitalikButerin",
      verified: true,
      followerCount: "5.4M+",
      note: "Co-Founder of Ethereum",
    },
    {
      platform: "website",
      handle: "vitalik.eth.limo",
      url: "https://vitalik.eth.limo",
      verified: true,
      note: "Official crypto & philosophy blog",
    },
  ],
  "gautam-adani": [
    {
      platform: "x",
      handle: "@gautam_adani",
      url: "https://x.com/gautam_adani",
      verified: true,
      followerCount: "1.5M+",
      note: "Founder & Chairman of Adani Group",
    },
    {
      platform: "linkedin",
      handle: "gautam-adani-official",
      url: "https://www.linkedin.com/in/gautam-adani-official",
      verified: true,
    },
  ],
  "steve-ballmer": [
    {
      platform: "x",
      handle: "@stevebmicrosoft",
      url: "https://x.com/stevebmicrosoft",
      verified: true,
      note: "Owner of LA Clippers, Former CEO of Microsoft",
    },
    {
      platform: "website",
      handle: "usafacts.org",
      url: "https://usafacts.org",
      verified: true,
      note: "Founder of USAFacts non-partisan government metrics",
    },
  ],
  "michael-dell": [
    {
      platform: "x",
      handle: "@MichaelDell",
      url: "https://x.com/MichaelDell",
      verified: true,
      followerCount: "760K+",
      note: "Founder, Chairman & CEO of Dell Technologies",
    },
    {
      platform: "linkedin",
      handle: "michaeldell",
      url: "https://www.linkedin.com/in/michaeldell",
      verified: true,
      followerCount: "1.9M+",
    },
  ],
  "daniel-ek": [
    {
      platform: "x",
      handle: "@eldsjal",
      url: "https://x.com/eldsjal",
      verified: true,
      followerCount: "350K+",
      note: "Founder & CEO of Spotify",
    },
  ],
  "tobi-lutke": [
    {
      platform: "x",
      handle: "@tobi",
      url: "https://x.com/tobi",
      verified: true,
      followerCount: "420K+",
      note: "Founder & CEO of Shopify",
    },
  ],
  "patrick-collison": [
    {
      platform: "x",
      handle: "@patrickc",
      url: "https://x.com/patrickc",
      verified: true,
      followerCount: "250K+",
      note: "Co-Founder & CEO of Stripe",
    },
    {
      platform: "website",
      handle: "patrickcollison.com",
      url: "https://patrickcollison.com",
      verified: true,
    },
  ],
  "john-collison": [
    {
      platform: "x",
      handle: "@collision",
      url: "https://x.com/collision",
      verified: true,
      followerCount: "185K+",
      note: "Co-Founder & President of Stripe",
    },
  ],
  "palmer-luckey": [
    {
      platform: "x",
      handle: "@PalmerLuckey",
      url: "https://x.com/PalmerLuckey",
      verified: true,
      followerCount: "310K+",
      note: "Founder of Anduril Industries & Oculus VR",
    },
  ],
  "warren-buffett": [
    {
      platform: "website",
      handle: "Berkshire Letters",
      url: "https://www.berkshirehathaway.com/letters/letters.html",
      verified: true,
      note: "Annual Chairman's Letters to Berkshire Shareholders",
    },
  ],
  "bernard-arnault": [
    {
      platform: "website",
      handle: "lvmh.com",
      url: "https://www.lvmh.com",
      verified: true,
      note: "Official LVMH Executive Announcements",
    },
  ],
};

/**
 * Returns verified social media accounts for a billionaire slug
 */
export function getBillionaireSocials(slug: string): SocialProfile[] {
  const norm = slug.toLowerCase().trim();
  return VERIFIED_BILLIONAIRE_SOCIALS[norm] || [];
}
