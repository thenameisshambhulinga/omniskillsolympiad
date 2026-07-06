"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Gauge, Medal, Route, Trophy, Zap } from "lucide-react";

import type { CompetitionPassport } from "@/lib/profile/competition-passport";

export default function CompetitionPassportHero({
  passport,
}: {
  passport: CompetitionPassport;
}) {
  const cards = [
    {
      label: "OMNI ID",
      value: passport.omniId,
      icon: BadgeCheck,
    },
    {
      label: "Current Stage",
      value: passport.currentStage,
      icon: Route,
    },
    {
      label: "Current Tier",
      value: passport.currentTier,
      icon: Medal,
    },
    {
      label: "Silicon Points",
      value: passport.currentSiliconPoints,
      icon: Zap,
    },
    {
      label: "Current Rank",
      value: passport.currentRank,
      icon: Trophy,
    },
    {
      label: "Journey Completion",
      value: `${passport.journeyCompletion}%`,
      icon: Gauge,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[3rem] border border-cyan-400/20 bg-white/[0.045] p-6 shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.15),transparent_34%)]" />

      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
          Competition Passport
        </p>

        <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
          Live Offline Competition
          <span className="block bg-gradient-to-r from-cyan-200 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            Progress Identity
          </span>
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ y: -5, scale: 1.012 }}
                className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
              >
                <Icon className="h-5 w-5 text-cyan-200" />

                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {card.label}
                </p>

                <p className="mt-3 truncate text-2xl font-black text-white">
                  {card.value}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
            Engineering Readiness
          </p>

          <p className="mt-3 text-4xl font-black text-white">
            {passport.engineeringReadiness}% — {passport.readinessLevel}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
