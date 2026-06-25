"use client";

import { motion } from "framer-motion";
import type { OmniStage } from "@/lib/profile/omni-roadmap";

export default function OmniMilestoneCard({
  stage,
  completedSteps,
  status,
}: {
  stage: OmniStage;
  completedSteps: number;
  status: "completed" | "current" | "locked";
}) {
  const progress = Math.min(
    100,
    Math.max(0, Math.round((completedSteps / 4) * 100)),
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-[2.2rem] border p-5 shadow-[0_26px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl ${
        status === "locked"
          ? "border-white/10 bg-white/[0.03]"
          : "border-white/10 bg-white/[0.05]"
      }`}
      style={{
        boxShadow:
          status === "locked"
            ? "0 26px 110px rgba(0,0,0,0.38)"
            : `0 0 80px ${stage.glow}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: stage.color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/38">
              {stage.letter} Stage
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
              {stage.name}
            </h3>
          </div>

          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-black"
            style={{
              borderColor: stage.color,
              backgroundColor: stage.softColor,
              color: stage.color,
            }}
          >
            {stage.letter}
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/58">
          {stage.description}
        </p>

        <div className="mt-6 flex items-center justify-between text-sm font-bold">
          <span className="text-white/50">Steps Completed</span>
          <span className="text-white">{completedSteps} / 4</span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full"
            style={{ backgroundColor: stage.color }}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {stage.steps.map((step, index) => (
            <span
              key={step.id}
              className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-black text-white/65"
              style={{
                color: index < completedSteps ? stage.color : undefined,
              }}
            >
              {step.code}
            </span>
          ))}
        </div>

        <p
          className="mt-5 inline-flex rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em]"
          style={{
            borderColor:
              status === "locked" ? "rgba(255,255,255,0.12)" : stage.color,
            backgroundColor:
              status === "locked" ? "rgba(255,255,255,0.04)" : stage.softColor,
            color: status === "locked" ? "rgba(255,255,255,0.45)" : stage.color,
          }}
        >
          {status}
        </p>
      </div>
    </motion.article>
  );
}
