"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getDomainUrl } from "@/lib/domains";
import { saveSharedTheme } from "@/lib/theme-sync";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageItem } from "@/context/LanguageContext";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
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

  const mainBase = isDocs ? (mounted ? getDomainUrl("main", "/") : "https://www.superrich.tech") : "";

  const navLinks = [
    {
      id: "leaderboard",
      href: isDocs ? (mounted ? getDomainUrl("main", "/") : "https://www.superrich.tech") : "/",
      label: t("nav.leaderboard"),
      isActive: pathname === "/" && !isDocs,
    },
    {
      id: "companies",
      href: isDocs ? (mounted ? getDomainUrl("main", "/companies") : "https://www.superrich.tech/companies") : "/companies",
      label: t("nav.companies"),
      isActive: (pathname.startsWith("/companies") || pathname.startsWith("/c")) && !isDocs,
    },
  ];

  return (
    <header className="sticky top-3 z-50 w-full px-4 max-w-7xl mx-auto mt-2">
      <div className="liquid-glass rounded-full px-5 py-3 flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <Link
          href={isDocs ? (mounted ? getDomainUrl("main", "/") : "https://www.superrich.tech") : "/"}
          className="flex items-center space-x-2.5 group"
        >
          <div className="relative w-8 h-8 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/icon.png"
              alt="SuperRich Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
              priority
            />
          </div>
          <div className="flex items-baseline">
            <span className="font-bold text-lg tracking-tight text-black dark:text-white select-none">
              SuperRich
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isExternal = link.href.startsWith("http");
            const className = `px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              link.isActive
                ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
            }`;

            return isExternal ? (
              <a key={link.id} href={link.href} className={className}>
                {link.label}
              </a>
            ) : (
              <Link key={link.id} href={link.href} className={className}>
                {link.label}
              </Link>
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
                      className={`w-full text-left px-3.5 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors flex items-center justify-between text-neutral-800 dark:text-neutral-200 ${isSelected ? "font-bold text-accent bg-neutral-100/80 dark:bg-neutral-800/50" : ""
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

          {/* GitHub Social */}
          <a
            href="https://github.com/realjackhalder/Super-Rich"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors text-neutral-600 dark:text-neutral-300 flex items-center justify-center w-8 h-8"
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* X / Twitter Social */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors text-neutral-600 dark:text-neutral-300 flex items-center justify-center w-8 h-8 font-bold text-xs"
            aria-label="X / Twitter"
            title="X / Twitter"
          >
            <span>𝕏</span>
          </a>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              const current =
                resolvedTheme ||
                theme ||
                (typeof document !== "undefined" && document.documentElement.classList.contains("dark")
                  ? "dark"
                  : "light");
              const next = current === "dark" ? "light" : "dark";
              setTheme(next);
              saveSharedTheme(next);
            }}
            className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors text-neutral-600 dark:text-neutral-300 flex items-center justify-center w-8 h-8"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
