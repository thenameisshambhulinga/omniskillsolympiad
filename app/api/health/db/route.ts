import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { classifyInfrastructureError } from "@/lib/server/connectivity-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      database: "online",
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        database: "offline",
        code: classifyInfrastructureError(error),
        error: "Database is not reachable from the app server.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
