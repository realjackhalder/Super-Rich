import Link from "next/link";
import { Code, ArrowLeft, Terminal, CheckCircle2, Zap } from "lucide-react";

export const metadata = {
  title: "API Overview & Documentation — SuperRich",
  description: "Comprehensive REST API documentation for real-time billionaire rankings, historical assets, and biographical timelines.",
};

export default function DocsPage() {
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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs liquid-glass text-accent">
          <Zap className="w-3.5 h-3.5" />
          <span>v1.0 Public REST API</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">API Overview</h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          Programmatic access to real-time wealth indices, historical assets, municipal residences, and sourced milestone timelines. Free for developers, students, and research tools.
        </p>
      </div>

      {/* Quick Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass rounded-2xl p-4 text-center">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Authentication</div>
          <div className="text-lg font-bold mt-1">None Required</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Open public endpoints</div>
        </div>
        <div className="liquid-glass rounded-2xl p-4 text-center">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Rate Limit</div>
          <div className="text-lg font-bold mt-1">1,000 req / day</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">30 requests per minute</div>
        </div>
        <div className="liquid-glass rounded-2xl p-4 text-center">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Data Format</div>
          <div className="text-lg font-bold mt-1">JSON / UTF-8</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">CORS-enabled globally</div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Endpoints</h2>

        {/* Endpoint 1 */}
        <div className="solid-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">GET</span>
              <span className="font-mono text-sm font-semibold">/api/v1/rankings</span>
            </div>
            <span className="text-xs text-neutral-500">Live Top 50 Index</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Returns real-time wealth rankings, municipal residences, 24h market value fluctuations, and primary corporate affiliations.
          </p>
          <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
            curl https://superrich.tech/api/v1/rankings?country=United%20States
          </div>
        </div>

        {/* Endpoint 2 */}
        <div className="solid-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">GET</span>
              <span className="font-mono text-sm font-semibold">/api/v1/people/:slug</span>
            </div>
            <span className="text-xs text-neutral-500">Full Profile Data</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Retrieves comprehensive biographical timeline, verified public social handles, corporate holdings, court exhibits, and legal dockets.
          </p>
          <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
            curl https://superrich.tech/api/v1/people/elon-musk
          </div>
        </div>

        {/* Endpoint 3 */}
        <div className="solid-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">GET</span>
              <span className="font-mono text-sm font-semibold">/api/rtb/profile/:uri</span>
            </div>
            <span className="text-xs text-neutral-500">Real-Time CDN Feeds</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Proxies live asset portfolios, exchange ticker prices, and historical annual valuation reports from the Real-Time Billionaires API CDN.
          </p>
          <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
            curl https://superrich.tech/api/rtb/profile/larry-ellison
          </div>
        </div>

        {/* Endpoint 4 */}
        <div className="solid-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">GET</span>
              <span className="font-mono text-sm font-semibold">/api/grokipedia/:slug</span>
            </div>
            <span className="text-xs text-neutral-500">Grokipedia Articles</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Extracts full-text articles and citation references from xAI Grokipedia knowledge base.
          </p>
          <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
            curl https://superrich.tech/api/grokipedia/Mark_Zuckerberg
          </div>
        </div>
      </div>

      {/* Code Integration Example */}
      <div className="solid-card rounded-3xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">Code Example (JavaScript / TypeScript)</h2>
        <div className="liquid-glass rounded-2xl p-5 font-mono text-xs text-neutral-800 dark:text-neutral-200 overflow-x-auto">
          <pre>{`// Fetch real-time wealth index
async function getTopTechBillionaires() {
  const response = await fetch("https://superrich.tech/api/v1/rankings");
  const result = await response.json();
  
  if (result.status === "success") {
    result.data.forEach((person) => {
      console.log(\`#\${person.rank}: \${person.name} - $\${person.net_worth_billion}B\`);
    });
  }
}

getTopTechBillionaires();`}</pre>
        </div>
      </div>
    </div>
  );
}
