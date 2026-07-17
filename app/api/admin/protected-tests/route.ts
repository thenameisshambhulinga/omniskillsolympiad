import { prisma } from "@/lib/prisma";
import { readJsonObjectWithLimit } from "@/lib/security/request-guard";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonNoStore, jsonOk } from "@/lib/server/route-hardening";
import { validateProtectedQuizImport } from "@/lib/quiz/quiz-import-validator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const auth = await requireApiAdmin();
  if (auth.response) return auth.response;

  const quizzes = await prisma.quiz.findMany({
    where: { duration: 30 },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      duration: true,
      isActive: true,
      totalPoints: true,
      createdAt: true,
      _count: { select: { questions: true, submissions: true, attempts: true } },
    },
  });

  return jsonNoStore({
    ok: true,
    success: true,
    quizzes: quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      isActive: quiz.isActive,
      totalPoints: quiz.totalPoints,
      createdAt: quiz.createdAt.toISOString(),
      questionCount: quiz._count.questions,
      submissionCount: quiz._count.submissions,
      attemptCount: quiz._count.attempts,
    })),
  });
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-protected-tests-create",
    limit: 12,
    windowMs: 60_000,
    maxBytes: 1024 * 1024,
  });
  if (guarded) return guarded;

  const auth = await requireApiAdmin();
  if (auth.response) return auth.response;

  const parsed = await readJsonObjectWithLimit(request, 1024 * 1024);
  if (parsed.response) return parsed.response;

  const body = parsed.data;
  const validation = validateProtectedQuizImport({
    title: body.title,
    description: body.description,
    category: body.category,
    difficulty: body.difficulty,
    duration: body.duration,
    isActive: body.isActive,
    questionsJson: body.questionsJson,
  });

  if (!validation.ok) return jsonError(validation.error, 400);

  try {
    const createdQuiz = await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: {
          title: validation.data.title,
          description: validation.data.description,
          category: validation.data.category,
          difficulty: validation.data.difficulty,
          duration: validation.data.duration,
          isActive: validation.data.isActive,
          totalPoints: validation.data.questions.reduce((sum, question) => sum + question.points, 0),
        },
        select: { id: true, title: true, duration: true },
      });

      await tx.question.createMany({
        data: validation.data.questions.map((question) => ({
          quizId: quiz.id,
          question: question.question,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          correctAnswer: question.correctAnswer,
          points: question.points,
        })),
      });

      return quiz;
    });

    return jsonOk({ quiz: createdQuiz, questionCount: validation.data.questions.length, createdBy: auth.user.email }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_PROTECTED_TEST_CREATE]", error);
    return jsonError("Unable to create protected test.", 500);
  }
}
