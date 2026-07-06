import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";
import { authOptions } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/post-login-redirect";
import { prisma } from "@/lib/prisma";

import LoginClient from "./LoginClient";
import SessionRecovery from "./SessionRecovery";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    let user: {
      role: string;
      isOnboarded: boolean;
    } | null = null;
    let lookupFailed = false;

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
      lookupFailed = true;
      console.error("LOGIN SESSION USER LOOKUP FAILED:", error);
    }

    if (user) {
      redirect(getPostLoginRedirect(user));
    }

    // A JWT can remain in the browser after its database user was removed.
    // Clear that stale cookie through NextAuth's CSRF-safe client sign-out flow
    // instead of redirecting /login back to itself forever.
    if (!lookupFailed) {
      return <SessionRecovery />;
    }
  }

  // The login screen remains renderable even when optional poster retrieval
  // cannot reach the database. The poster helper already returns [] on failure.
  const posters = await getPublishedAnnouncementPosters();

  return <LoginClient posters={posters} />;
}
