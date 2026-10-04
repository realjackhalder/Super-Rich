"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";

export function LiveTicker() {
  const topList = INITIAL_50_BILLIONAIRES.slice(0, 10);

  return (
    <div className="w-full border-y border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-950/50 overflow-hidden py-2 text-xs">
      <div className="flex space-x-8 animate-none overflow-x-auto no-scrollbar px-4 whitespace-nowrap">
        {topList.map((person) => {
          const isPositive = person.netWorthChangeDay >= 0;
          return (
            <Link
              key={person.id}
              href={`/p/${person.slug}`}
              className="inline-flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <span className="font-semibold text-neutral-400 dark:text-neutral-500">#{person.rank}</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-200">{person.name}</span>
              <span className="font-semibold">${person.netWorth.toFixed(1)}B</span>
              <span
                className={`inline-flex items-center font-medium ${
                  isPositive ? "text-gain" : "text-loss"
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? "+" : ""}
                ${Math.abs(person.netWorthChangeDay).toFixed(1)}B
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
