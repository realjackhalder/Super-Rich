import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { SmartBackButton } from "@/components/SmartBackButton";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) — SuperRich",
  description: "Common questions regarding real-time wealth calculations, prediction market consensus, and municipal residence indexing.",
};

const FAQS = [
  {
    q: "How is real-time net worth calculated?",
    a: "SuperRich combines verified insider shareholdings from official SEC Form 4 filings with live market exchange tickers (NASDAQ/NYSE/OTC). For private companies (like SpaceX or xAI), valuations are adjusted based on the latest confirmed venture capital funding round.",
  },
  {
    q: "Why do you only list municipal residences (Country + City)?",
    a: "For the safety, physical security, and legal privacy of indexed individuals and their families, SuperRich strictly adheres to municipality-level reporting (e.g. 'Austin, Texas' or 'Lanai, Hawaii'). Street addresses, property maps, and GPS coordinates are never collected.",
  },
  {
    q: "How does Polymarket & Kalshi fact-checking work?",
    a: "Prediction market event contracts have legally binding resolution criteria determined by independent reporting sources. When an event resolves (such as a merger closure or CEO appointment), our system checks the resolution against timeline events to assign 'Verified' confidence badges.",
  },
  {
    q: "Where do the public contact emails and court emails come from?",
    a: "Contact emails are sourced from public corporate press releases and verified investor relations pages. Court emails are public trial exhibits submitted in open federal or state litigation (such as Delaware Chancery Court filings) with personal contact details of third parties redacted.",
  },
  {
    q: "Is the SuperRich API free to use?",
    a: "Yes. Our REST API is completely free for developers, educators, and research platforms with a generous daily rate limit of 1,000 requests per day. No credit card or paid subscription is required.",
  },
  {
    q: "How often is data refreshed?",
    a: "Public equity prices and top rankings update continuously every minute during market hours. Biographical timelines, legal dockets, and RTB CDN assets sync on a continuous daily schedule.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <SmartBackButton fallbackLabel="Back to Global Index" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Everything you need to know about our data architecture, estimation models, and privacy protocols.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((item, idx) => (
          <div key={idx} className="solid-card rounded-3xl p-6 space-y-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <span className="text-accent font-mono text-sm">0{idx + 1}.</span>
              <span>{item.q}</span>
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pl-6">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div className="liquid-glass rounded-3xl p-6 text-center space-y-2 border border-apple-borderLight dark:border-apple-borderDark">
        <h3 className="text-sm font-bold">Have another question or correction?</h3>
        <p className="text-xs text-neutral-500">
          Review our <Link href="/legal" className="underline text-accent">Legal Notice</Link> or submit an inquiry through our public GitHub repository.
        </p>
      </div>
    </div>
  );
}
