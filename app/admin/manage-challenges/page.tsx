import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ManageChallengesPage() {
  const challenges = await prisma.dailyChallenge.findMany({
    include: {
      questions: true,
      attempts: true,
    },
    orderBy: {
      dayNumber: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Manage Challenges</h1>

      <div className="space-y-4">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-bold">
                Day {c.dayNumber} — {c.title}
              </h2>
              <p className="text-zinc-400">
                Questions: {c.questions.length} · Attempts: {c.attempts.length}
              </p>
              <p className="text-zinc-500 text-sm">
                Created: {new Date((c as any).createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/challenge/${c.id}`}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Open
              </Link>
              <form action={`/api/admin/publish-challenge`} method="post">
                <input type="hidden" name="challengeId" value={c.id} />
                <input
                  type="hidden"
                  name="action"
                  value={(c as any).isPublished ? "unpublish" : "publish"}
                />
                <button className="px-4 py-2 bg-zinc-800 rounded">
                  {(c as any).isPublished ? "Unpublish" : "Publish"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
