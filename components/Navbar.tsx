"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, Globe, Activity } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getDomainUrl } from "@/lib/domains";

export interface LanguageOption {
  label: string;      // Native name
}

const LANGUAGES: LanguageOption[] = [
  { label: "English" },
  { label: "Español" },
  { label: "Français" },
  { label: "Português" },
  { label: "中文" },
  { label: "日本語" },
  { label: "한국어" },
  { label: "العربية" },
  { label: "Tiếng Việt" },
  { label: "ไทย" },
  { label: "বাংলা" },
  { label: "မြန်မာ" },
];

const TRANSLATION_MAP: Record<string, string> = {
  English: "en",
  Español: "es",
  Français: "fr",
  Português: "pt",
  中文: "zh-CN",
  日本語: "ja",
  한국어: "ko",
  العربية: "ar",
  "Tiếng Việt": "vi",
  ไทย: "th",
  বাংলা: "bn",
  မြန်မာ: "mm",
};

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem("sr_selected_lang");
      if (saved) {
        const match = LANGUAGES.find((l) => l.label === saved);
        if (match) {
          setSelectedLang(match);
          return;
        }
      }

      // Check existing googtrans cookie
      const matchCookie = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
      if (matchCookie && matchCookie[1]) {
        const gt = matchCookie[1];
        const labelKey = Object.keys(TRANSLATION_MAP).find(
          (key) => TRANSLATION_MAP[key] === gt || (gt === "my" && key === "မြန်မာ")
        );
        if (labelKey) {
          const match = LANGUAGES.find((l) => l.label === labelKey);
          if (match) setSelectedLang(match);
        }
      }
    } catch {
      // Ignore during SSR
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    setLangOpen(false);

    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("sr_selected_lang", lang.label);
      const gtCode = TRANSLATION_MAP[lang.label] || "en";

      if (gtCode === "en") {
        // Clear translation cookies to restore original English
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = "googtrans=/en/en; path=/;";
        document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname};`;

        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select) {
          select.value = "en";
          select.dispatchEvent(new Event("change"));
        }
        window.location.reload();
        return;
      }

      // Set cookie for Google Translate
      document.cookie = `googtrans=/en/${gtCode}; path=/;`;
      document.cookie = `googtrans=/en/${gtCode}; path=/; domain=${window.location.hostname};`;
      if (gtCode === "mm") {
        document.cookie = `googtrans=/en/my; path=/;`;
        document.cookie = `googtrans=/en/my; path=/; domain=${window.location.hostname};`;
      }

      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        if (gtCode === "mm") {
          const hasMm = Array.from(select.options).some((o) => o.value === "mm");
          select.value = hasMm ? "mm" : "my";
        } else {
          select.value = gtCode;
        }
        select.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.warn("Language translation error:", err);
    }
  };

  const isDocs =
    (typeof window !== "undefined" && window.location.hostname.startsWith("docs.")) ||
    pathname.startsWith("/docs");

  const isStatus =
    (typeof window !== "undefined" && window.location.hostname.startsWith("status.")) ||
    pathname.startsWith("/status");

  const mainUrl = mounted ? getDomainUrl("main") : "https://superrich.tech";
  const docsUrl = mounted ? getDomainUrl("docs") : "https://docs.superrich.tech";
  const statusUrl = mounted ? getDomainUrl("status") : "https://status.superrich.tech";

  const navLinks = [
    { href: `${mainUrl}/`, label: "Leaderboard", isActive: pathname === "/" && !isDocs && !isStatus },
    { href: `${mainUrl}/#timeline`, label: "Timeline", isActive: false },
    { href: docsUrl, label: "Docs", isActive: isDocs },
    { href: statusUrl, label: "Status", isActive: isStatus },
    { href: `${mainUrl}/about`, label: "About", isActive: pathname === "/about" },
    { href: `${mainUrl}/faq`, label: "FAQ", isActive: pathname === "/faq" },
  ];

  return (
    <header className="sticky top-3 z-50 w-full px-4 max-w-7xl mx-auto mt-2">
      <div className="liquid-glass rounded-full px-5 py-3 flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <a href={mainUrl} className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm">
            SR
          </div>
          <span className="font-semibold text-base tracking-tight hover:opacity-80 transition-opacity">
            SuperRich
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-gain mr-1 animate-pulse"></span>
            LIVE
          </span>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            return (
              <a
                key={link.label}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  link.isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Tools (Language, Theme) */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="h-8 px-3 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors text-neutral-800 dark:text-neutral-200 flex items-center space-x-1.5 text-xs font-medium border border-neutral-300/40 dark:border-neutral-700/50"
              title={`Language: ${selectedLang.label}`}
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className="text-xs font-medium">{selectedLang.label}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 liquid-glass rounded-2xl shadow-xl py-1.5 z-50 text-xs border border-surface-borderLight dark:border-surface-borderDark max-h-[75vh] overflow-y-auto">
                {LANGUAGES.map((l) => {
                  const isSelected = selectedLang.label === l.label;
                  return (
                    <button
                      key={l.label}
                      onClick={() => handleSelectLanguage(l)}
                      className={`w-full text-left px-3.5 py-1.5 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors flex items-center justify-between ${
                        isSelected ? "font-bold text-accent bg-neutral-200/40 dark:bg-neutral-800/40" : ""
                      }`}
                    >
                      <span>{l.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mr-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors text-neutral-600 dark:text-neutral-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
