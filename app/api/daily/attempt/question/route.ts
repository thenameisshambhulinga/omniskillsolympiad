import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This route is inactive. Daily challenge attempts use the active attempt flow.",
    },
    {
      status: 410,
    },
  );
}
