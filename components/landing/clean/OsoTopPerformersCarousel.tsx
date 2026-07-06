"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Crown,
  Flame,
  GraduationCap,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

export type TopPerformerItem = {
  id: string;
  rank: number;
  name: string;
  imageUrl: string | null;
  omniId: string;
  college: string;
  branch: string;
  state: string;
  siliconPoints: number;
  streak: number;
  completedChallenges: number;
  accuracy: number;
};

type OsoTopPerformersCarouselProps = {
  performers: TopPerformerItem[];
};

export default function OsoTopPerformersCarousel({
  performers,
}: OsoTopPerformersCarouselProps) {
  const safePerformers = useMemo(() => performers.slice(0, 10), [performers]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (safePerformers.length === 0) return;

    setActiveIndex((current) =>
      current >= safePerformers.length ? 0 : current,
    );
  }, [safePerformers.length]);

  useEffect(() => {
    if (paused || safePerformers.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        current === safePerformers.length - 1 ? 0 : current + 1,
      );
    }, 4200);

    return () => window.clearInterval(timer);
  }, [paused, safePerformers.length]);

  useEffect(() => {
    document
      .getElementById(`oso-top-performer-${activeIndex}`)
      ?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }, [activeIndex]);

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? safePerformers.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === safePerformers.length - 1 ? 0 : current + 1,
    );
  };

  const activePerformer = safePerformers[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] py-16 sm:py-20">
      <div className="oso-container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(37,99,235,0.42),transparent_30%),radial-gradient(circle_at_52%_8%,rgba(34,211,238,0.28),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(250,204,21,0.24),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]"
          />

          <div className="relative z-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-white/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-xl">
                  <Trophy className="h-4 w-4" />
                  Top Performers Leaderboard
                </div>

                <h2 className="mt-5 max-w-5xl text-4xl font-black leading-tight text-white sm:text-5xl">
                  Meet the students leading the OMNI skill arena.
                </h2>

                <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-white/70">
                  A high-impact ranking carousel inspired by match-day performer
                  cards. Top students are ranked using Silicon Points, challenge
                  activity and skill progress signals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={safePerformers.length <= 1}
                  aria-label="Previous performer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_0_18px_rgba(34,211,238,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={safePerformers.length <= 1}
                  aria-label="Next performer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_0_18px_rgba(34,211,238,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {safePerformers.length > 0 ? (
              <>
                <div
                  className="relative mt-10"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 left-0 top-0 z-20 w-16 bg-gradient-to-r from-slate-950 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 right-0 top-0 z-20 w-16 bg-gradient-to-l from-slate-950 to-transparent"
                  />

                  <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-5 [scrollbar-color:#22d3ee_transparent] [scrollbar-width:thin]">
                    {safePerformers.map((performer, index) => {
                      const active = index === activeIndex;
                      const distance = Math.abs(index - activeIndex);
                      const tone = getRankTone(performer.rank);

                      return (
                        <button
                          id={`oso-top-performer-${index}`}
                          key={performer.id}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          className={`group relative w-[320px] shrink-0 snap-center overflow-hidden rounded-[2rem] border text-left transition-all duration-500 ease-out sm:w-[370px] ${
                            active
                              ? "scale-[1.035] border-cyan-200/70 bg-white text-slate-950 shadow-[0_36px_110px_rgba(34,211,238,0.22),0_20px_70px_rgba(15,23,42,0.34)]"
                              : distance === 1
                                ? "scale-[0.94] border-white/15 bg-white/10 text-white opacity-85 shadow-[0_18px_60px_rgba(0,0,0,0.18)] hover:scale-[0.98]"
                                : "scale-[0.88] border-white/10 bg-white/[0.065] text-white opacity-55 shadow-[0_14px_44px_rgba(0,0,0,0.14)] hover:opacity-80"
                          }`}
                        >
                          <div
                            aria-hidden="true"
                            className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${tone.gradient}`}
                          />

                          <div
                            aria-hidden="true"
                            className={`absolute -right-20 -top-20 h-52 w-52 rounded-full ${tone.glow} blur-3xl opacity-80 transition group-hover:scale-125`}
                          />

                          <div
                            aria-hidden="true"
                            className={`absolute -bottom-24 -left-24 h-56 w-56 rounded-full ${tone.glow} blur-3xl opacity-60 transition group-hover:scale-110`}
                          />

                          <div className="relative z-10 p-5">
                            <div className="relative h-48 overflow-hidden rounded-[1.55rem] border border-white/20 bg-slate-900 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
                              {performer.imageUrl ? (
                                <img
                                  src={performer.imageUrl}
                                  alt={performer.name}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div
                                  className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tone.gradient}`}
                                >
                                  <span className="text-7xl font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.26)]">
                                    {getInitials(performer.name)}
                                  </span>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur-xl">
                                <Crown className="h-3.5 w-3.5 text-yellow-300" />
                                Rank #{performer.rank}
                              </div>

                              <div className="absolute bottom-4 left-4 right-4">
                                <p className="line-clamp-1 text-2xl font-black text-white">
                                  {performer.name}
                                </p>
                                <p className="mt-1 line-clamp-1 text-sm font-bold text-white/70">
                                  {performer.college}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <PerformerPill
                                active={active}
                                icon={<Zap className="h-3.5 w-3.5" />}
                                label={`${performer.siliconPoints} Points`}
                              />
                              <PerformerPill
                                active={active}
                                icon={<Flame className="h-3.5 w-3.5" />}
                                label={`${performer.streak} Streak`}
                              />
                            </div>

                            <div className="mt-5 grid grid-cols-3 gap-3">
                              <PerformerMetric
                                active={active}
                                label="Accuracy"
                                value={`${performer.accuracy}%`}
                              />
                              <PerformerMetric
                                active={active}
                                label="Done"
                                value={performer.completedChallenges}
                              />
                              <PerformerMetric
                                active={active}
                                label="State"
                                value={performer.state}
                              />
                            </div>

                            <div
                              className={`grid transition-all duration-500 ease-out ${
                                active
                                  ? "mt-5 grid-rows-[1fr] opacity-100"
                                  : "mt-0 grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4 text-slate-700">
                                  <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-blue-700" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                                      Performer Profile
                                    </p>
                                  </div>

                                  <p className="mt-3 text-sm font-semibold leading-7">
                                    {performer.name} is currently leading with{" "}
                                    <span className="font-black text-slate-950">
                                      {performer.siliconPoints}
                                    </span>{" "}
                                    Silicon Points,{" "}
                                    <span className="font-black text-slate-950">
                                      {performer.completedChallenges}
                                    </span>{" "}
                                    completed challenge signals and{" "}
                                    <span className="font-black text-slate-950">
                                      {performer.accuracy}%
                                    </span>{" "}
                                    performance accuracy.
                                  </p>

                                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                    <MiniProfileSignal
                                      icon={<GraduationCap className="h-4 w-4" />}
                                      label={performer.branch}
                                    />
                                    <MiniProfileSignal
                                      icon={<Target className="h-4 w-4" />}
                                      label={performer.omniId}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activePerformer ? (
                  <div className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
                    <ActiveSignal
                      icon={<Medal className="h-4 w-4" />}
                      label={`#${activePerformer.rank}`}
                    />
                    <ActiveSignal
                      icon={<Sparkles className="h-4 w-4" />}
                      label={activePerformer.name}
                    />
                    <ActiveSignal
                      icon={<Zap className="h-4 w-4" />}
                      label={`${activePerformer.siliconPoints} Points`}
                    />
                  </div>
                ) : null}

                <div className="mt-8 flex justify-center">
                  <Link
                    href="/daily-leaderboard"
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-cyan-300/35 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(34,211,238,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-cyan-400/15 hover:shadow-[0_0_32px_rgba(34,211,238,0.34)]"
                  >
                    View Full Leaderboard
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-10 rounded-[2rem] border border-dashed border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
                <Trophy className="mx-auto h-10 w-10 text-cyan-200" />
                <h3 className="mt-4 text-2xl font-black text-white">
                  Top performers will appear here soon.
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-white/65">
                  Once students complete challenges and earn Silicon Points, the
                  live performer carousel will automatically populate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PerformerPill({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={
        active
          ? "inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-blue-700"
          : "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-white/75"
      }
    >
      {icon}
      {label}
    </span>
  );
}

function PerformerMetric({
  label,
  value,
  active,
}: {
  label: string;
  value: string | number;
  active: boolean;
}) {
  return (
    <div
      className={
        active
          ? "rounded-2xl border border-slate-200 bg-white p-3 text-slate-950"
          : "rounded-2xl border border-white/15 bg-white/10 p-3 text-white"
      }
    >
      <p className={active ? "text-[10px] font-black uppercase tracking-[0.14em] text-slate-400" : "text-[10px] font-black uppercase tracking-[0.14em] text-white/45"}>
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-black">{value}</p>
    </div>
  );
}

function MiniProfileSignal({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-slate-700">
      <span className="text-blue-700">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}

function ActiveSignal({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-cyan-100">
      {icon}
      {label}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "O";
  const second = parts[1]?.[0] ?? "S";

  return `${first}${second}`.toUpperCase();
}

function getRankTone(rank: number) {
  if (rank === 1) {
    return {
      gradient: "from-yellow-300 via-amber-400 to-orange-500",
      glow: "bg-yellow-300/35",
    };
  }

  if (rank === 2) {
    return {
      gradient: "from-cyan-300 via-sky-400 to-blue-500",
      glow: "bg-cyan-300/35",
    };
  }

  if (rank === 3) {
    return {
      gradient: "from-emerald-300 via-teal-400 to-cyan-500",
      glow: "bg-emerald-300/35",
    };
  }

  return {
    gradient: "from-blue-500 via-violet-500 to-fuchsia-500",
    glow: "bg-blue-400/30",
  };
}