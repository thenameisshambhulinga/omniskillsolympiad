"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  CircuitBoard,
  Cpu,
  GraduationCap,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
  Zap,
} from "lucide-react";

import PosterAnnouncementCarousel, {
  type PosterAnnouncement,
} from "@/components/landing/PosterAnnouncementCarousel";

type OsoHeroExperienceProps = {
  posters: PosterAnnouncement[];
};

const heroMetrics = [
  {
    label: "Daily Skill Missions",
    value: "Live",
  },
  {
    label: "Engineering Tracks",
    value: "20+",
  },
  {
    label: "Growth Loop",
    value: "7 Stage",
  },
];

const valuePillars = [
  {
    icon: BrainCircuit,
    title: "Learn",
    description: "Practice applied engineering skills.",
  },
  {
    icon: Zap,
    title: "Compete",
    description: "Attempt challenges and missions.",
  },
  {
    icon: Trophy,
    title: "Get Ranked",
    description: "Earn recognition through performance.",
  },
];

const ecosystemCards = [
  {
    icon: GraduationCap,
    label: "For Students",
    value: "Skills • Rankings • Recognition",
  },
  {
    icon: UsersRound,
    label: "For Colleges",
    value: "Engagement • Benchmarking • Visibility",
  },
  {
    icon: CircuitBoard,
    label: "For Industry",
    value: "Talent Pipeline • Challenges • Innovation",
  },
];

export default function OsoHeroExperience({ posters }: OsoHeroExperienceProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 overflow-hidden px-4 pb-16 pt-5 text-white sm:px-6 md:px-10 lg:px-12 lg:pb-20 lg:pt-8">
      <HeroBackground />

      <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-8 xl:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 28, filter: "blur(10px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.35rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_140px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.14)]">
                <Radio className="h-4 w-4" />
                Omni Skills Olympiad
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-purple-100">
                <Sparkles className="h-4 w-4" />
                Engineering Skills League
              </span>
            </div>

            <h1 className="mt-7 max-w-5xl text-4xl font-black leading-[1.03] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl 2xl:text-7xl">
              India&apos;s Engineering Skills Competition Ecosystem
            </h1>

            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-300 sm:text-lg lg:text-xl lg:leading-9">
              Learn, practice, compete, get ranked and build an industry-ready
              engineering identity through daily challenges, competitions,
              Omni Score, Silicon Points and national-level recognition.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Learn", "Practice", "Compete", "Innovate", "Get Ranked"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300 backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#061019] shadow-[0_0_44px_rgba(34,211,238,0.24)] outline-none transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-100 hover:shadow-[0_0_54px_rgba(34,211,238,0.34)] focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                Register as Student
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/competition"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.055] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white outline-none backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-purple-300/45 hover:bg-purple-300/10 hover:text-purple-100 focus-visible:ring-2 focus-visible:ring-purple-300/70"
              >
                Explore Competitions
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.35rem] border border-white/10 bg-black/22 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-cyan-300/[0.07]"
                >
                  <p className="text-2xl font-black text-white">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {valuePillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <div
                    key={pillar.title}
                    className="group rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.06]"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 transition group-hover:scale-105">
                      <Icon className="h-4 w-4" />
                    </div>

                    <h3 className="mt-3 text-base font-black text-white">
                      {pillar.title}
                    </h3>

                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-400">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 28, filter: "blur(10px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-5"
        >
          <PosterAnnouncementCarousel
            posters={posters}
            className="min-h-[31rem] xl:min-h-[35rem]"
          />

          <div className="grid gap-3 md:grid-cols-3">
            {ecosystemCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.label}
                  href={
                    card.label === "For Students"
                      ? "/dashboard"
                      : card.label === "For Colleges"
                        ? "/competition"
                        : "/admin"
                  }
                  className="group rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4 outline-none backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-cyan-300/[0.075] focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/24 text-cyan-100 transition group-hover:bg-cyan-300/15">
                      <Icon className="h-4 w-4" />
                    </span>

                    <ArrowRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
                  </div>

                  <p className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-white">
                    {card.label}
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                    {card.value}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/24 p-5 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <CalendarDays className="h-5 w-5" />
              </span>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                  Next module preview
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  How It Works will convert this hero into a complete guided
                  homepage journey.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.26),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(34,211,238,0.18),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.1),rgba(2,6,23,0.94))]" />
      <div className="absolute left-[-160px] top-[8%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute right-[-180px] top-[16%] h-[520px] w-[520px] rounded-full bg-cyan-500/16 blur-3xl" />
      <div className="absolute bottom-[-200px] left-[35%] h-[420px] w-[420px] rounded-full bg-blue-500/12 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:88px_88px] opacity-45 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
    </div>
  );
}