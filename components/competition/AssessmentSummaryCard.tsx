"use client";

import { motion } from "framer-motion";
import { CalendarDays, ClipboardCheck, Gauge, TrendingUp } from "lucide-react";

import type { OfflineAssessment } from "@/lib/profile/assessment-ledger";

export default function AssessmentSummaryCard({
  assessment,
}: {
  assessment: OfflineAssessment | null;
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

        {assessment ? (
          <>
            <h3 className="mt-6 text-3xl font-black text-white">
              {assessment.title}
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Info icon={<Gauge className="h-4 w-4 text-cyan-200" />} label="Score" value={`${assessment.score}%`} />
              <Info icon={<TrendingUp className="h-4 w-4 text-emerald-200" />} label="Readiness Impact" value={`+${assessment.readinessImpact}`} />
              <Info icon={<ClipboardCheck className="h-4 w-4 text-purple-200" />} label="Category" value={assessment.category} />
              <Info icon={<CalendarDays className="h-4 w-4 text-amber-200" />} label="Date" value={assessment.date} />
            </div>

            <p className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-semibold leading-7 text-white/60">
              {assessment.notes}
            </p>
          </>
        ) : (
          <div className="mt-7 rounded-[2rem] border border-dashed border-white/15 bg-black/25 p-6">
            <h3 className="text-2xl font-black text-white">
              No assessment recorded yet
            </h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/55">
              Offline assessment data will appear here after it is added through
              a real verification-backed workflow.
            </p>
          </div>
        )}
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