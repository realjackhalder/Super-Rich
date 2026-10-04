import Link from "next/link";
import { ShieldCheck, Database, Globe, Scale, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About SuperRich — Methodology & Architecture",
  description: "Learn about SuperRich's mission, open data methodology, and privacy-first indexing of tech billionaires.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Global Index</span>
        </Link>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">About SuperRich</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          SuperRich is an independent, open-data index and historical encyclopedia tracking the world’s top tech entrepreneurs from childhood milestones to real-time equity valuations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="solid-card rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-accent">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold">Open-Source & Multi-Source Indexing</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Unlike closed paywalled ranking platforms, SuperRich aggregates data through community-maintained CDNs (including komed3/rtb-api), official SEC EDGAR insider disclosures, CourtListener docket exhibits, xAI Grokipedia, and Wikidata.
          </p>
        </div>

        <div className="solid-card rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-accent">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold">Strictly Neutral Reporting</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            All legal actions and controversies cataloged on SuperRich cite formal court dockets and regulatory press releases. We maintain rigorous editorial objectivity without political bias or sensationalism.
          </p>
        </div>
      </div>

      <div className="solid-card rounded-3xl p-8 space-y-6">
        <h2 className="text-2xl font-bold">Valuation Methodology</h2>
        <div className="space-y-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p>
            SuperRich calculates real-time wealth using a multi-factor formula:
          </p>
          <div className="liquid-glass rounded-2xl p-4 font-mono text-xs text-neutral-900 dark:text-white border border-apple-borderLight dark:border-apple-borderDark">
            Net Worth = Σ(Verified Public Shares × Live Exchange Ticker) + Σ(Private Equity Stake % × Audited Valuation Round) + Disclosed Liquid Holdings − Documented Liabilities
          </div>
          <p>
            Valuations for publicly listed companies (such as Tesla, Meta, Oracle, NVIDIA, and Amazon) update continuously during active exchange market hours. Private ventures (such as SpaceX, xAI, ByteDance, and Stripe) reflect the most recently confirmed equity financing round.
          </p>
        </div>

        <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/80">
          <h3 className="text-base font-bold mb-2">Municipal Residence & Privacy Standards</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            In compliance with global safety standards and privacy legislation, SuperRich strictly indexes residences at the <strong>municipality and country level</strong> (e.g. <em>Austin, Texas</em> or <em>Singapore</em>). Specific neighborhood street addresses, cadastral parcel maps, and residential GPS coordinates are permanently prohibited from our databases.
          </p>
        </div>
      </div>
    </div>
  );
}
