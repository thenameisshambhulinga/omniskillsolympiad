"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  Medal,
  Palette,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";

import type { EngineeringProfile } from "@/types/profile";
import {
  getVibgyorProgress,
  type TierProgress,
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

export default function ProfileHero({
  profile,
  completionPercent,
  publicProfilePath,
  tierProgress,
}: {
  profile: EngineeringProfile;
  completionPercent: number;
  publicProfilePath: string;
  tierProgress?: TierProgress;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const vibgyorProgress = getVibgyorProgress(profile.siliconPoints ?? 0);
  const stageAccent = getStageAccent(vibgyorProgress.currentStage);

  const metrics = [
    { label: "Engineering Tier", value: profile.tier, icon: Medal },
    { label: "Silicon Points", value: profile.siliconPoints, icon: Zap },
    { label: "National Rank", value: profile.nationalRank, icon: Trophy },
    { label: "Day Streak", value: profile.streak, icon: Flame },
  ];

  const copyProfile = async () => {
    const url = `${window.location.origin}${publicProfilePath}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_34px_140px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7 lg:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%)]"
      />

      <div className="relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-stretch">
        <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center">
          <motion.div
            whileHover={{ scale: 1.025, rotate: -1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="relative h-36 w-36 shrink-0 overflow-hidden rounded-[2rem] border border-cyan-400/30 bg-black/40 shadow-[0_0_70px_rgba(34,211,238,0.2)] sm:h-40 sm:w-40"
          >
            {profile.image && !imageFailed ? (
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                priority
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
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Engineering Identity
            </div>

            <h1 className="mt-4 truncate bg-linear-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-3 break-words text-lg font-black tracking-wide text-cyan-200">
              {profile.omniId}
            </p>

            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              {profile.bio}
            </p>

            <div className="mt-5 grid gap-2 text-sm leading-6 text-white/62 sm:text-base">
              <p className="truncate">{profile.college}</p>
              <p className="truncate">
                {profile.branch} • {profile.course} • Semester{" "}
                {profile.semester}
              </p>
              <p className="truncate">
                {profile.university} • {profile.state} • {profile.district}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyProfile}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-400/15"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy Profile Link"}
              </button>

              <Link
                href={publicProfilePath}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
                View Public Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.012 }}
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl"
              >
                <Icon className="mb-4 h-5 w-5 text-cyan-200" />
                <p className="metric-label">{stat.label}</p>
                <p className="mt-3 truncate text-3xl font-black text-white">
                  {stat.value}
                </p>
              </motion.article>
            );
          })}

          {tierProgress && (
            <ProgressCard
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
          )}

          <ProgressCard
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

          <article className="relative overflow-hidden rounded-[1.75rem] border border-purple-400/20 bg-purple-400/10 p-5 backdrop-blur-xl sm:col-span-2">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="metric-label">Profile Completion</p>
                <p className="mt-3 text-3xl font-black text-white">
                  {completionPercent}%
                </p>
              </div>

              <div
                className="grid h-20 w-20 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(rgb(34 211 238) ${completionPercent}%, rgba(255,255,255,0.1) 0)`,
                }}
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-sm font-black text-white">
                  {completionPercent}%
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function ProgressCard({
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
      className={`relative overflow-hidden rounded-[1.75rem] border p-5 backdrop-blur-xl sm:col-span-2 ${className}`}
    >
      <div className="flex items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <p className="metric-label">{title}</p>
          </div>

          <p className="mt-3 text-3xl font-black">{value}</p>

          <p className="mt-2 text-sm font-semibold text-white/55">{helper}</p>

          {subHelper && (
            <p className="mt-1 text-sm font-bold text-cyan-200">{subHelper}</p>
          )}
        </div>

        <p className="text-4xl font-black">{percent}%</p>
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
