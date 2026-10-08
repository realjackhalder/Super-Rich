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
  CheckCircle2,
  Globe,
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
    fetch(`/api/people/${slug}`)
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

  const grokipediaNormalizedSlug = (person.name || displayName || slug)
    .replace(/\s*&\s*family/gi, "")
    .replace(/\s*and\s*family/gi, "")
    .replace(/\s*\(.*?\)/g, "")
    .replace(/[&]/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => (w.length >= 2 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("_");

  const grokipediaUrl =
    grokipediaData?.url ||
    person.grokipedia?.url ||
    `https://grokipedia.com/page/${encodeURIComponent(grokipediaNormalizedSlug)}`;

  const wikipediaUrl =
    person.wikipedia?.url ||
    person.wikipediaUrl ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(
      (person.name || displayName || slug)
        .replace(/\s*&\s*family/gi, "")
        .replace(/\s*and\s*family/gi, "")
        .replace(/\s+/g, "_")
    )}`;

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
    { id: "social", label: `Social Media (${person.socials?.length || 0})` },
    { id: "legal", label: `Legal Cases (${person.legal?.length || 0})` },
    {
      id: "emails",
      label: `Court & Public Emails (${(person.courtEmails?.length || 0) + (person.contactEmails?.length || 0)})`,
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

        {/* Social media & Knowledge Graph row */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          {person.socials && person.socials.length > 0 && (
            <span className="text-xs text-neutral-400 mr-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Verified:</span>
            </span>
          )}

          {person.socials?.map((s: any, idx: number) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="liquid-glass px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1.5 transition-colors border border-neutral-200/80 dark:border-neutral-700/80"
            >
              <span className="font-bold text-neutral-900 dark:text-white capitalize">
                {s.platform === "x" ? "𝕏" : s.platform}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 font-normal">{s.handle}</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          ))}

          {/* Read on Grokipedia Chip */}
          <a
            href={grokipediaUrl}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass px-3 py-1 rounded-full text-xs font-semibold hover:bg-purple-500/15 dark:hover:bg-purple-900/40 flex items-center space-x-1.5 transition-all border border-purple-500/40 text-purple-600 dark:text-purple-300 shadow-sm group"
            title="Read AI-verified intelligence dossier on xAI Grokipedia"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform" />
            <span>Read on Grokipedia</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Wikipedia Chip */}
          <a
            href={wikipediaUrl}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1.5 transition-colors border border-neutral-200/80 dark:border-neutral-700/80 text-blue-600 dark:text-blue-400"
            title="Read open biographical article on Wikipedia"
          >
            <span className="font-bold font-serif text-xs">W</span>
            <span>Wikipedia</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

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
                  <a
                    href={grokipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/20 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>xAI Grokipedia Enriched</span>
                  </a>
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

                <div className="pt-2 text-[11px] text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span>Source: SuperRich Real-Time Index</span>
                  <span>•</span>
                  <a
                    href={wikipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Read full article on Wikipedia</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                  <span>•</span>
                  <a
                    href={grokipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 dark:text-purple-400 font-semibold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Read on Grokipedia</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* xAI Grokipedia Intelligence Dossier */}
              <div className="solid-card rounded-3xl p-6 space-y-3 border border-purple-500/25 bg-gradient-to-br from-purple-500/5 via-purple-500/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        xAI Grokipedia Intelligence Dossier
                      </h4>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Autonomous verified knowledge graph (grokipedia.com)
                      </p>
                    </div>
                  </div>
                  <a
                    href={grokipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <span>Read on Grokipedia</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                  {grokipediaData?.summary ||
                    person.grokipediaSummary ||
                    grokipediaData?.description ||
                    `${displayName} is indexed on xAI Grokipedia with verified corporate filings, cross-referenced real-time wealth indices, and primary source citations.`}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400 border-t border-purple-500/15">
                  <span>
                    {grokipediaData?.referencesCount
                      ? `${grokipediaData.referencesCount} verified source citations`
                      : "Multi-source citation verification"}
                  </span>
                  <a
                    href={grokipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 dark:text-purple-400 font-medium hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Open full dossier on grokipedia.com</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
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
          <div className="solid-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Biographical Career Timeline & Major Milestones</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Verified childhood milestones, company foundings, initial public offerings (IPOs), and executive leadership transitions.
              </p>
            </div>

            <div className="space-y-8 relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 pl-6 pt-2">
              {person.timeline?.length ? (
                person.timeline.map((event: any, idx: number) => (
                  <div key={idx} className="relative space-y-1.5 group">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white dark:border-black group-hover:scale-125 transition-transform"></div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-accent font-mono px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                        {event.year}
                      </span>
                      {event.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700/80">
                          {event.category}
                        </span>
                      )}
                      {event.status && (
                        <span className="text-[10px] font-semibold text-gain flex items-center space-x-0.5">
                          <CheckCircle2 className="w-3 h-3 inline mr-0.5" />
                          <span>{event.status}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                      {event.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                      {event.description}
                    </p>
                    {event.sources && event.sources.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-neutral-400">
                        <span>Source:</span>
                        {event.sources.map((s: any, sIdx: number) => (
                          <a
                            key={sIdx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-500 hover:text-black dark:hover:text-white underline inline-flex items-center space-x-0.5"
                          >
                            <span>{s.publisher || "Documentation"}</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    )}
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
          <div className="solid-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-sans text-neutral-900 dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Verified Public Social Presence & Official Channels</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Official authenticated social handles, verified personal newsletters, and executive communication platforms.
              </p>
            </div>

            {person.socials && person.socials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {person.socials.map((soc: any, idx: number) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="liquid-glass rounded-2xl p-5 border border-surface-borderLight dark:border-surface-borderDark flex flex-col justify-between space-y-3 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="capitalize font-bold text-sm text-neutral-900 dark:text-white">
                            {soc.platform === "x" ? "𝕏 (Twitter)" : soc.platform}
                          </span>
                          {soc.verified && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/15 text-accent">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300">
                          {soc.handle}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    {(soc.followerCount || soc.note) && (
                      <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/80 space-y-1">
                        {soc.followerCount && (
                          <div className="text-[11px] font-mono font-bold text-gain">
                            {soc.followerCount} Followers
                          </div>
                        )}
                        {soc.note && (
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                            {soc.note}
                          </div>
                        )}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl font-sans">
                <Globe className="w-7 h-7 text-neutral-400 mx-auto" />
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  No Active Personal Social Accounts
                </div>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  No active personal social media accounts verified for this individual. Official updates are communicated through company disclosures and regulatory filings.
                </p>
              </div>
            )}

            {/* Official Knowledge Graphs & AI Dossiers */}
            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
              <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                Official Knowledge Graphs & Dossiers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={grokipediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass rounded-2xl p-4 border border-purple-500/30 hover:border-purple-500/60 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        xAI Grokipedia
                      </div>
                      <div className="text-xs text-neutral-500">
                        AI-verified intelligence dossier
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <span>Read on Grokipedia</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>

                <a
                  href={wikipediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass rounded-2xl p-4 border border-blue-500/30 hover:border-blue-500/60 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400 font-serif font-bold text-lg">
                      W
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        Wikipedia
                      </div>
                      <div className="text-xs text-neutral-500">
                        Open biographical encyclopedia
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Read on Wikipedia</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </div>
            </div>
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
          <div className="space-y-6">
            {/* Section A: Court-Released Trial Exhibits */}
            <div className="solid-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-sans text-neutral-900 dark:text-white flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>Court-Released Email Archives (Federal & State Dockets)</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Public trial exhibits, discovery deposition filings, and subpoenaed communications unsealed by federal and Delaware Chancery courts.
                </p>
              </div>

              {person.courtEmails?.length ? (
                <div className="space-y-4">
                  {person.courtEmails.map((cEmail: any, idx: number) => (
                    <div
                      key={idx}
                      className="liquid-glass rounded-2xl p-5 sm:p-6 space-y-3.5 border border-surface-borderLight dark:border-surface-borderDark shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 dark:border-neutral-800/80 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                            {cEmail.exhibitNumber || "Trial Exhibit"}
                          </span>
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            {cEmail.caseName}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          {cEmail.date}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-neutral-400 min-w-[48px]">From:</span>
                          <span className="font-semibold text-neutral-900 dark:text-white select-all">{cEmail.sender}</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-neutral-400 min-w-[48px]">To:</span>
                          <span className="text-neutral-700 dark:text-neutral-300 select-all">{cEmail.recipients}</span>
                        </div>
                        {cEmail.subject && (
                          <div className="flex items-baseline space-x-2 pt-0.5">
                            <span className="text-neutral-400 min-w-[48px]">Subject:</span>
                            <span className="font-bold text-neutral-900 dark:text-white font-sans">{cEmail.subject}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-neutral-100/70 dark:bg-[#1a1a1e] p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800 text-xs sm:text-sm font-sans leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line italic">
                        "{cEmail.snippet}"
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">Status: Public Judicial Record</span>
                        <a
                          href={cEmail.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline inline-flex items-center space-x-1 font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Official Court Docket</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl font-sans">
                  <Mail className="w-7 h-7 text-neutral-400 mx-auto" />
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    No Public Trial Exhibit Emails Docketed
                  </div>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    No unsealed court trial exhibits or email depositions on record for this individual across federal or state dockets.
                  </p>
                </div>
              )}
            </div>

            {/* Section B: Public Corporate & Investor Relations Emails */}
            {person.contactEmails && person.contactEmails.length > 0 && (
              <div className="solid-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-sans text-neutral-900 dark:text-white flex items-center space-x-2">
                    <Building className="w-5 h-5 text-accent" />
                    <span>Public Corporate & Investor Relations Inboxes</span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Verified public corporate media points of contact, investor relations inboxes, and executive foundation addresses.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                  {person.contactEmails.map((em: any, idx: number) => (
                    <div
                      key={idx}
                      className="liquid-glass rounded-2xl p-4 space-y-2 border border-surface-borderLight dark:border-surface-borderDark flex flex-col justify-between shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-accent tracking-wider font-mono">
                          {em.department.replace("_", " ")}
                        </div>
                        <div className="font-mono text-xs font-semibold select-all text-neutral-900 dark:text-white break-all">
                          {em.email}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="truncate mr-2">{em.source}</span>
                        <a
                          href={`mailto:${em.email}`}
                          className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium hover:underline shrink-0"
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
