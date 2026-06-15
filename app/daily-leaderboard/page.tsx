import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

import {
  calculateOmniScore,
  determineEngineeringTier,
} from "@/lib/engineering-system";

export default async function DailyLeaderboardPage() {
  const rankings = await prisma.seasonProgress.findMany({
    orderBy: [
      {
        weightedRankScore: "desc",
      },
      {
        averageAccuracy: "desc",
      },
      {
        consistencyScore: "desc",
      },
    ],

    include: {
      user: true,
    },

    take: 100,
  });

  const processedRankings = rankings.map((entry) => {
    const omniScore = calculateOmniScore({
      averageAccuracy: entry.averageAccuracy,
      consistencyScore: entry.consistencyScore,
      completedDays: entry.completedDays,
      totalPoints: entry.totalPoints,
    });

    const safeOmniScore = Number.isFinite(omniScore) ? omniScore : 0;
    const engineeringTier = determineEngineeringTier(safeOmniScore);

    return {
      ...entry,
      omniScore: safeOmniScore,
      engineeringTier,
    };
  });

  const topThree = processedRankings.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              Omni Skills Olympiad Rankings
            </p>

            <h1 className="mt-4 text-6xl font-bold">Engineering Leaderboard</h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
              Rankings are generated using omni-score intelligence, engineering
              consistency, challenge performance, accuracy metrics, and
              protected streak systems.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold transition hover:border-cyan-500"
          >
            Dashboard
          </Link>
        </div>

        {/* TOP 3 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {topThree.map((entry, index) => (
            <div
              key={entry.id}
              className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-cyan-500 px-5 py-2 text-lg font-bold text-black">
                  #{index + 1}
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-cyan-300">
                  {Number.isFinite(entry.omniScore) ? entry.omniScore : 0}
                </div>
              </div>

              <h2 className="mt-8 text-3xl font-bold">
                {entry.user.fullName || "Anonymous Engineer"}
              </h2>

              <p className="mt-2 text-white/40">{entry.user.email}</p>

              {/* TIER */}
              <div
                className={`mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 px-5 py-2 text-sm font-bold text-black`}
              >
                {entry.engineeringTier.badge} {entry.engineeringTier.level}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/50">Accuracy</p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {Number.isFinite(entry.averageAccuracy)
                      ? entry.averageAccuracy.toFixed(1)
                      : "0.0"}
                    %
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/50">Consistency</p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {Number.isFinite(entry.consistencyScore)
                      ? entry.consistencyScore.toFixed(0)
                      : "0"}
                  </h3>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/50">Completed Days</p>

                <h3 className="mt-2 text-2xl font-bold">
                  {Number.isFinite(entry.completedDays)
                    ? entry.completedDays
                    : 0}
                  /30
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* FULL LEADERBOARD */}
        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm uppercase tracking-[0.2em] text-white/40">
                  <th className="pb-5">Rank</th>

                  <th className="pb-5">Engineer</th>

                  <th className="pb-5">Omni Score</th>

                  <th className="pb-5">Level</th>

                  <th className="pb-5">Accuracy</th>

                  <th className="pb-5">Consistency</th>

                  <th className="pb-5">Completed</th>

                  <th className="pb-5">Total Points</th>
                </tr>
              </thead>

              <tbody>
                {processedRankings.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-white/5">
                    <td className="py-5">
                      <div className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black">
                        #{index + 1}
                      </div>
                    </td>

                    <td className="py-5">
                      <div>
                        <p className="font-semibold">
                          {entry.user.fullName || "Anonymous"}
                        </p>

                        <p className="text-sm text-white/40">
                          {entry.user.email}
                        </p>
                      </div>
                    </td>

                    <td className="py-5 text-xl font-bold text-cyan-400">
                      {Number.isFinite(entry.omniScore) ? entry.omniScore : 0}
                    </td>

                    <td className="py-5">
                      <div
                        className={`inline-flex rounded-full bg-linear-to-r from-cyan-500/30 to-purple-500/30 px-4 py-2 text-xs font-bold text-black`}
                      >
                        {entry.engineeringTier.badge}{" "}
                        {entry.engineeringTier.level}
                      </div>
                    </td>

                    <td className="py-5">
                      {Number.isFinite(entry.averageAccuracy)
                        ? entry.averageAccuracy.toFixed(1)
                        : "0.0"}
                      %
                    </td>

                    <td className="py-5">
                      {Number.isFinite(entry.consistencyScore)
                        ? entry.consistencyScore.toFixed(0)
                        : "0"}
                    </td>

                    <td className="py-5">
                      {Number.isFinite(entry.completedDays)
                        ? entry.completedDays
                        : 0}
                      /30
                    </td>

                    <td className="py-5">
                      {Number.isFinite(entry.totalPoints)
                        ? entry.totalPoints
                        : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
