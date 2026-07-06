import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function OnboardingSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      fullName: true,
      omniId: true,
      isOnboarded: true,
    },
  });

  if (!user?.isOnboarded || !user.omniId) {
    redirect("/onboarding");
  }

  return (
    <SuccessClient
      fullName={user.fullName ?? "Engineer"}
      omniId={user.omniId}
    />
  );
}