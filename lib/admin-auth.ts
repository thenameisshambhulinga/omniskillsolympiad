import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function redirectToDatabaseUnavailable(): never {
  redirect("/database-unavailable");
}

export async function getCurrentDbUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  try {
    return await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("AUTH DATABASE CONNECTION FAILED:", error);
    redirectToDatabaseUnavailable();
  }
}

export async function requireUser() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/access-restricted");
  }

  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (!user.isOnboarded) {
    redirect("/onboarding");
  }

  return user;
}