import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — SuperRich Legal",
  description: "Official privacy policy and transparent data practices for SuperRich.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          SuperRich is designed with a strict privacy-first foundation. We respect your rights and protect your personal information.
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
            className="px-3.5 py-1.5 rounded-full text-xs font-medium liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/cookies"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Cookie Policy
          </Link>
          <Link
            href="/legal/privacy"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black shadow-sm"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="solid-card rounded-3xl p-8 space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-accent font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Information We Collect</span>
          </div>
          <p>
            SuperRich does not require user registration or personal account creation to explore our wealth rankings, company dossiers, or public executive disclosures. We do not collect names, home addresses, phone numbers, or credit card information from general visitors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Cookies and Client-Side Storage
          </h2>
          <p>
            We only utilize necessary local browser storage to retain theme preferences (Dark vs. Light mode), view layouts, and privacy consent decisions. We do not use third-party behavioral advertising trackers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Security and Protection
          </h2>
          <p>
            All network traffic to SuperRich is encrypted using modern TLS (HTTPS) standards. Edge caching and Cloudflare Turnstile protection ensure security against automated abuse.
          </p>
        </section>
      </div>
    </div>
  );
}
