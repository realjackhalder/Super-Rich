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
      { url: "/diamond-crystal-.jpeg" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)", sizes: "32x32", type: "image/png" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)", sizes: "32x32", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/diamond-crystal-.jpeg" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/diamond-crystal-.jpeg",
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
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-500">
                <Link href="/about" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  About
                </Link>
                <a href="/docs" className="hover:text-black dark:hover:text-white hover:underline transition-colors">
                  Docs
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
              <div className="flex items-center justify-center space-x-2 text-neutral-500">
                <Image
                  src="/diamond-crystal-.jpeg"
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
