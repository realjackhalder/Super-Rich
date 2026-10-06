import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { LiveTicker } from "@/components/LiveTicker";
import { CookieConsent, CookiePreferencesTrigger } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "SuperRich — Tech Billionaires Encyclopedia & Live Wealth Index",
  description:
    "Real-time wealth tracking, childhood-to-present timelines, verified assets, companies, public contact emails and court-released archives for the world's top tech titans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-apple-lightBg dark:bg-apple-darkBg text-black dark:text-white transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <LiveTicker />
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
              {children}
            </main>
            <CookieConsent />
          </LanguageProvider>
          <footer className="w-full border-t border-neutral-200/60 dark:border-neutral-800/80 py-8 px-4 text-center text-xs text-neutral-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                © {new Date().getFullYear()} SuperRich.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <Link href="/about" className="hover:underline">About</Link>
                <a href="https://docs.superrich.tech" className="hover:underline">Docs</a>
                <Link href="/faq" className="hover:underline">FAQ</Link>
                <div className="flex items-center space-x-1.5 text-neutral-400">
                  <Link href="/legal" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:underline">
                    Legal
                  </Link>
                  <span className="text-[10px]">•</span>
                  <Link href="/legal/terms" className="text-neutral-400 hover:underline text-[11px]">
                    Terms
                  </Link>
                  <span className="text-[10px]">•</span>
                  <Link href="/legal/cookies" className="text-neutral-400 hover:underline text-[11px]">
                    Cookies
                  </Link>
                  <span className="text-[10px]">•</span>
                  <CookiePreferencesTrigger className="text-neutral-400 hover:text-black dark:hover:text-white hover:underline text-[11px] cursor-pointer">
                    Cookie Settings
                  </CookiePreferencesTrigger>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
