"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";

import type { ProfileAchievement } from "@/types/profile";

export default function PublicProfileAchievements({
  achievements,
}: {
  achievements: ProfileAchievement[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
          Achievements
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Engineering Badges
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement, index) => (
            <motion.article
              key={achievement.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.018 }}
              className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                <Award className="h-6 w-6 text-amber-200" />
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                {achievement.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/48">
                {achievement.description}
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${achievement.progress ?? 0}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400"
                />
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                <BadgeCheck className="h-4 w-4" />
                Public Badge
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
