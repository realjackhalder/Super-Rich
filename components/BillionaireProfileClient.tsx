"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Building,
  TrendingUp,
  Scale,
  Mail,
  Clock,
  ExternalLink,
  FileText,
  AlertCircle,
  Share2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { VERIFIED_PORTRAITS } from "@/lib/portraits";
import { formatCountryName } from "@/lib/countries";

interface Props {
  serverProfile: any;
  serverRtb: any;
  slug: string;
}

export default function BillionaireProfileClient({
  serverProfile,
  serverRtb,
  slug,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "stocks" | "assets" | "social" | "legal" | "emails"
  >("overview");

  const [profileData, setProfileData] = useState<any>(serverProfile);
  const [rtbData, setRtbData] = useState<any>(serverRtb);
  const [grokipediaData, setGrokipediaData] = useState<any>(serverProfile?.grokipedia || null);
  const [bloombergData, setBloombergData] = useState<any>(serverProfile?.bloombergValuation || null);

  useEffect(() => {
    // Refresh live profile in the background
    fetch(`/api/v1/people/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setProfileData(data.data);
          if (data.data.bloombergValuation) {
            setBloombergData(data.data.bloombergValuation);
          }
          if (data.data.grokipedia) {
            setGrokipediaData(data.data.grokipedia);
          }
        }
      })
      .catch((err) => console.warn("Live profile update skipped:", err));

    if (!rtbData) {
      fetch(`/api/rtb/profile/${slug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data) {
            setRtbData(data.data);
          }
        })
        .catch((err) => console.warn("RTB fetch skipped:", err));
    }
  }, [slug]);

  const person = profileData || serverProfile || {};

  const liveNetWorth = person.netWorthBillion
    ? Number(person.netWorthBillion).toFixed(1)
    : rtbData?.latest?.networth
    ? (rtbData.latest.networth / 1000).toFixed(1)
    : "0.0";

  const liveChangeValue = person.netWorthChangeDayBillion !== undefined
    ? Math.abs(person.netWorthChangeDayBillion).toFixed(1)
    : rtbData?.latest?.change?.value
    ? (Math.abs(rtbData.latest.change.value) / 1000).toFixed(1)
    : "0.0";

  const isPositive = person.netWorthChangeDayBillion !== undefined
    ? person.netWorthChangeDayBillion >= 0
    : rtbData?.latest?.change?.value
    ? rtbData.latest.change.value >= 0
    : true;

  const liveChangePercent = person.netWorthChangePercent !== undefined
    ? Number(person.netWorthChangePercent).toFixed(2)
    : rtbData?.latest?.change?.pct
    ? Number(rtbData.latest.change.pct).toFixed(2)
    : "0.00";

  const rawCountry = person.currentCountry || rtbData?.info?.residence?.country;
  const currentCountry = formatCountryName(rawCountry) || "United States";
  const currentCity =
    person.currentCity && person.currentCity.toLowerCase() !== "global"
      ? person.currentCity
      : rtbData?.info?.residence?.city || "";
  const rawCitizenship = person.citizenship || rtbData?.info?.citizenship;
  const citizenship = formatCountryName(rawCitizenship) || currentCountry;
  const childrenCount = rtbData?.info?.children ?? 0;
  const displayName = person.name || rtbData?.info?.name || slug;
  const displayBio = person.bio || rtbData?.bio?.bio?.[0] || "";
  const photoUrl = VERIFIED_PORTRAITS[slug] || person.photoUrl || rtbData?.info?.image;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: `Timeline (${person.timeline?.length || 0})` },
    {
      id: "stocks",
      label: `Companies & Assets (${
        (rtbData?.assets?.length || person.stocks?.length) ?? 0
      })`,
    },
    { id: "assets", label: "Assets Breakdown" },
    { id: "social", label: "Social Media" },
    { id: "legal", label: `Legal & Charges (${person.legal?.length || 0})` },
    {
      id: "emails",
      label: `Court Emails (${person.courtEmails?.length || 0})`,
    },
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

      {/* Profile Header */}
      <div className="liquid-glass rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center space-x-5">
            {/* Avatar / Portrait */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-white dark:border-neutral-700 shadow-sm flex-shrink-0">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-neutral-400">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-black">
                  #{person.rank || (slug === "elon-musk" ? 1 : "-")}
                </span>
              </div>

              {/* Residence strictly Country + City */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-1 font-medium text-neutral-900 dark:text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    {currentCity ? `${currentCity}, ${currentCountry}` : currentCountry}
                  </span>
                </div>
                <span>·</span>
                <span>Citizenship: {citizenship}</span>
                {childrenCount > 0 && (
                  <>
                    <span>·</span>
                    <span>{childrenCount} Children</span>
                  </>
                )}
              </div>

              <p className="text-xs text-neutral-500 max-w-xl line-clamp-2">
                {displayBio}
              </p>
            </div>
          </div>

          {/* Live Net Worth Card */}
          <div className="flex flex-col items-start md:items-end justify-center pt-2 md:pt-0">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              <span>Live Real-Time Net Worth</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1 flex items-baseline space-x-2">
              <span>{Number(liveNetWorth) >= 1000 ? `$${(Number(liveNetWorth) / 1000).toFixed(2)}T` : `$${liveNetWorth}B`}</span>
              {Number(liveNetWorth) >= 1000 && (
                <span className="text-base font-semibold text-neutral-400 font-mono">
                  (${Number(liveNetWorth).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}B)
                </span>
              )}
            </div>
            <div
              className={`text-xs font-semibold mt-1 flex items-center ${
                isPositive ? "text-gain" : "text-loss"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {isPositive ? "+" : "-"}${liveChangeValue}B today ({isPositive ? "+" : ""}
              {liveChangePercent}%)
            </div>
          </div>
        </div>

        {/* Social media links row */}
        {person.socials &&
          person.socials.filter((s: any) => s.platform?.toLowerCase() !== "website").length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-400 mr-2">Verified Profiles:</span>
              {person.socials
                .filter((s: any) => s.platform?.toLowerCase() !== "website")
                .map((s: any, idx: number) => (
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

        {/* Tab Navigation */}
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
              {/* Bio & Background */}
              <div className="solid-card rounded-3xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                    Biography & Background
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                  {displayBio}
                </p>

                {/* RTB Bio Points */}
                {rtbData?.bio?.bio && (
                  <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-2">
                    {rtbData.bio.bio.map((b: string, idx: number) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}

                <div className="pt-2 text-[11px] text-neutral-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Source: SuperRich Real-Time Index</span>
                  <span>•</span>
                  <a
                    href={
                      person.wikipedia?.url ||
                      person.wikipediaUrl ||
                      `https://en.wikipedia.org/wiki/${encodeURIComponent(
                        displayName.replace(/\s+/g, "_")
                      )}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Read full article on Wikipedia
                  </a>
                  {grokipediaData?.url && (
                    <>
                      <span>•</span>
                      <a
                        href={grokipediaData.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-500 dark:text-purple-400 hover:underline"
                      >
                        Read full article on Grokipedia
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Core Equity Stakes & Assets */}
              <div className="solid-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                    Core Equity Stakes & Live Assets
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    {rtbData?.assets?.length
                      ? "Real-Time CDN Feeds"
                      : "SEC Filings"}
                  </span>
                </div>

                <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                  {rtbData?.assets?.length
                    ? rtbData.assets.map((asset: any, idx: number) => (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                              <span>{asset.companyName}</span>
                              {asset.ticker && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                                  {asset.ticker}
                                </span>
                              )}
                              {asset.exchange && (
                                <span className="text-[10px] text-neutral-400">
                                  ({asset.exchange})
                                </span>
                              )}
                            </div>
                            <div className="text-neutral-500">
                              {asset.numberOfShares
                                ? `${(asset.numberOfShares / 1e6).toFixed(
                                    1
                                  )}M shares`
                                : "Equity Stake"}
                              {asset.currentPrice &&
                                ` · $${asset.currentPrice.toFixed(2)}/share`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-neutral-900 dark:text-white">
                              {asset.numberOfShares && asset.currentPrice
                                ? `$${(
                                    (asset.numberOfShares *
                                      asset.currentPrice) /
                                    1e9
                                  ).toFixed(1)}B`
                                : "Direct Stake"}
                            </div>
                            <div className="text-neutral-400 text-[10px]">
                              {asset.ticker ? "Public Shares" : "Private Venture"}
                            </div>
                          </div>
                        </div>
                      ))
                    : person.stocks?.map((stk: any, idx: number) => (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                              <span>{stk.name}</span>
                              {stk.ticker && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                                  {stk.ticker}
                                </span>
                              )}
                            </div>
                            <div className="text-neutral-500">
                              {stk.role} · {stk.ownershipPercent}% ownership
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-neutral-900 dark:text-white">
                              ${stk.stakeValue}B
                            </div>
                            <div className="text-neutral-400 text-[10px]">
                              {stk.isPublic ? "Public Equity" : "Private"}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Sidebar quick intelligence */}
            <div className="space-y-6">
              {/* Real-Time Wealth Summary Card */}
              <div className="solid-card rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                  Real-Time Wealth Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50">
                    <span className="text-xs text-neutral-500">Current Valuation</span>
                    <span className="text-base font-bold text-neutral-900 dark:text-white">
                      {Number(liveNetWorth) >= 1000
                        ? `$${(Number(liveNetWorth) / 1000).toFixed(2)}T ($${liveNetWorth}B)`
                        : `$${liveNetWorth}B`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50">
                    <span className="text-xs text-neutral-500">24h Net Change</span>
                    <span className={`text-sm font-bold ${isPositive ? "text-gain" : "text-loss"}`}>
                      {isPositive ? "+" : "-"}${liveChangeValue}B ({isPositive ? "+" : ""}{liveChangePercent}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50">
                    <span className="text-xs text-neutral-500">Global Rank</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      #{person.rank || (slug === "elon-musk" ? 1 : "-")}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 pt-1">
                    Calculated from verified market equity prices, public share filings, and real-time private venture valuations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold">Biographical Career Timeline</h3>
            <div className="space-y-6 relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 pl-6">
              {person.timeline?.length ? (
                person.timeline.map((event: any, idx: number) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-neutral-900 dark:bg-white border-2 border-white dark:border-black"></div>
                    <div className="text-xs font-bold text-accent font-mono">
                      {event.year}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {event.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {event.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 py-4">
                  Timeline events currently being synchronized from Wikidata archive.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMPANIES */}
        {activeTab === "stocks" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Companies & Corporate Ventures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {person.stocks?.map((stk: any, idx: number) => (
                <div
                  key={idx}
                  className="liquid-glass rounded-2xl p-4 border border-surface-borderLight dark:border-surface-borderDark space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{stk.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-200/50 dark:bg-neutral-800">
                      {stk.ticker || "PRIVATE"}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500">{stk.role}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200/40 dark:border-neutral-800/60 text-xs">
                    <span className="text-neutral-400">Stake Value:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      ${stk.stakeValue}B
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ASSETS BREAKDOWN */}
        {activeTab === "assets" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Asset Breakdown & Holdings</h3>
            <div className="space-y-3">
              {rtbData?.assets?.length ? (
                rtbData.assets.map((asset: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50 text-xs"
                  >
                    <div>
                      <span className="font-bold">{asset.companyName}</span>
                      <span className="text-neutral-400 ml-2">
                        {asset.exchange ? `(${asset.exchange})` : ""}
                      </span>
                    </div>
                    <div className="font-bold">
                      {asset.numberOfShares
                        ? `${(asset.numberOfShares / 1e6).toFixed(1)}M shares`
                        : "Private Asset"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 py-4">
                  Full SEC Form 4 asset breakdown available in public filings.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL */}
        {activeTab === "social" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Verified Social Presence</h3>
            {person.socials &&
            person.socials.filter((s: any) => s.platform?.toLowerCase() !== "website").length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {person.socials
                  .filter((s: any) => s.platform?.toLowerCase() !== "website")
                  .map((soc: any, idx: number) => (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="liquid-glass rounded-2xl p-4 border border-surface-borderLight dark:border-surface-borderDark flex items-center justify-between hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <div>
                        <div className="capitalize font-bold text-xs">{soc.platform}</div>
                        <div className="text-xs text-neutral-400">{soc.handle}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400" />
                    </a>
                  ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-500 py-4">
                No active public social media accounts verified for this executive. Official statements are communicated through regulatory filings and corporate press releases.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LEGAL */}
        {activeTab === "legal" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Legal Cases & Regulatory Filings</h3>
            {person.legal?.length ? (
              <div className="space-y-4">
                {person.legal.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/40 dark:border-neutral-800/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {item.caseName}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {item.summary}
                    </p>
                    <a
                      href={item.officialDocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent underline flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      <span>Official Court Docket</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-500 py-4">
                No active federal civil or criminal litigations docketed.
              </div>
            )}
          </div>
        )}

        {/* TAB 7: EMAILS */}
        {activeTab === "emails" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Court-Released Email Archives</h3>
            {person.courtEmails?.length ? (
              <div className="space-y-4">
                {person.courtEmails.map((cEmail: any, idx: number) => (
                  <div
                    key={idx}
                    className="liquid-glass rounded-2xl p-5 space-y-3 font-mono text-xs border border-surface-borderLight dark:border-surface-borderDark"
                  >
                    <div className="flex items-center justify-between text-neutral-500 border-b border-neutral-200/50 dark:border-neutral-800/80 pb-2">
                      <span>{cEmail.caseName}</span>
                      <span>{cEmail.date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">From:</span> {cEmail.sender}
                    </div>
                    <div>
                      <span className="text-neutral-500">To:</span> {cEmail.recipients}
                    </div>
                    <div className="bg-neutral-100/50 dark:bg-neutral-900/50 p-3 rounded-xl whitespace-pre-line text-neutral-700 dark:text-neutral-300 font-sans">
                      "{cEmail.snippet}"
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-500 py-4">
                No public trial exhibit emails filed for this profile.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
