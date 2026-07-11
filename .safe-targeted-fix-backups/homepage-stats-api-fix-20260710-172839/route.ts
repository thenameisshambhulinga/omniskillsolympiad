import { NextResponse } from "next/server";

const fallbackStats = {
  activeStudents: 25000,
  colleges: 150,
  competitions: 30,
  ecosystems: 1,
  source: "fallback" as const,
};

export const dynamic = "force-dynamic";

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(fallbackStats);
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const [
      activeStudents,
      competitions,
      colleges,
    ] = await Promise.all([
      prisma.user.count().catch(() => fallbackStats.activeStudents),
      prisma.quiz.count({
        where: {
          isPublished: true,
        },
      }).catch(() => fallbackStats.competitions),
      prisma.competitionProfile.count({
        where: {
          isActive: true,
        },
      }).catch(() => fallbackStats.colleges),
    ]);

    return NextResponse.json({
      activeStudents: safeNumber(activeStudents, fallbackStats.activeStudents),
      colleges: safeNumber(colleges, fallbackStats.colleges),
      competitions: safeNumber(competitions, fallbackStats.competitions),
      ecosystems: 1,
      source: "database",
    });
  } catch {
    return NextResponse.json(fallbackStats);
  }
}
