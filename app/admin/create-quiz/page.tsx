"use client";

import { useMemo, useState } from "react";

export default function CreateQuizPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration: 30,
  });

  const isValid = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.category.trim().length > 0 &&
      form.difficulty.trim().length > 0 &&
      Number.isFinite(form.duration) &&
      Number(form.duration) > 0
    );
  }, [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValid) return;

    try {
      setLoading(true);

      const response = await fetch("/api/admin/create-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          category: form.category,
          difficulty: form.difficulty,
          duration: Number(form.duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Failed to create quiz");
        return;
      }

      alert("Quiz created");
      if (data?.quiz?.id) {
        window.location.href = `/admin/create-quiz/${data.quiz.id}`;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
        <h1 className="mb-10 text-5xl font-bold">Create Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Quiz Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="h-40 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          />

          <input
            type="text"
            placeholder="Difficulty"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          />

          <input
            type="number"
            min={1}
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: Number(e.target.value),
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          />

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full rounded-2xl bg-cyan-500 py-4 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </main>
  );
}
