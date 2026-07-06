import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function disabledRouteResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This duplicate route is disabled. Use /api/admin/create-daily-challenge.",
      code: "ROUTE_DISABLED",
    },
    {
      status: 410,
    },
  );
}

export async function GET() {
  return disabledRouteResponse();
}

export async function POST() {
  return disabledRouteResponse();
}