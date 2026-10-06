import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Billionaires (People)
export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // e.g. "elon-musk"
  name: text("name").notNull(),
  rank: integer("rank").notNull(),
  netWorth: numeric("net_worth", { precision: 15, scale: 2 }).notNull(), // in USD
  netWorthChangeDay: numeric("net_worth_change_day", { precision: 15, scale: 2 }).default("0"),
  netWorthChangePercent: numeric("net_worth_change_percent", { precision: 5, scale: 2 }).default("0"),
  
  // Residence (Country + City strictly, no exact street/pins)
  currentCountry: text("current_country").notNull(),
  currentCity: text("current_city").notNull(),
  residenceAsOf: text("residence_as_of"),
  residenceSource: text("residence_source"),

  birthDate: date("birth_date"),
  birthPlace: text("birth_place"),
  citizenship: text("citizenship"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  wikidataId: text("wikidata_id"),
  wikipediaUrl: text("wikipedia_url"),
  grokipediaSummary: text("grokipedia_summary"),
  mainCompany: text("main_company"),
  industry: text("industry"),
  source: text("source"),
  bloombergNetWorth: numeric("bloomberg_net_worth", { precision: 15, scale: 2 }),
  bloombergRank: integer("bloomberg_rank"),
  isTechTitan: boolean("is_tech_titan").default(false),
  isVerified: boolean("is_verified").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. Social Accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(), // 'x', 'instagram', 'threads', 'linkedin', 'youtube', 'tiktok', 'facebook', 'bluesky', 'website'
  handle: text("handle").notNull(),
  url: text("url").notNull(),
  isVerified: boolean("is_verified").default(true),
});

// 3. Companies & Entities
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ticker: text("ticker"), // e.g. "TSLA"
  exchange: text("exchange"), // e.g. "NASDAQ"
  isPublic: boolean("is_public").notNull().default(true),
  logoUrl: text("logo_url"),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }),
  priceChangePercent: numeric("price_change_percent", { precision: 5, scale: 2 }),
  marketCap: numeric("market_cap", { precision: 15, scale: 2 }),
  cik: text("cik"), // SEC identifier
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// 4. Holdings (Equity, Stakes & Roles)
export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  role: text("role"), // 'CEO & Founder', 'Major Shareholder', etc.
  sharesOwned: numeric("shares_owned", { precision: 15, scale: 2 }),
  ownershipPercent: numeric("ownership_percent", { precision: 5, scale: 2 }),
  stakeValue: numeric("stake_value", { precision: 15, scale: 2 }),
  stakeType: text("stake_type").notNull().default("public"), // 'public', 'private', 'trust', 'options'
  asOf: timestamp("as_of").defaultNow(),
  sourceUrl: text("source_url"),
});

// 5. Timeline Events (Childhood to Present)
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  date: text("date"),
  ageAtEvent: integer("age_at_event"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'childhood', 'education', 'career', 'ipo', 'milestone', 'legal', 'philanthropy'
  status: text("status").notNull().default("reported"), // 'reported', 'confirmed', 'verified', 'disputed'
  confidence: integer("confidence").default(80),
  sources: jsonb("sources").default([]), // array of { publisher: string, url: string, title?: string }
  marketCheckNote: text("market_check_note"), // notes from polymarket/kalshi check
  createdAt: timestamp("created_at").defaultNow(),
});

// 6. Legal Cases & Charges
export const legalCases = pgTable("legal_cases", {
  id: serial("id").primaryKey(),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  caseName: text("case_name").notNull(),
  court: text("court").notNull(),
  caseNumber: text("case_number"),
  caseType: text("case_type").notNull(), // 'civil', 'criminal', 'regulatory'
  role: text("role").notNull(), // 'defendant', 'plaintiff', 'respondent'
  status: text("status").notNull(), // 'filed', 'ongoing', 'settled', 'dismissed', 'acquitted', 'convicted'
  filingDate: text("filing_date"),
  closedDate: text("closed_date"),
  summary: text("summary").notNull(),
  officialDocUrl: text("official_doc_url"),
  sources: jsonb("sources").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// 7. Court-Released Emails
export const courtEmails = pgTable("court_emails", {
  id: serial("id").primaryKey(),
  legalCaseId: integer("legal_case_id")
    .notNull()
    .references(() => legalCases.id, { onDelete: "cascade" }),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  exhibitNumber: text("exhibit_number"), // e.g. "Exhibit 14B"
  sender: text("sender").notNull(),
  recipients: text("recipients").notNull(),
  sentAt: text("sent_at").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  pdfSourceUrl: text("pdf_source_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 8. Public Contact Emails
export const contactEmails = pgTable("contact_emails", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").references(() => people.id, { onDelete: "cascade" }),
  companyId: integer("company_id").references(() => companies.id, { onDelete: "cascade" }),
  department: text("department").notNull(), // 'press', 'investor_relations', 'foundation', 'legal', 'general'
  email: text("email").notNull(),
  verifiedSourceUrl: text("verified_source_url").notNull(),
  lastVerifiedAt: timestamp("last_verified_at").defaultNow(),
});

// 9. Historical Net Worth Snapshots
export const netWorthSnapshots = pgTable("net_worth_snapshots", {
  id: serial("id").primaryKey(),
  personId: integer("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  netWorth: numeric("net_worth", { precision: 15, scale: 2 }).notNull(),
  rank: integer("rank").notNull(),
});

// 10. Free Public API Keys
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  appName: text("app_name").notNull(),
  email: text("email"),
  rateLimitPerDay: integer("rate_limit_per_day").default(1000),
  usageToday: integer("usage_today").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 11. Admin Review Queue
export const reviewQueue = pgTable("review_queue", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(), // 'fact', 'legal_case', 'email', 'valuation'
  payload: jsonb("payload").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// 12. Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});


// Relational Definitions
export const peopleRelations = relations(people, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  holdings: many(holdings),
  timelineEvents: many(timelineEvents),
  legalCases: many(legalCases),
  courtEmails: many(courtEmails),
  contactEmails: many(contactEmails),
  snapshots: many(netWorthSnapshots),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  holdings: many(holdings),
  contactEmails: many(contactEmails),
}));

export const legalCasesRelations = relations(legalCases, ({ one, many }) => ({
  person: one(people, {
    fields: [legalCases.personId],
    references: [people.id],
  }),
  courtEmails: many(courtEmails),
}));
