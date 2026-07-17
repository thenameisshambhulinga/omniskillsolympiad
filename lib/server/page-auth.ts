import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type OnboardedPageUser = {
  id: string;
  email: string;
  role: string;
  isOnboarded: true;
};

export async function requireOnboardedPageUser(
  callbackPath: string,
): Promise<OnboardedPageUser> {
  const session = await getServerSession(authOptions);
  const email =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  if (!email || session?.user?.authError) {
    const params = new URLSearchParams({ callbackUrl: callbackPath });
    redirect(`/login?${params.toString()}`);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isOnboarded: true,
    },
  });

  if (!user) {
    const params = new URLSearchParams({
      callbackUrl: callbackPath,
      reason: "stale-session",
    });
    redirect(`/login?${params.toString()}`);
  }

  if (!user.isOnboarded) {
    redirect("/onboarding");
  }

  return {
    ...user,
    isOnboarded: true,
  };
}
