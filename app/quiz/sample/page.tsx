"use client";

import { useState } from "react";

export default function SampleQuizPage() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  async function submitQuiz() {
    try {
      setLoading(true);

      const response = await fetch("/api/quiz/submit", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          score: 8,
          total: 10,
          category: "Embedded Systems",
        }),
      });

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="mb-8 text-5xl font-bold">Sample Quiz Engine</h1>

      <button
        onClick={submitQuiz}
        disabled={loading}
        className="rounded-2xl bg-purple-600 px-8 py-4"
      >
        {loading ? "Submitting..." : "Submit Mock Quiz"}
      </button>

      {result && (
        <div className="mt-10 rounded-2xl border border-white/10 p-6">
          <p>Percentage: {result.percentage}</p>

          <p>Earned Points: {result.earnedPoints}</p>
        </div>
      )}
    </main>
  );
}
