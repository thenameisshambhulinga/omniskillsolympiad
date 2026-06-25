"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ClipboardCheck } from "lucide-react";

import {
  prepareAssessmentEntry,
  type AdapterPreview,
} from "@/lib/competition-control/entry-adapters";

export default function AssessmentEntryCard() {
  const [preview, setPreview] = useState<AdapterPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPreview(
      prepareAssessmentEntry({
        assessmentName: String(formData.get("assessmentName") ?? ""),
        score: Number(formData.get("score") ?? 0),
        remarks: String(formData.get("remarks") ?? ""),
        date: String(formData.get("date") ?? ""),
      }),
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.04 }}
      className="relative overflow-hidden rounded-[3rem] border border-purple-400/20 bg-purple-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-5 w-5 text-purple-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
            Assessment Entry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ControlInput
              label="Assessment Name"
              name="assessmentName"
              placeholder="Embedded Systems Evaluation"
            />
            <ControlInput
              label="Score"
              name="score"
              type="number"
              min={0}
              max={100}
              placeholder="82"
            />
            <ControlInput label="Assessment Date" name="date" type="date" />
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Remarks
              </span>
              <textarea
                name="remarks"
                rows={4}
                placeholder="Mentor assessment notes"
                className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-purple-400/40"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-400/25 bg-purple-300 px-5 py-3 text-sm font-black text-black transition hover:bg-purple-200"
          >
            <CalendarDays className="h-4 w-4" />
            Prepare Assessment Entry
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
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
        {label}
      </span>
      <input
        name={name}
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-purple-400/40"
      />
    </label>
  );
}