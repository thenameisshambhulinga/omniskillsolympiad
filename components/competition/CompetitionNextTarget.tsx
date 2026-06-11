"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Route, Target, Trophy, Zap } from "lucide-react";

import type { CompetitionPassport } from "@/lib/profile/competition-passport";

export default function CompetitionNextTarget({
  passport,
}: {
  passport: CompetitionPassport;
}) {
  const targets = [
    {
      label: "Next Stage",
      value: passport.nextStage,
      icon: Route,
    },
    {
      label: "Points Required",
      value: `${passport.pointsRequired} Points`,
      icon: Zap,
    },
    {
      label: "Steps Required",
      value: `${passport.stepsRequired} Steps`,
      icon: Target,
    },
    {
      label: "Target Readiness",
      value: `${passport.targetReadiness}%`,
      icon: Trophy,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <ArrowUpRight className="h-5 w-5 text-cyan-200" />

          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Next Target
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {targets.map((target, index) => {
            const Icon = target.icon;

            return (
              <motion.article
                key={target.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <Icon className="h-5 w-5 text-cyan-200" />

                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {target.label}
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {target.value}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
