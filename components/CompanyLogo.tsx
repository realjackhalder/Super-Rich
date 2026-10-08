"use client";

import React, { useState } from "react";
import { getCompanyLogoUrl, getCompanyFallbackLogoUrl } from "@/lib/company-logos";

interface CompanyLogoProps {
  slug: string;
  ticker?: string;
  name?: string;
  className?: string;
  containerClassName?: string;
}

export function CompanyLogo({
  slug,
  ticker,
  name,
  className = "w-full h-full object-contain",
  containerClassName = "relative w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 shadow-sm",
}: CompanyLogoProps) {
  // 0: primary, 1: secondary fallback (DuckDuckGo), 2: text monogram badge
  const [stage, setStage] = useState<number>(0);

  const displayTicker = (ticker || slug || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const badgeLabel = displayTicker.slice(0, 3) || (name ? name.slice(0, 2).toUpperCase() : "CO");

  const handleError = () => {
    setStage((prev) => prev + 1);
  };

  const primarySrc = getCompanyLogoUrl(slug, ticker);
  const secondarySrc = getCompanyFallbackLogoUrl(slug);

  return (
    <div className={containerClassName}>
      {stage === 0 && (
        <img
          src={primarySrc}
          alt={name || ticker || slug}
          className={className}
          loading="lazy"
          onError={handleError}
        />
      )}
      {stage === 1 && (
        <img
          src={secondarySrc}
          alt={name || ticker || slug}
          className={className}
          loading="lazy"
          onError={handleError}
        />
      )}
      {stage >= 2 && (
        <div className="w-full h-full rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center text-[9px] font-bold font-mono tracking-tight select-none">
          {badgeLabel}
        </div>
      )}
    </div>
  );
}
