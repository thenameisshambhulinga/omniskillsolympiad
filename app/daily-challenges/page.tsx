import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getChallengeWindowStatus } from "@/lib/challenge-window";
import StatusBadge from "@/components/ui/StatusBadge";

export default async function DailyChallengesPage() {
  const challenges = await prisma.dailyChallenge.findMany({
    where: {
      isPublished: true,
    },

    orderBy: {
      dayNumber: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            30 Day Engineering League
          </p>

          <h1 className="mt-4 text-6xl font-bold">Daily Challenges</h1>

          <p className="mt-6 max-w-2xl text-lg text-white/60">
            Complete 5 engineering questions every day, maintain consistency,
            compete globally, and climb the leaderboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge: any) => {
            const status = getChallengeWindowStatus(
              challenge.startTime,
              challenge.endTime,
            );

            return (
              <Link
                key={challenge.id}
                href={`/daily-challenges/${challenge.id}`}
                className="rounded-[32px] border border-white/10 bg-white/3 p-8 transition hover:border-cyan-400/30"
              >
                <div className="mb-4 flex items-start justify-between">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                    Day {challenge.dayNumber}
                  </p>
                  <StatusBadge status={status} />
                </div>

                <h2 className="text-3xl font-bold">{challenge.title}</h2>

                <p className="mt-4 text-white/60">{challenge.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
