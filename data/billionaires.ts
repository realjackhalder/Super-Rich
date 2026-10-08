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
