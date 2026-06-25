import { requireAdmin } from "@/lib/admin-auth";

import ProtectedTestBuilderClient from "./ProtectedTestBuilderClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminProtectedTestsPage() {
  await requireAdmin();

  return <ProtectedTestBuilderClient />;
}
