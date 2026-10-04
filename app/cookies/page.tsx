import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — SuperRich",
  description: "Privacy-first cookie and local storage disclosure for SuperRich.",
};

export default function CookiesPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Cookie Policy</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          SuperRich is built with a privacy-first architecture. We do not use third-party advertising trackers or invasive behavioral cookies.
        </p>
      </div>

      <div className="solid-card rounded-3xl p-8 space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-accent font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Third-Party Advertising Trackers</span>
          </div>
          <p>
            Unlike conventional finance portals, SuperRich does not load third-party ad networks, marketing pixels, or invasive cross-site tracking scripts. Your browsing activity across our index remains private.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            What Data We Store Locally
          </h2>
          <p>
            SuperRich utilizes minimal, strictly essential client-side storage technologies:
          </p>
          <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
            <div className="py-3 flex items-start justify-between">
              <div>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">theme</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">LocalStorage</p>
              </div>
              <div className="text-right text-neutral-500">
                Remembers your choice of Light or Dark Apple Liquid Glass mode across sessions.
              </div>
            </div>

            <div className="py-3 flex items-start justify-between">
              <div>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">superrich_admin_session</span>
                <p className="text-[11px] text-neutral-500 mt-0.5">HTTP-Only Cookie</p>
              </div>
              <div className="text-right text-neutral-500">
                Encrypted authentication token used exclusively when signing into the internal administrator review panel.
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Managing Your Preferences
          </h2>
          <p>
            You can configure your browser to block or delete local storage and cookies at any time. The public index and profile pages will continue to function seamlessly without interruption.
          </p>
        </section>
      </div>
    </div>
  );
}
