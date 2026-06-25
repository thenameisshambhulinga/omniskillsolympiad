import OsoCleanLandingPage from "@/components/landing/clean/OsoCleanLandingPage";
import type { TopPerformerItem } from "@/components/landing/clean/OsoTopPerformersCarousel";
import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export default async function Home() {
  const [posters, topPerformers] = await Promise.all([
    getPublishedAnnouncementPosters(),
    getTopPerformers(),
  ]);

  return (
    <OsoCleanLandingPage
      posters={posters}
      topPerformers={topPerformers}
    />
  );
}

async function getTopPerformers(): Promise<TopPerformerItem[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        isOnboarded: true,
      },
      orderBy: [{ siliconPoints: "desc" }, { createdAt: "asc" }],
      take: 12,
      select: {
        id: true,
        fullName: true,
        image: true,
        omniId: true,
        college: true,
        branch: true,
        state: true,
        siliconPoints: true,
        streak: true,
        seasonProgress: {
          select: {
            totalPoints: true,
            weightedRankScore: true,
            averageAccuracy: true,
            completedDays: true,
          },
        },
        _count: {
          select: {
            dailyAttempts: true,
          },
        },
      },
    });

    return users
      .map((user) => {
        const computedPoints = Math.max(
          user.siliconPoints ?? 0,
          user.seasonProgress?.totalPoints ?? 0,
          Math.round(user.seasonProgress?.weightedRankScore ?? 0),
        );

        return {
          id: user.id,
          rank: 0,
          name: user.fullName?.trim() || "OMNI Student",
          imageUrl: user.image,
          omniId: user.omniId || "OMNI Pending",
          college: user.college || "OMNI Campus",
          branch: user.branch || "Engineering",
          state: user.state || "India",
          siliconPoints: computedPoints,
          streak: user.streak ?? 0,
          completedChallenges:
            user.seasonProgress?.completedDays ?? user._count.dailyAttempts,
          accuracy: Math.round(user.seasonProgress?.averageAccuracy ?? 0),
        };
      })
      .sort((a, b) => b.siliconPoints - a.siliconPoints)
      .slice(0, 10)
      .map((performer, index) => ({
        ...performer,
        rank: index + 1,
      }));
  } catch {
    return [];
  }
}
