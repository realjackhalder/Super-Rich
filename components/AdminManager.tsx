"use client";

import { useState } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  Edit3,
  Search,
  Key,
  Database,
  ExternalLink,
  Save,
  Check,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";
import { BillionaireData } from "@/data/billionaires";

interface ReviewItem {
  id: number;
  type: string;
  subject: string;
  claim: string;
  source: string;
  confidence: number;
  status: "pending" | "approved" | "rejected";
}

interface AdminManagerProps {
  username: string;
  initialBillionaires: BillionaireData[];
}

export function AdminManager({
  username,
  initialBillionaires,
}: AdminManagerProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "editor" | "keys">("queue");

  // Review Queue State
  const [queue, setQueue] = useState<ReviewItem[]>([
    {
      id: 1,
      type: "Corporate Restructuring",
      subject: "Sam Altman",
      claim: "OpenAI announced restructuring to for-profit public benefit corporation with equity allocation.",
      source: "Reuters / SEC Notice (Docket #24-710)",
      confidence: 94,
      status: "pending",
    },
    {
      id: 2,
      type: "Legal Appeal",
      subject: "Elon Musk",
      claim: "New appeal filed regarding Tesla compensation package in Delaware Supreme Court.",
      source: "CourtListener (Docket #482-2024)",
      confidence: 99,
      status: "pending",
    },
    {
      id: 3,
      type: "Primary Residence",
      subject: "Jeff Bezos",
      claim: "Confirmed transfer of primary tax residence to Miami, Florida (Indian Creek Island).",
      source: "Miami-Dade County Property Appraiser Filing",
      confidence: 98,
      status: "pending",
    },
    {
      id: 4,
      type: "Shareholding Disclosure",
      subject: "Jensen Huang",
      claim: "Filed Form 144 disclosing scheduled Rule 10b5-1 trading plan for 240,000 NVDA shares.",
      source: "SEC EDGAR Form 144",
      confidence: 96,
      status: "pending",
    },
  ]);

  // Editor State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<BillionaireData>(
    initialBillionaires[0]
  );
  const [editForm, setEditForm] = useState({
    name: selectedPerson.name,
    mainCompany: selectedPerson.mainCompany,
    currentCity: selectedPerson.currentCity,
    currentCountry: selectedPerson.currentCountry,
    netWorth: selectedPerson.netWorth.toString(),
    bio: selectedPerson.bio,
    primaryEmail: selectedPerson.contactEmails?.[0]?.email || "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // API Key Generator State
  const [apiKeys, setApiKeys] = useState<
    { id: string; name: string; key: string; created: string; rateLimit: string }[]
  >([
    {
      id: "key-1",
      name: "Default Production Key",
      key: "sr_live_948f2c019a84b1e7c390a8f",
      created: "2026-10-01",
      rateLimit: "500 req/min",
    },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSelectPerson = (p: BillionaireData) => {
    setSelectedPerson(p);
    setEditForm({
      name: p.name,
      mainCompany: p.mainCompany,
      currentCity: p.currentCity,
      currentCountry: p.currentCountry,
      netWorth: p.netWorth.toString(),
      bio: p.bio,
      primaryEmail: p.contactEmails?.[0]?.email || "",
    });
    setSaveSuccess(false);
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAction = (id: number, action: "approved" | "rejected") => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: `sr_live_${randomHex}`,
      created: new Date().toISOString().split("T")[0],
      rateLimit: "500 req/min",
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName("");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredBillionaires = initialBillionaires.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mainCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = queue.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header with user status and logout */}
      <div className="liquid-glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight">SuperRich Control Center</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/10 text-accent">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Authenticated as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{username}</span> · admin.superrich.tech
            </p>
          </div>
        </div>

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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center">
        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Tracked Titans</div>
          <div className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
            {initialBillionaires.length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Top tech profiles</div>
        </div>

        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Review Queue</div>
          <div className="text-2xl font-bold mt-1 text-accent">{pendingCount}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Awaiting human sign-off</div>
        </div>

        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Public API Policy</div>
          <div className="text-2xl font-bold mt-1 text-gain">Read-Only</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Rate limited (60/min)</div>
        </div>

        <div className="liquid-glass rounded-2xl p-4">
          <div className="text-[11px] text-neutral-500 uppercase font-semibold">Active API Keys</div>
          <div className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
            {apiKeys.length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">500 req/min tier</div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center space-x-2 border-b border-neutral-200/60 dark:border-neutral-800/80 pb-3">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "queue"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <span>Review Queue</span>
          {pendingCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "queue"
                  ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black"
                  : "bg-accent text-white"
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "editor"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Billionaire Editor</span>
        </button>

        <button
          onClick={() => setActiveTab("keys")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === "keys"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "liquid-glass text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Key Management</span>
        </button>
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {activeTab === "queue" && (
        <div className="solid-card rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold tracking-tight">Review Queue (Automated Extractions)</h2>
              <p className="text-xs text-neutral-500">
                AI automated scraper extracts claims from SEC filings, court dockets, and verified announcements. Approve to publish to live index.
              </p>
            </div>
            <button
              onClick={() => {
                setQueue((prev) =>
                  prev.map((i) => ({ ...i, status: "pending" }))
                );
              }}
              className="px-3 py-1.5 rounded-full liquid-glass text-xs font-medium hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 flex items-center space-x-1.5 self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Reset & Reload Queue</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`liquid-glass rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-all ${
                  item.status === "approved"
                    ? "border-gain/40 bg-gain/5"
                    : item.status === "rejected"
                    ? "border-loss/40 bg-loss/5 opacity-60"
                    : "border-neutral-200/50 dark:border-neutral-800/80"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-200/60 dark:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-gain font-semibold">
                      {item.confidence}% Confidence
                    </span>
                    {item.status === "approved" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gain text-white">
                        APPROVED & PUBLISHED
                      </span>
                    )}
                    {item.status === "rejected" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-loss text-white">
                        REJECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200">
                    {item.claim}
                  </p>
                  <div className="text-[11px] text-neutral-400">
                    Source: {item.source}
                  </div>
                </div>

                {item.status === "pending" ? (
                  <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
                    <button
                      onClick={() => handleAction(item.id, "approved")}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gain text-white hover:opacity-90 transition-opacity flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "rejected")}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-loss/10 text-loss hover:bg-loss/20 transition-colors flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setQueue((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, status: "pending" } : i
                        )
                      )
                    }
                    className="text-[11px] text-neutral-400 hover:underline self-end md:self-center"
                  >
                    Change Decision
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BILLIONAIRE EDITOR */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector Sidebar */}
          <div className="solid-card rounded-3xl p-5 space-y-3">
            <div className="font-bold text-sm">Select Profile</div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search billionaire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
              {filteredBillionaires.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectPerson(b)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    selectedPerson.id === b.id
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="opacity-70 mr-1.5">#{b.rank}</span>
                    <span>{b.name}</span>
                  </div>
                  <span className="text-[11px] font-mono shrink-0">
                    ${b.netWorth.toFixed(1)}B
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 solid-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight">
                  Editing: {selectedPerson.name} (#{selectedPerson.rank})
                </h2>
                <p className="text-xs text-neutral-500">
                  Direct overrides for verified public dossiers and encyclopedia archives.
                </p>
              </div>
              <a
                href={`/p/${selectedPerson.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent hover:underline flex items-center space-x-1"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-2xl bg-gain/10 text-gain text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Profile saved and published to production index successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveEditor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Main Affiliated Company
                  </label>
                  <input
                    type="text"
                    value={editForm.mainCompany}
                    onChange={(e) =>
                      setEditForm({ ...editForm, mainCompany: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Primary City Residence
                  </label>
                  <input
                    type="text"
                    value={editForm.currentCity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, currentCity: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Country Residence
                  </label>
                  <input
                    type="text"
                    value={editForm.currentCountry}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        currentCountry: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Base Net Worth ($ Billions)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.netWorth}
                    onChange={(e) =>
                      setEditForm({ ...editForm, netWorth: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Verified Press / Legal Email
                  </label>
                  <input
                    type="email"
                    value={editForm.primaryEmail}
                    onChange={(e) =>
                      setEditForm({ ...editForm, primaryEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Biographical Dossier & Executive Summary
                </label>
                <textarea
                  rows={4}
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: API KEYS & RATE LIMITING */}
      {activeTab === "keys" && (
        <div className="solid-card rounded-3xl p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold tracking-tight">API Key Management (api.superrich.tech)</h2>
            <p className="text-xs text-neutral-500">
              Provision developer API keys. Keys bypass the public 60 req/min rate limit and are allocated 500 requests per minute with access to all endpoints.
            </p>
          </div>

          {/* New Key Form */}
          <form
            onSubmit={handleGenerateKey}
            className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl liquid-glass"
          >
            <input
              type="text"
              placeholder="Application or Developer Name (e.g. Bloomberg Terminal Integration)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Key</span>
            </button>
          </form>

          {/* Keys List */}
          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="liquid-glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
                    <span>{k.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-gain/10 text-gain font-semibold">
                      {k.rateLimit}
                    </span>
                  </div>
                  <div className="font-mono text-neutral-600 dark:text-neutral-400 text-[11px] bg-neutral-200/50 dark:bg-neutral-800/50 px-2 py-1 rounded-lg inline-block">
                    {k.key}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCopyKey(k.key)}
                    className="px-3 py-1.5 rounded-full liquid-glass text-xs font-medium hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors flex items-center space-x-1"
                  >
                    {copiedKey === k.key ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-gain" />
                        <span className="text-gain">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setApiKeys((prev) => prev.filter((item) => item.id !== k.id))
                    }
                    className="p-1.5 rounded-full hover:bg-loss/10 text-loss transition-colors"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
