"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck, Lock, Star } from "lucide-react";

import type { ProfileAchievement } from "@/types/profile";

export default function ProfileAchievements({
  achievements,
}: {
  achievements: ProfileAchievement[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
        Achievement Badges
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {achievements.map((achievement, index) => {
          const Icon =
            achievement.status === "unlocked"
              ? BadgeCheck
              : achievement.status === "progress"
                ? Star
                : Lock;

          return (
            <motion.article
              key={achievement.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: index * 0.05 }}
              className="rounded-[1.75rem] border border-white/10 bg-black/25 p-4 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.045]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
                <Icon className="h-6 w-6 text-cyan-200" />
              </div>

              <h3 className="text-sm font-black text-white">
                {achievement.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-white/50">
                {achievement.description}
              </p>

              {achievement.status === "progress" && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-300 to-purple-400"
                    style={{ width: `${achievement.progress ?? 0}%` }}
                  />
                </div>
              )}

              {achievement.status === "unlocked" && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                  <Award className="h-3.5 w-3.5" />
                  Unlocked
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
