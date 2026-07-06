"use client";

import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Gauge } from "lucide-react";

import RankPodiumCard from "@/components/rank/RankPodiumCard";
import type { EngineeringProfile } from "@/types/profile";

export default function PublicProfileStats({
  profile,
}: {
  profile: EngineeringProfile;
}) {
  const stats = [
    {
      label: "Challenges Solved",
      value: String(profile.challengesSolved),
      icon: CheckCircle2,
    },
    {
      label: "Average Accuracy",
      value: `${profile.averageAccuracy}%`,
      icon: Gauge,
    },
    {
      label: "OMNI Score",
      value: String(profile.omniScore),
      icon: BarChart3,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <RankPodiumCard
        title="National Rank"
        rank={profile.nationalRank}
        score={profile.omniScore}
        tier={profile.tier}
      />

      <RankPodiumCard
        title="State Rank"
        rank={profile.stateRank}
        score={profile.omniScore}
        tier={profile.tier}
      />

      <RankPodiumCard
        title="College Rank"
        rank={profile.collegeRank}
        score={profile.omniScore}
        tier={profile.tier}
      />

      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.42,
              delay: index * 0.04,
            }}
            whileHover={{
              y: -4,
              scale: 1.012,
            }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
          >
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="metric-label">{stat.label}</p>

                <p className="mt-4 text-4xl font-black text-white">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
                <Icon className="h-5 w-5 text-cyan-200" />
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
