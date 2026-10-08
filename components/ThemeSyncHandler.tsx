"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  saveSharedTheme,
  getThemeFromCookie,
  THEME_BROADCAST_CHANNEL,
} from "@/lib/theme-sync";

/**
 * Headless client component mounted inside ThemeProvider that keeps theme
 * state synchronized across all subdomains (superrich.tech, docs.superrich.tech, admin.superrich.tech)
 * and across all open tabs/windows in real time.
 */
export function ThemeSyncHandler() {
  const { theme, setTheme } = useTheme();
  const isInitialMount = useRef(true);

  // 1. Initial mount: check if URL query ?theme= or cross-subdomain cookie has preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get("theme");
      const cookieTheme = getThemeFromCookie();
      const localTheme = localStorage.getItem("theme");

      if (
        urlTheme &&
        (urlTheme === "dark" || urlTheme === "light" || urlTheme === "system")
      ) {
        if (urlTheme !== theme) {
          setTheme(urlTheme);
        }
        saveSharedTheme(urlTheme);
      } else if (
        cookieTheme &&
        (cookieTheme === "dark" || cookieTheme === "light" || cookieTheme === "system")
      ) {
        if (cookieTheme !== theme) {
          setTheme(cookieTheme);
        }
        saveSharedTheme(cookieTheme);
      } else if (
        localTheme &&
        (localTheme === "dark" || localTheme === "light" || localTheme === "system")
      ) {
        if (localTheme !== theme) {
          setTheme(localTheme);
        }
        saveSharedTheme(localTheme);
      } else if (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1"))) {
        fetch("/api/theme", { cache: "no-store" })
          .then((res) => res.json())
          .then((data) => {
            if (
              data?.theme &&
              data.theme !== theme &&
              (data.theme === "dark" || data.theme === "light" || data.theme === "system")
            ) {
              setTheme(data.theme);
              saveSharedTheme(data.theme);
            }
          })
          .catch(() => {});
      }

      // Clean ?theme= param from browser address bar if present
      if (urlTheme) {
        urlParams.delete("theme");
        const newQuery = urlParams.toString();
        const cleanUrl =
          window.location.pathname +
          (newQuery ? `?${newQuery}` : "") +
          window.location.hash;
        window.history.replaceState({}, "", cleanUrl);
      }
    } catch {
      // Ignore
    }
  }, []);

  // 2. Whenever theme changes, save to shared cookie, localStorage, and broadcast
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (theme) {
      saveSharedTheme(theme);
    }
  }, [theme]);

  // 3. Listen to cross-tab BroadcastChannel for instant same-domain tab updates
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    try {
      const channel = new BroadcastChannel(THEME_BROADCAST_CHANNEL);
      channel.onmessage = (event) => {
        if (
          event.data?.theme &&
          event.data.theme !== theme &&
          (event.data.theme === "dark" ||
            event.data.theme === "light" ||
            event.data.theme === "system")
        ) {
          setTheme(event.data.theme);
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      // Ignore
    }
  }, [theme, setTheme]);

  // 4. Listen to window focus & visibilitychange + dev poll for real-time localhost sync:
  // When a user toggles theme on another subdomain (e.g. localhost) and returns to this tab (e.g. docs.localhost),
  // instantly detect the updated shared theme from cookie or /api/theme and apply without requiring page reload.
  useEffect(() => {
    let isCancelled = false;

    const handleSync = async () => {
      const cookieTheme = getThemeFromCookie();
      if (
        cookieTheme &&
        cookieTheme !== theme &&
        (cookieTheme === "dark" || cookieTheme === "light" || cookieTheme === "system")
      ) {
        setTheme(cookieTheme);
        return;
      }

      // Check server shared theme via /api/theme (syncs localhost:3000 <-> docs.localhost:3000)
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (
            data.theme &&
            data.theme !== theme &&
            (data.theme === "dark" || data.theme === "light" || data.theme === "system")
          ) {
            setTheme(data.theme);
          }
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    // Periodic poll in dev mode so side-by-side tabs sync automatically
    let intervalId: any = null;
    if (typeof window !== "undefined" && window.location.hostname.includes("localhost")) {
      intervalId = setInterval(handleSync, 1200);
    }

    return () => {
      isCancelled = true;
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [theme, setTheme]);

  return null;
}
