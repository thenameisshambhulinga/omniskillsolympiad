"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type QuestionForm = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  points: number;
};

export default function AddQuestionsPage() {
  const params = useParams<{ quizId: string }>();
  const quizId = params.quizId;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<QuestionForm>({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    points: 1,
  });

  const isValid = useMemo(() => {
    const optsOk =
      form.optionA.trim() &&
      form.optionB.trim() &&
      form.optionC.trim() &&
      form.optionD.trim();

    return (
      !!quizId &&
      form.question.trim().length > 0 &&
      Boolean(optsOk) &&
      form.correctAnswer.trim().length > 0 &&
      Number.isFinite(form.points) &&
      form.points > 0
    );
  }, [form, quizId]);

  // No extra API calls in this phase; meta is omitted to keep routing minimal.

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!quizId || !isValid) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/create-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          question: form.question,
          optionA: form.optionA,
          optionB: form.optionB,
          optionC: form.optionC,
          optionD: form.optionD,
          correctAnswer: form.correctAnswer,
          points: Number(form.points),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to add question");
        return;
      }

      // reset form except correctAnswer/points
      setForm((prev) => ({
        ...prev,
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
      }));
      alert("Question added");
    } catch (error) {
      console.error(error);
      alert("Failed to add question");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              Quiz Questions
            </p>
            <h1 className="mt-4 text-5xl font-bold">Add Questions</h1>
            <p className="mt-3 text-white/60">Quiz ID: {quizId}</p>
          </div>

          <div className="text-white/60"></div>
        </div>

        <form onSubmit={handleAdd} className="space-y-6">
          <input
            type="text"
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Option A"
              value={form.optionA}
              onChange={(e) => setForm({ ...form, optionA: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
            />
            <input
              type="text"
              placeholder="Option B"
              value={form.optionB}
              onChange={(e) => setForm({ ...form, optionB: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
            />
            <input
              type="text"
              placeholder="Option C"
              value={form.optionC}
              onChange={(e) => setForm({ ...form, optionC: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
            />
            <input
              type="text"
              placeholder="Option D"
              value={form.optionD}
              onChange={(e) => setForm({ ...form, optionD: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.correctAnswer}
              onChange={(e) =>
                setForm({ ...form, correctAnswer: e.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
            >
              <option value="A">Correct Answer: A</option>
              <option value="B">Correct Answer: B</option>
              <option value="C">Correct Answer: C</option>
              <option value="D">Correct Answer: D</option>
            </select>

            <input
              type="number"
              min={1}
              placeholder="Points"
              value={form.points}
              onChange={(e) =>
                setForm({
                  ...form,
                  points: Number(e.target.value),
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full rounded-2xl bg-cyan-500 py-4 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Question"}
          </button>
        </form>

        <div className="mt-8 text-sm text-white/50">
          Note: This page expects correctAnswer as one of: A/B/C/D.
        </div>
      </div>
    </main>
  );
}
