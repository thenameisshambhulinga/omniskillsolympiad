"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  Crown,
  Layers3,
  Medal,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";

type JourneyStep = {
  id: string;
  title: string;
  description: string;
  outcome: string;
  icon: LucideIcon;
  accent:
    | "cyan"
    | "purple"
    | "blue"
    | "emerald"
    | "amber"
    | "rose"
    | "violet"
    | "sky";
};

const journeySteps: JourneyStep[] = [
  {
    id: "01",
    title: "Student Registers",
    description:
      "Students enter OSO through a guided onboarding path built for engineering identity creation.",
    outcome: "Account ready",
    icon: UserPlus,
    accent: "cyan",
  },
  {
    id: "02",
    title: "Select Skill Domain",
    description:
      "They choose engineering tracks such as electronics, embedded systems, PCB, VLSI, robotics or IoT.",
    outcome: "Track selected",
    icon: Layers3,
    accent: "purple",
  },
  {
    id: "03",
    title: "Practice Challenges",
    description:
      "Daily missions convert theory into quick technical practice and practical problem-solving habits.",
    outcome: "Practice loop",
    icon: Target,
    accent: "blue",
  },
  {
    id: "04",
    title: "Submit & Compete",
    description:
      "Students participate in timed competitions with structured submissions and protected challenge flow.",
    outcome: "Attempt locked",
    icon: Send,
    accent: "emerald",
  },
  {
    id: "05",
    title: "Earn Omni Score",
    description:
      "Performance becomes a measurable engineering signal through score, accuracy and consistency.",
    outcome: "Skill measured",
    icon: BarChart3,
    accent: "amber",
  },
  {
    id: "06",
    title: "Gain Silicon Points",
    description:
      "Consistent effort is rewarded with progression points that keep students returning and improving.",
    outcome: "Progress earned",
    icon: Zap,
    accent: "rose",
  },
  {
    id: "07",
    title: "Climb Leaderboards",
    description:
      "Students compare growth through national, institutional and domain-based rankings.",
    outcome: "Rank visible",
    icon: Trophy,
    accent: "violet",
  },
  {
    id: "08",
    title: "Industry Readiness",
    description:
      "The journey builds a stronger portfolio, recognition layer and career-ready engineering confidence.",
    outcome: "Career signal",
    icon: BriefcaseBusiness,
    accent: "sky",
  },
];

const accentClasses: Record<
  JourneyStep["accent"],
  {
    border: string;
    bg: string;
    text: string;
    glow: string;
    dot: string;
  }
> = {
  cyan: {
    border: "border-cyan-300/35",
    bg: "bg-cyan-300/10",
    text: "text-cyan-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(34,211,238,0.18)]",
    dot: "bg-cyan-300",
  },
  purple: {
    border: "border-purple-300/35",
    bg: "bg-purple-300/10",
    text: "text-purple-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(168,85,247,0.18)]",
    dot: "bg-purple-300",
  },
  blue: {
    border: "border-blue-300/35",
    bg: "bg-blue-300/10",
    text: "text-blue-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(96,165,250,0.16)]",
    dot: "bg-blue-300",
  },
  emerald: {
    border: "border-emerald-300/35",
    bg: "bg-emerald-300/10",
    text: "text-emerald-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(110,231,183,0.16)]",
    dot: "bg-emerald-300",
  },
  amber: {
    border: "border-amber-300/35",
    bg: "bg-amber-300/10",
    text: "text-amber-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(252,211,77,0.14)]",
    dot: "bg-amber-300",
  },
  rose: {
    border: "border-rose-300/35",
    bg: "bg-rose-300/10",
    text: "text-rose-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(251,113,133,0.14)]",
    dot: "bg-rose-300",
  },
  violet: {
    border: "border-violet-300/35",
    bg: "bg-violet-300/10",
    text: "text-violet-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(196,181,253,0.16)]",
    dot: "bg-violet-300",
  },
  sky: {
    border: "border-sky-300/35",
    bg: "bg-sky-300/10",
    text: "text-sky-200",
    glow: "group-hover:shadow-[0_0_34px_rgba(125,211,252,0.16)]",
    dot: "bg-sky-300",
  },
};

export default function OsoHowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="relative z-10 overflow-hidden border-t border-white/10 px-4 py-16 text-white sm:px-6 md:px-10 lg:px-12 lg:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_90%_24%,rgba(168,85,247,0.13),transparent_30%)]" />
        <div className="absolute left-[-160px] top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-160px] bottom-16 h-[460px] w-[460px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px]">
        <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="xl:sticky xl:top-32"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_110px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_38%)]" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">
                  <Sparkles className="h-4 w-4" />
                  How It Works
                </span>

                <h2 className="mt-6 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  A clear growth loop from first login to industry-ready
                  ranking.
                </h2>

                <p className="mt-5 text-base font-semibold leading-8 text-slate-300">
                  OSO turns every student action into measurable progress:
                  register, choose a domain, practice missions, compete, earn
                  scores, build points, climb rankings and move toward
                  recognition.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <SummaryPill
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Structured"
                    description="Guided pathway"
                  />
                  <SummaryPill
                    icon={<Medal className="h-4 w-4" />}
                    title="Measurable"
                    description="Score + points"
                  />
                  <SummaryPill
                    icon={<Crown className="h-4 w-4" />}
                    title="Aspirational"
                    description="Recognition layer"
                  />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row xl:flex-col 2xl:flex-row">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-5 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-[#061019] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-100 hover:shadow-[0_0_34px_rgba(34,211,238,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                  >
                    Start Journey
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/daily-challenges"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-purple-300/40 hover:bg-purple-300/10 hover:text-purple-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/70"
                  >
                    View Challenges
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/35 to-purple-300/0 md:block xl:left-1/2"
            />

            <div className="grid gap-4 md:grid-cols-2">
              {journeySteps.map((step, index) => (
                <JourneyCard
                  key={step.id}
                  step={step}
                  index={index}
                  reduceMotion={Boolean(shouldReduceMotion)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyCard({
  step,
  index,
  reduceMotion,
}: {
  step: JourneyStep;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = step.icon;
  const tone = accentClasses[step.accent];

  return (
    <motion.article
      initial={
        reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] ${tone.glow}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),transparent_46%)] opacity-80" />
      <div
        className={`pointer-events-none absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full ${tone.bg} blur-2xl`}
      />

      <div className="relative flex items-start justify-between gap-5">
        <div
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tone.border} ${tone.bg} ${tone.text}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          {step.id}
        </span>
      </div>

      <div className="relative mt-5">
        <h3 className="text-xl font-black text-white">{step.title}</h3>

        <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">
          {step.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${tone.dot} shadow-[0_0_16px_currentColor]`}
            />
            {step.outcome}
          </span>

          <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
        </div>
      </div>
    </motion.article>
  );
}

function SummaryPill({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-cyan-200">
        {icon}
        <p className="text-sm font-black text-white">{title}</p>
      </div>

      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {description}
      </p>
    </div>
  );
}