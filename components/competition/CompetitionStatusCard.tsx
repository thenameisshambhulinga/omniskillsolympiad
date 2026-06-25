"use client";

import { motion } from "framer-motion";
import { Activity, Gauge, Layers3, Medal, Route } from "lucide-react";

import type { CompetitionPassport } from "@/lib/profile/competition-passport";

export default function CompetitionStatusCard({
  passport,
}: {
  passport: CompetitionPassport;
}) {
  const status = [
    {
      label: "Current Stage",
      value: passport.currentStage,
      icon: Layers3,
    },
    {
      label: "Current OMNI Step",
      value: passport.currentStep,
      icon: Route,
    },
    {
      label: "Current Tier",
      value: passport.currentTier,
      icon: Medal,
    },
    {
      label: "Latest Assessment Score",
      value: `${passport.latestAssessmentScore}%`,
      icon: Gauge,
    },
    {
      label: "Current Readiness Level",
      value: passport.readinessLevel,
      icon: Activity,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:p-8">
      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-purple-300">
          Passport Status
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {status.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.012 }}
                className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                <Icon className="h-5 w-5 text-purple-200" />

                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {item.label}
                </p>

                <p className="mt-3 line-clamp-2 text-xl font-black text-white">
                  {item.value}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
