"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Lock, SlidersHorizontal, Check } from "lucide-react";

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
        // Show after smooth delay for visitors without saved consent
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
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
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consentData));

      const oneYearSeconds = 365 * 24 * 60 * 60;
      const expires = new Date(Date.now() + oneYearSeconds * 1000).toUTCString();
      document.cookie = `${COOKIE_STORAGE_KEY}=${encodeURIComponent(
        JSON.stringify(consentData)
      )}; expires=${expires}; path=/; max-age=${oneYearSeconds}; SameSite=Lax`;

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
    <>
      {/* Main Cookie Banner Bar — Matches Requested Design */}
      <div
        role="region"
        aria-label="Cookie consent banner"
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#f4f6fd] dark:bg-[#121319] border-t border-[#dce0ef] dark:border-neutral-800 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] py-3.5 px-4 sm:px-8 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
          {/* Informational Text */}
          <div className="text-xs sm:text-[13px] text-[#374151] dark:text-neutral-300 leading-relaxed font-normal text-center lg:text-left">
            By clicking <strong className="font-bold text-neutral-900 dark:text-white">“Accept All Cookies”</strong>, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts. View our{" "}
            <Link
              href="/privacy"
              className="text-[#0088ff] dark:text-[#38bdf8] underline hover:opacity-80 transition-opacity font-medium"
            >
              Privacy Policy
            </Link>{" "}
            for more information.
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Preferences Link */}
            <button
              type="button"
              onClick={() => setShowPreferences(true)}
              className="text-[#0088ff] dark:text-[#38bdf8] underline text-xs sm:text-[13px] font-medium hover:opacity-80 transition-opacity px-1 py-1"
            >
              Preferences
            </button>

            {/* DENY Button */}
            <button
              type="button"
              onClick={() => saveConsent("essential")}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200/90 dark:border-neutral-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              DENY
            </button>

            {/* ACCEPT Button */}
            <button
              type="button"
              onClick={() => saveConsent("all")}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              ACCEPT
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => saveConsent("essential")}
              aria-label="Close cookie banner"
              className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white border border-neutral-200/90 dark:border-neutral-700 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal Dialog */}
      {showPreferences && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie Preferences"
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-[#121418] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-neutral-900 dark:text-neutral-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Cookie Preferences
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Customize the cookie technologies allowed on your device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                aria-label="Close preferences"
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preference Categories */}
            <div className="space-y-3 text-xs">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      Strictly Necessary
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Essential for site navigation, security verification, and theme persistence.
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/80 cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 transition-colors">
                <div className="flex items-start gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      Analytics & Performance
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Helps us measure site traffic, view popularity, and latency metrics anonymously.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-black dark:accent-white rounded cursor-pointer"
                />
              </label>

              {/* Personalization */}
              <label className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/80 cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 transition-colors">
                <div className="flex items-start gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      Marketing & Personalization
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Enables customized wealth index filters and display settings across sessions.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={personalization}
                  onChange={(e) => setPersonalization(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-black dark:accent-white rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-200/70 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => saveConsent("essential")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => saveConsent("custom", { analytics, personalization })}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => saveConsent("all")}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
