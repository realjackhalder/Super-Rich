"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export interface CookiePreferences {
  necessary: boolean;
  marketing: boolean;
  personalization: boolean;
  analytics: boolean;
  timestamp: number;
  choice: "all" | "essential" | "custom";
}

const COOKIE_STORAGE_KEY = "superrich_cookie_consent";

export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }
}

/**
 * Illustrated Blue Bitten Cookie Icon (matching provided visual specification)
 */
export function BittenCookieIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cookie body with bite on the upper right */}
      <path
        d="M 50 10 
           A 40 40 0 0 0 10 50 
           A 40 40 0 0 0 50 90 
           A 40 40 0 0 0 90 50 
           C 90 47.5 89.7 45 89.2 42.6 
           C 85.5 44 81 44 77 42 
           C 71.5 39.5 68 34 68 28 
           C 68 23.5 70 19.5 73.5 16.8 
           C 66.8 12.5 58.7 10 50 10 Z"
        fill="#3b66d9"
      />
      {/* Big cyan chip with white highlight (top-left) */}
      <circle cx="34" cy="33" r="6.5" fill="#38bdf8" />
      <circle cx="36" cy="31" r="3.5" fill="#ffffff" />

      {/* Big cyan chip with white highlight (bottom-left) */}
      <circle cx="36" cy="66" r="6.5" fill="#38bdf8" />
      <circle cx="38" cy="64" r="3.5" fill="#ffffff" />

      {/* Medium cyan chip with white highlight (bottom-right) */}
      <circle cx="62" cy="70" r="5.5" fill="#38bdf8" />
      <circle cx="64" cy="68" r="3" fill="#ffffff" />

      {/* Small cyan chips / white specks */}
      <circle cx="53" cy="46" r="3" fill="#38bdf8" />
      <circle cx="28" cy="49" r="2.5" fill="#ffffff" />
      <circle cx="45" cy="24" r="2.5" fill="#ffffff" />
      <circle cx="46" cy="79" r="2.5" fill="#ffffff" />
      <circle cx="65" cy="54" r="2.5" fill="#ffffff" />
      <circle cx="58" cy="35" r="2" fill="#ffffff" />
      <circle cx="44" cy="56" r="2" fill="#ffffff" />

      {/* Floating Crumbs outside bite */}
      <rect x="74" y="24" width="7" height="6" rx="3" transform="rotate(-20 74 24)" fill="#38bdf8" />
      <circle cx="94" cy="32" r="3" fill="#38bdf8" />
      <circle cx="86" cy="46" r="4" fill="#38bdf8" />
    </svg>
  );
}

/**
 * iOS-style Toggle Switch
 */
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  id,
}: {
  checked: boolean;
  onChange?: (val: boolean) => void;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => onChange && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${checked ? "bg-[#3563e9]" : "bg-neutral-300 dark:bg-neutral-700"}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-y-0.5 ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Category toggles
  const [marketing, setMarketing] = useState(true);
  const [personalization, setPersonalization] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    setMounted(true);

    try {
      const localConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
      const cookieMatch = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_STORAGE_KEY}=`));

      if (localConsent || cookieMatch) {
        const raw = localConsent || (cookieMatch ? decodeURIComponent(cookieMatch.split("=")[1]) : null);
        if (raw) {
          const parsed = JSON.parse(raw);
          setMarketing(Boolean(parsed.marketing ?? true));
          setPersonalization(Boolean(parsed.personalization ?? true));
          setAnalytics(Boolean(parsed.analytics ?? true));
        }
      } else {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }

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
    customPrefs?: { marketing: boolean; personalization: boolean; analytics: boolean }
  ) => {
    const isAll = choice === "all";
    const isEssential = choice === "essential";

    const consentData: CookiePreferences = {
      necessary: true,
      marketing: isAll ? true : isEssential ? false : (customPrefs?.marketing ?? marketing),
      personalization: isAll ? true : isEssential ? false : (customPrefs?.personalization ?? personalization),
      analytics: isAll ? true : isEssential ? false : (customPrefs?.analytics ?? analytics),
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
      {/* Bottom Cookie Banner Bar */}
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
              className="text-[#0088ff] dark:text-[#38bdf8] underline text-xs sm:text-[13px] font-medium hover:opacity-80 transition-opacity px-1 py-1 cursor-pointer"
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

      {/* Privacy Preference Center Modal (Full Detailed View matching screenshots) */}
      {showPreferences && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Privacy Preference Center"
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-[#14161f] text-neutral-900 dark:text-neutral-100 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-neutral-200/80 dark:border-neutral-800">
            {/* Top close button */}
            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              aria-label="Close preferences"
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top line accent */}
            <div className="border-t border-[#e5e7eb] dark:border-neutral-800 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-6" />

            {/* Blue Bitten Cookie Icon */}
            <div className="mb-4">
              <BittenCookieIcon className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-3">
              Privacy Preference Center
            </h2>

            {/* Primary Description in Vibrant Cyan/Blue */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#0284c7] dark:text-[#38bdf8] mb-6">
              When you visit websites, they may store or retrieve data in your browser. This storage is often necessary for the basic functionality of the website. The storage may be used for marketing, analytics, and personalization of the site, such as storing your preferences. Privacy is important to us, so you have the option of disabling certain types of storage that may not be necessary for the basic functioning of the website. Blocking categories may impact your experience on the website.
            </p>

            {/* Top Dual Action Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                type="button"
                onClick={() => saveConsent("essential")}
                className="px-6 py-2 rounded-full border border-[#2d2d2d] dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs sm:text-sm font-medium transition shadow-sm cursor-pointer"
              >
                Reject all cookies
              </button>
              <button
                type="button"
                onClick={() => saveConsent("all")}
                className="px-6 py-2 rounded-full bg-[#3d3d3d] hover:bg-[#2c2c2c] dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-medium transition shadow-sm cursor-pointer"
              >
                Allow all cookies
              </button>
            </div>

            {/* Category Section Header */}
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white mb-6">
              Manage Consent Preferences by Category
            </h3>

            {/* Category Rows */}
            <div className="space-y-6">
              {/* Essential */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-bold text-neutral-950 dark:text-white">
                    Essential
                  </h4>
                  <span className="text-[#0284c7] dark:text-[#38bdf8] font-medium text-xs sm:text-sm">
                    Always Active
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#0284c7] dark:text-[#38bdf8]">
                  These items are required to enable basic website functionality.
                </p>
                <div className="border-b border-neutral-200 dark:border-neutral-800 mt-5" />
              </div>

              {/* Marketing */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-bold text-neutral-950 dark:text-white">
                    Marketing
                  </h4>
                  <ToggleSwitch
                    checked={marketing}
                    onChange={(val) => setMarketing(val)}
                    id="toggle-marketing"
                  />
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#0284c7] dark:text-[#38bdf8]">
                  These items are used to deliver advertising that is more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns. Advertising networks usually place them with the website operator&apos;s permission.
                </p>
                <div className="border-b border-neutral-200 dark:border-neutral-800 mt-5" />
              </div>

              {/* Personalization */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-bold text-neutral-950 dark:text-white">
                    Personalization
                  </h4>
                  <ToggleSwitch
                    checked={personalization}
                    onChange={(val) => setPersonalization(val)}
                    id="toggle-personalization"
                  />
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#0284c7] dark:text-[#38bdf8]">
                  These items allow the website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features. For example, a website may provide you with local weather reports or traffic news by storing data about your current location.
                </p>
                <div className="border-b border-neutral-200 dark:border-neutral-800 mt-5" />
              </div>

              {/* Analytics */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-bold text-neutral-950 dark:text-white">
                    Analytics
                  </h4>
                  <ToggleSwitch
                    checked={analytics}
                    onChange={(val) => setAnalytics(val)}
                    id="toggle-analytics"
                  />
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#0284c7] dark:text-[#38bdf8]">
                  These items help the website operator understand how its website performs, how visitors interact with the site, and whether there may be technical issues. This storage type usually doesn&apos;t collect information that identifies a visitor.
                </p>
                <div className="border-b border-neutral-200 dark:border-neutral-800 mt-5" />
              </div>
            </div>

            {/* Bottom Confirm Button */}
            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={() =>
                  saveConsent("custom", {
                    marketing,
                    personalization,
                    analytics,
                  })
                }
                className="px-7 py-2.5 rounded-full bg-[#3d3d3d] hover:bg-[#2c2c2c] dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-medium transition shadow-sm cursor-pointer"
              >
                Confirm my preferences and close
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
      className={className || "hover:underline text-[11px] text-neutral-400 cursor-pointer"}
    >
      {children || "Cookie Settings"}
    </button>
  );
}
