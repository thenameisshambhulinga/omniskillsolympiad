import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type FooterRole = "ADMIN" | "STUDENT" | "MENTOR" | "INDUSTRY" | string;

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "Cookie",
    },
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return noStoreJson({ authenticated: false, role: null });
  }

  const sessionRole =
    typeof session.user.role === "string"
      ? session.user.role.trim().toUpperCase()
      : "STUDENT";

  try {
    const databaseUser = await prisma.user.findUnique({
      where: { email: session.user.email.trim().toLowerCase() },
      select: { role: true },
    });

    const role: FooterRole = databaseUser?.role
      ? String(databaseUser.role).trim().toUpperCase()
      : sessionRole;

    return noStoreJson({ authenticated: true, role });
  } catch {
    // The footer must remain usable during a transient database interruption.
    return noStoreJson({
      authenticated: true,
      role: sessionRole,
      roleSource: "session-fallback",
    });
  }
}
