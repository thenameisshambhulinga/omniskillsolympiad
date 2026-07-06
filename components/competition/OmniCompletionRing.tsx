"use client";

import { motion } from "framer-motion";

export default function OmniCompletionRing({
  percent,
  label = "Engineering Journey Complete",
}: {
  percent: number;
  label?: string;
}) {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className="grid h-40 w-40 place-items-center rounded-full"
          style={{
            background: `conic-gradient(rgb(34 211 238) ${safePercent}%, rgba(255,255,255,0.08) 0)`,
          }}
        >
          <div className="grid h-28 w-28 place-items-center rounded-full border border-white/10 bg-black/70 backdrop-blur-xl">
            <span className="text-3xl font-black text-white">
              {safePercent}%
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Completion
        </p>

        <h3 className="mt-3 text-2xl font-black text-white">{label}</h3>
      </div>
    </motion.article>
  );
}