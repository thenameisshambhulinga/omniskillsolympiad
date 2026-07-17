import { jsonError } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function disabledRouteResponse() {
  return jsonError("This duplicate route is disabled. Use /api/admin/create-daily-challenge.", 410, { code: "ROUTE_DISABLED" });
}

export async function GET() { return disabledRouteResponse(); }
export async function POST() { return disabledRouteResponse(); }
