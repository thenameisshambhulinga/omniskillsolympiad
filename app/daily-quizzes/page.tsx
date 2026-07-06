import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  publicDailyChallengeWhere,
  studentDailyChallengeOrderBy,
} from "@/lib/daily-challenge/public-challenge-visibility";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export default async function DailyQuizzesPage() {
  const challenges = await prisma.dailyChallenge.findMany({
    where: publicDailyChallengeWhere,
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: studentDailyChallengeOrderBy,
    take: 60,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute left-[-100px] top-[120px] h-[300px] w-[300px] rounded-full bg-purple-700/20 blur-3xl" />

      <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <h1 className="text-5xl font-black">Daily Challenges</h1>

          <p className="mt-4 text-zinc-400">Attempt published engineering challenges.</p>
        </div>

        {challenges.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <h2 className="text-2xl font-bold">No Published Challenges</h2>

            <p className="mt-2 text-zinc-400">Admin has not published any challenges yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                    DAY {challenge.dayNumber}
                  </span>

                  <span className="text-sm text-zinc-400">
                    {challenge._count.questions} Questions
                  </span>
                </div>

                <h2 className="text-2xl font-bold">{challenge.title}</h2>

                <p className="mt-3 line-clamp-3 text-zinc-400">{challenge.description}</p>

                <div className="mt-6">
                  <Link
                    href={`/daily-challenges/${challenge.id}`}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
                  >
                    Start Challenge
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
