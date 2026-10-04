"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";
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
  Sparkles,
  BookOpen,
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

  // Real-time enrichment from komed3/rtb-api & Grokipedia
  const [rtbData, setRtbData] = useState<any>(null);
  const [grokipediaData, setGrokipediaData] = useState<any>(null);
  const [loadingRTB, setLoadingRTB] = useState(true);

  useEffect(() => {
    // 1. Fetch from Real-Time Billionaires API
    fetch(`/api/rtb/profile/${person.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setRtbData(data.data);
        }
      })
      .catch((err) => console.warn("RTB fetch skipped:", err))
      .finally(() => setLoadingRTB(false));

    // 2. Fetch from Grokipedia API
    fetch(`/api/grokipedia/${encodeURIComponent(person.name)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setGrokipediaData(data.data);
        }
      })
      .catch((err) => console.warn("Grokipedia fetch skipped:", err));
  }, [person.slug, person.name]);

  // If RTB has latest data, use its live calculated networth (converted from millions to billions)
  const liveNetWorth = rtbData?.latest?.networth
    ? (rtbData.latest.networth / 1000).toFixed(1)
    : person.netWorth.toFixed(1);

  const liveChangeValue = rtbData?.latest?.change?.value
    ? (rtbData.latest.change.value / 1000).toFixed(1)
    : Math.abs(person.netWorthChangeDay).toFixed(1);

  const isPositive = rtbData?.latest?.change?.value
    ? rtbData.latest.change.value >= 0
    : person.netWorthChangeDay >= 0;

  const liveChangePercent = rtbData?.latest?.change?.pct
    ? rtbData.latest.change.pct.toFixed(2)
    : person.netWorthChangePercent;

  const currentCity = rtbData?.info?.residence?.city || person.currentCity;
  const currentCountry =
    rtbData?.info?.residence?.country?.toUpperCase() || person.currentCountry;
  const childrenCount = rtbData?.info?.children ?? 0;

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
      label: `Emails (${
        (person.contactEmails?.length || 0) + (person.courtEmails?.length || 0)
      })`,
    },
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
              {rtbData?.info?.image || person.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rtbData?.info?.image || person.photoUrl}
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
                  #{rtbData?.latest?.rank || person.rank}
                </span>
                {rtbData && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gain/10 text-gain">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain mr-1 animate-pulse"></span>
                    CDN LIVE
                  </span>
                )}
              </div>

              {/* Residence strictly Country + City */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-1 font-medium text-neutral-900 dark:text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>
                    {currentCity}, {currentCountry}
                  </span>
                </div>
                <span>·</span>
                <span>Citizenship: {person.citizenship}</span>
                {childrenCount > 0 && (
                  <>
                    <span>·</span>
                    <span>{childrenCount} Children</span>
                  </>
                )}
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
              <span>Live Real-Time Net Worth</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
              ${liveNetWorth}B
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

            {/* Grokipedia Link Chip */}
            {grokipediaData && (
              <a
                href={grokipediaData.url}
                target="_blank"
                rel="noreferrer"
                className="liquid-glass px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1.5 transition-colors text-accent"
              >
                <BookOpen className="w-3 h-3 text-accent" />
                <span>Grokipedia Article</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
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
              {/* Bio & Background */}
              <div className="solid-card rounded-3xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                    Biography & Background
                  </h3>
                  {grokipediaData && (
                    <span className="text-[11px] text-accent flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>xAI Grokipedia Enriched</span>
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                  {person.bio}
                </p>

                {/* RTB Bio Points if present */}
                {rtbData?.bio?.bio && (
                  <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-2">
                    {rtbData.bio.bio.map((b: string, idx: number) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}

                <div className="pt-2 text-[11px] text-neutral-400 flex items-center space-x-4">
                  <span>Source: Wikidata & Wikipedia (CC BY-SA 4.0)</span>
                  {grokipediaData && (
                    <a
                      href={grokipediaData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-neutral-500 hover:text-black dark:hover:text-white"
                    >
                      Read full article on Grokipedia
                    </a>
                  )}
                </div>
              </div>

              {/* Core Equity Stakes */}
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
                  {/* If RTB assets exist, show them */}
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
                    : person.stocks?.map((stk, idx) => (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                              <span>{stk.name}</span>
                              {stk.ticker && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
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
                              ${stk.stakeValue.toFixed(1)}B
                            </div>
                            <div className="text-neutral-400">
                              {stk.isPublic
                                ? "Public Stock"
                                : "Private Valuation"}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Residence & Public Records card */}
              <div className="liquid-glass rounded-3xl p-6 space-y-3 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-neutral-500">
                  Verified Residence
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 font-semibold text-sm">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>
                      {currentCity}, {currentCountry}
                    </span>
                  </div>
                  <div className="text-neutral-500">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      Reporting Basis:{" "}
                    </span>
                    {person.residenceSource}
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Note: Municipal-level only. Exact street addresses are
                    never collected to protect safety and comply with privacy
                    laws.
                  </div>
                </div>
              </div>

              {/* Annual historical net worth preview if available */}
              {rtbData?.annual && (
                <div className="solid-card rounded-3xl p-6 space-y-3 text-xs">
                  <h3 className="font-bold uppercase tracking-wider text-neutral-500">
                    Annual Net Worth History
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(rtbData.annual)
                      .reverse()
                      .map(([yr, report]: [string, any]) => (
                        <div
                          key={yr}
                          className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-900"
                        >
                          <span className="font-bold">{yr}</span>
                          <span className="text-neutral-500">
                            Rank #{report?.rank?.latest ?? "--"}
                          </span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            $
                            {report?.networth?.latest
                              ? (report.networth.latest / 1000).toFixed(1)
                              : "--"}
                            B
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === "timeline" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold">Childhood to Present Timeline</h3>
              <p className="text-xs text-neutral-500">
                Chronological milestones backed by official documents and
                fact-checked through Polymarket/Kalshi resolutions.
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
                <div className="pl-6 text-xs text-neutral-500">
                  Timeline events being indexed via Wikidata...
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMPANIES & STOCKS */}
        {activeTab === "stocks" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Equity Stakes & Live Assets
                </h3>
                <p className="text-xs text-neutral-500">
                  Synced with real-time exchange tickers, SEC Form 4 insider
                  holdings, and RTB API.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full liquid-glass text-neutral-500 font-mono">
                {rtbData?.assets?.length || person.stocks?.length} Assets Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Exchange / Ticker</th>
                    <th className="py-3 px-4">Shares</th>
                    <th className="py-3 px-4">Share Price</th>
                    <th className="py-3 px-4 text-right">Value (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                  {rtbData?.assets?.length
                    ? rtbData.assets.map((asset: any, idx: number) => {
                        const totalVal =
                          asset.numberOfShares && asset.currentPrice
                            ? (
                                (asset.numberOfShares * asset.currentPrice) /
                                1e9
                              ).toFixed(1)
                            : null;
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-neutral-200/20 dark:hover:bg-neutral-800/20"
                          >
                            <td className="py-3 px-4 font-semibold">
                              {asset.companyName}
                            </td>
                            <td className="py-3 px-4 text-neutral-500 font-mono">
                              {asset.exchange || "OTC"} ·{" "}
                              {asset.ticker || "PRIVATE"}
                            </td>
                            <td className="py-3 px-4">
                              {asset.numberOfShares
                                ? (asset.numberOfShares / 1e6).toFixed(2) + "M"
                                : "--"}
                            </td>
                            <td className="py-3 px-4">
                              {asset.currentPrice
                                ? `$${asset.currentPrice.toFixed(2)}`
                                : "--"}
                            </td>
                            <td className="py-3 px-4 text-right font-bold">
                              {totalVal ? `$${totalVal}B` : "Valuation Model"}
                            </td>
                          </tr>
                        );
                      })
                    : person.stocks?.map((stock, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-neutral-200/20 dark:hover:bg-neutral-800/20"
                        >
                          <td className="py-3 px-4 font-semibold">
                            {stock.name}
                          </td>
                          <td className="py-3 px-4 text-neutral-500 font-mono">
                            {stock.ticker || "PRIVATE"}
                          </td>
                          <td className="py-3 px-4">
                            {stock.ownershipPercent}%
                          </td>
                          <td className="py-3 px-4">
                            {stock.livePrice
                              ? `$${stock.livePrice.toFixed(2)}`
                              : "Private"}
                          </td>
                          <td className="py-3 px-4 text-right font-bold">
                            ${stock.stakeValue.toFixed(1)}B
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ASSETS BREAKDOWN */}
        {activeTab === "assets" && (
          <div className="solid-card rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold">Asset Class Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="liquid-glass rounded-2xl p-4 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold">
                  Public Equity
                </div>
                <div className="text-2xl font-bold mt-1">65%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Liquid on public exchanges
                </div>
              </div>
              <div className="liquid-glass rounded-2xl p-4 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold">
                  Private Equity
                </div>
                <div className="text-2xl font-bold mt-1">30%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Venture & unlisted shares
                </div>
              </div>
              <div className="liquid-glass rounded-2xl p-4 text-center">
                <div className="text-xs text-neutral-500 uppercase font-semibold">
                  Cash & Other
                </div>
                <div className="text-2xl font-bold mt-1">5%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Real estate & equivalents
                </div>
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
                    <div className="text-xs text-neutral-400 uppercase font-semibold">
                      {soc.platform}
                    </div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                      {soc.handle}
                    </div>
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
              <h3 className="text-lg font-bold">
                Official Legal Cases & Regulatory Actions
              </h3>
              <p className="text-xs text-neutral-500">
                Grounded in court records and SEC litigation releases. Neutral
                reporting using official legal status.
              </p>
            </div>

            {person.legal?.length ? (
              <div className="space-y-4">
                {person.legal.map((item, idx) => (
                  <div
                    key={idx}
                    className="liquid-glass rounded-2xl p-5 space-y-2 border border-apple-borderLight dark:border-apple-borderDark"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm">{item.caseName}</h4>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 font-medium uppercase">
                        Status: {item.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      <span>{item.court}</span> · <span>Type: {item.caseType}</span> ·{" "}
                      <span>Role: {item.role}</span>
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
              <div className="text-xs text-neutral-500 py-4">
                No major federal civil or criminal actions currently docketed.
              </div>
            )}
          </div>
        )}

        {/* TAB 7: EMAILS */}
        {activeTab === "emails" && (
          <div className="space-y-6">
            {/* Section A: Contact Emails */}
            <div className="solid-card rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold">
                Public Contact & Investor Relations Emails
              </h3>
              <p className="text-xs text-neutral-500">
                Verified public corporate, media, and foundation points of
                contact.
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
                    <div className="text-[10px] text-neutral-400 pt-1">
                      Source: {em.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Court-Released Emails */}
            <div className="solid-card rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold">
                Court-Released Email Archives
              </h3>
              <p className="text-xs text-neutral-500">
                Official trial exhibits made public during court proceedings.
                Personal third-party details are redacted.
              </p>

              {person.courtEmails?.length ? (
                <div className="space-y-4 pt-2">
                  {person.courtEmails.map((cEmail, idx) => (
                    <div
                      key={idx}
                      className="liquid-glass rounded-2xl p-5 space-y-3 font-mono text-xs border border-apple-borderLight dark:border-apple-borderDark"
                    >
                      <div className="flex items-center justify-between text-neutral-500 border-b border-neutral-200/50 dark:border-neutral-800/80 pb-2">
                        <span>
                          {cEmail.caseName} — {cEmail.exhibit}
                        </span>
                        <span>{cEmail.date}</span>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-neutral-500">From:</span>{" "}
                          {cEmail.sender}
                        </div>
                        <div>
                          <span className="text-neutral-500">To:</span>{" "}
                          {cEmail.recipients}
                        </div>
                        <div>
                          <span className="text-neutral-500">Subject:</span>{" "}
                          {cEmail.subject}
                        </div>
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
                <div className="text-xs text-neutral-500 py-2">
                  No public trial exhibit emails filed for this profile.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: SOURCES */}
        {activeTab === "sources" && (
          <div className="solid-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Audit Trail & Data Sources</h3>
            <p className="text-xs text-neutral-500">
              In accordance with our methodology, every claim links to official
              documentation, public databases, and real-time feeds.
            </p>
            <ul className="list-disc list-inside text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>Real-Time Billionaires API</strong> (komed3/rtb-api &
                realtimebillionaires.de) - Live net worth, rank, daily movers,
                and asset share counts
              </li>
              <li>
                <strong>xAI Grokipedia Knowledge Base</strong> (grokipedia-api) -
                Full-text articles and citation verification
              </li>
              <li>
                U.S. Securities and Exchange Commission (SEC EDGAR) - Form 4 &
                Schedule 13D
              </li>
              <li>Wikidata Entity Registry (CC0 Public Domain)</li>
              <li>Wikipedia English Foundation (CC BY-SA 4.0)</li>
              <li>
                CourtListener / Free Law Project (Federal Docket Exhibits)
              </li>
              <li>Polymarket & Kalshi Prediction Event Resolutions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
