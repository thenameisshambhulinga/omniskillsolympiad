"use client";

import AchievementBadge from "@/components/profile/AchievementBadge";
import type { ProfileAchievement } from "@/types/profile";

export default function AchievementGrid({
  achievements,
}: {
  achievements: ProfileAchievement[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_34%)]"
      />

      <div className="relative z-10">
        <p className="section-label text-amber-300">Achievement Engine</p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">
              Engineering Badges
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
              Badges are calculated from real platform activity, skills,
              streaks, and Silicon Points.
            </p>
          </div>

          <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
            {achievements.length} Badges
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </section>
  );
}
