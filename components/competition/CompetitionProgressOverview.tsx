"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers3,
} from "lucide-react";

import type { CompetitionPassport } from "@/lib/profile/competition-passport";

export default function CompetitionProgressOverview({
  passport,
}: {
  passport: CompetitionPassport;
}) {
  const overview = [
    {
      label: "Journey Completion",
      value: `${passport.journeyCompletion}%`,
      icon: BarChart3,
    },
    {
      label: "Completed Stages",
      value: passport.completedStages,
      icon: Layers3,
    },
    {
      label: "Completed Steps",
      value: passport.completedSteps,
      icon: CheckCircle2,
    },
    {
      label: "Remaining Steps",
      value: passport.remainingSteps,
      icon: Clock,
    },
    {
      label: "Current Momentum",
      value: passport.currentMomentum,
      icon: Activity,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          Progress Overview
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {overview.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <Icon className="h-5 w-5 text-emerald-200" />

                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {item.label}
                </p>

                <p className="mt-2 truncate text-2xl font-black text-white">
                  {item.value}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${passport.journeyCompletion}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300"
          />
        </div>
      </div>
    </section>
  );
}
