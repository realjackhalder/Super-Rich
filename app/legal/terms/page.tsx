import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SmartBackButton } from "@/components/SmartBackButton";

export const metadata = {
  title: "Terms of Service — SuperRich Legal",
  description: "Terms and conditions governing the use of the SuperRich web application and public REST APIs.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <SmartBackButton fallbackLabel="Back to Global Index" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Last updated: October 2026. Please read these terms carefully before utilizing our platform or API.
        </p>

        {/* Legal Hub Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-neutral-200/60 dark:border-neutral-800/80 pb-3">
          <Link
            href="/legal"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Legal Notice &amp; Disclaimers
          </Link>
          <Link
            href="/legal/terms"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black shadow-sm"
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/cookies"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Cookie Policy
          </Link>
        </div>
      </div>

      <div className="solid-card rounded-3xl p-8 space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using SuperRich (including superrich.tech, associated subdomains, and public API endpoints), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            2. Permitted Use &amp; API Attribution
          </h2>
          <p>
            You are granted a worldwide, non-exclusive license to view web content and query our free public API endpoints for personal, educational, research, and non-commercial developmental purposes.
          </p>
          <p>
            Any application, website, or research tool integrating data from SuperRich must provide clear attribution stating <strong>&quot;Data provided by SuperRich.tech&quot;</strong> with a direct hyperlink back to the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            3. Prohibited Activities
          </h2>
          <p>
            When utilizing SuperRich, you agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Attempt to bypass rate limits or conduct denial-of-service attacks on our API.</li>
            <li>Use the platform to dox, harass, stalk, or locate physical coordinates of indexed individuals.</li>
            <li>Resell raw stock quote data in violation of upstream financial data provider licensing terms.</li>
            <li>Misrepresent automated estimations as certified or audited financial statements.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall SuperRich, its contributors, or maintainers be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use the platform or reliance on published valuations.
          </p>
        </section>
      </div>
    </div>
  );
}
