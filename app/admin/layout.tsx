import type { ReactNode } from "react";

import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}