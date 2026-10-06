"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Lock, SlidersHorizontal, Check, X, ChevronDown, ChevronUp } from "lucide-react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  personalization: boolean;
  timestamp: number;
  choice: "all" | "essential" | "custom";
}

const COOKIE_STORAGE_KEY = "superrich_cookie_consent";

export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Custom toggles
  const [analytics, setAnalytics] = useState(true);
  const [personalization, setPersonalization] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Check if consent has already been recorded
    try {
      const localConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
      const cookieMatch = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_STORAGE_KEY}=`));

      if (localConsent || cookieMatch) {
        const raw = localConsent || (cookieMatch ? decodeURIComponent(cookieMatch.split("=")[1]) : null);
        if (raw) {
          const parsed = JSON.parse(raw);
          setAnalytics(Boolean(parsed.analytics));
          setPersonalization(Boolean(parsed.personalization));
        }
      } else {
        // Show after brief smooth delay for visitors without saved consent
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // If error parsing, default to prompting
      setIsOpen(true);
    }

    // Listen for custom event to reopen preferences (from footer, settings, etc.)
    const handleOpenPreferences = () => {
      setIsOpen(true);
      setShowPreferences(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPreferences);
    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpenPreferences);
    };
  }, []);

  const saveConsent = (
    choice: "all" | "essential" | "custom",
    customPrefs?: { analytics: boolean; personalization: boolean }
  ) => {
    const consentData: CookiePreferences = {
      necessary: true,
      analytics: choice === "all" ? true : choice === "essential" ? false : (customPrefs?.analytics ?? analytics),
      personalization: choice === "all" ? true : choice === "essential" ? false : (customPrefs?.personalization ?? personalization),
      choice,
      timestamp: Date.now(),
    };

    try {
      // 1. Store in localStorage
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consentData));

      // 2. Store in Cookie with 1 year expiration
      const oneYearSeconds = 365 * 24 * 60 * 60;
      const expires = new Date(Date.now() + oneYearSeconds * 1000).toUTCString();
      document.cookie = `${COOKIE_STORAGE_KEY}=${encodeURIComponent(
        JSON.stringify(consentData)
      )}; expires=${expires}; path=/; max-age=${oneYearSeconds}; SameSite=Lax`;

      // 3. Dispatch global update event
      window.dispatchEvent(
        new CustomEvent("cookie-consent-updated", { detail: consentData })
      );
    } catch (err) {
      console.warn("Failed to persist cookie consent:", err);
    }

    setIsOpen(false);
    setShowPreferences(false);
  };

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-[#121418]/95 backdrop-blur-2xl border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl p-5 shadow-2xl text-neutral-900 dark:text-neutral-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
                Cookie & Privacy Consent
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                We remember your choices across sessions.
              </p>
            </div>
          </div>
          <button
            onClick={() => saveConsent("essential")}
            title="Dismiss & continue with essential only"
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-1.5">
          <p>
            SuperRich uses strictly essential storage to deliver live wealth calculations, theme state, and secure sessions. You can also allow analytics and personalization cookies to enhance your experience.
          </p>
          <p className="text-[11px] text-neutral-500">
            Read our transparent{" "}
            <Link
              href="/legal/cookies"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
            >
              Cookie Policy
            </Link>{" "}
            to learn more.
          </p>
        </div>

        {/* Detailed Preferences Accordion */}
        {showPreferences && (
          <div className="border-t border-neutral-200/80 dark:border-neutral-800/80 pt-3 space-y-2.5 text-xs">
            {/* Essential */}
            <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/60">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    Strictly Necessary
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Required for core security, CSRF protection, and dark/light mode persistence.
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Always Active
              </span>
            </div>

            {/* Analytics */}
            <label className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/60 cursor-pointer hover:bg-neutral-200/40 dark:hover:bg-neutral-800/70 transition-colors">
              <div className="flex items-start gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Analytics & Performance
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Helps us monitor real-time stock sync latency and page load speeds anonymously.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            {/* Personalization */}
            <label className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/60 cursor-pointer hover:bg-neutral-200/40 dark:hover:bg-neutral-800/70 transition-colors">
              <div className="flex items-start gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Personalization
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Remembers your preferred view layout (Grid vs Table) and search filters.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={personalization}
                onChange={(e) => setPersonalization(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>
        )}

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="inline-flex items-center justify-center space-x-1 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors py-1.5 px-2 rounded-lg"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showPreferences ? "Simple View" : "Customize"}</span>
            {showPreferences ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            {showPreferences ? (
              <>
                <button
                  type="button"
                  onClick={() => saveConsent("custom", { analytics, personalization })}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent("all")}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                >
                  Accept All
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => saveConsent("essential")}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-neutral-700/80 transition"
                >
                  Decline Non-Essential
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent("all")}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesTrigger({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className={className || "hover:underline text-[11px] text-neutral-400"}
    >
      {children || "Cookie Settings"}
    </button>
  );
}
