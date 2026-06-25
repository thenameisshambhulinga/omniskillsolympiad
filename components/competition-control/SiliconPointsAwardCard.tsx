"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

import {
  prepareSiliconPointsAward,
  SILICON_POINT_PRESETS,
  type AdapterPreview,
} from "@/lib/competition-control/entry-adapters";

export default function SiliconPointsAwardCard() {
  const [preview, setPreview] = useState<AdapterPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const preset = Number(formData.get("preset") ?? 0);
    const custom = Number(formData.get("custom") ?? 0);
    const points = custom > 0 ? custom : preset;

    setPreview(
      prepareSiliconPointsAward({
        points,
        reason: String(formData.get("reason") ?? ""),
      }),
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="relative overflow-hidden rounded-[3rem] border border-amber-400/20 bg-amber-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-amber-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
            Silicon Points Award
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Preset Award
              </span>
              <select
                name="preset"
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-400/40"
              >
                {SILICON_POINT_PRESETS.map((points) => (
                  <option key={points} value={points}>
                    +{points} Silicon Points
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Custom Points
              </span>
              <input
                name="custom"
                type="number"
                min={0}
                placeholder="Optional custom value"
                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-amber-400/40"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Reason Required
              </span>
              <textarea
                name="reason"
                rows={4}
                required
                placeholder="Reason for awarding Silicon Points"
                className="resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-amber-400/40"
              />
            </label>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-300 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-200"
          >
            <Zap className="h-4 w-4" />
            Prepare Points Award
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
