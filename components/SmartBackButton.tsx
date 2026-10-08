"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getDomainUrl } from "@/lib/domains";
import { useTheme } from "next-themes";

interface SmartBackButtonProps {
  fallbackLabel?: string;
  fallbackHref?: string;
}

export function SmartBackButton({
  fallbackLabel = "Back to Global Index",
  fallbackHref = "/",
}: SmartBackButtonProps) {
  const { theme } = useTheme();
  const [isFromDocs, setIsFromDocs] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDocsHost = window.location.hostname.startsWith("docs.");
      const referrer = (document.referrer || "").toLowerCase();
      const params = new URLSearchParams(window.location.search);

      if (
        isDocsHost ||
        params.get("from") === "docs" ||
        referrer.includes("docs.") ||
        referrer.includes("/docs")
      ) {
        setIsFromDocs(true);
      }
    }
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const isDocsHost = window.location.hostname.startsWith("docs.");
      if (isDocsHost) {
        // We are on docs subdomain, go back to docs home
        window.location.href = "/";
        return;
      }

      // If browser has history and came from docs or previous page
      if (window.history.length > 1 && document.referrer) {
        window.history.back();
        return;
      }

      if (isFromDocs) {
        window.location.href = getDomainUrl("docs", "/", theme);
      } else {
        window.location.href = getDomainUrl("main", fallbackHref, theme);
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer group"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>{isFromDocs ? "Back to Documentation" : fallbackLabel}</span>
    </button>
  );
}
