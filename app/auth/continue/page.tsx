import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/post-login-redirect";
import { prisma } from "@/lib/prisma";
import { isDatabaseConnectivityError } from "@/lib/server/database-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AuthContinuePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/auth/continue");
  }

  let user: {
    role: string;
    isOnboarded: boolean;
  } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        role: true,
        isOnboarded: true,
      },
    });
  } catch (error) {
    if (isDatabaseConnectivityError(error)) {
      redirect("/database-unavailable?from=/auth/continue");
    }

    throw error;
  }

  if (!user) {
    // /login now detects the stale JWT, clears it safely, and then renders.
    redirect("/login?reason=stale-session");
  }

  redirect(getPostLoginRedirect(user));
}
