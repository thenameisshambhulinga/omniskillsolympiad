import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";
import { authOptions } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/post-login-redirect";
import { prisma } from "@/lib/prisma";

import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const runtime = "nodejs";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        role: true,
        isOnboarded: true,
      },
    });

    redirect(getPostLoginRedirect(user));
  }

  const posters = await getPublishedAnnouncementPosters();

  return <LoginClient posters={posters} />;
}