import { prisma } from "@/lib/prisma";

export default async function QuizByIdPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.quizId },
    include: { questions: true },
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
            Timed Quiz (DB Driven)
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
          onSubmit={(e) => {
            // Prevent default only; script will handle async submit.
            e.preventDefault();
          }}
        >
          <input type="hidden" name="quizId" value={quiz.id} />
          <input type="hidden" name="quizCategory" value={quiz.category} />

          {quiz.questions.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/70">This quiz has no questions yet.</p>
            </div>
          ) : (
            quiz.questions.map((q, idx) => (
              <section
                key={q.id}
                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
              >
                <div className="mb-6 flex items-start justify-between gap-6">
                  <h2 className="text-2xl font-bold">Q{idx + 1}</h2>
                  <span className="text-sm text-white/50">
                    {q.points} point{q.points === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="mb-6 text-white/80">{q.question}</p>

                <div className="grid gap-3">
                  {(["A", "B", "C", "D"] as const).map((letter) => {
                    const option =
                      letter === "A"
                        ? q.optionA
                        : letter === "B"
                          ? q.optionB
                          : letter === "C"
                            ? q.optionC
                            : q.optionD;

                    return (
                      <label
                        key={letter}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                      >
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          value={option}
                          className="h-4 w-4 accent-cyan-500"
                          required={idx === 0 ? true : false}
                        />
                        <span className="font-semibold">{letter}.</span>
                        <span className="text-white/70">{option}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Correct answer is embedded for client-side scoring (not anti-cheat). */}
                <input
                  type="hidden"
                  name={`correct_${q.id}`}
                  value={q.correctAnswer}
                />
              </section>
            ))
          )}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <button
              id="quiz-submit"
              type="button"
              disabled={quiz.questions.length === 0}
              className="w-full rounded-2xl bg-cyan-500 py-4 font-semibold text-black disabled:opacity-50"
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
              if (!form || !submitBtn) return;

              function getSelected(letterName) {
                const el = form.querySelector('input[name="' + letterName + '"]:checked');
                return el ? el.value : null;
              }

              async function handleSubmit() {
                const inputs = form.querySelectorAll('input[type="hidden"]');
                // Collect questions by finding correct_* hidden inputs.
                const correctHidden = Array.from(inputs).filter(i => i.name && i.name.startsWith('correct_'));
                const quizId =
                  (form.querySelector('input[name="quizId"]') || {}).value;

                const category =
                  (form.querySelector('input[name="quizCategory"]') || {}).value;

                let score = 0;
                let total = 0;

                correctHidden.forEach((hidden) => {
                  const qId = hidden.name.replace('correct_', '');
                  const userAnswer = getSelected('q_' + qId);
                  const correctAnswer = hidden.value;
                  const pointField = form.querySelector('input[name="points_' + qId + '"]');
                  const questionPoints = pointField ? Number(pointField.value) : 1;

                  total += questionPoints;

                  if (userAnswer && userAnswer === correctAnswer) {
                    score += questionPoints;
                  }
                });

                try {
                  statusEl.textContent = 'Submitting...';
                  submitBtn.disabled = true;

                  const response = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      score: score,
                      total: total,
                      category: category
                    })
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    statusEl.textContent = data?.error || 'Failed to submit';
                    submitBtn.disabled = false;
                    return;
                  }

                  statusEl.textContent = 'Submitted! Earned: ' + data.earnedPoints + ' (' + data.percentage.toFixed(2) + '%)';
                  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch (e) {
                  console.error(e);
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
