import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { LiveTicker } from "@/components/LiveTicker";
import { GoogleTranslate } from "@/components/GoogleTranslate";

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
        <GoogleTranslate />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="pt-2">
            <LiveTicker />
          </div>
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="w-full border-t border-neutral-200/60 dark:border-neutral-800/80 py-8 px-4 text-center text-xs text-neutral-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                © {new Date().getFullYear()} SuperRich.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/docs" className="hover:underline">API Overview</Link>
                <Link href="/faq" className="hover:underline">FAQ</Link>
                <Link href="/terms" className="hover:underline">Terms</Link>
                <Link href="/legal" className="hover:underline">Legal</Link>
                <Link href="/cookies" className="hover:underline">Cookies</Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
