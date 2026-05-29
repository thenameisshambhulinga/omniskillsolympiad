"use client";

import { useState } from "react";

type Props = {
  challengeId: string;
};

export default function QuestionForm({ challengeId }: Props) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    difficulty: "easy",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const options = [
      form.optionA.trim().toLowerCase(),
      form.optionB.trim().toLowerCase(),
      form.optionC.trim().toLowerCase(),
      form.optionD.trim().toLowerCase(),
    ];

    const correct = form.correctAnswer.trim().toLowerCase();

    if (!options.includes(correct)) {
      setError("Correct answer must exactly match one option.");

      return;
    }

    const duplicates = options.filter(
      (item, index) => options.indexOf(item) !== index,
    );

    if (duplicates.length > 0) {
      setError(
        `Duplicate options detected after normalization: ${duplicates.join(", ")}`,
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/create-daily-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId,
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add question");
      }

      setSuccess("Question added successfully.");

      setForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        difficulty: "easy",
      });

      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
    >
      <h2 className="text-3xl font-bold">Add Question</h2>

      <div className="mt-8 space-y-6">
        <textarea
          required
          rows={5}
          value={form.question}
          onChange={(e) => updateField("question", e.target.value)}
          placeholder="Question"
          className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 outline-none"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <input
            required
            value={form.optionA}
            onChange={(e) => updateField("optionA", e.target.value)}
            placeholder="Option A"
            className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
          />

          <input
            required
            value={form.optionB}
            onChange={(e) => updateField("optionB", e.target.value)}
            placeholder="Option B"
            className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
          />

          <input
            required
            value={form.optionC}
            onChange={(e) => updateField("optionC", e.target.value)}
            placeholder="Option C"
            className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
          />

          <input
            required
            value={form.optionD}
            onChange={(e) => updateField("optionD", e.target.value)}
            placeholder="Option D"
            className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <input
            required
            value={form.correctAnswer}
            onChange={(e) => updateField("correctAnswer", e.target.value)}
            placeholder="Correct Answer"
            className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
          />

          <select
            value={form.difficulty}
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {success}
          </div>
        )}

        <button
          disabled={loading}
          className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:scale-[1.02]"
        >
          {loading ? "Saving..." : "Save Question"}
        </button>
      </div>
    </form>
  );
}
