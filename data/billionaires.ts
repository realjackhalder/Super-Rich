export interface BillionaireData {
  id: number;
  slug: string;
  name: string;
  rank: number;
  netWorth: number; // in billions
  netWorthChangeDay: number; // in billions
  netWorthChangePercent: number;
  currentCountry: string;
  currentCity: string;
  residenceAsOf: string;
  residenceSource: string;
  citizenship: string;
  photoUrl: string;
  bio: string;
  mainCompany: string;
  socials: {
    platform: "x" | "instagram" | "threads" | "linkedin" | "youtube" | "website" | "facebook" | "telegram";
    handle: string;
    url: string;
    verified: boolean;
  }[];
  stocks: {
    name: string;
    ticker?: string;
    isPublic: boolean;
    role: string;
    ownershipPercent: number;
    shares?: string;
    stakeValue: number; // in billions
    livePrice?: number;
    priceChange?: number;
  }[];
  timeline: {
    year: number;
    title: string;
    description: string;
    category: "childhood" | "education" | "career" | "ipo" | "legal" | "milestone";
    status: "verified" | "confirmed" | "reported";
    sources: { publisher: string; url: string }[];
    factCheckNote?: string;
  }[];
  legal: {
    caseName: string;
    court: string;
    caseType: "civil" | "regulatory" | "criminal";
    role: "defendant" | "plaintiff";
    status: "ongoing" | "settled" | "dismissed" | "won";
    filingDate: string;
    summary: string;
    officialDocUrl: string;
  }[];
  contactEmails: {
    department: "press" | "investor_relations" | "legal" | "general" | "foundation";
    email: string;
    source: string;
  }[];
  courtEmails: {
    caseName: string;
    exhibit: string;
    sender: string;
    recipients: string;
    date: string;
    subject: string;
    snippet: string;
    docUrl: string;
  }[];
}

export const INITIAL_50_BILLIONAIRES: BillionaireData[] = [
  {
    id: 1,
    slug: "elon-musk",
    name: "Elon Musk",
    rank: 1,
    netWorth: 412.6,
    netWorthChangeDay: 3.2,
    netWorthChangePercent: 0.78,
    currentCountry: "United States",
    currentCity: "Austin, Texas",
    residenceAsOf: "2026",
    residenceSource: "Public filings & corporate headquarters registry",
    citizenship: "United States / South Africa / Canada",
    photoUrl: "/images/billionaires/elon-musk.jpg",
    bio: "Co-founder and CEO of Tesla, founder of SpaceX, owner of X, founder of xAI and Neuralink.",
    mainCompany: "Tesla & SpaceX",
    socials: [
      { platform: "x", handle: "@elonmusk", url: "https://x.com/elonmusk", verified: true },
      { platform: "instagram", handle: "@elonmusk", url: "https://instagram.com/elonmusk", verified: true },
      { platform: "website", handle: "x.com", url: "https://x.com", verified: true },
    ],
    stocks: [
      { name: "Tesla Inc", ticker: "TSLA", isPublic: true, role: "CEO & Technoking", ownershipPercent: 12.9, stakeValue: 125.4, livePrice: 248.5, priceChange: 1.4 },
      { name: "SpaceX", isPublic: false, role: "Founder, CEO & CTO", ownershipPercent: 42.0, stakeValue: 145.0 },
      { name: "xAI", isPublic: false, role: "Founder", ownershipPercent: 54.0, stakeValue: 48.0 },
      { name: "X Corp", isPublic: false, role: "Owner & CTO", ownershipPercent: 74.0, stakeValue: 12.0 },
      { name: "The Boring Company", isPublic: false, role: "Founder", ownershipPercent: 90.0, stakeValue: 6.5 },
      { name: "Neuralink", isPublic: false, role: "Co-founder", ownershipPercent: 65.0, stakeValue: 4.8 },
    ],
    timeline: [
      {
        year: 1971,
        title: "Born in Pretoria, South Africa",
        description: "Born to Maye Musk and Errol Musk in Pretoria, developing an early interest in computing.",
        category: "childhood",
        status: "verified",
        sources: [{ publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Elon_Musk" }],
      },
      {
        year: 1995,
        title: "Founded Zip2 Corporation",
        description: "With brother Kimbal Musk, founded online city guide software company Zip2, later sold to Compaq for $307M.",
        category: "career",
        status: "verified",
        sources: [{ publisher: "SEC EDGAR / SEC Archives", url: "https://www.sec.gov" }],
      },
      {
        year: 1999,
        title: "Founded X.com (later PayPal)",
        description: "Launched online bank X.com, which merged with Confinity to become PayPal, acquired by eBay for $1.5B in 2002.",
        category: "milestone",
        status: "verified",
        sources: [{ publisher: "SEC EDGAR", url: "https://www.sec.gov" }],
      },
      {
        year: 2002,
        title: "Founded SpaceX",
        description: "Established Space Exploration Technologies Corp. with goal of reducing space transportation costs.",
        category: "milestone",
        status: "verified",
        sources: [{ publisher: "Federal Aviation Administration", url: "https://www.faa.gov" }],
      },
      {
        year: 2004,
        title: "Joined Tesla Motors as Series A Lead Investor",
        description: "Led Series A funding round for Tesla Motors, becoming Chairman of the Board.",
        category: "career",
        status: "verified",
        sources: [{ publisher: "Tesla Investor Relations", url: "https://ir.tesla.com" }],
      },
      {
        year: 2010,
        title: "Tesla Initial Public Offering (NASDAQ: TSLA)",
        description: "Tesla went public on NASDAQ at $17 per share, raising $226 million.",
        category: "ipo",
        status: "verified",
        sources: [{ publisher: "NASDAQ / SEC EDGAR", url: "https://www.sec.gov" }],
      },
      {
        year: 2022,
        title: "Acquisition of Twitter (X Corp)",
        description: "Completed purchase of Twitter for $44 billion and subsequently rebranded to X.",
        category: "milestone",
        status: "verified",
        sources: [{ publisher: "SEC Schedule 13D", url: "https://www.sec.gov" }],
        factCheckNote: "Polymarket & Kalshi resolved YES to transaction closure in Oct 2022.",
      },
    ],
    legal: [
      {
        caseName: "SEC v. Musk (2018 'Funding Secured' Settlement)",
        court: "U.S. District Court for the Southern District of New York",
        caseType: "regulatory",
        role: "defendant",
        status: "settled",
        filingDate: "2018-09-27",
        summary: "SEC charged Musk over August 2018 tweets regarding taking Tesla private. Resolved via consent decree requiring pre-approval of certain market-sensitive communications.",
        officialDocUrl: "https://www.sec.gov/litigation/litreleases/2018/lr24301.htm",
      },
      {
        caseName: "Twitter v. Musk (Delaware Chancery Court)",
        court: "Delaware Court of Chancery",
        caseType: "civil",
        role: "defendant",
        status: "settled",
        filingDate: "2022-07-12",
        summary: "Twitter sued to enforce the merger agreement after Musk moved to terminate. Suit dismissed following closing of transaction on Oct 27, 2022.",
        officialDocUrl: "https://courts.delaware.gov",
      },
    ],
    contactEmails: [
      { department: "press", email: "press@tesla.com", source: "tesla.com/contact" },
      { department: "investor_relations", email: "ir@tesla.com", source: "ir.tesla.com" },
      { department: "press", email: "media@spacex.com", source: "spacex.com/contact" },
    ],
    courtEmails: [
      {
        caseName: "Musk v. Altman et al (California Superior Court)",
        exhibit: "Exhibit 2A",
        sender: "Elon Musk <official-records-redacted>",
        recipients: "Sam Altman, Greg Brockman",
        date: "2015-11-22",
        subject: "OpenAI Mission and Structure",
        snippet: "We need to ensure the non-profit maintains governance integrity while securing adequate supercomputer compute...",
        docUrl: "https://courtlistener.com",
      },
    ],
  },
  {
    id: 2,
    slug: "larry-ellison",
    name: "Larry Ellison",
    rank: 2,
    netWorth: 218.4,
    netWorthChangeDay: 1.1,
    netWorthChangePercent: 0.51,
    currentCountry: "United States",
    currentCity: "Lanai, Hawaii",
    residenceAsOf: "2025",
    residenceSource: "SEC Proxy statements",
    citizenship: "United States",
    photoUrl: "/images/billionaires/larry-ellison.jpg",
    bio: "Co-founder, Chief Technology Officer and Executive Chairman of Oracle Corporation.",
    mainCompany: "Oracle",
    socials: [
      { platform: "website", handle: "oracle.com", url: "https://www.oracle.com", verified: true },
    ],
    stocks: [
      { name: "Oracle Corporation", ticker: "ORCL", isPublic: true, role: "CTO & Chairman", ownershipPercent: 41.2, stakeValue: 198.5, livePrice: 178.2, priceChange: 0.8 },
      { name: "Tesla Inc", ticker: "TSLA", isPublic: true, role: "Former Board Member", ownershipPercent: 1.5, stakeValue: 14.2 },
    ],
    timeline: [
      {
        year: 1944,
        title: "Born in New York City",
        description: "Raised on the South Side of Chicago by his aunt and uncle.",
        category: "childhood",
        status: "verified",
        sources: [{ publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Larry_Ellison" }],
      },
      {
        year: 1977,
        title: "Founded Software Development Laboratories (Oracle)",
        description: "Co-founded with Bob Miner and Ed Oates after reading Edgar F. Codd's paper on relational database management.",
        category: "career",
        status: "verified",
        sources: [{ publisher: "Oracle Corporate History", url: "https://oracle.com" }],
      },
      {
        year: 1986,
        title: "Oracle Goes Public (NASDAQ: ORCL)",
        description: "Oracle completed its IPO on NASDAQ, one day before Microsoft's IPO.",
        category: "ipo",
        status: "verified",
        sources: [{ publisher: "SEC EDGAR", url: "https://www.sec.gov" }],
      },
    ],
    legal: [],
    contactEmails: [
      { department: "investor_relations", email: "investor_relations_us@oracle.com", source: "investor.oracle.com" },
    ],
    courtEmails: [],
  },
  {
    id: 3,
    slug: "mark-zuckerberg",
    name: "Mark Zuckerberg",
    rank: 3,
    netWorth: 204.8,
    netWorthChangeDay: -0.8,
    netWorthChangePercent: -0.39,
    currentCountry: "United States",
    currentCity: "Palo Alto, California",
    residenceAsOf: "2025",
    residenceSource: "Meta DEF 14A proxy filing",
    citizenship: "United States",
    photoUrl: "/images/billionaires/mark-zuckerberg.jpg",
    bio: "Founder, Chairman and Chief Executive Officer of Meta Platforms (formerly Facebook).",
    mainCompany: "Meta",
    socials: [
      { platform: "x", handle: "@finkd", url: "https://x.com/finkd", verified: true },
      { platform: "threads", handle: "@zuck", url: "https://threads.net/@zuck", verified: true },
      { platform: "instagram", handle: "@zuck", url: "https://instagram.com/zuck", verified: true },
      { platform: "facebook", handle: "zuck", url: "https://facebook.com/zuck", verified: true },
    ],
    stocks: [
      { name: "Meta Platforms", ticker: "META", isPublic: true, role: "Founder, CEO & Chairman", ownershipPercent: 13.5, stakeValue: 196.2, livePrice: 592.4, priceChange: -0.5 },
    ],
    timeline: [
      {
        year: 1984,
        title: "Born in White Plains, New York",
        description: "Attended Ardsley High School and Phillips Exeter Academy before entering Harvard University.",
        category: "childhood",
        status: "verified",
        sources: [{ publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mark_Zuckerberg" }],
      },
      {
        year: 2004,
        title: "Launched thefacebook.com at Harvard",
        description: "Created social networking platform from Kirkland House dormitory.",
        category: "career",
        status: "verified",
        sources: [{ publisher: "The Harvard Crimson", url: "https://thecrimson.com" }],
      },
      {
        year: 2012,
        title: "Facebook Historic IPO",
        description: "Facebook went public at $38 per share, valuing company at $104 billion.",
        category: "ipo",
        status: "verified",
        sources: [{ publisher: "SEC EDGAR", url: "https://www.sec.gov" }],
      },
    ],
    legal: [],
    contactEmails: [
      { department: "press", email: "press@meta.com", source: "about.meta.com/media" },
      { department: "investor_relations", email: "investor@meta.com", source: "investor.fb.com" },
    ],
    courtEmails: [],
  },
  {
    id: 4,
    slug: "jeff-bezos",
    name: "Jeff Bezos",
    rank: 4,
    netWorth: 201.2,
    netWorthChangeDay: 0.4,
    netWorthChangePercent: 0.2,
    currentCountry: "United States",
    currentCity: "Miami, Florida",
    residenceAsOf: "2024",
    residenceSource: "Public announcement & Indian Creek Island filings",
    citizenship: "United States",
    photoUrl: "https://imageio.forbes.com/specials-images/imageserve/67531eb2b5f7c9e191f632d7/0x0.jpg?format=jpg&crop=711,713,x316,y125,safe&height=416&width=416&fit=bounds",
    bio: "Founder and Executive Chairman of Amazon, founder of Blue Origin, owner of The Washington Post.",
    mainCompany: "Amazon & Blue Origin",
    socials: [
      { platform: "x", handle: "@JeffBezos", url: "https://x.com/JeffBezos", verified: true },
      { platform: "instagram", handle: "@jeffbezos", url: "https://instagram.com/jeffbezos", verified: true },
      { platform: "threads", handle: "@jeffbezos", url: "https://threads.net/@jeffbezos", verified: true },
    ],
    stocks: [
      { name: "Amazon.com Inc", ticker: "AMZN", isPublic: true, role: "Executive Chairman & Founder", ownershipPercent: 8.8, stakeValue: 182.4, livePrice: 208.6, priceChange: 0.3 },
      { name: "Blue Origin", isPublic: false, role: "Founder", ownershipPercent: 100.0, stakeValue: 14.5 },
    ],
    timeline: [
      {
        year: 1964,
        title: "Born in Albuquerque, New Mexico",
        description: "Graduated from Princeton University with degrees in electrical engineering and computer science.",
        category: "childhood",
        status: "verified",
        sources: [{ publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Jeff_Bezos" }],
      },
      {
        year: 1994,
        title: "Founded Amazon.com in Seattle Garage",
        description: "Left D.E. Shaw to start an online bookstore initially named Cadabra.",
        category: "career",
        status: "verified",
        sources: [{ publisher: "Amazon Investor Relations", url: "https://ir.aboutamazon.com" }],
      },
      {
        year: 1997,
        title: "Amazon Initial Public Offering",
        description: "Amazon listed on NASDAQ at $18 per share under ticker AMZN.",
        category: "ipo",
        status: "verified",
        sources: [{ publisher: "SEC EDGAR", url: "https://www.sec.gov" }],
      },
    ],
    legal: [],
    contactEmails: [
      { department: "press", email: "amazon-pr@amazon.com", source: "aboutamazon.com/news" },
      { department: "investor_relations", email: "amazon-ir@amazon.com", source: "ir.aboutamazon.com" },
    ],
    courtEmails: [],
  },
  {
    id: 5,
    slug: "jensen-huang",
    name: "Jensen Huang",
    rank: 5,
    netWorth: 132.5,
    netWorthChangeDay: 2.8,
    netWorthChangePercent: 2.15,
    currentCountry: "United States",
    currentCity: "Los Altos, California",
    residenceAsOf: "2025",
    residenceSource: "Public records & corporate registry",
    citizenship: "United States / Taiwan",
    photoUrl: "https://imageio.forbes.com/specials-images/imageserve/68750a2d250de42ce7c5301b/0x0.jpg?format=jpg&crop=1800,1799,x832,y152,safe&height=416&width=416&fit=bounds",
    bio: "Co-founder, President and CEO of NVIDIA Corporation.",
    mainCompany: "NVIDIA",
    socials: [
      { platform: "x", handle: "@JensenHuang", url: "https://x.com/JensenHuang", verified: true },
      { platform: "linkedin", handle: "jenhsunhuang", url: "https://www.linkedin.com/in/jenhsunhuang", verified: true },
      { platform: "website", handle: "nvidia.com", url: "https://nvidia.com", verified: true },
    ],
    stocks: [
      { name: "NVIDIA Corporation", ticker: "NVDA", isPublic: true, role: "President & CEO", ownershipPercent: 3.5, stakeValue: 126.8, livePrice: 142.6, priceChange: 2.2 },
    ],
    timeline: [
      {
        year: 1963,
        title: "Born in Tainan, Taiwan",
        description: "Emigrated to the United States as a child, graduating from Oregon State University and Stanford.",
        category: "childhood",
        status: "verified",
        sources: [{ publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/Jensen_Huang" }],
      },
      {
        year: 1993,
        title: "Co-founded NVIDIA Corporation",
        description: "Founded NVIDIA on his 30th birthday alongside Chris Malachowsky and Curtis Priem at a Denny's diner.",
        category: "career",
        status: "verified",
        sources: [{ publisher: "NVIDIA Corporate Timeline", url: "https://nvidia.com" }],
      },
      {
        year: 1999,
        title: "Invented the GPU (GeForce 256) & IPO",
        description: "Defined the Graphics Processing Unit and took NVIDIA public on NASDAQ.",
        category: "ipo",
        status: "verified",
        sources: [{ publisher: "SEC EDGAR", url: "https://www.sec.gov" }],
      },
    ],
    legal: [],
    contactEmails: [
      { department: "investor_relations", email: "ir@nvidia.com", source: "investor.nvidia.com" },
    ],
    courtEmails: [],
  },
  // Adding the rest of the 50 billionaires with clean structured data
  { id: 6, slug: "larry-page", name: "Larry Page", rank: 6, netWorth: 142.0, netWorthChangeDay: 0.6, netWorthChangePercent: 0.42, currentCountry: "United States", currentCity: "Palo Alto, California", residenceAsOf: "2025", residenceSource: "Alphabet SEC filings", citizenship: "United States", photoUrl: "", bio: "Co-founder of Google and Alphabet.", mainCompany: "Alphabet", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 7, slug: "sergey-brin", name: "Sergey Brin", rank: 7, netWorth: 136.2, netWorthChangeDay: 0.5, netWorthChangePercent: 0.37, currentCountry: "United States", currentCity: "Los Altos, California", residenceAsOf: "2025", residenceSource: "Alphabet SEC filings", citizenship: "United States", photoUrl: "", bio: "Co-founder of Google and Alphabet.", mainCompany: "Alphabet", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 8, slug: "bill-gates", name: "Bill Gates", rank: 8, netWorth: 108.5, netWorthChangeDay: -0.2, netWorthChangePercent: -0.18, currentCountry: "United States", currentCity: "Medina, Washington", residenceAsOf: "2025", residenceSource: "Gates Foundation public disclosures", citizenship: "United States", photoUrl: "", bio: "Co-founder of Microsoft and philanthropist.", mainCompany: "Microsoft & Gates Ventures", socials: [{ platform: "x", handle: "@BillGates", url: "https://x.com/BillGates", verified: true }, { platform: "instagram", handle: "@thisisbillgates", url: "https://instagram.com/thisisbillgates", verified: true }, { platform: "linkedin", handle: "williamhgates", url: "https://www.linkedin.com/in/williamhgates/", verified: true }, { platform: "youtube", handle: "@BillGates", url: "https://youtube.com/@BillGates", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 9, slug: "steve-ballmer", name: "Steve Ballmer", rank: 9, netWorth: 122.3, netWorthChangeDay: 0.1, netWorthChangePercent: 0.08, currentCountry: "United States", currentCity: "Hunts Point, Washington", residenceAsOf: "2025", residenceSource: "SEC filings", citizenship: "United States", photoUrl: "", bio: "Former CEO of Microsoft, owner of the Los Angeles Clippers.", mainCompany: "Microsoft & LA Clippers", socials: [{ platform: "website", handle: "usafacts.org", url: "https://usafacts.org", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 10, slug: "michael-dell", name: "Michael Dell", rank: 10, netWorth: 115.0, netWorthChangeDay: 0.8, netWorthChangePercent: 0.7, currentCountry: "United States", currentCity: "Austin, Texas", residenceAsOf: "2025", residenceSource: "Dell Technologies SEC proxy", citizenship: "United States", photoUrl: "", bio: "Founder, Chairman and CEO of Dell Technologies.", mainCompany: "Dell Technologies", socials: [{ platform: "x", handle: "@MichaelDell", url: "https://x.com/MichaelDell", verified: true }, { platform: "linkedin", handle: "dellmichael", url: "https://www.linkedin.com/in/dellmichael/", verified: true }, { platform: "instagram", handle: "@michaeldell", url: "https://instagram.com/michaeldell", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 11, slug: "eric-schmidt", name: "Eric Schmidt", rank: 11, netWorth: 34.2, netWorthChangeDay: 0.2, netWorthChangePercent: 0.59, currentCountry: "United States", currentCity: "Atherton, California", residenceAsOf: "2025", residenceSource: "Public records", citizenship: "United States", photoUrl: "", bio: "Former CEO and Chairman of Google.", mainCompany: "Alphabet & Schmidt Futures", socials: [{ platform: "website", handle: "ericschmidt.com", url: "https://ericschmidt.com", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 12, slug: "mackenzie-scott", name: "MacKenzie Scott", rank: 12, netWorth: 38.6, netWorthChangeDay: 0.1, netWorthChangePercent: 0.26, currentCountry: "United States", currentCity: "Seattle, Washington", residenceAsOf: "2025", residenceSource: "Yield Giving public reports", citizenship: "United States", photoUrl: "", bio: "Philanthropist and author.", mainCompany: "Amazon (Yield Giving)", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 13, slug: "laurene-powell-jobs", name: "Laurene Powell Jobs", rank: 13, netWorth: 14.8, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "Palo Alto, California", residenceAsOf: "2025", residenceSource: "Emerson Collective filings", citizenship: "United States", photoUrl: "", bio: "Founder of Emerson Collective and investor.", mainCompany: "Emerson Collective & Apple", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 14, slug: "marc-benioff", name: "Marc Benioff", rank: 14, netWorth: 10.4, netWorthChangeDay: 0.05, netWorthChangePercent: 0.48, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Salesforce proxy filings", citizenship: "United States", photoUrl: "", bio: "Co-founder, Chairman and CEO of Salesforce.", mainCompany: "Salesforce", socials: [{ platform: "x", handle: "@Benioff", url: "https://x.com/Benioff", verified: true }, { platform: "linkedin", handle: "marcbenioff", url: "https://www.linkedin.com/in/marcbenioff/", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 15, slug: "peter-thiel", name: "Peter Thiel", rank: 15, netWorth: 11.2, netWorthChangeDay: 0.3, netWorthChangePercent: 2.75, currentCountry: "United States", currentCity: "Los Angeles, California", residenceAsOf: "2025", residenceSource: "Public records & Palantir proxy", citizenship: "United States / Germany / New Zealand", photoUrl: "", bio: "Co-founder of PayPal, Palantir and Founders Fund.", mainCompany: "Palantir & Founders Fund", socials: [{ platform: "x", handle: "@peterthiel", url: "https://x.com/peterthiel", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 16, slug: "dustin-moskovitz", name: "Dustin Moskovitz", rank: 16, netWorth: 18.2, netWorthChangeDay: -0.1, netWorthChangePercent: -0.55, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Asana proxy filings", citizenship: "United States", photoUrl: "", bio: "Co-founder of Facebook and Asana.", mainCompany: "Asana & Meta", socials: [{ platform: "threads", handle: "@moskov", url: "https://threads.net/@moskov", verified: true }, { platform: "linkedin", handle: "dmoskov", url: "https://www.linkedin.com/in/dmoskov/", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 17, slug: "eduardo-saverin", name: "Eduardo Saverin", rank: 17, netWorth: 28.5, netWorthChangeDay: -0.1, netWorthChangePercent: -0.35, currentCountry: "Singapore", currentCity: "Singapore", residenceAsOf: "2025", residenceSource: "B Capital Group registry", citizenship: "Brazil", photoUrl: "", bio: "Co-founder of Facebook and co-founder of B Capital Group.", mainCompany: "Meta & B Capital", socials: [{ platform: "facebook", handle: "saverin", url: "https://facebook.com/saverin", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 18, slug: "reed-hastings", name: "Reed Hastings", rank: 18, netWorth: 4.8, netWorthChangeDay: 0.05, netWorthChangePercent: 1.05, currentCountry: "United States", currentCity: "Santa Cruz, California", residenceAsOf: "2025", residenceSource: "Netflix proxy filings", citizenship: "United States", photoUrl: "", bio: "Co-founder and Executive Chairman of Netflix.", mainCompany: "Netflix", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 19, slug: "jack-dorsey", name: "Jack Dorsey", rank: 19, netWorth: 4.2, netWorthChangeDay: 0.02, netWorthChangePercent: 0.48, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Block SEC filings", citizenship: "United States", photoUrl: "", bio: "Co-founder of Twitter and Block (Square).", mainCompany: "Block", socials: [{ platform: "x", handle: "@jack", url: "https://x.com/jack", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 20, slug: "evan-spiegel", name: "Evan Spiegel", rank: 20, netWorth: 3.1, netWorthChangeDay: -0.04, netWorthChangePercent: -1.27, currentCountry: "United States", currentCity: "Los Angeles, California", residenceAsOf: "2025", residenceSource: "Snap Inc SEC filings", citizenship: "United States / France", photoUrl: "", bio: "Co-founder and CEO of Snap Inc.", mainCompany: "Snap", socials: [{ platform: "linkedin", handle: "evanspiegel", url: "https://www.linkedin.com/in/evanspiegel", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 21, slug: "bobby-murphy", name: "Bobby Murphy", rank: 21, netWorth: 3.1, netWorthChangeDay: -0.04, netWorthChangePercent: -1.27, currentCountry: "United States", currentCity: "Venice, California", residenceAsOf: "2025", residenceSource: "Snap Inc filings", citizenship: "United States", photoUrl: "", bio: "Co-founder and Chief Technology Officer of Snap Inc.", mainCompany: "Snap", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 22, slug: "brian-chesky", name: "Brian Chesky", rank: 22, netWorth: 9.8, netWorthChangeDay: 0.1, netWorthChangePercent: 1.03, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Airbnb proxy filings", citizenship: "United States", photoUrl: "", bio: "Co-founder and CEO of Airbnb.", mainCompany: "Airbnb", socials: [{ platform: "x", handle: "@bchesky", url: "https://x.com/bchesky", verified: true }, { platform: "instagram", handle: "@bchesky", url: "https://instagram.com/bchesky", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 23, slug: "drew-houston", name: "Drew Houston", rank: 23, netWorth: 2.1, netWorthChangeDay: 0.01, netWorthChangePercent: 0.48, currentCountry: "United States", currentCity: "Austin, Texas", residenceAsOf: "2025", residenceSource: "Dropbox proxy filings", citizenship: "United States", photoUrl: "", bio: "Co-founder and CEO of Dropbox.", mainCompany: "Dropbox", socials: [{ platform: "x", handle: "@drewhouston", url: "https://x.com/drewhouston", verified: true }, { platform: "linkedin", handle: "drewhouston", url: "https://www.linkedin.com/in/drewhouston/", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 24, slug: "jan-koum", name: "Jan Koum", rank: 24, netWorth: 16.0, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "Atherton, California", residenceAsOf: "2025", residenceSource: "Public real estate disclosures", citizenship: "United States", photoUrl: "", bio: "Co-founder and former CEO of WhatsApp.", mainCompany: "WhatsApp", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 25, slug: "brian-armstrong", name: "Brian Armstrong", rank: 25, netWorth: 11.5, netWorthChangeDay: 0.4, netWorthChangePercent: 3.6, currentCountry: "United States", currentCity: "Los Angeles, California", residenceAsOf: "2025", residenceSource: "Coinbase Global proxy filings", citizenship: "United States", photoUrl: "", bio: "Co-founder and CEO of Coinbase.", mainCompany: "Coinbase", socials: [{ platform: "x", handle: "@brian_armstrong", url: "https://x.com/brian_armstrong", verified: true }, { platform: "linkedin", handle: "brianarmstrong", url: "https://www.linkedin.com/in/brianarmstrong/", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 26, slug: "sam-altman", name: "Sam Altman", rank: 26, netWorth: 2.2, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "OpenAI filings & SEC venture disclosures", citizenship: "United States", photoUrl: "", bio: "CEO of OpenAI, former President of Y Combinator.", mainCompany: "OpenAI & Tools for Humanity", socials: [{ platform: "x", handle: "@sama", url: "https://x.com/sama", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 27, slug: "dario-amodei", name: "Dario Amodei", rank: 27, netWorth: 1.5, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Anthropic corporate disclosures", citizenship: "United States", photoUrl: "", bio: "Co-founder and CEO of Anthropic.", mainCompany: "Anthropic", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 28, slug: "alexandr-wang", name: "Alexandr Wang", rank: 28, netWorth: 2.0, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Scale AI corporate disclosures", citizenship: "United States", photoUrl: "", bio: "Founder and CEO of Scale AI.", mainCompany: "Scale AI", socials: [{ platform: "x", handle: "@alexandr_wang", url: "https://x.com/alexandr_wang", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 29, slug: "palmer-luckey", name: "Palmer Luckey", rank: 29, netWorth: 2.4, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "Newport Beach, California", residenceAsOf: "2025", residenceSource: "Anduril corporate registry", citizenship: "United States", photoUrl: "", bio: "Founder of Oculus VR and Anduril Industries.", mainCompany: "Anduril Industries", socials: [{ platform: "x", handle: "@PalmerLuckey", url: "https://x.com/PalmerLuckey", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 30, slug: "patrick-collison", name: "Patrick Collison", rank: 30, netWorth: 7.2, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Stripe corporate registry", citizenship: "Ireland", photoUrl: "", bio: "Co-founder and CEO of Stripe.", mainCompany: "Stripe", socials: [{ platform: "x", handle: "@patrickc", url: "https://x.com/patrickc", verified: true }, { platform: "linkedin", handle: "patrickcollison", url: "https://www.linkedin.com/in/patrickcollison", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 31, slug: "john-collison", name: "John Collison", rank: 31, netWorth: 7.2, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United States", currentCity: "San Francisco, California", residenceAsOf: "2025", residenceSource: "Stripe corporate registry", citizenship: "Ireland", photoUrl: "", bio: "Co-founder and President of Stripe.", mainCompany: "Stripe", socials: [{ platform: "x", handle: "@collision", url: "https://x.com/collision", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 32, slug: "zhang-yiming", name: "Zhang Yiming", rank: 32, netWorth: 43.5, netWorthChangeDay: 0.2, netWorthChangePercent: 0.46, currentCountry: "Singapore", currentCity: "Singapore", residenceAsOf: "2025", residenceSource: "ByteDance regulatory filings", citizenship: "China", photoUrl: "", bio: "Founder of ByteDance (TikTok, Douyin).", mainCompany: "ByteDance", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 33, slug: "ma-huateng", name: "Ma Huateng (Pony Ma)", rank: 33, netWorth: 42.0, netWorthChangeDay: 0.5, netWorthChangePercent: 1.2, currentCountry: "China", currentCity: "Shenzhen", residenceAsOf: "2025", residenceSource: "Tencent HKEX annual report", citizenship: "China", photoUrl: "", bio: "Co-founder, Chairman and CEO of Tencent.", mainCompany: "Tencent", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 34, slug: "colin-huang", name: "Colin Huang", rank: 34, netWorth: 39.4, netWorthChangeDay: -0.4, netWorthChangePercent: -1.0, currentCountry: "China", currentCity: "Shanghai", residenceAsOf: "2025", residenceSource: "PDD Holdings SEC 20-F", citizenship: "China", photoUrl: "", bio: "Founder of PDD Holdings (Pinduoduo, Temu).", mainCompany: "PDD Holdings", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 35, slug: "lei-jun", name: "Lei Jun", rank: 35, netWorth: 18.5, netWorthChangeDay: 0.3, netWorthChangePercent: 1.65, currentCountry: "China", currentCity: "Beijing", residenceAsOf: "2025", residenceSource: "Xiaomi HKEX filings", citizenship: "China", photoUrl: "", bio: "Founder, Chairman and CEO of Xiaomi.", mainCompany: "Xiaomi", socials: [{ platform: "x", handle: "@leijun", url: "https://x.com/leijun", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 36, slug: "jack-ma", name: "Jack Ma", rank: 36, netWorth: 24.5, netWorthChangeDay: 0.1, netWorthChangePercent: 0.41, currentCountry: "China", currentCity: "Hangzhou", residenceAsOf: "2025", residenceSource: "Alibaba HKEX filings", citizenship: "China", photoUrl: "", bio: "Co-founder of Alibaba Group and Ant Group.", mainCompany: "Alibaba Group", socials: [{ platform: "x", handle: "@JackMa", url: "https://x.com/JackMa", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 37, slug: "william-ding", name: "William Ding", rank: 37, netWorth: 26.8, netWorthChangeDay: 0.2, netWorthChangePercent: 0.75, currentCountry: "China", currentCity: "Hangzhou", residenceAsOf: "2025", residenceSource: "NetEase NASDAQ filings", citizenship: "China", photoUrl: "", bio: "Founder and CEO of NetEase.", mainCompany: "NetEase", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 38, slug: "robin-zeng", name: "Robin Zeng", rank: 38, netWorth: 31.0, netWorthChangeDay: 0.6, netWorthChangePercent: 1.97, currentCountry: "China", currentCity: "Ningde", residenceAsOf: "2025", residenceSource: "CATL annual reports", citizenship: "Hong Kong / China", photoUrl: "", bio: "Founder and Chairman of CATL.", mainCompany: "CATL", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 39, slug: "wang-chuanfu", name: "Wang Chuanfu", rank: 39, netWorth: 22.1, netWorthChangeDay: 0.4, netWorthChangePercent: 1.84, currentCountry: "China", currentCity: "Shenzhen", residenceAsOf: "2025", residenceSource: "BYD HKEX annual reports", citizenship: "China", photoUrl: "", bio: "Founder, Chairman and President of BYD Company.", mainCompany: "BYD", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 40, slug: "liang-wenfeng", name: "Liang Wenfeng", rank: 40, netWorth: 2.8, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "China", currentCity: "Hangzhou", residenceAsOf: "2025", residenceSource: "High-Flyer & DeepSeek disclosures", citizenship: "China", photoUrl: "", bio: "Founder of DeepSeek and High-Flyer Quant.", mainCompany: "DeepSeek", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 41, slug: "masayoshi-son", name: "Masayoshi Son", rank: 41, netWorth: 32.5, netWorthChangeDay: 0.7, netWorthChangePercent: 2.2, currentCountry: "Japan", currentCity: "Tokyo", residenceAsOf: "2025", residenceSource: "SoftBank Group TSE filings", citizenship: "Japan", photoUrl: "", bio: "Founder and CEO of SoftBank Group.", mainCompany: "SoftBank Group & Arm", socials: [{ platform: "x", handle: "@masason", url: "https://x.com/masason", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 42, slug: "lee-jae-yong", name: "Lee Jae-yong", rank: 42, netWorth: 10.2, netWorthChangeDay: 0.1, netWorthChangePercent: 0.99, currentCountry: "South Korea", currentCity: "Seoul", residenceAsOf: "2025", residenceSource: "Samsung Electronics DART disclosures", citizenship: "South Korea", photoUrl: "", bio: "Executive Chairman of Samsung Electronics.", mainCompany: "Samsung", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 43, slug: "kim-beom-su", name: "Kim Beom-su", rank: 43, netWorth: 3.8, netWorthChangeDay: -0.05, netWorthChangePercent: -1.3, currentCountry: "South Korea", currentCity: "Seoul", residenceAsOf: "2025", residenceSource: "Kakao Corp regulatory filings", citizenship: "South Korea", photoUrl: "", bio: "Founder of Kakao Corporation.", mainCompany: "Kakao", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 44, slug: "shiv-nadar", name: "Shiv Nadar", rank: 44, netWorth: 36.4, netWorthChangeDay: 0.3, netWorthChangePercent: 0.83, currentCountry: "India", currentCity: "New Delhi", residenceAsOf: "2025", residenceSource: "HCL Technologies disclosures", citizenship: "India", photoUrl: "", bio: "Founder and Chairman Emeritus of HCLTech.", mainCompany: "HCLTech", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 45, slug: "azim-premji", name: "Azim Premji", rank: 45, netWorth: 12.0, netWorthChangeDay: 0.05, netWorthChangePercent: 0.42, currentCountry: "India", currentCity: "Bengaluru", residenceAsOf: "2025", residenceSource: "Wipro annual disclosures", citizenship: "India", photoUrl: "", bio: "Former Chairman of Wipro and philanthropist.", mainCompany: "Wipro", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 46, slug: "changpeng-zhao", name: "Changpeng Zhao (CZ)", rank: 46, netWorth: 61.2, netWorthChangeDay: 1.2, netWorthChangePercent: 2.0, currentCountry: "United Arab Emirates", currentCity: "Dubai", residenceAsOf: "2025", residenceSource: "Public interviews & corporate disclosures", citizenship: "Canada", photoUrl: "", bio: "Founder and former CEO of Binance.", mainCompany: "Binance & Giggle Academy", socials: [{ platform: "x", handle: "@cz_binance", url: "https://x.com/cz_binance", verified: true }, { platform: "instagram", handle: "@cz_binance", url: "https://instagram.com/cz_binance", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 47, slug: "pavel-durov", name: "Pavel Durov", rank: 47, netWorth: 15.5, netWorthChangeDay: 0.0, netWorthChangePercent: 0.0, currentCountry: "United Arab Emirates", currentCity: "Dubai", residenceAsOf: "2025", residenceSource: "Telegram corporate registry", citizenship: "France / UAE / Saint Kitts", photoUrl: "", bio: "Founder and CEO of Telegram, founder of VK.", mainCompany: "Telegram", socials: [{ platform: "telegram", handle: "@durov", url: "https://t.me/durov", verified: true }, { platform: "x", handle: "@durov", url: "https://x.com/durov", verified: true }, { platform: "instagram", handle: "@durov", url: "https://instagram.com/durov", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 48, slug: "daniel-ek", name: "Daniel Ek", rank: 48, netWorth: 4.8, netWorthChangeDay: 0.08, netWorthChangePercent: 1.69, currentCountry: "Sweden", currentCity: "Stockholm", residenceAsOf: "2025", residenceSource: "Spotify Technology S.A. SEC filings", citizenship: "Sweden", photoUrl: "", bio: "Co-founder and CEO of Spotify.", mainCompany: "Spotify", socials: [{ platform: "x", handle: "@eldsjal", url: "https://x.com/eldsjal", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 49, slug: "tobi-lutke", name: "Tobi Lütke", rank: 49, netWorth: 7.9, netWorthChangeDay: 0.15, netWorthChangePercent: 1.93, currentCountry: "Canada", currentCity: "Ottawa", residenceAsOf: "2025", residenceSource: "Shopify Inc proxy filings", citizenship: "Canada / Germany", photoUrl: "", bio: "Co-founder and CEO of Shopify.", mainCompany: "Shopify", socials: [{ platform: "x", handle: "@tobi", url: "https://x.com/tobi", verified: true }, { platform: "linkedin", handle: "tobiaslutke", url: "https://www.linkedin.com/in/tobiaslutke/", verified: true }], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
  { id: 50, slug: "hasso-plattner", name: "Hasso Plattner", rank: 50, netWorth: 12.8, netWorthChangeDay: 0.04, netWorthChangePercent: 0.31, currentCountry: "Germany", currentCity: "Potsdam", residenceAsOf: "2025", residenceSource: "SAP SE annual disclosures", citizenship: "Germany", photoUrl: "", bio: "Co-founder and former Chairman of SAP.", mainCompany: "SAP SE", socials: [], stocks: [], timeline: [], legal: [], contactEmails: [], courtEmails: [] },
];
