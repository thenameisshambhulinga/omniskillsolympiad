import { notFound } from "next/navigation";

import DailyChallengeClient from "./DailyChallengeClient";

import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    challengeId: string;
  }>;
}

export default async function ChallengePage({ params }: Props) {
  const { challengeId } = await params;

  const challenge = await prisma.dailyChallenge.findUnique({
    where: {
      id: challengeId,
    },

    include: {
      questions: true,
    },
  });

  if (!challenge) {
    notFound();
  }

  return (
    <main className="relative z-10 min-h-screen px-6 pb-20 pt-32 text-white">
      <div className="mx-auto max-w-5xl">
        <DailyChallengeClient initialChallenge={challenge} />
      </div>
    </main>
  );
}
