import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import ChallengeHeader from "./ChallengeHeader";
import QuestionForm from "./QuestionForm";
import QuestionLibrary from "./QuestionLibrary";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{
    challengeId: string;
  }>;
}) {
  const { challengeId } = await params;

  const challenge = await prisma.dailyChallenge.findUnique({
    where: {
      id: challengeId,
    },

    include: {
      questions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <ChallengeHeader challenge={challenge} />

        <QuestionForm challengeId={challenge.id} />

        <QuestionLibrary questions={challenge.questions} />
      </div>
    </main>
  );
}
