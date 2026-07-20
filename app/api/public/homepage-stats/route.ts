import { NextResponse } from "next/server";

import {
  getHomepageStats,
  homepageDomainCount,
} from "@/lib/homepage-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function toPublicStats(value: unknown) {
  const raw =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    activeStudents: safeCount(raw.activeStudents),
    colleges: safeCount(raw.colleges),
    competitions: safeCount(raw.competitions),
    domains: homepageDomainCount,
    ecosystems: 1,
    source: raw.source === "database" ? "database" : "fallback",
  } as const;
}

export async function GET() {
  try {
    return NextResponse.json(toPublicStats(await getHomepageStats()), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(toPublicStats(null), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}