import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ProfileHero from "@/components/profile/ProfileHero";
import AchievementGrid from "@/components/profile/AchievementGrid";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const xp = user.siliconPoints;

  const level = Math.max(1, Math.floor(xp / 500));

  const nextLevelXp = level * 500 + 500;

  return (
    <main className="relative z-10 min-h-screen px-6 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <ProfileHero
          name={user.fullName || "Engineer"}
          email={user.email}
          siliconPoints={user.siliconPoints}
          streak={user.streak}
          level={level}
          xp={xp}
          nextLevelXp={nextLevelXp}
        />

        <AchievementGrid />
      </div>
    </main>
  );
}
