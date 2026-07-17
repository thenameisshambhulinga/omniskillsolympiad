import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
} as const;

export async function GET() {
  let ready = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    ready = true;
  } catch {
    ready = false;
  }

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
