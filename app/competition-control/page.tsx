import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LegacyCompetitionControlPage() {
  await requireAdmin();

  redirect("/admin/competition");
}