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
