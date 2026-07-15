import { NextResponse } from "next/server";
import { getHomepageStats } from "@/lib/homepage-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const BASELINE = 7_000;

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
  const databaseBacked = raw.source === "database";

  return {
    activeStudents: Math.max(
      7_001,
      BASELINE + (databaseBacked ? safeCount(raw.activeStudents) : 0),
    ),
    colleges: Math.max(
      7_001,
      BASELINE + (databaseBacked ? safeCount(raw.colleges) : 0),
    ),
    competitions: Math.max(
      7_038,
      BASELINE + (databaseBacked ? safeCount(raw.competitions) : 0),
    ),
    ecosystems: 1,
    source: databaseBacked ? "database" : "fallback",
  } as const;
}

export async function GET() {
  try {
    return NextResponse.json(toPublicStats(await getHomepageStats()), {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(toPublicStats(null), {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
