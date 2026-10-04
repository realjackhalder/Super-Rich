import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service — SuperRich",
  description: "Terms and conditions governing the use of the SuperRich web application and public REST APIs.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Last updated: October 2026. Please read these terms carefully before utilizing our platform or API.
        </p>
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
            2. Permitted Use & API Attribution
          </h2>
          <p>
            You are granted a worldwide, non-exclusive license to view web content and query our free public API endpoints for personal, educational, research, and non-commercial developmental purposes.
          </p>
          <p>
            Any application, website, or research tool integrating data from SuperRich must provide clear attribution stating <strong>"Data provided by SuperRich.tech"</strong> with a direct hyperlink back to the platform.
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
