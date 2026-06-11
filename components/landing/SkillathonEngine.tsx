"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Crown,
  Medal,
  Rocket,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

type EngineStep = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "cyan" | "purple" | "blue" | "amber" | "emerald" | "rose" | "violet";
};

const engineSteps: EngineStep[] = [
  {
    title: "Daily Challenge",
    subtitle: "Solve focused engineering missions every day.",
    icon: Target,
    tone: "cyan",
  },
  {
    title: "Submission",
    subtitle: "Lock answers inside a protected challenge flow.",
    icon: ShieldCheck,
    tone: "purple",
  },
  {
    title: "Omni Score",
    subtitle: "Performance becomes a competitive skill signal.",
    icon: BrainCircuit,
    tone: "blue",
  },
  {
    title: "Silicon Points",
    subtitle: "Consistency converts into visible progression.",
    icon: Zap,
    tone: "amber",
  },
  {
    title: "Leaderboard",
    subtitle: "Students compete, rank, improve, and return.",
    icon: Trophy,
    tone: "emerald",
  },
  {
    title: "Engineering Tier",
    subtitle: "Growth unlocks higher readiness identity.",
    icon: Crown,
    tone: "rose",
  },
  {
    title: "Industry Readiness",
    subtitle: "The journey points toward real engineering confidence.",
    icon: Medal,
    tone: "violet",
  },
];

const toneClasses: Record<
  EngineStep["tone"],
  {
    shell: string;
    glow: string;
    icon: string;
    text: string;
  }
> = {
  cyan: {
    shell: "border-cyan-400/30 bg-cyan-400/10",
    glow: "bg-cyan-400/18",
    icon: "text-cyan-200",
    text: "text-cyan-200",
  },
  purple: {
    shell: "border-purple-400/30 bg-purple-400/10",
    glow: "bg-purple-500/18",
    icon: "text-purple-200",
    text: "text-purple-200",
  },
  blue: {
    shell: "border-blue-400/30 bg-blue-400/10",
    glow: "bg-blue-400/18",
    icon: "text-blue-200",
    text: "text-blue-200",
  },
  amber: {
    shell: "border-amber-400/30 bg-amber-400/10",
    glow: "bg-amber-400/18",
    icon: "text-amber-200",
    text: "text-amber-200",
  },
  emerald: {
    shell: "border-emerald-400/30 bg-emerald-400/10",
    glow: "bg-emerald-400/18",
    icon: "text-emerald-200",
    text: "text-emerald-200",
  },
  rose: {
    shell: "border-rose-400/30 bg-rose-400/10",
    glow: "bg-rose-400/18",
    icon: "text-rose-200",
    text: "text-rose-200",
  },
  violet: {
    shell: "border-violet-400/30 bg-violet-400/10",
    glow: "bg-violet-400/18",
    icon: "text-violet-200",
    text: "text-violet-200",
  },
};

export default function SkillathonEngine() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-24 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.22, 0.52, 0.22], scale: [1, 1.08, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-14rem] top-10 h-[34rem] w-[34rem] rounded-full bg-cyan-400/12 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.18, 0.45, 0.18], scale: [1.06, 1, 1.06] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-14rem] top-36 h-[36rem] w-[36rem] rounded-full bg-purple-500/12 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.1),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_34%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <MotionWrapper>
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-cyan-300">
              Silicon Skillathon Engine
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              One growth loop that turns effort into{" "}
              <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                engineering readiness
              </span>
            </h2>

            <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              Students do not just answer questions. They enter a competitive
              engineering loop where every challenge strengthens score,
              consistency, rank, and identity.
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.08}>
          <div className="relative mt-16 overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_34px_150px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%)]" />

            <motion.div
              aria-hidden="true"
              animate={{ x: ["-30%", "130%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/80 to-transparent"
            />

            <div className="relative z-10 grid gap-4 lg:grid-cols-7">
              {engineSteps.map((step, index) => (
                <EngineNode key={step.title} step={step} index={index} />
              ))}
            </div>

            <div className="relative z-10 mt-8 hidden items-center justify-between px-8 lg:flex">
              {engineSteps.slice(0, -1).map((step, index) => (
                <motion.div
                  key={step.title}
                  animate={{ opacity: [0.25, 1, 0.25], x: [0, 8, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: index * 0.16,
                  }}
                  className="flex flex-1 items-center justify-center text-cyan-200/70"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              ))}
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}

function EngineNode({ step, index }: { step: EngineStep; index: number }) {
  const Icon = step.icon;
  const tone = toneClasses[step.tone];

  return (
    <HoverScale hoverScale={1.015} lift={5}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 0.45,
          delay: index * 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`group relative h-full overflow-hidden rounded-[2rem] border p-5 backdrop-blur-xl transition duration-500 ${tone.shell}`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${tone.glow} blur-3xl transition duration-500 group-hover:opacity-90`}
        />

        <div className="relative z-10">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 ${tone.icon}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
            Step {String(index + 1).padStart(2, "0")}
          </p>

          <h3 className={`mt-2 text-lg font-black ${tone.text}`}>
            {step.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {step.subtitle}
          </p>

          <div className="mt-5 flex items-center gap-1.5">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: item * 0.2 + index * 0.08,
                }}
                className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </HoverScale>
  );
}
