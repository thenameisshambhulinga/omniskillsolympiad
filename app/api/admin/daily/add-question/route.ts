import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This route is inactive. Use the active daily question creation route.",
    },
    {
      status: 410,
    },
  );
}
