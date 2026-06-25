"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

type CreateResponse = {
  ok?: boolean;
  error?: string;
  quiz?: {
    id: string;
    title: string;
    duration: number;
  };
  questionCount?: number;
};

const sampleQuestions = Array.from({ length: 40 }, (_, index) => ({
  question: `Sample Question ${index + 1}: Which option is correct?`,
  optionA: `Correct Answer ${index + 1}`,
  optionB: `Wrong Option B ${index + 1}`,
  optionC: `Wrong Option C ${index + 1}`,
  optionD: `Wrong Option D ${index + 1}`,
  correctAnswer: "A",
  points: 1,
}));

export default function ProtectedTestBuilderClient() {
  const [title, setTitle] = useState("OSO Protected Engineering Test");
  const [description, setDescription] = useState(
    "30-minute protected assessment with server timer, autosave and secure scoring.",
  );
  const [category, setCategory] = useState("Engineering Fundamentals");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [isActive, setIsActive] = useState(true);
  const [questionsJson, setQuestionsJson] = useState(
    JSON.stringify(sampleQuestions, null, 2),
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateResponse | null>(null);

  const questionCount = useMemo(() => {
    try {
      const parsed = JSON.parse(questionsJson);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }, [questionsJson]);

  async function createProtectedTest() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/protected-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          duration: 30,
          isActive,
          questionsJson,
        }),
      });

      const data = (await response.json()) as CreateResponse;
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error: "Network error while creating protected test.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1500px] rounded-[2.75rem] border border-white bg-white/85 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin
        </Link>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          <ShieldCheck className="h-4 w-4" />
          Protected Test Builder
        </div>

        <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-tight text-[#6d6e6f] sm:text-5xl">
          Create a 30-minute protected test with 40–50 verified questions.
        </h1>

        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
          Paste valid JSON questions. The API validates everything and creates the quiz in one transaction.
        </p>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              Test Details
            </p>

            <div className="mt-5 grid gap-4">
              <Field label="Title">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Category">
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Difficulty">
                <input
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-700">
                  Publish immediately
                </span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  className="h-5 w-5"
                />
              </label>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
                Duration is locked to 30 minutes. Current JSON count: {questionCount}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                  Questions JSON
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#6d6e6f]">
                  Paste 40–50 questions
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setQuestionsJson(JSON.stringify(sampleQuestions, null, 2))}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700"
              >
                Load 40 Sample
              </button>
            </div>

            <textarea
              value={questionsJson}
              onChange={(event) => setQuestionsJson(event.target.value)}
              rows={24}
              className="mt-5 w-full rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 font-mono text-xs font-semibold leading-6 text-cyan-100 outline-none focus:border-blue-400"
            />

            <button
              type="button"
              onClick={() => void createProtectedTest()}
              disabled={loading}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Create Protected Test
            </button>

            {result ? (
              <div
                className={
                  result.ok
                    ? "mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
                    : "mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
                }
              >
                {result.ok && result.quiz ? (
                  <div>
                    <div className="flex items-center gap-2 font-black">
                      <CheckCircle2 className="h-5 w-5" />
                      Test created successfully
                    </div>

                    <p className="mt-2 text-sm font-bold">
                      {result.quiz.title} · {result.questionCount} questions
                    </p>

                    <Link
                      href={`/quiz/${result.quiz.id}`}
                      className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white"
                    >
                      <Play className="h-4 w-4" />
                      Open Test
                    </Link>
                  </div>
                ) : (
                  <p className="font-bold">{result.error}</p>
                )}
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
