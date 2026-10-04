"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

// Ensure callback is defined globally as early as possible
if (typeof window !== "undefined" && !window.googleTranslateElementInit) {
  window.googleTranslateElementInit = () => {
    try {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,pt,fr,zh-CN,ko,ja,th,vi,bn,ar,my,mm",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    } catch (err) {
      console.warn("Google Translate initialization notice:", err);
    }
  };
}

export function GoogleTranslate() {
  useEffect(() => {
    if (window.google && window.google.translate && window.googleTranslateElementInit) {
      window.googleTranslateElementInit();
    }

    // Function to enforce 0 top offset and hide any Google Translate banner
    const suppressBanner = () => {
      if (document.body && document.body.style.top !== "0px" && document.body.style.top !== "") {
        document.body.style.setProperty("top", "0px", "important");
        document.body.style.setProperty("position", "static", "important");
      }
      if (document.documentElement && document.documentElement.style.top !== "0px" && document.documentElement.style.top !== "") {
        document.documentElement.style.setProperty("top", "0px", "important");
      }

      // Hide banner iframes or container elements
      const banners = document.querySelectorAll<HTMLElement>(
        'iframe.goog-te-banner-frame, .goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd, body > .skiptranslate, body > div.skiptranslate, iframe[id*=":1.container"]'
      );
      banners.forEach((el) => {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("height", "0px", "important");
        el.style.setProperty("width", "0px", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
      });
    };

    suppressBanner();

    const observer = new MutationObserver(suppressBanner);
    observer.observe(document.body, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    const interval = setInterval(suppressBanner, 250);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Hidden container where Google Translate initializes */}
      <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true" />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
