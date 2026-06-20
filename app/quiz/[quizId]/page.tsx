import { prisma } from "@/lib/prisma";

type QuizByIdPageProps = {
  params: {
    quizId: string;
  };
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function QuizByIdPage({ params }: QuizByIdPageProps) {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: params.quizId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
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
          points: true,
        },
      },
    },
  });

  if (!quiz || !quiz.isActive) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Quiz not found</h1>
          <p className="mt-4 text-white/60">
            The quiz may be inactive or deleted.
          </p>
        </div>
      </main>
    );
  }

  const totalQuestions = quiz.questions.length;

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Secure Timed Quiz
          </p>

          <h1 className="mt-4 text-5xl font-bold">{quiz.title}</h1>

          {quiz.description ? (
            <p className="mt-4 text-white/60">{quiz.description}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
            <span>{quiz.category}</span>
            <span>{quiz.difficulty}</span>
            <span>{quiz.duration} mins</span>
          </div>

          <p className="mt-6 text-white/60">Questions: {totalQuestions}</p>
        </div>

        <form
          id="quiz-form"
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input type="hidden" name="quizId" value={quiz.id} />

          {quiz.questions.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/70">This quiz has no questions yet.</p>
            </div>
          ) : (
            quiz.questions.map((question, index) => (
              <section
                key={question.id}
                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
              >
                <div className="mb-6 flex items-start justify-between gap-6">
                  <h2 className="text-2xl font-bold">Q{index + 1}</h2>

                  <span className="text-sm text-white/50">
                    {question.points} point{question.points === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="mb-6 text-white/80">{question.question}</p>

                <div className="grid gap-3">
                  {[
                    ["A", question.optionA],
                    ["B", question.optionB],
                    ["C", question.optionC],
                    ["D", question.optionD],
                  ].map(([letter, option]) => (
                    <label
                      key={letter}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-cyan-400/40"
                    >
                      <input
                        type="radio"
                        name={`q_${question.id}`}
                        value={option}
                        className="h-4 w-4 accent-cyan-500"
                      />

                      <span className="font-semibold">{letter}.</span>
                      <span className="text-white/70">{option}</span>
                    </label>
                  ))}
                </div>
              </section>
            ))
          )}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <button
              id="quiz-submit"
              type="button"
              disabled={quiz.questions.length === 0}
              className="w-full rounded-2xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
            >
              Submit Quiz
            </button>

            <p id="quiz-status" className="mt-4 text-sm text-white/60" />
          </div>
        </form>
      </div>

      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              const form = document.getElementById('quiz-form');
              const submitBtn = document.getElementById('quiz-submit');
              const statusEl = document.getElementById('quiz-status');

              if (!form || !submitBtn || !statusEl) return;

              function getSelected(questionId) {
                const el = form.querySelector('input[name="q_' + questionId + '"]:checked');
                return el ? el.value : null;
              }

              async function handleSubmit() {
                const quizIdField = form.querySelector('input[name="quizId"]');
                const quizId = quizIdField ? quizIdField.value : "";

                const questionIds = ${JSON.stringify(quiz.questions.map((question) => question.id))};

                const answers = questionIds
                  .map(function (questionId) {
                    const selectedAnswer = getSelected(questionId);

                    if (!selectedAnswer) {
                      return null;
                    }

                    return {
                      questionId: questionId,
                      selectedAnswer: selectedAnswer
                    };
                  })
                  .filter(Boolean);

                try {
                  statusEl.textContent = 'Submitting securely...';
                  submitBtn.disabled = true;

                  const response = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      quizId: quizId,
                      answers: answers
                    })
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    statusEl.textContent = data && data.error ? data.error : 'Failed to submit quiz.';
                    submitBtn.disabled = false;
                    return;
                  }

                  const percentage =
                    typeof data.percentage === 'number'
                      ? data.percentage.toFixed(2)
                      : '0.00';

                  statusEl.textContent =
                    'Submitted securely! Score: ' +
                    data.score +
                    '/' +
                    data.total +
                    ' • Earned: ' +
                    data.earnedPoints +
                    ' points • ' +
                    percentage +
                    '%';

                  form.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                } catch (error) {
                  console.error(error);
                  statusEl.textContent = 'Server error while submitting.';
                  submitBtn.disabled = false;
                }
              }

              submitBtn.addEventListener('click', handleSubmit);
            })();
          `,
        }}
      />
    </main>
  );
}