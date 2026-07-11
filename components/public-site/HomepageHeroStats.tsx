"use client";

import { useEffect, useState } from "react";

import styles from "@/components/public-site/next-gen-public-home.module.css";

type HomepageHeroStatsValue = {
  activeStudents: number;
  colleges: number;
  competitions: number;
  ecosystems: number;
  source?: "database" | "fallback";
};

const fallbackStats: HomepageHeroStatsValue = {
  activeStudents: 25000,
  colleges: 150,
  competitions: 30,
  ecosystems: 1,
  source: "fallback",
};

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function normalizeStats(payload: unknown): HomepageHeroStatsValue {
  if (!payload || typeof payload !== "object") {
    return fallbackStats;
  }

  const record = payload as Record<string, unknown>;

  return {
    activeStudents: readNumber(record.activeStudents, fallbackStats.activeStudents),
    colleges: readNumber(record.colleges, fallbackStats.colleges),
    competitions: readNumber(record.competitions, fallbackStats.competitions),
    ecosystems: readNumber(record.ecosystems, fallbackStats.ecosystems),
    source: record.source === "database" ? "database" : "fallback",
  };
}

function formatCount(value: number, allowPlus = true): string {
  if (value >= 100000) {
    return `${Math.round(value / 100000)}L${allowPlus ? "+" : ""}`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}K${allowPlus ? "+" : ""}`;
  }

  return `${value}${allowPlus && value > 1 ? "+" : ""}`;
}

export default function HomepageHeroStats() {
  const [stats, setStats] = useState<HomepageHeroStatsValue>(fallbackStats);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    void fetch("/api/public/homepage-stats", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          return fallbackStats;
        }

        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        if (isActive) {
          setStats(normalizeStats(payload));
        }
      })
      .catch(() => {
        if (isActive) {
          setStats(fallbackStats);
        }
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const statItems = [
    {
      value: formatCount(stats.activeStudents),
      label: "Active Students",
    },
    {
      value: formatCount(stats.colleges),
      label: "Colleges",
    },
    {
      value: formatCount(stats.competitions),
      label: "Competitions",
    },
    {
      value: String(stats.ecosystems),
      label: "Unified Ecosystem",
    },
  ];

  return (
    <div className={styles.imageOnlyHeroStats} aria-label="OSO platform statistics">
      {statItems.map((item) => (
        <span key={item.label} className={styles.imageOnlyHeroStat}>
          <strong>{item.value}</strong>
          <small>{item.label}</small>
        </span>
      ))}
    </div>
  );
}
