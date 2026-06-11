import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import DashboardHero from "@/components/dashboard/DashboardHero";
import PerformanceCards from "@/components/dashboard/PerformanceCards";
import PerformanceAnalytics from "@/components/dashboard/PerformanceAnalytics";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import LearningCoach from "@/components/dashboard/intelligence/LearningCoach";
import MetricFlow from "@/components/dashboard/intelligence/MetricFlow";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import OfflineState from "@/components/system/OfflineState";
import { calculateOmniScore } from "@/lib/engineering-system";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },

      include: {
        dailyAttempts: true,

        activities: {
          orderBy: {
            createdAt: "desc",
          },

          take: 8,
        },
      },
    });
  } catch (error) {
    console.error("Database unavailable", error);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-4 pt-28 text-white sm:px-6 lg:px-8">
        <OfflineState />
      </main>
    );
  }

  // CHALLENGE METRICS
  const completedChallenges = user.dailyAttempts.filter(
    (attempt) => attempt.completed,
  ).length;

  let totalChallenges = 0;
  let usersAbove = 0;

  try {
    totalChallenges = await prisma.dailyChallenge.count();

    usersAbove = await prisma.user.count({
      where: {
        siliconPoints: {
          gt: user.siliconPoints,
        },
      },
    });
  } catch (error) {
    console.error("Database unavailable", error);
  }

  const totalCorrectAnswers = user.dailyAttempts.reduce(
    (acc, curr) => acc + curr.score,
    0,
  );

  const totalQuestionsAttempted = user.dailyAttempts.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

  const averageAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : 0;

  const successRate =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : 0;

  const nationalRank = usersAbove + 1;

  // ENGINEERING SYSTEM
  const omniScore = calculateOmniScore({
    averageAccuracy,
    consistencyScore: completedChallenges,
    completedDays: completedChallenges,
    totalPoints: Number(user?.siliconPoints || 0),
  });

  return (
    <main className="relative min-h-screen overflow-visible bg-black px-4 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HERO */}
        <DashboardHero
          userName={user.fullName || "Engineer"}
          siliconPoints={omniScore}
          streak={user.streak}
          rank={nationalRank}
        />

        {/* RANKING CARDS */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              National Rank
            </p>

            <h2 className="mt-4 text-4xl font-black">#{nationalRank}</h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              State Rank
            </p>

            <h2 className="mt-4 text-2xl font-black text-white/40">
              <span className="text-white/40">Pending</span>
            </h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              College Rank
            </p>

            <h2 className="mt-4 text-2xl font-black text-white/40">
              <span className="text-white/40">Pending</span>
            </h2>
          </div>
        </div>

        {/* PERFORMANCE */}
        <PerformanceCards
          completedChallenges={completedChallenges}
          totalChallenges={totalChallenges}
          averageAccuracy={averageAccuracy}
          mockTests={0}
          worldSkillsScore={omniScore}
          totalQuestionsAttempted={totalQuestionsAttempted}
          totalCorrectAnswers={totalCorrectAnswers}
          successRate={successRate}
        />

        <MetricFlow />

        {/* ANALYTICS */}
        <PerformanceAnalytics data={[]} />

        {/* ACTIVITY */}
        <ActivityTimeline activities={user.activities} />

        <LearningCoach />
      </div>
    </main>
  );
}
