import Link from "next/link";
import { ArrowLeft, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Legal Notice & Disclaimers — SuperRich",
  description: "Official legal disclaimers, financial disclosure notices, and correction request guidelines for SuperRich.",
};

export default function LegalPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Legal Notice & Disclaimers</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Important disclosures concerning mathematical valuations, third-party public records, and intellectual property.
        </p>
      </div>

      <div className="space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <div className="solid-card rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-loss font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Not Financial or Investment Advice</span>
          </div>
          <p>
            All valuations, rankings, and financial metric calculations published on SuperRich (accessible at superrich.tech) are provided strictly for educational, historical, and informational research purposes. Nothing on this website constitutes financial, legal, tax, or investment advice. SuperRich does not recommend or endorse the buying, selling, or holding of any public equity, venture stake, or asset class.
          </p>
        </div>

        <div className="solid-card rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Estimation Methodology Notice
          </h2>
          <p>
            Because high-net-worth individuals hold diverse private equities, trusts, debt pledges, and illiquid holdings, all net worth calculations represent mathematical estimations based on public sources (including SEC disclosures, Forbes RTB community archives, and audited venture capital rounds). Actual liquidated values may differ significantly.
          </p>
        </div>

        <div className="solid-card rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Court Records and Public Dockets
          </h2>
          <p>
            Information displayed in the Legal and Emails tabs is sourced directly from publicly accessible federal docket registries (such as the Free Law Project / CourtListener) and regulatory press releases. SuperRich adheres to strict legal objectivity: unless a formal criminal conviction or final judicial determination is entered into the record, all proceedings are designated as allegations, civil suits, or settlements.
          </p>
        </div>

        <div className="solid-card rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Corrections & Removal Requests
          </h2>
          <p>
            SuperRich commits to immediate factual corrections. If you represent an indexed individual or organization and identify an out-of-date municipal residence, inaccurate share count, or misstated court record, please submit supporting documentation via our designated public channels or GitHub repository issue tracker.
          </p>
        </div>
      </div>
    </div>
  );
}
