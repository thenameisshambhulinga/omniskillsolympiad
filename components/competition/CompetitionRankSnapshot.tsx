"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Trophy, TrendingUp } from "lucide-react";

import type { CompetitionPassport } from "@/lib/profile/competition-passport";

export default function CompetitionRankSnapshot({
  passport,
}: {
  passport: CompetitionPassport;
}) {
  const ranks = [
    {
      label: "National Rank",
      value: passport.currentRank,
      icon: Trophy,
    },
    {
      label: "State Rank",
      value: passport.stateRank,
      icon: MapPin,
    },
    {
      label: "College Rank",
      value: passport.collegeRank,
      icon: GraduationCap,
    },
    {
      label: "Rank Change",
      value:
        passport.rankChange > 0
          ? `↑ +${passport.rankChange} This Week`
          : "Tracking",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-amber-400/20 bg-amber-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
          Rank Snapshot
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {ranks.map((rank, index) => {
            const Icon = rank.icon;

            return (
              <motion.article
                key={rank.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <Icon className="h-5 w-5 text-amber-200" />

                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  {rank.label}
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  {rank.value}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
