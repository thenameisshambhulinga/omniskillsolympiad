"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Scale, Star } from "lucide-react";

import {
  prepareJudgeEvaluation,
  type AdapterPreview,
} from "@/lib/competition-control/entry-adapters";

export default function JudgeEvaluationCard() {
  const [preview, setPreview] = useState<AdapterPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPreview(
      prepareJudgeEvaluation({
        overallScore: Number(formData.get("overallScore") ?? 0),
        technicalSkill: Number(formData.get("technicalSkill") ?? 0),
        presentation: Number(formData.get("presentation") ?? 0),
        innovation: Number(formData.get("innovation") ?? 0),
        execution: Number(formData.get("execution") ?? 0),
        comments: String(formData.get("comments") ?? ""),
      }),
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.16 }}
      className="relative overflow-hidden rounded-[3rem] border border-rose-400/20 bg-rose-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-rose-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-rose-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-300">
            Judge Evaluation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ScoreInput label="Overall Score" name="overallScore" />
            <ScoreInput label="Technical Skill" name="technicalSkill" />
            <ScoreInput label="Presentation" name="presentation" />
            <ScoreInput label="Innovation" name="innovation" />
            <ScoreInput label="Execution" name="execution" />

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Comments
              </span>
              <textarea
                name="comments"
                rows={4}
                placeholder="Judge evaluation comments"
                className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-rose-400/40"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-300 px-5 py-3 text-sm font-black text-black transition hover:bg-rose-200"
          >
            <Star className="h-4 w-4" />
            Prepare Judge Evaluation
          </button>
        </form>

        {preview && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-semibold leading-6 text-white/65">
            {preview.message}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function ScoreInput({ label, name }: { label: string; name: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <input
        name={name}
        type="number"
        min={0}
        max={100}
        placeholder="0 - 100"
        className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-rose-400/40"
      />
    </label>
  );
}
