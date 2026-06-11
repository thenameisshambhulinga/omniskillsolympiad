"use client";

import { motion } from "framer-motion";
import { CalendarDays, ClipboardCheck, Gauge, Layers3 } from "lucide-react";

export type OmniAssessmentData = {
  title: string;
  score: number;
  evaluationDate: string;
  assessmentType: string;
};

export default function OmniAssessmentCard({
  assessment,
}: {
  assessment: OmniAssessmentData;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-5 w-5 text-cyan-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Latest Assessment
          </p>
        </div>

        <h3 className="mt-6 text-3xl font-black text-white">
          {assessment.title}
        </h3>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Info
            icon={<Gauge className="h-4 w-4 text-cyan-200" />}
            label="Assessment Score"
            value={`${assessment.score}%`}
          />

          <Info
            icon={<CalendarDays className="h-4 w-4 text-purple-200" />}
            label="Evaluation Date"
            value={assessment.evaluationDate}
          />

          <Info
            icon={<Layers3 className="h-4 w-4 text-emerald-200" />}
            label="Assessment Type"
            value={assessment.assessmentType}
          />
        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${assessment.score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
          />
        </div>
      </div>
    </motion.article>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      {icon}

      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
