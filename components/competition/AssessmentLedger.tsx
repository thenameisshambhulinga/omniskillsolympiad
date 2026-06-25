"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Lock } from "lucide-react";

import type { OfflineAssessment } from "@/lib/profile/assessment-ledger";

function getStatusIcon(status: OfflineAssessment["status"]) {
  if (status === "Completed") return CheckCircle2;
  if (status === "In Review") return Clock;
  return Lock;
}

function getStatusClass(status: OfflineAssessment["status"]) {
  if (status === "Completed") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "In Review") {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  return "border-white/10 bg-white/[0.04] text-white/40";
}

export default function AssessmentLedger({
  assessments,
}: {
  assessments: OfflineAssessment[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.48)] backdrop-blur-2xl lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.12),transparent_34%)]" />

      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
          Assessment Ledger
        </p>

        <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
          Offline Evaluation
          <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            History
          </span>
        </h2>

        {assessments.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-black/25 p-6">
            <h3 className="text-2xl font-black text-white">
              No assessment history available
            </h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/55">
              Real offline assessment records will appear here when database
              support is added.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {assessments.map((assessment, index) => {
              const StatusIcon = getStatusIcon(assessment.status);

              return (
                <motion.article
                  key={assessment.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, delay: index * 0.04 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                        {assessment.evaluatorType}
                      </p>

                      <h3 className="mt-2 truncate text-xl font-black text-white">
                        {assessment.category}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-white/50">
                        {assessment.date}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                          Score
                        </p>

                        <p className="mt-1 text-2xl font-black text-white">
                          {assessment.score}%
                        </p>
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black ${getStatusClass(
                          assessment.status,
                        )}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {assessment.status}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
