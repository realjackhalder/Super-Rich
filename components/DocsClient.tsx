"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Code,
  Terminal,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Scale,
  Building,
  DollarSign,
  FileText,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export function DocsClient() {
  const [activeTab, setActiveTab] = useState<"quickstart" | "endpoints" | "code" | "methodology">("quickstart");
  const [selectedEndpoint, setSelectedEndpoint] = useState<"rtb_list" | "rtb_profile" | "rankings" | "person">("rtb_list");
  const [codeLang, setCodeLang] = useState<"curl" | "javascript" | "python">("curl");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Back button */}
      <div>
        <a
          href="https://superrich.tech"
          className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Global Index (superrich.tech)</span>
        </a>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs liquid-glass text-accent">
          <BookOpen className="w-3.5 h-3.5" />
          <span>docs.superrich.tech</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          SuperRich Documentation
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Everything you need to query real-time billionaire net worths, verified SEC shareholdings, biographical timelines, and market valuation data via <code className="font-mono text-accent">api.superrich.tech</code>.
        </p>
      </div>

      {/* Global API Spec Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">API Base URL</div>
          <div className="text-sm font-bold font-mono mt-1 text-accent">api.superrich.tech</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">HTTPS Edge distribution</div>
        </div>
        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Access Policy</div>
          <div className="text-sm font-bold mt-1 text-gain">Public Read-Only</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">GET &amp; OPTIONS methods</div>
        </div>
        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Public Rate Limit</div>
          <div className="text-sm font-bold mt-1">60 req / min</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">No auth token required</div>
        </div>
        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Key Tier Limit</div>
          <div className="text-sm font-bold mt-1">500 req / min</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Pass X-API-Key header</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200/60 dark:border-neutral-800/80 pb-3">
        <button
          onClick={() => setActiveTab("quickstart")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "quickstart"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>How to Use the API</span>
        </button>

        <button
          onClick={() => setActiveTab("endpoints")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "endpoints"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Endpoints &amp; Schema</span>
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "code"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Code Examples</span>
        </button>

        <button
          onClick={() => setActiveTab("methodology")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "methodology"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Valuation Methodology</span>
        </button>
      </div>

      {/* TAB 1: HOW TO USE THE API (QUICKSTART) */}
      {activeTab === "quickstart" && (
        <div className="space-y-6">
          <div className="solid-card rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Quickstart Guide</h2>
              <p className="text-xs text-neutral-500">
                Start querying live billionaire wealth data in less than 60 seconds.
              </p>
            </div>

            {/* Step 1 */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center">
                  1
                </span>
                <span>Send your first request to api.superrich.tech</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You can immediately fetch real-time valuations for all 3,400+ billionaires with a simple GET request. No API key is required for initial exploration.
              </p>
              <div className="relative group">
                <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                  curl https://api.superrich.tech/rtb/list
                </div>
                <button
                  onClick={() => copyToClipboard("curl https://api.superrich.tech/rtb/list")}
                  className="absolute right-3 top-3 p-1.5 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-xs flex items-center space-x-1"
                >
                  {copiedText === "curl https://api.superrich.tech/rtb/list" ? (
                    <Check className="w-3.5 h-3.5 text-gain" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/80">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center">
                  2
                </span>
                <span>Inspect the JSON response</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Every response includes rank, name, net worth in millions (USD), and daily percentage changes:
              </p>
              <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                <pre>{`{
  "status": "success",
  "data": {
    "count": 3403,
    "list": [
      {
        "rank": 1,
        "name": "Elon Musk",
        "uri": "elon-musk",
        "networth": 891900.0,
        "change": {
          "value": 18800.0,
          "pct": 2.15,
          "date": "2026-08-31"
        },
        "source": ["Tesla & SpaceX"],
        "industry": ["technology"]
      }
    ]
  }
}`}</pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/80">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center">
                  3
                </span>
                <span>Passing API Keys for High-Throughput Usage</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                While the API is completely open to the public at 60 requests/minute, registered applications can pass an <code className="font-mono text-accent">X-API-Key</code> header to unlock 500 requests/minute:
              </p>
              <div className="relative group">
                <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                  curl -H &quot;X-API-Key: sr_live_948f2c019a84b1e7c390a8f&quot; https://api.superrich.tech/v1/rankings
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'curl -H "X-API-Key: sr_live_948f2c019a84b1e7c390a8f" https://api.superrich.tech/v1/rankings'
                    )
                  }
                  className="absolute right-3 top-3 p-1.5 rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-xs flex items-center space-x-1"
                >
                  {copiedText?.includes("sr_live_") ? (
                    <Check className="w-3.5 h-3.5 text-gain" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENDPOINTS & SCHEMA */}
      {activeTab === "endpoints" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-2 overflow-x-auto">
            <button
              onClick={() => setSelectedEndpoint("rtb_list")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                selectedEndpoint === "rtb_list"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                  : "liquid-glass text-neutral-600 dark:text-neutral-400"
              }`}
            >
              GET /rtb/list
            </button>
            <button
              onClick={() => setSelectedEndpoint("rtb_profile")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                selectedEndpoint === "rtb_profile"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                  : "liquid-glass text-neutral-600 dark:text-neutral-400"
              }`}
            >
              GET /rtb/profile/:slug
            </button>
            <button
              onClick={() => setSelectedEndpoint("rankings")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                selectedEndpoint === "rankings"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                  : "liquid-glass text-neutral-600 dark:text-neutral-400"
              }`}
            >
              GET /v1/rankings
            </button>
            <button
              onClick={() => setSelectedEndpoint("person")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                selectedEndpoint === "person"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                  : "liquid-glass text-neutral-600 dark:text-neutral-400"
              }`}
            >
              GET /v1/people/:slug
            </button>
          </div>

          {selectedEndpoint === "rtb_list" && (
            <div className="solid-card rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">
                  GET
                </span>
                <span className="font-mono text-base font-bold">https://api.superrich.tech/rtb/list</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Returns the full catalog of 3,400+ indexed global billionaires with real-time daily valuation changes, rank shifts, and industry sectors.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold">Response Example:</div>
                <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                  <pre>{`{
  "status": "success",
  "source": "Real-Time Billionaires API CDN",
  "data": {
    "date": "2026-08-31",
    "count": 3403,
    "total": 20430000.0,
    "list": [
      {
        "rank": 1,
        "uri": "elon-musk",
        "name": "Elon Musk",
        "networth": 891900.0,
        "change": { "value": 18800.0, "pct": 2.15, "date": "2026-08-31" },
        "citizenship": "us",
        "industry": ["technology"]
      }
    ]
  }
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {selectedEndpoint === "rtb_profile" && (
            <div className="solid-card rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">
                  GET
                </span>
                <span className="font-mono text-base font-bold">https://api.superrich.tech/rtb/profile/:slug</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Returns deep biographical information, verified stock assets, exchange tickers, share counts, and historical annual net worth tracking.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold">Response Example (Gautam Adani / Larry Ellison):</div>
                <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                  <pre>{`{
  "status": "success",
  "data": {
    "uri": "gautam-adani-1",
    "info": {
      "name": "Gautam Adani",
      "birthDate": "1962-06-24",
      "citizenship": "in",
      "residence": { "country": "in", "city": "Ahmedabad" }
    },
    "latest": {
      "rank": 26,
      "networth": 79493.42,
      "change": { "value": -5599.26, "pct": -6.58 }
    },
    "assets": [
      {
        "companyName": "Adani Enterprises",
        "ticker": "512599-IN",
        "exchange": "BSE INDIA",
        "numberOfShares": 749700000,
        "sharePrice": 29.32
      }
    ]
  }
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {selectedEndpoint === "rankings" && (
            <div className="solid-card rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">
                  GET
                </span>
                <span className="font-mono text-base font-bold">https://api.superrich.tech/v1/rankings</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Structured endpoint supporting query parameters <code className="font-mono text-accent">?country=United%20States</code> and <code className="font-mono text-accent">?limit=25</code>.
              </p>
              <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                curl &quot;https://api.superrich.tech/v1/rankings?country=United%20States&amp;limit=10&quot;
              </div>
            </div>
          )}

          {selectedEndpoint === "person" && (
            <div className="solid-card rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-gain/10 text-gain text-xs font-bold font-mono">
                  GET
                </span>
                <span className="font-mono text-base font-bold">https://api.superrich.tech/v1/people/:slug</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Curated profile dossiers containing verified corporate email contacts, federal court docket citations, and childhood-to-present timeline milestones.
              </p>
              <div className="liquid-glass rounded-2xl p-4 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                curl https://api.superrich.tech/v1/people/elon-musk
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CODE EXAMPLES */}
      {activeTab === "code" && (
        <div className="solid-card rounded-3xl p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Query api.superrich.tech from Your App</h2>
            <div className="flex items-center space-x-1.5 p-1 rounded-full liquid-glass text-xs">
              <button
                onClick={() => setCodeLang("curl")}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  codeLang === "curl"
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setCodeLang("javascript")}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  codeLang === "javascript"
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => setCodeLang("python")}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  codeLang === "python"
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Python
              </button>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-5 font-mono text-xs text-neutral-800 dark:text-neutral-200 overflow-x-auto">
            {codeLang === "curl" && (
              <pre>{`# 1. Fetch live billionaire stream
curl https://api.superrich.tech/rtb/list

# 2. Query individual profile with assets
curl https://api.superrich.tech/rtb/profile/elon-musk

# 3. Filter top US rankings with custom API key
curl -H "X-API-Key: YOUR_API_KEY" \\
     "https://api.superrich.tech/v1/rankings?country=United%20States"`}</pre>
            )}

            {codeLang === "javascript" && (
              <pre>{`// Fetch real-time wealth index using modern async/await
async function getLiveBillionaires() {
  const res = await fetch("https://api.superrich.tech/rtb/list", {
    headers: {
      "Accept": "application/json",
      // "X-API-Key": "YOUR_API_KEY", // Optional for 500 req/min
    },
  });

  const json = await res.json();
  const topTitan = json.data.list[0];

  console.log(\`#\${topTitan.rank}: \${topTitan.name} — $\${topTitan.networth / 1000}B\`);
}

getLiveBillionaires();`}</pre>
            )}

            {codeLang === "python" && (
              <pre>{`import requests

url = "https://api.superrich.tech/rtb/list"
headers = {
    "Accept": "application/json",
    # "X-API-Key": "YOUR_API_KEY"  # Optional
}

response = requests.get(url, headers=headers)
data = response.json()

for person in data["data"]["list"][:5]:
    net_worth_billions = person["networth"] / 1000
    print(f"#{person['rank']}: {person['name']} - \${net_worth_billions:.1f}B")`}</pre>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: VALUATION METHODOLOGY */}
      {activeTab === "methodology" && (
        <div className="space-y-6">
          <div className="solid-card rounded-3xl p-6 md:p-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs liquid-glass text-accent">
              <Scale className="w-3.5 h-3.5" />
              <span>Mathematical Model</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Real-Time Wealth Calculation Standard
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              The SuperRich Wealth Index updates valuations continuously throughout global market trading hours. Our methodology distinguishes between public equity, private venture stakes, real estate, and pledged debt.
            </p>

            <div className="liquid-glass rounded-2xl p-5 font-mono text-xs sm:text-sm text-neutral-900 dark:text-white space-y-2 border border-accent/20">
              <div className="font-bold text-accent text-xs uppercase tracking-wider">Net Worth Core Formula</div>
              <div className="bg-neutral-200/50 dark:bg-neutral-800/60 p-3 rounded-xl overflow-x-auto">
                Net Worth = Σ(Public Shares × Live Stock Price) + Private Equity Valuation + Liquid Assets − Pledged Margin Debt
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="liquid-glass rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">1. Public Equity &amp; SEC Form 4</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Holdings in public entities are determined by analyzing mandatory filings from the U.S. Securities and Exchange Commission (SEC), including Forms 3, 4, 13D, 13G, and proxy statements (DEF 14A).
              </p>
            </div>

            <div className="liquid-glass rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gain/10 text-gain flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">2. Private Venture Valuations</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Stakes in closely held private firms (e.g. SpaceX, ByteDance, OpenAI) are assessed by indexing the most recent verified primary rounds, secondary liquidity transactions, or revenue multiples of publicly traded peers.
              </p>
            </div>

            <div className="liquid-glass rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">3. Residence Verification</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Municipal residences are strictly recorded as City and Country only, audited via county property tax assessor rolls, homestead exemption affidavits, and corporate registrations.
              </p>
            </div>

            <div className="liquid-glass rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">4. Human-in-the-Loop Review</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                AI discovery scrapers continuously monitor regulatory dockets. However, every fact-check assertion, court docket, and email archive must be approved through our editorial queue before publishing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
