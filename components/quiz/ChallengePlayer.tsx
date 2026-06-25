// LEGACY FILE - NOT ACTIVE SOURCE OF TRUTH

"use client";

import { useEffect, useMemo, useState } from "react";

import { Clock3, ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface Props {
  challengeId: string;
  questions: Question[];
  durationInMinutes: number;
}

export default function ChallengePlayer({
  challengeId,
  questions,
  durationInMinutes,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [secondsLeft, setSecondsLeft] = useState(durationInMinutes * 60);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);

    const secs = secondsLeft % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, [secondsLeft]);

  const handleSelect = (questionId: string, selectedAnswer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  async function handleSubmit() {
    const payload = {
      challengeId,

      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })),
    };

    const response = await fetch("/api/daily/attempt", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = `/daily-challenges/result?score=${result.score}&total=${result.total}`;
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Engineering Challenge
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Question {currentIndex + 1} / {questions.length}
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-300">
          <Clock3 className="h-5 w-5" />

          <span className="text-xl font-bold">{formattedTime}</span>
        </div>
      </div>

      {/* QUESTION */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h2 className="text-2xl font-semibold leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="mt-10 grid gap-5">
          {[
            currentQuestion.optionA,
            currentQuestion.optionB,
            currentQuestion.optionC,
            currentQuestion.optionD,
          ].map((option, index) => {
            const selected = answers[currentQuestion.id] === option;

            return (
              <button
                key={index}
                onClick={() => handleSelect(currentQuestion.id, option)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 bg-black/30 hover:border-cyan-400/40"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-4 transition hover:border-cyan-400/40"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            Submit Challenge
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-black transition hover:scale-105"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
