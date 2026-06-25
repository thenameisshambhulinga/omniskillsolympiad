import { NextResponse } from "next/server";

import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posters = await getPublishedAnnouncementPosters();

    return NextResponse.json(
      {
        ok: true,
        posters,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        posters: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
