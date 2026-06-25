import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      database: "online",
    });
  } catch (error) {
    console.error("DATABASE HEALTH CHECK FAILED:", error);

    return NextResponse.json(
      {
        success: false,
        database: "offline",
        error: "Database is not reachable from the app server.",
      },
      {
        status: 503,
      },
    );
  }
}