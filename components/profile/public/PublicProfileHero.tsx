"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Flame,
  GraduationCap,
  Medal,
  Palette,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";

import type { EngineeringProfile } from "@/types/profile";
import {
  getTierProgress,
  getVibgyorProgress,
  type VibgyorProgress,
} from "@/lib/profile/tier-engine";

function getStageAccent(stage: VibgyorProgress["currentStage"]) {
  const styles: Record<VibgyorProgress["currentStage"], string> = {
    Violet: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    Indigo: "border-indigo-400/25 bg-indigo-400/10 text-indigo-200",
    Blue: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    Green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    Yellow: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
    Orange: "border-orange-400/25 bg-orange-400/10 text-orange-200",
    Red: "border-red-400/25 bg-red-400/10 text-red-200",
  };

  return styles[stage];
}

export default function PublicProfileHero({
  profile,
}: {
  profile: EngineeringProfile;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const tierProgress = getTierProgress(profile.siliconPoints ?? 0);
  const vibgyorProgress = getVibgyorProgress(profile.siliconPoints ?? 0);
  const stageAccent = getStageAccent(vibgyorProgress.currentStage);

  const stats = [
    { label: "Tier", value: profile.tier, icon: Medal },
    { label: "Silicon Points", value: profile.siliconPoints, icon: Zap },
    { label: "National Rank", value: profile.nationalRank, icon: Trophy },
    { label: "Streak", value: `${profile.streak} Days`, icon: Flame },
  ];

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_34px_160px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%)]" />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <motion.div
            whileHover={{ scale: 1.03, rotate: -1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[2.5rem] border border-cyan-400/30 bg-black/40 shadow-[0_0_70px_rgba(34,211,238,0.2)]"
          >
            {profile.image && !imageFailed ? (
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                sizes="160px"
                onError={() => setImageFailed(true)}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cyan-400/10">
                <UserRound className="h-16 w-16 text-cyan-200" />
              </div>
            )}
          </motion.div>

          <div className="min-w-0">
            <p className="section-label">Public Engineering Identity</p>

            <h1 className="mt-4 truncate text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-linear-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>

            <p className="mt-3 break-words text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
              {profile.omniId}
            </p>

            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/65">
              {profile.bio}
            </p>

            <div className="mt-5 grid gap-2 text-sm text-white/62">
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-200" />
                <span className="truncate">{profile.college}</span>
              </p>

              <p className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-200" />
                <span className="truncate">
                  {profile.branch} • {profile.course} • Semester{" "}
                  {profile.semester}
                </span>
              </p>

              <p className="truncate">
                {profile.university} • {profile.state} • {profile.district}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="metric-label">{item.label}</p>
                    <p className="mt-3 text-2xl font-black text-white">
                      {item.value}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
                    <Icon className="h-5 w-5 text-cyan-200" />
                  </div>
                </div>
              </motion.article>
            );
          })}

          <PublicProgressCard
            title="Tier Progress"
            value={tierProgress.currentTier}
            helper={
              tierProgress.nextTier
                ? `${tierProgress.points} / ${tierProgress.nextMin} Points`
                : "Maximum tier achieved"
            }
            subHelper={
              tierProgress.pointsToNextTier !== null && tierProgress.nextTier
                ? `${tierProgress.pointsToNextTier} Points To ${tierProgress.nextTier}`
                : ""
            }
            percent={tierProgress.progressPercent}
            className="border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
          />

          <PublicProgressCard
            title="Engineering Journey"
            value={vibgyorProgress.currentStage}
            helper={
              vibgyorProgress.nextStage
                ? `${vibgyorProgress.points} / ${vibgyorProgress.nextMin} Points`
                : "Final VIBGYOR stage achieved"
            }
            subHelper={
              vibgyorProgress.pointsToNextStage !== null &&
              vibgyorProgress.nextStage
                ? `${vibgyorProgress.pointsToNextStage} Points To ${vibgyorProgress.nextStage}`
                : ""
            }
            percent={vibgyorProgress.progressPercent}
            className={stageAccent}
            icon={<Palette className="h-4 w-4" />}
          />
        </div>
      </div>
    </section>
  );
}

function PublicProgressCard({
  title,
  value,
  helper,
  subHelper,
  percent,
  className,
  icon,
}: {
  title: string;
  value: string;
  helper: string;
  subHelper: string;
  percent: number;
  className: string;
  icon?: React.ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[2rem] border p-5 backdrop-blur-xl sm:col-span-2 ${className}`}
    >
      <div className="flex items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <p className="metric-label">{title}</p>
          </div>

          <p className="mt-3 text-2xl font-black">{value}</p>

          <p className="mt-2 text-sm font-semibold text-white/55">{helper}</p>

          {subHelper && (
            <p className="mt-1 text-sm font-bold text-cyan-200">{subHelper}</p>
          )}
        </div>

        <p className="text-3xl font-black">{percent}%</p>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7 }}
          className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400"
        />
      </div>
    </article>
  );
}
