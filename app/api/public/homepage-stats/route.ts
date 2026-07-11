import { NextResponse } from "next/server";

import {
  fallbackHomepageStats,
  getHomepageStats,
} from "@/lib/homepage-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const stats = await getHomepageStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(fallbackHomepageStats, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}