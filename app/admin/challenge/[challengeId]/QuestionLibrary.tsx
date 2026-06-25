import {
  CheckCircle2,
  FileQuestion,
  ShieldAlert,
  Trash2,
} from "lucide-react";

type QuestionLibraryProps = {
  challengeId: string;
  questions: Array<{
    id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    difficulty: string;
    createdAt: Date;
  }>;
};

export default function QuestionLibrary({
  challengeId,
  questions,
}: QuestionLibraryProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.06em] text-blue-700">
            Question Library
          </p>

          <h2 className="oso-heading mt-2 text-3xl font-black text-slate-950">
            Saved questions
          </h2>

          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Admin can review correct answers and remove wrong entries before the
            challenge is published.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-blue-700">
          <FileQuestion className="h-4 w-4" />
          {questions.length} Total
        </span>
      </div>

      <div className="mt-7 grid gap-5">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <article
              key={question.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.07)] sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700">
                      Question {questions.length - index}
                    </span>

                    <span className={getDifficultyClass(question.difficulty)}>
                      Difficulty: {question.difficulty}
                    </span>

                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="oso-heading mt-4 text-2xl font-black leading-tight text-slate-950">
                    {question.question}
                  </h3>
                </div>

                <form action="/api/admin/delete-question" method="post">
                  <input type="hidden" name="questionId" value={question.id} />
                  <input type="hidden" name="challengeId" value={challengeId} />

                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </form>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 p-5">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.06em] text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Correct Answer
                  </p>

                  <p className="mt-3 text-xl font-black text-emerald-800">
                    {question.correctAnswer}
                  </p>
                </div>

                <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.06em] text-slate-500">
                    Options
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Option label="A" value={question.optionA} />
                    <Option label="B" value={question.optionB} />
                    <Option label="C" value={question.optionC} />
                    <Option label="D" value={question.optionD} />
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyQuestionState />
        )}
      </div>
    </section>
  );
}

function Option({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
      <span className="mr-2 font-black text-blue-700">{label}.</span>
      {value}
    </div>
  );
}

function EmptyQuestionState() {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-200 bg-yellow-50 text-yellow-700">
        <ShieldAlert className="h-6 w-6" />
      </div>

      <h3 className="oso-heading mt-5 text-2xl font-black text-slate-950">
        No questions added yet.
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-500">
        Add at least one validated question to unlock the publish control.
      </p>
    </div>
  );
}

function getDifficultyClass(difficulty: string) {
  const normalizedDifficulty = difficulty.toLowerCase();

  if (normalizedDifficulty === "hard") {
    return "inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-red-700";
  }

  if (normalizedDifficulty === "medium") {
    return "inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-yellow-700";
  }

  return "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-700";
}