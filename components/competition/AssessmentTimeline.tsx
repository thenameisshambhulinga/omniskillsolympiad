"use client";

import { motion } from "framer-motion";
import { Award, ClipboardCheck, Eye, TrendingUp } from "lucide-react";

import type { OfflineAssessment } from "@/lib/profile/assessment-ledger";

export default function AssessmentTimeline({
  latestAssessment,
}: {
  latestAssessment: OfflineAssessment | null;
}) {
  if (!latestAssessment) {
    return (
      <section className="relative overflow-hidden rounded-[3rem] border border-purple-400/20 bg-purple-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
          Evaluation Timeline
        </p>

        <div className="mt-7 rounded-[2rem] border border-dashed border-white/15 bg-black/25 p-6">
          <h3 className="text-2xl font-black text-white">
            No evaluation timeline yet
          </h3>
          <p className="mt-3 text-sm font-semibold leading-7 text-white/55">
            Timeline entries will appear after real assessment records are
            connected.
          </p>
        </div>
      </section>
    );
  }

  const timeline = [
    {
      title: "Assessment Completed",
      description: latestAssessment.title,
      icon: ClipboardCheck,
    },
    {
      title: "Mentor Review",
      description: `${latestAssessment.evaluatorType} evaluation recorded`,
      icon: Eye,
    },
    {
      title: "Stage Completion",
      description: `${latestAssessment.category} progress updated`,
      icon: Award,
    },
    {
      title: "Readiness Update",
      description: `+${latestAssessment.readinessImpact} readiness impact`,
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-purple-400/20 bg-purple-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
          Evaluation Timeline
        </p>

        <div className="mt-7 space-y-5">
          {timeline.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.05 }}
                className="relative rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                {index < timeline.length - 1 && (
                  <div className="absolute left-8 top-[4.5rem] h-7 w-px bg-white/15" />
                )}

                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-purple-400/25 bg-purple-400/10">
                    <Icon className="h-5 w-5 text-purple-200" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
