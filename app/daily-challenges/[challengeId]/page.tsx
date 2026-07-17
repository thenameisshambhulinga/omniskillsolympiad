import { notFound } from "next/navigation";

import DailyChallengeClient from "./DailyChallengeClient";

import OfflineState from "@/components/system/OfflineState";
import { prisma } from "@/lib/prisma";
import { publicDailyChallengeWhere } from "@/lib/daily-challenge/public-challenge-visibility";
import { withDatabaseResult } from "@/lib/server/database-guard";
import { requireOnboardedPageUser } from "@/lib/server/page-auth";

type ChallengePageProps = {
  params: Promise<{
    challengeId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ChallengePage({ params }: ChallengePageProps) {
  await requireOnboardedPageUser("/daily-challenges");
  const { challengeId } = await params;

  const challengeResult = await withDatabaseResult({
    label: "ChallengePage.getDailyChallenge",
    action: async () => {
      return prisma.dailyChallenge.findFirst({
        where: {
          id: challengeId,
          ...publicDailyChallengeWhere,
        },
        select: {
          id: true,
          title: true,
          description: true,
          dayNumber: true,
          isPublished: true,
          questions: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              question: true,
              optionA: true,
              optionB: true,
              optionC: true,
              optionD: true,
            },
          },
        },
      });
    },
  });

  if (!challengeResult.ok) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] px-6 py-12">
        <OfflineState />
      </main>
    );
  }

  const challenge = challengeResult.data;

  if (!challenge || !challenge.isPublished) {
    notFound();
  }

  if (challenge.questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] px-6 py-12">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-yellow-200 bg-yellow-50 p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Challenge is not ready
          </h1>

          <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
            This mission has been published but does not contain questions yet.
            Please contact admin.
          </p>
        </section>
      </main>
    );
  }

  return <DailyChallengeClient initialChallenge={challenge} />;
}