"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";

interface TickerItem {
  id: string | number;
  slug: string;
  name: string;
  rank: number;
  netWorth: number; // in billions
  changeDay: number; // in billions
  changePercent: number;
}

export function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(() => {
    const gainers = INITIAL_50_BILLIONAIRES.filter((p) => p.netWorthChangeDay > 0).slice(0, 8);
    const losers = INITIAL_50_BILLIONAIRES.filter((p) => p.netWorthChangeDay < 0).slice(0, 8);
    const initial: TickerItem[] = [];
    const max = Math.max(gainers.length, losers.length);
    for (let i = 0; i < max; i++) {
      if (gainers[i]) {
        initial.push({
          id: `init-g-${gainers[i].id}`,
          slug: gainers[i].slug,
          name: gainers[i].name,
          rank: gainers[i].rank,
          netWorth: gainers[i].netWorth,
          changeDay: gainers[i].netWorthChangeDay,
          changePercent: gainers[i].netWorthChangePercent,
        });
      }
      if (losers[i]) {
        initial.push({
          id: `init-l-${losers[i].id}`,
          slug: losers[i].slug,
          name: losers[i].name,
          rank: losers[i].rank,
          netWorth: losers[i].netWorth,
          changeDay: losers[i].netWorthChangeDay,
          changePercent: losers[i].netWorthChangePercent,
        });
      }
    }
    return initial;
  });

  useEffect(() => {
    let isMounted = true;

    const fetchLiveTicker = () => {
      fetch("/api/rtb/list")
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (!isMounted) return;
          if (json?.data?.list && Array.isArray(json.data.list)) {
            // Strictly restrict to Top 100 billionaires (rank 1 to 100)
            const list = json.data.list.filter(
              (item: any) => typeof item.rank === "number" && item.rank >= 1 && item.rank <= 100
            );

            // 1. Top gainers within top 100
            const topGainers = [...list]
              .filter((item: any) => (item.change?.value || 0) > 0)
              .sort((a, b) => (b.change?.value || 0) - (a.change?.value || 0))
              .slice(0, 10);

            // 2. Top losers within top 100
            const topLosers = [...list]
              .filter((item: any) => (item.change?.value || 0) < 0)
              .sort((a, b) => (a.change?.value || 0) - (b.change?.value || 0))
              .slice(0, 10);

            // 3. Top net worth titans within top 100
            const topTitans = [...list]
              .sort((a, b) => (a.rank || 999) - (b.rank || 999))
              .slice(0, 10);

            // Interleave gainers and losers so movement rhythm constantly alternates
            const interleaved: any[] = [];
            const maxLen = Math.max(topGainers.length, topLosers.length);
            for (let i = 0; i < maxLen; i++) {
              if (topGainers[i]) interleaved.push(topGainers[i]);
              if (topLosers[i]) interleaved.push(topLosers[i]);
              if (topTitans[i]) interleaved.push(topTitans[i]);
            }

            // Deduplicate by name and ensure rank <= 100
            const seen = new Set<string>();
            const combined: TickerItem[] = [];

            for (const item of interleaved) {
              if (!seen.has(item.name) && item.rank >= 1 && item.rank <= 100) {
                seen.add(item.name);
                combined.push({
                  id: `rtb-${item.uri || item.rank}`,
                  slug: item.uri || item.name.toLowerCase().replace(/\s+/g, "-"),
                  name: item.name,
                  rank: item.rank,
                  netWorth: item.networth ? item.networth / 1000 : 0,
                  changeDay: item.change?.value ? item.change.value / 1000 : 0,
                  changePercent: item.change?.pct || 0,
                });
              }
            }

            if (combined.length > 0) {
              setTickerItems(combined);
            }
          }
        })
        .catch(() => {});
    };

    fetchLiveTicker();
    const interval = setInterval(fetchLiveTicker, 60000); // 60s background sync

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Double the list to create a seamless infinite marquee loop
  const marqueeList = useMemo(() => [...tickerItems, ...tickerItems], [tickerItems]);

  return (
    <div className="w-full bg-neutral-100/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/80 py-1.5 text-xs overflow-hidden select-none">
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_28px,black_calc(100%-28px),transparent)]">
      <div className="animate-marquee flex items-center space-x-6 whitespace-nowrap">
        {marqueeList.map((person, idx) => {
          const isPositive = person.changeDay >= 0;
          return (
            <div key={`${person.id}-${idx}`} className="flex items-center space-x-6 shrink-0">
              <Link
                href={`/p/${person.slug}`}
                className="inline-flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group"
              >
                <span className="font-semibold text-neutral-400 dark:text-neutral-500 text-[11px]">
                  #{person.rank}
                </span>
                <span className="font-medium text-neutral-900 dark:text-neutral-200 group-hover:underline">
                  {person.name}
                </span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {person.netWorth >= 1000
                    ? `$${(person.netWorth / 1000).toFixed(2)}T`
                    : `$${person.netWorth.toFixed(1)}B`}
                </span>
                <span
                  className={`inline-flex items-center font-semibold text-[11px] ${
                    isPositive ? "text-gain" : "text-loss"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
                  )}
                  {isPositive ? "+" : ""}
                  ${Math.abs(person.changeDay).toFixed(1)}B
                  <span className="opacity-80 ml-0.5">
                    ({isPositive ? "+" : ""}
                    {person.changePercent.toFixed(1)}%)
                  </span>
                </span>
              </Link>
              <span className="text-neutral-300 dark:text-neutral-800 text-[10px]">•</span>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
