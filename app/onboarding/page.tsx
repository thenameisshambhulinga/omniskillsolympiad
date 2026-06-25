import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import OnboardingClient from "@/app/onboarding/OnboardingClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const runtime = "nodejs";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/onboarding");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      role: true,
      isOnboarded: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.isOnboarded) {
    redirect("/");
  }

  return <OnboardingClient />;
}