import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  buildSelectionEquation,
  buildSelectionRows,
  normalizeSelectionSettings,
} from "@/lib/quiz/selection-policy";

import SelectionControlClient from "./SelectionControlClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function ProtectedTestSelectionPage({ params }: PageProps) {
  await requireAdmin();

  const { quizId } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      title: true,
      selectionMinimumPercentage: true,
      selectionMaxTabSwitches: true,
      selectionRequireNonSuspicious: true,
      selectionShortlistLimit: true,
    },
  });

  if (!quiz) {
    notFound();
  }

  const settings = normalizeSelectionSettings({
    minimumPercentage: quiz.selectionMinimumPercentage,
    maxTabSwitches: quiz.selectionMaxTabSwitches,
    requireNonSuspicious: quiz.selectionRequireNonSuspicious,
    shortlistLimit: quiz.selectionShortlistLimit,
  });

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      quizId,
      completed: true,
    },
    select: {
      id: true,
      score: true,
      total: true,
      percentage: true,
      suspicious: true,
      tabSwitchCount: true,
      startedAt: true,
      submittedAt: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  const rows = buildSelectionRows({
    attempts,
    settings,
  });

  return (
    <SelectionControlClient
      initialData={{
        quiz: {
          id: quiz.id,
          title: quiz.title,
        },
        settings,
        equation: buildSelectionEquation(settings),
        rows,
      }}
    />
  );
}
