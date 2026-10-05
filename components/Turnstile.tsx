"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Script from "next/script";

export interface TurnstileRef {
  reset: () => void;
  remove: () => void;
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: any) => void;
  action?: string;
  className?: string;
  theme?: "light" | "dark" | "auto";
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          action?: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (error?: any) => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  function Turnstile(
    {
      onVerify,
      onExpire,
      onError,
      action = "login",
      className,
      theme = "auto",
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    // Canonical site key: use environment variable or fallback to provided site key
    const siteKey =
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
      "0x4AAAAAAFOpJjrkemn-gauB";

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (e) {
            console.warn("[Turnstile] Reset failed:", e);
          }
        }
      },
      remove: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {}
          widgetIdRef.current = null;
        }
      },
    }));

    useEffect(() => {
      let interval: NodeJS.Timeout;

      const renderWidget = () => {
        if (window.turnstile && containerRef.current && !widgetIdRef.current) {
          try {
            widgetIdRef.current = window.turnstile.render(
              containerRef.current,
              {
                sitekey: siteKey,
                action,
                theme,
                callback: (token: string) => {
                  onVerify(token);
                },
                "expired-callback": () => {
                  if (onExpire) onExpire();
                },
                "error-callback": (err?: any) => {
                  if (onError) onError(err);
                },
              }
            );
          } catch (e) {
            console.warn("[Turnstile] Render notice:", e);
          }
        }
      };

      if (window.turnstile) {
        renderWidget();
      } else {
        interval = setInterval(() => {
          if (window.turnstile) {
            renderWidget();
            clearInterval(interval);
          }
        }, 100);
      }

      return () => {
        if (interval) clearInterval(interval);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {}
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, action, theme, onVerify, onExpire, onError]);

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
        <div
          ref={containerRef}
          data-action={action}
          className={`flex justify-center my-3 min-h-[65px] items-center ${
            className || ""
          }`}
        />
      </>
    );
  }
);
