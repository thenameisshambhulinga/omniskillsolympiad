import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function QuizListPage() {
  const quizzes = await prisma.quiz.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      duration: true,
    },
  });

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Engineering Assessments
          </p>
          <h1 className="mt-4 text-6xl font-bold">Available Quizzes</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
            >
              <h2 className="text-3xl font-bold">{quiz.title}</h2>

              <p className="mt-4 text-white/60">{quiz.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
                <span>{quiz.category}</span>
                <span>{quiz.difficulty}</span>
                <span>{quiz.duration} mins</span>
              </div>

              <Link
                href={`/quiz/${quiz.id}`}
                className="mt-8 inline-block rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-black"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="mt-10 text-white/60">
            No active quizzes found. Admins can create quizzes from the Admin
            panel.
          </div>
        )}
      </div>
    </main>
  );
}
