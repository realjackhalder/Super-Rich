"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_50_BILLIONAIRES, BillionaireData } from "@/data/billionaires";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  ShieldCheck,
  Building,
  TrendingUp,
  Scale,
  Mail,
  Clock,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertCircle,
  Share2,
} from "lucide-react";

export default function BillionaireProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const person = INITIAL_50_BILLIONAIRES.find((p) => p.slug === params.slug);

  if (!person) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "stocks" | "assets" | "social" | "legal" | "emails" | "sources"
  >("overview");

  const isPositive = person.netWorthChangeDay >= 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: `Timeline (${person.timeline?.length || 0})` },
    { id: "stocks", label: `Companies & Stocks (${person.stocks?.length || 0})` },
    { id: "assets", label: "Assets" },
    { id: "social", label: "Social Media" },
    { id: "legal", label: `Legal & Charges (${person.legal?.length || 0})` },
    { id: "emails", label: `Emails (${(person.contactEmails?.length || 0) + (person.courtEmails?.length || 0)})` },
    { id: "sources", label: "Sources" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Global Index</span>
        </Link>
      </div>

      {/* Profile Header (Apple Liquid Glass + X style layout) */}
      <div className="liquid-glass rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center space-x-5">
            {/* Avatar / Portrait placeholder */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-white dark:border-neutral-700 shadow-sm flex-shrink-0">
              {person.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-full h-full object-cover grayscale contrast-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-neutral-400">
                  {person.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  {person.name}
                </h1>
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-black">
                  #{person.rank}
                </span>
              </div>

              {/* Residence strictly Country + City */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-1 font-medium text-neutral-900 dark:text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{person.currentCity}, {person.currentCountry}</span>
                </div>
                <span>·</span>
                <span>Citizenship: {person.citizenship}</span>
                <span>·</span>
                <span>As of {person.residenceAsOf}</span>
              </div>

              <p className="text-xs text-neutral-500 max-w-xl line-clamp-2">
                {person.bio}
              </p>
            </div>
          </div>

          {/* Live Net Worth Card */}
          <div className="flex flex-col items-start md:items-end justify-center pt-2 md:pt-0">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              <span>Live Calculated Net Worth</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
              ${person.netWorth.toFixed(1)}B
            </div>
            <div
              className={`text-xs font-semibold mt-1 flex items-center ${
                isPositive ? "text-gain" : "text-loss"
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {isPositive ? "+" : ""}${Math.abs(person.netWorthChangeDay).toFixed(1)}B today ({isPositive ? "+" : ""}{person.netWorthChangePercent}%)
            </div>
          </div>
        </div>

        {/* Social media links row */}
        {person.socials && person.socials.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 mr-2">Verified Profiles:</span>
            {person.socials.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="liquid-glass px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1.5 transition-colors"
              >
                <span className="capitalize">{s.platform}</span>
                <span className="text-neutral-400 font-normal">{s.handle}</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            ))}
          </div>
        )}

        {/* Tab Navigation (X-like style with Liquid Glass pills) */}
        <div className="flex space-x-1 border-t border-neutral-200/50 dark:border-neutral-800/80 pt-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="solid-card rounded-3xl p-6 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Biography & Background</h3>
                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{person.bio}</p>
                <div className="pt-2 text-xs text-neutral-500">
                  <span>Source: Wikidata & Wikipedia (CC BY-SA 4.0)</span>
                </div>
              </div>

              {/* Top holdings quick preview */}
              <div className="solid-card rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Core Equity Stakes</h3>
                <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                  {person.stocks?.map((stk, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                          <span>{stk.name}</span>
                          {stk.ticker && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">{stk.ticker}</span>}
                        </div>
                        <div className="text-neutral-500">{stk.role} · {stk.ownershipPercent}% ownership</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-neutral-900 dark:text-white">${stk.stakeValue.toFixed(1)}B</div>
                        <div className="text-neutral-400">{stk.isPublic ? "Public Stock" : "Private Valuation"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Residence & Public Records card */}
              <div className="liquid-glass rounded-3xl p-6 space-y-3 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-neutral-500">Verified Residence</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 font-semibold text-sm">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{person.currentCity}, {person.currentCountry}</span>
                  </div>
                  <div className="text-neutral-500">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Reporting Basis: </span>
                    {person.residenceSource}
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Note: For privacy and safety, only municipality and country are reported. Exact residential coordinates are never cataloged.
                  </div>
                </div>
              </div>

              {/* Methodology note */}
              <div className="liquid-glass rounded-3xl p-6 space-y-2 text-xs text-neutral-500">
                <h3 className="font-bold uppercase tracking-wider text-neutral-500">Valuation Formula</h3>
                <p>
                  Calculated dynamically: Public shares × Real-time market tick + Private equity based on latest audited venture funding rounds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold">Childhood to Present Timeline</h3>
              <p className="text-xs text-neutral-500">
                Chronological milestones backed by official documents and fact-checked through Polymarket/Kalshi resolutions.
              </p>
            </div>

            <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-4 space-y-8 py-2">
              {person.timeline?.length ? (
                person.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6 space-y-1.5 group">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 group-hover:scale-125 transition-transform"></span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white bg-neutral-200/50 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                        {event.year}
                      </span>
                      <h4 className="text-sm font-semibold">{event.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gain/10 text-gain font-medium uppercase">
                        {event.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {event.description}
                    </p>

                    {event.factCheckNote && (
                      <div className="text-[11px] p-2 rounded-xl liquid-glass text-neutral-600 dark:text-neutral-300 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gain" />
                        <span>{event.factCheckNote}</span>
                      </div>
                    )}

                    {event.sources?.length > 0 && (
                      <div className="flex items-center space-x-2 pt-1 text-[11px] text-neutral-400">
                        <span>Source:</span>
                        {event.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-black dark:hover:text-white"
                          >
                            {src.publisher}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="pl-6 text-xs text-neutral-500">Timeline events being indexed via Wikidata...</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMPANIES & STOCKS */}
        {activeTab === "stocks" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold">Equity Stakes & Corporate Control</h3>
              <p className="text-xs text-neutral-500">
                Data derived from SEC Form 4 insider ownership and verified funding rounds.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Ownership</th>
                    <th className="py-3 px-4">Live Price</th>
                    <th className="py-3 px-4 text-right">Stake Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                  {person.stocks?.map((stock, idx) => (
                    <tr key={idx} className="hover:bg-neutral-200/20 dark:hover:bg-neutral-800/20">
                      <td className="py-3 px-4 font-semibold">
                        {stock.name} {stock.ticker && <span className="text-neutral-400 font-normal">({stock.ticker})</span>}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{stock.role}</td>
                      <td className="py-3 px-4">{stock.ownershipPercent}%</td>
                      <td className="py-3 px-4">
                        {stock.livePrice ? `$${stock.livePrice.toFixed(2)}` : "Private"}
                      </td>
                      <td className="py-3 px-4 text-right font-bold">${stock.stakeValue.toFixed(1)}B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ASSETS */}
        {activeTab === "assets" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold">Asset Class Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="liquid-glass rounded-2xl p-4 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold">Public Equity</div>
                <div className="text-2xl font-bold mt-1">65%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Liquid on public exchanges</div>
              </div>
              <div className="liquid-glass rounded-2xl p-4 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold">Private Equity</div>
                <div className="text-2xl font-bold mt-1">30%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Venture & unlisted shares</div>
              </div>
              <div className="liquid-glass rounded-2xl p-4 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold">Cash & Other</div>
                <div className="text-2xl font-bold mt-1">5%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Real estate & equivalents</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL */}
        {activeTab === "social" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold">Verified Social Media Presence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {person.socials?.map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass rounded-2xl p-4 flex items-center justify-between hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <div>
                    <div className="text-xs text-neutral-400 uppercase font-semibold">{soc.platform}</div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">{soc.handle}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: LEGAL */}
        {activeTab === "legal" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold">Official Legal Cases & Regulatory Actions</h3>
              <p className="text-xs text-neutral-500">
                Ground in court records and SEC litigation releases. Neutral reporting using official legal status.
              </p>
            </div>

            {person.legal?.length ? (
              <div className="space-y-4">
                {person.legal.map((item, idx) => (
                  <div key={idx} className="liquid-glass rounded-2xl p-5 space-y-2 border border-apple-borderLight dark:border-apple-borderDark">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm">{item.caseName}</h4>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 font-medium uppercase">
                        Status: {item.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      <span>{item.court}</span> · <span>Type: {item.caseType}</span> · <span>Role: {item.role}</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pt-1">
                      {item.summary}
                    </p>
                    <div className="pt-2">
                      <a
                        href={item.officialDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] text-accent hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Official Docket Document</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-500 py-4">No major federal civil or criminal actions currently docketed.</div>
            )}
          </div>
        )}

        {/* TAB 7: EMAILS */}
        {activeTab === "emails" && (
          <div className="space-y-6">
            {/* Section A: Contact Emails */}
            <div className="solid-card rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold">Public Contact & Investor Relations Emails</h3>
              <p className="text-xs text-neutral-500">
                Verified public corporate, media, and foundation points of contact.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {person.contactEmails?.map((em, idx) => (
                  <div key={idx} className="liquid-glass rounded-2xl p-4 space-y-1">
                    <div className="text-[11px] uppercase font-bold text-neutral-500 tracking-wider">
                      {em.department.replace("_", " ")}
                    </div>
                    <div className="font-mono text-xs font-semibold select-all text-neutral-900 dark:text-white">
                      {em.email}
                    </div>
                    <div className="text-[10px] text-neutral-400 pt-1">Source: {em.source}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Court-Released Emails */}
            <div className="solid-card rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold">Court-Released Email Archives</h3>
              <p className="text-xs text-neutral-500">
                Official trial exhibits made public during court proceedings. Personal third-party details are redacted.
              </p>

              {person.courtEmails?.length ? (
                <div className="space-y-4 pt-2">
                  {person.courtEmails.map((cEmail, idx) => (
                    <div key={idx} className="liquid-glass rounded-2xl p-5 space-y-3 font-mono text-xs border border-apple-borderLight dark:border-apple-borderDark">
                      <div className="flex items-center justify-between text-neutral-500 border-b border-neutral-200/50 dark:border-neutral-800/80 pb-2">
                        <span>{cEmail.caseName} — {cEmail.exhibit}</span>
                        <span>{cEmail.date}</span>
                      </div>
                      <div className="space-y-1">
                        <div><span className="text-neutral-500">From:</span> {cEmail.sender}</div>
                        <div><span className="text-neutral-500">To:</span> {cEmail.recipients}</div>
                        <div><span className="text-neutral-500">Subject:</span> {cEmail.subject}</div>
                      </div>
                      <div className="bg-neutral-100/50 dark:bg-neutral-900/50 p-3 rounded-xl whitespace-pre-line text-neutral-700 dark:text-neutral-300 font-sans">
                        "{cEmail.snippet}"
                      </div>
                      <div className="pt-1">
                        <a
                          href={cEmail.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-accent hover:underline font-sans"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Full Exhibit on CourtListener</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-neutral-500 py-2">No public trial exhibit emails filed for this profile.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: SOURCES */}
        {activeTab === "sources" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Audit Trail & Data Sources</h3>
            <p className="text-xs text-neutral-500">
              In accordance with our methodology, every claim links to official documentation or public databases.
            </p>
            <ul className="list-disc list-inside text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>U.S. Securities and Exchange Commission (SEC EDGAR) - Form 4 & Schedule 13D</li>
              <li>Wikidata Entity Registry (CC0 Public Domain)</li>
              <li>Wikipedia English Foundation (CC BY-SA 4.0)</li>
              <li>CourtListener / Free Law Project (Federal Docket Exhibits)</li>
              <li>Finnhub & Twelve Data Real-Time Quotes</li>
              <li>Polymarket & Kalshi Prediction Event Resolutions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
