import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";
import { authOptions } from "@/lib/auth";
import {
  buildAuthContinueHref,
  buildLoginHref,
  extractRequestedDestination,
} from "@/lib/navigation/auth-destination";
import { getPostLoginRedirect } from "@/lib/post-login-redirect";
import { prisma } from "@/lib/prisma";
import { isDatabaseConnectivityError } from "@/lib/server/database-guard";
import { getTrustedRequestOrigins } from "@/lib/server/request-origins";

import LoginClient from "./LoginClient";
import SessionRecovery from "./SessionRecovery";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    reason?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const trustedOrigins = await getTrustedRequestOrigins();

  const requestedDestination = extractRequestedDestination(
    resolvedSearchParams.callbackUrl,
    {
      allowedOrigins: trustedOrigins,
    },
  );

  const continueHref = buildAuthContinueHref(
    requestedDestination,
  );

  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
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
        const params = new URLSearchParams({
          from: continueHref,
        });

        redirect(`/database-unavailable?${params.toString()}`);
      }

      throw error;
    }

    if (user) {
      redirect(
        getPostLoginRedirect(
          user,
          requestedDestination,
        ),
      );
    }

    return (
      <SessionRecovery
        loginHref={buildLoginHref(
          requestedDestination,
          resolvedSearchParams.reason ??
            "stale-session",
        )}
      />
    );
  }

  const posters = await getPublishedAnnouncementPosters();

  return (
    <LoginClient
      posters={posters}
      callbackUrl={continueHref}
    />
  );
}
