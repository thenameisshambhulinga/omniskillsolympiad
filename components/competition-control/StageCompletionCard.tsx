"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Layers3 } from "lucide-react";

import {
  prepareStageCompletion,
  VIBGYOR_CONTROL_STAGES,
  type AdapterPreview,
  type VibgyorControlStage,
} from "@/lib/competition-control/entry-adapters";

export default function StageCompletionCard() {
  const [preview, setPreview] = useState<AdapterPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPreview(
      prepareStageCompletion({
        stage: String(formData.get("stage")) as VibgyorControlStage,
        completionStatus: "Complete",
        evaluator: String(formData.get("evaluator") ?? ""),
        remarks: String(formData.get("remarks") ?? ""),
        date: String(formData.get("date") ?? ""),
      }),
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="relative overflow-hidden rounded-[3rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Layers3 className="h-5 w-5 text-emerald-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Stage Completion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                VIBGYOR Stage
              </span>
              <select
                name="stage"
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-400/40"
              >
                {VIBGYOR_CONTROL_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Status
              </span>
              <input
                value="Complete"
                readOnly
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none"
              />
            </label>

            <ControlInput
              label="Evaluator"
              name="evaluator"
              placeholder="Mentor / Judge name"
            />
            <ControlInput label="Completion Date" name="date" type="date" />

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Remarks
              </span>
              <textarea
                name="remarks"
                rows={4}
                placeholder="Stage completion remarks"
                className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-emerald-400/40"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-300 px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            Prepare Stage Completion
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

function ControlInput({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-emerald-400/40"
      />
    </label>
  );
}
