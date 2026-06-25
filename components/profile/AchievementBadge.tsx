"use client";

import { motion } from "framer-motion";
import {
  Award,
  Brain,
  CircuitBoard,
  Flame,
  Lock,
  Medal,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import type {
  ProfileAchievement,
  ProfileAchievementIcon,
} from "@/types/profile";

const iconMap: Record<
  ProfileAchievementIcon,
  React.ComponentType<{ className?: string }>
> = {
  award: Award,
  brain: Brain,
  circuit: CircuitBoard,
  flame: Flame,
  medal: Medal,
  shield: Shield,
  star: Star,
  target: Target,
  trophy: Trophy,
  zap: Zap,
};

export default function AchievementBadge({
  achievement,
}: {
  achievement: ProfileAchievement;
}) {
  const isEarned = achievement.status === "unlocked";
  const isProgress = achievement.status === "progress";
  const progress = Math.min(100, Math.max(0, achievement.progress ?? 0));
  const Icon = iconMap[achievement.icon ?? "trophy"] ?? Trophy;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.018 }}
      transition={{ duration: 0.42 }}
      className={
        isEarned
          ? "relative overflow-hidden rounded-[2rem] border border-amber-400/25 bg-amber-400/10 p-5 shadow-[0_0_44px_rgba(251,191,36,0.16)]"
          : isProgress
            ? "relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5"
            : "relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5"
      }
    >
      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
          {isEarned || isProgress ? (
            <Icon
              className={
                isEarned ? "h-6 w-6 text-amber-200" : "h-6 w-6 text-cyan-200"
              }
            />
          ) : (
            <Lock className="h-6 w-6 text-white/30" />
          )}
        </div>

        <h3 className="mt-5 text-lg font-black text-white">
          {achievement.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          {achievement.description}
        </p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400"
          />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/45">
          {isEarned
            ? "Unlocked Badge"
            : isProgress
              ? `${progress}% Progress`
              : "Locked Badge"}
        </p>
      </div>
    </motion.article>
  );
}
