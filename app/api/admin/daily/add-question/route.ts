import { jsonError } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return jsonError("This route is inactive. Use /api/admin/create-daily-question.", 410, { code: "ROUTE_DISABLED" });
}
