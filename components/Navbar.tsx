"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, Globe, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "bn", label: "বাংলা" },
  { code: "ar", label: "العربية" },
  { code: "my", label: "မြန်မာ" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Leaderboard" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/docs", label: "API Overview" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-full px-5 py-3 flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
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
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools (Language, Theme, Search, Admin) */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors text-neutral-600 dark:text-neutral-300 flex items-center justify-center"
              title="Select Language"
              aria-label="Select Language"
            >
              <Globe className="w-4 h-4" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 liquid-glass rounded-2xl shadow-xl py-2 z-50 text-xs border border-surface-borderLight dark:border-surface-borderDark">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors flex items-center justify-between ${
                      selectedLang === l.code ? "font-bold text-accent" : ""
                    }`}
                  >
                    <span>{l.label}</span>
                    {selectedLang === l.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span>
                    )}
                  </button>
                ))}
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
