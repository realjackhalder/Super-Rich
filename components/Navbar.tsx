"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getDomainUrl } from "@/lib/domains";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageItem } from "@/context/LanguageContext";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, languageItem, setLanguage, t } = useLanguage();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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

  const handleSelectLanguage = (lang: LanguageItem) => {
    setLanguage(lang.code);
    setLangOpen(false);
  };

  const isDocs =
    (typeof window !== "undefined" && window.location.hostname.startsWith("docs.")) ||
    pathname.startsWith("/docs");

  const mainUrl = mounted ? getDomainUrl("main") : "https://superrich.tech";
  const docsUrl = mounted ? getDomainUrl("docs") : "https://docs.superrich.tech";

  const navLinks = [
    { href: `${mainUrl}/`, label: t("nav.leaderboard"), isActive: pathname === "/" && !isDocs },
    {
      href: `${mainUrl}/companies`,
      label: t("nav.companies"),
      isActive: (pathname.startsWith("/companies") || pathname.startsWith("/c")) && !isDocs,
    },
    { href: docsUrl, label: t("nav.docs"), isActive: isDocs },
    { href: `${mainUrl}/about`, label: t("nav.about"), isActive: pathname === "/about" },
    { href: `${mainUrl}/faq`, label: t("nav.faq"), isActive: pathname === "/faq" },
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
            {t("nav.live")}
          </span>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            return (
              <a
                key={link.href}
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
              className="h-8 px-3 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors text-neutral-800 dark:text-neutral-200 flex items-center space-x-1.5 text-xs font-medium border border-neutral-300/60 dark:border-neutral-700/60 bg-white/50 dark:bg-neutral-900/40"
              title={`Language: ${languageItem.label}`}
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className="text-xs font-medium">{languageItem.label}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-2xl shadow-xl py-1.5 z-50 text-xs border border-neutral-200/90 dark:border-neutral-800 max-h-[75vh] overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isSelected = language === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => handleSelectLanguage(l)}
                      className={`w-full text-left px-3.5 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors flex items-center justify-between text-neutral-800 dark:text-neutral-200 ${
                        isSelected ? "font-bold text-accent bg-neutral-100/80 dark:bg-neutral-800/50" : ""
                      }`}
                    >
                      <span>{l.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1"></span>
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
