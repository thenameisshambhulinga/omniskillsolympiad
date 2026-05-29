import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";

export default async function AdminPage() {
  await requireAdmin();

  const [totalChallenges, totalUsers, totalAttempts, leaderboard] =
    await Promise.all([
      prisma.dailyChallenge.count(),
      prisma.user.count(),
      prisma.dailyAttempt.count(),
      (prisma as any).seasonProgress.findMany({
        where: {
          championBlocked: false,
        },
        include: {
          user: true,
        },
        orderBy: {
          weightedRankScore: "desc",
        },
        take: 5,
      }),
    ]);

  return (
    <div className="p-8 text-white min-h-screen bg-black">
      <h1 className="text-4xl font-bold mb-8">Enterprise Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-zinc-400">Challenges</h2>
          <p className="text-4xl font-bold">{totalChallenges}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-zinc-400">Users</h2>
          <p className="text-4xl font-bold">{totalUsers}</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-zinc-400">Attempts</h2>
          <p className="text-4xl font-bold">{totalAttempts}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <Link
          href="/admin/create-daily-challenge"
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Create Challenge
        </Link>

        <Link
          href="/admin/manage-challenges"
          className="bg-zinc-800 px-6 py-3 rounded-lg"
        >
          Manage Challenges
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Leaderboard Preview</h2>

        <div className="space-y-4">
          {leaderboard.map((entry: any, index: number) => (
            <div
              key={entry.id}
              className="flex justify-between border-b border-zinc-800 pb-3"
            >
              <span>
                #{index + 1} {entry.user.fullName}
              </span>

              <span>{entry.weightedRankScore.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
