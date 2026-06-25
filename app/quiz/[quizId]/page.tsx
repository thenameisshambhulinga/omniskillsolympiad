import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import ProtectedQuizClient from "@/components/quiz/ProtectedQuizClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MAX_PROTECTED_TEST_QUESTIONS,
  MIN_PROTECTED_TEST_QUESTIONS,
} from "@/lib/quiz/quiz-policy";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type QuizByIdPageProps = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizByIdPage({ params }: QuizByIdPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { quizId } = await params;

  if (!quizId) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: {
        userId: user.id,
        quizId,
      },
    },
    select: {
      completed: true,
    },
  });

  if (existingAttempt?.completed) {
    redirect(`/quiz/selection-result/${quizId}`);
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      isActive: true,
      questions: {
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: MAX_PROTECTED_TEST_QUESTIONS,
      },
    },
  });

  if (!quiz || !quiz.isActive) {
    notFound();
  }

  if (
    quiz.questions.length < MIN_PROTECTED_TEST_QUESTIONS ||
    quiz.questions.length > MAX_PROTECTED_TEST_QUESTIONS
  ) {
    return (
      <main className="min-h-screen bg-[#f8fbff] px-6 py-10 text-slate-950">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-white/80 p-8 text-center shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
          <h1 className="text-3xl font-black text-red-700">Test not ready</h1>

          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
            This protected test needs {MIN_PROTECTED_TEST_QUESTIONS} to{" "}
            {MAX_PROTECTED_TEST_QUESTIONS} questions. Current count:{" "}
            {quiz.questions.length}.
          </p>
        </section>
      </main>
    );
  }

  return <ProtectedQuizClient quiz={quiz} />;
}
