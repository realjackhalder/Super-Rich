import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";
import {
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  Users,
  Database,
  Key,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Mock pending items awaiting human approval
  const pendingQueue = [
    {
      id: 1,
      type: "Fact",
      subject: "Sam Altman",
      claim: "OpenAI announced restructuring to for-profit public benefit corporation.",
      source: "Reuters / SEC Notice",
      confidence: 94,
    },
    {
      id: 2,
      type: "Legal Case",
      subject: "Elon Musk",
      claim: "New appeal filed regarding Tesla compensation package in Delaware Supreme Court.",
      source: "CourtListener (Docket #482-2024)",
      confidence: 99,
    },
    {
      id: 3,
      type: "Residence Update",
      subject: "Jeff Bezos",
      claim: "Confirmed transfer of primary tax residence to Miami, Florida (Indian Creek).",
      source: "Miami-Dade County Property Appraiser",
      confidence: 98,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Admin Header */}
      <div className="liquid-glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SuperRich Control Center</h1>
            <p className="text-xs text-neutral-500">
              Logged in as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{session.username as string}</span> (Administrator)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium liquid-glass hover:bg-loss/10 hover:text-loss transition-colors flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="solid-card rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Tracked Titans</div>
          <div className="text-2xl font-bold mt-1">{INITIAL_50_BILLIONAIRES.length}</div>
        </div>
        <div className="solid-card rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Pending Review Queue</div>
          <div className="text-2xl font-bold mt-1 text-accent">{pendingQueue.length}</div>
        </div>
        <div className="solid-card rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">API Status</div>
          <div className="text-2xl font-bold mt-1 text-gain">Active (Free)</div>
        </div>
        <div className="solid-card rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Auto-Fetch Jobs</div>
          <div className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">Idle</div>
        </div>
      </div>

      {/* Human-in-the-Loop Review Queue */}
      <div className="solid-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Review Queue (Facts & Legal Actions)</h2>
            <p className="text-xs text-neutral-500">
              AI automated scraper extracts candidates from filings and news. Approve to publish to production index.
            </p>
          </div>
          <button className="px-3 py-1.5 rounded-full liquid-glass text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1">
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Refresh Queue</span>
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {pendingQueue.map((item) => (
            <div
              key={item.id}
              className="liquid-glass rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-borderLight dark:border-surface-borderDark"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-neutral-900 dark:text-white">{item.subject}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-200 dark:bg-neutral-800 font-medium">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-gain font-medium">
                    {item.confidence}% Match
                  </span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {item.claim}
                </p>
                <div className="text-[11px] text-neutral-400">
                  Source: {item.source}
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
                <button className="px-3 py-1 rounded-full text-xs font-semibold bg-gain text-white hover:opacity-90 transition-opacity flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button className="px-3 py-1 rounded-full text-xs font-semibold bg-loss/10 text-loss hover:bg-loss/20 transition-colors flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="liquid-glass rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
            <RefreshCw className="w-4 h-4 text-accent" />
            <span>Manual Wealth & Stock Ticker Sync</span>
          </div>
          <p className="text-xs text-neutral-500">
            Triggers Finnhub and Twelve Data stock quote pipelines to recalculate net worth estimates for all 50 billionaires.
          </p>
          <button className="px-4 py-2 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity">
            Trigger Sync Now
          </button>
        </div>

        <div className="liquid-glass rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
            <Key className="w-4 h-4 text-accent" />
            <span>Free API Rate Limiting & Usage</span>
          </div>
          <p className="text-xs text-neutral-500">
            Review active free public API tokens, requests per minute, and developer integration statistics.
          </p>
          <button className="px-4 py-2 rounded-2xl liquid-glass text-neutral-800 dark:text-neutral-200 font-semibold text-xs hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors">
            Manage Free Keys
          </button>
        </div>
      </div>
    </div>
  );
}
