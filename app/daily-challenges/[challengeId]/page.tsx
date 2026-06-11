import { notFound } from "next/navigation";

import DailyChallengeClient from "./DailyChallengeClient";

import { prisma } from "@/lib/prisma";
import OfflineState from "@/components/system/OfflineState";

interface Props {
  params: Promise<{
    challengeId: string;
  }>;
}

export default async function ChallengePage({ params }: Props) {
  const { challengeId } = await params;

  let challenge = null;

  try {
    challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },

      include: {
        questions: true,
      },
    });
  } catch (error) {
    console.error(error);
  }

  if (!challenge) {
    // If Prisma is down we return OfflineState instead of a 500.
    return (
      <main className="relative z-10 min-h-screen px-6 pb-20 pt-32 text-white">
        <OfflineState />
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-6 pb-20 pt-32 text-white">
      <div className="mx-auto max-w-5xl">
        <DailyChallengeClient initialChallenge={challenge} />
      </div>
    </main>
  );
}
