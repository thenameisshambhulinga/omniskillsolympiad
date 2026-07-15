"use client";

import { useEffect, useState } from "react";
import styles from "@/components/public-site/public-hero-showcase.module.css";

type Stats = {
  activeStudents: number;
  colleges: number;
  competitions: number;
  ecosystems: number;
  source?: "database" | "fallback";
};

const FALLBACK: Stats = {
  activeStudents: 7_001,
  colleges: 7_001,
  competitions: 7_038,
  ecosystems: 1,
  source: "fallback",
};

function number(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function normalize(payload: unknown): Stats {
  if (!payload || typeof payload !== "object") return FALLBACK;
  const value = payload as Record<string, unknown>;

  return {
    activeStudents: number(value.activeStudents, FALLBACK.activeStudents),
    colleges: number(value.colleges, FALLBACK.colleges),
    competitions: number(value.competitions, FALLBACK.competitions),
    ecosystems: number(value.ecosystems, FALLBACK.ecosystems),
    source: value.source === "database" ? "database" : "fallback",
  };
}

function format(value: number, plus = true) {
  const rendered = new Intl.NumberFormat("en-IN").format(value);
  return plus ? `${rendered}+` : rendered;
}

export default function HomepageHeroStats() {
  const [stats, setStats] = useState<Stats>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    void fetch("/api/public/homepage-stats", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) =>
        response.ok ? (response.json() as Promise<unknown>) : FALLBACK,
      )
      .then((payload) => mounted && setStats(normalize(payload)))
      .catch(() => mounted && setStats(FALLBACK));

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const items = [
    [format(stats.activeStudents), "Active Students"],
    [format(stats.colleges), "Institutions"],
    [format(stats.competitions), "Competitions"],
    [format(stats.ecosystems, false), "Unified Ecosystem"],
  ] as const;

  return (
    <div
      className={styles.statsStrip}
      aria-label="OSO platform statistics"
      data-source={stats.source ?? "fallback"}
    >
      {items.map(([value, label]) => (
        <article key={label} className={styles.statItem}>
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}
