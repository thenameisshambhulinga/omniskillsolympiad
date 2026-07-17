import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getRuntimeEnvReport } from "@/lib/server/runtime-env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
} as const;

export async function GET() {
  const env = getRuntimeEnvReport();
  let databaseReady = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseReady = true;
  } catch {
    databaseReady = false;
  }

  const ready = env.ready && databaseReady;

  return NextResponse.json(
    {
      ok: ready,
      status: ready ? "ready" : "unavailable",
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: NO_STORE_HEADERS,
    },
  );
}
