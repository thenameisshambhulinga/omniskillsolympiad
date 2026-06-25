"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircle2, FilePlus2, ShieldAlert } from "lucide-react";

type QuestionFormProps = {
  challengeId: string;
};

type QuestionFormState = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
};

const initialForm: QuestionFormState = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "",
  difficulty: "easy",
};

export default function QuestionForm({ challengeId }: QuestionFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<QuestionFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<Key extends keyof QuestionFormState>(
    key: Key,
    value: QuestionFormState[Key],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const clientValidationError = validateQuestionForm(form);

    if (clientValidationError) {
      setError(clientValidationError);
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

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to add question.");
      }

      setForm(initialForm);
      setSuccess("Question added successfully. Control panel updated.");

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
          <FilePlus2 className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.06em] text-blue-700">
            Question Builder
          </p>

          <h2 className="oso-heading mt-1 text-2xl font-black text-slate-950">
            Add validated question
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Correct answer must match one option exactly. Duplicate options are
            blocked before saving.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
        <textarea
          required
          rows={5}
          value={form.question}
          onChange={(event) => updateField("question", event.target.value)}
          placeholder="Question"
          className="w-full resize-none rounded-[1.35rem] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <OptionInput
            label="Option A"
            value={form.optionA}
            onChange={(value) => updateField("optionA", value)}
          />

          <OptionInput
            label="Option B"
            value={form.optionB}
            onChange={(value) => updateField("optionB", value)}
          />

          <OptionInput
            label="Option C"
            value={form.optionC}
            onChange={(value) => updateField("optionC", value)}
          />

          <OptionInput
            label="Option D"
            value={form.optionD}
            onChange={(value) => updateField("optionD", value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            value={form.correctAnswer}
            onChange={(event) =>
              updateField("correctAnswer", event.target.value)
            }
            placeholder="Correct Answer"
            className="min-h-14 rounded-[1.15rem] border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          />

          <select
            value={form.difficulty}
            onChange={(event) =>
              updateField(
                "difficulty",
                event.target.value as QuestionFormState["difficulty"],
              )
            }
            className="min-h-14 rounded-[1.15rem] border border-slate-200 bg-white px-5 text-sm font-black uppercase tracking-[0.04em] text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="flex items-start gap-3 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Saving Question..." : "Save Question"}
        </button>
      </form>
    </section>
  );
}

function OptionInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={label}
      className="min-h-14 rounded-[1.15rem] border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
    />
  );
}

function validateQuestionForm(form: QuestionFormState) {
  const options = [
    form.optionA,
    form.optionB,
    form.optionC,
    form.optionD,
  ].map(normalizeChoice);

  const correctAnswer = normalizeChoice(form.correctAnswer);

  if (form.question.trim().length < 5) {
    return "Question must be at least 5 characters.";
  }

  if (options.some((option) => option.length === 0)) {
    return "All four options are required.";
  }

  if (!correctAnswer) {
    return "Correct answer is required.";
  }

  if (!options.includes(correctAnswer)) {
    return "Correct answer must exactly match one of the options.";
  }

  if (new Set(options).size !== 4) {
    return "Duplicate options detected. Keep all options unique.";
  }

  return "";
}

function normalizeChoice(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}