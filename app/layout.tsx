import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { LiveTicker } from "@/components/LiveTicker";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "SuperRich — Tech Billionaires Encyclopedia & Live Wealth Index",
  description:
    "Real-time wealth tracking, childhood-to-present timelines, verified assets, companies, public contact emails and court-released archives for the world's top tech titans.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)", sizes: "32x32", type: "image/png" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var p = new URLSearchParams(window.location.search);
    var q = p.get('theme');
    var m = document.cookie.match(/(?:^|; )superrich-theme=([^;]+)/);
    var c = m ? decodeURIComponent(m[1]) : null;
    var l = localStorage.getItem('theme');
    var t = q || c || l;
    if (t) {
      try { localStorage.setItem('theme', t); } catch(e) {}
      var isProd = window.location.hostname.indexOf('superrich.tech') !== -1;
      var domain = isProd ? '; domain=.superrich.tech' : '';
      if (domain) {
        document.cookie = 'superrich-theme=' + encodeURIComponent(t) + '; path=/; max-age=31536000; SameSite=Lax' + domain;
      }
      document.cookie = 'superrich-theme=' + encodeURIComponent(t) + '; path=/; max-age=31536000; SameSite=Lax';
    }
    var r = t;
    if (!r || r === 'system') {
      r = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (r === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`,
          }}
        />
      </head>
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
          <footer className="w-full border-t border-neutral-200/60 dark:border-neutral-800/80 py-8 px-4 text-xs text-neutral-500">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-500">
                <Link href="/about" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  About
                </Link>
                <a href="/docs" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  API Overview
                </a>
                <Link href="/faq" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  FAQ
                </Link>
                <Link href="/legal" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  Legal
                </Link>
                <Link href="/legal/terms" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  Terms
                </Link>
                <Link href="/legal/cookies" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  Cookies
                </Link>
              </div>
              {/* Official Social Media Channels */}
              <div className="flex items-center justify-center space-x-5 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1.5 font-medium"
                >
                  <span className="font-bold text-sm">𝕏</span>
                  <span>Twitter / X</span>
                </a>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <a
                  href="https://github.com/realjackhalder/Super-Rich"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1.5 font-medium"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2 text-neutral-500 pt-1">
                <Image
                  src="/icon.png"
                  alt="SuperRich"
                  width={18}
                  height={18}
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span>© {new Date().getFullYear()} SuperRich.</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
