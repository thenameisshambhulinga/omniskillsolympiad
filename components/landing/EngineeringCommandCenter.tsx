"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  BrainCircuit,
  CircuitBoard,
  Crown,
  Gauge,
  Layers3,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

type FlowStep = {
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "cyan" | "purple" | "emerald" | "amber" | "blue" | "rose";
};

type GrowthNode = {
  level: string;
  description: string;
  progress: number;
};

type TelemetryMetric = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

type ActivityItem = {
  signal: string;
  title: string;
  meta: string;
};

const flowSteps: FlowStep[] = [
  {
    label: "Daily Challenge",
    description: "Students enter timed engineering missions",
    icon: Target,
    tone: "cyan",
  },
  {
    label: "Submission",
    description: "Answers are locked into the challenge engine",
    icon: ShieldCheck,
    tone: "purple",
  },
  {
    label: "Omni Score",
    description: "Performance is evaluated across competition signals",
    icon: BrainCircuit,
    tone: "blue",
  },
  {
    label: "Silicon Points",
    description: "Progress converts into platform achievement energy",
    icon: Zap,
    tone: "amber",
  },
  {
    label: "Leaderboard",
    description: "Ranks update through competitive progression",
    icon: Trophy,
    tone: "emerald",
  },
  {
    label: "Engineering Tier",
    description: "Students climb into higher readiness bands",
    icon: Crown,
    tone: "rose",
  },
];

const growthNodes: GrowthNode[] = [
  {
    level: "Beginner",
    description: "Starts with guided technical exposure",
    progress: 12,
  },
  {
    level: "Explorer",
    description: "Builds multi-domain engineering awareness",
    progress: 28,
  },
  {
    level: "Builder",
    description: "Applies concepts through practical missions",
    progress: 46,
  },
  {
    level: "Engineer",
    description: "Competes with consistent performance",
    progress: 64,
  },
  {
    level: "Elite",
    description: "Rises through ranking and accuracy pressure",
    progress: 82,
  },
  {
    level: "Master",
    description: "Achieves industry-grade competition readiness",
    progress: 100,
  },
];

const telemetryMetrics: TelemetryMetric[] = [
  {
    label: "Daily Challenges",
    value: "30",
    helper: "Season missions",
    icon: CircuitBoard,
  },
  {
    label: "Active Engineers",
    value: "1K+",
    helper: "Competition-ready learners",
    icon: Users,
  },
  {
    label: "Challenge Accuracy",
    value: "87%",
    helper: "Target excellence signal",
    icon: Gauge,
  },
  {
    label: "Ranking Activity",
    value: "Live",
    helper: "Dynamic leaderboard flow",
    icon: Activity,
  },
  {
    label: "Engineering Tracks",
    value: "06",
    helper: "Multi-domain pathways",
    icon: Layers3,
  },
];

const activityFeed: ActivityItem[] = [
  {
    signal: "01",
    title: "Embedded Systems challenge completed",
    meta: "Firmware arena signal received",
  },
  {
    signal: "02",
    title: "Leaderboard updated",
    meta: "Omni Score ranking recalculated",
  },
  {
    signal: "03",
    title: "Tier upgraded",
    meta: "Engineer advanced into next readiness band",
  },
  {
    signal: "04",
    title: "VLSI mission unlocked",
    meta: "Semiconductor pathway activity detected",
  },
  {
    signal: "05",
    title: "WorldSkills pathway activated",
    meta: "Precision training sequence started",
  },
];

const toneClasses: Record<
  FlowStep["tone"],
  {
    node: string;
    icon: string;
    glow: string;
    text: string;
  }
> = {
  cyan: {
    node: "border-cyan-400/30 bg-cyan-400/10",
    icon: "text-cyan-200",
    glow: "bg-cyan-400/18",
    text: "text-cyan-200",
  },
  purple: {
    node: "border-purple-400/30 bg-purple-400/10",
    icon: "text-purple-200",
    glow: "bg-purple-500/18",
    text: "text-purple-200",
  },
  emerald: {
    node: "border-emerald-400/30 bg-emerald-400/10",
    icon: "text-emerald-200",
    glow: "bg-emerald-400/18",
    text: "text-emerald-200",
  },
  amber: {
    node: "border-amber-400/30 bg-amber-400/10",
    icon: "text-amber-200",
    glow: "bg-amber-400/18",
    text: "text-amber-200",
  },
  blue: {
    node: "border-blue-400/30 bg-blue-400/10",
    icon: "text-blue-200",
    glow: "bg-blue-400/18",
    text: "text-blue-200",
  },
  rose: {
    node: "border-rose-400/30 bg-rose-400/10",
    icon: "text-rose-200",
    glow: "bg-rose-400/18",
    text: "text-rose-200",
  },
};

export default function EngineeringCommandCenter() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-24 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.22, 0.55, 0.22], scale: [1, 1.08, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-14rem] top-10 h-[34rem] w-[34rem] rounded-full bg-cyan-400/12 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.18, 0.46, 0.18], scale: [1.06, 1, 1.06] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-14rem] top-44 h-[36rem] w-[36rem] rounded-full bg-purple-500/12 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.18, 0.42, 0.18], x: [0, 26, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.1),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_42%,rgba(34,211,238,0.025))]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <MotionWrapper>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.1)]">
                <Radio className="h-4 w-4" />
                Command Center Simulation
              </div>

              <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-purple-300">
                How Omni Skills Olympiad Works
              </p>

              <h2 className="max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
                From daily missions to{" "}
                <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  engineering mastery
                </span>
              </h2>

              <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
                A visual command center showing how students progress through
                challenges, submissions, scoring, Silicon Points, rankings, and
                engineering tiers.
              </p>
            </div>

            <GlassCard className="max-w-md p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-3">
                  <Sparkles className="h-6 w-6 text-emerald-200" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                    Ecosystem Signal
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    Live Growth Loop
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/55">
                Every challenge feeds into measurable engineering growth,
                competitive ranking, and long-term readiness.
              </p>
            </GlassCard>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.08}>
          <div className="relative mt-16 overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_34px_150px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%)]"
            />

            <motion.div
              aria-hidden="true"
              animate={{ x: ["-30%", "130%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/80 to-transparent"
            />

            <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-8">
                <GlassCard className="relative overflow-hidden p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"
                  />

                  <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                          Module 01
                        </p>
                        <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                          Competition Engine Visualization
                        </h3>
                      </div>

                      <Rocket className="hidden h-8 w-8 text-cyan-300 sm:block" />
                    </div>

                    <div className="grid gap-4">
                      {flowSteps.map((step, index) => (
                        <FlowStepCard
                          key={step.label}
                          step={step}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"
                  />

                  <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-300">
                          Module 02
                        </p>
                        <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                          Engineering Growth Map
                        </h3>
                      </div>

                      <Crown className="hidden h-8 w-8 text-purple-300 sm:block" />
                    </div>

                    <div className="space-y-4">
                      {growthNodes.map((node, index) => (
                        <motion.div
                          key={node.level}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.45 }}
                          transition={{
                            duration: 0.42,
                            delay: index * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-black text-white">
                                {node.level}
                              </p>
                              <p className="mt-1 text-sm text-white/50">
                                {node.description}
                              </p>
                            </div>

                            <p className="text-sm font-black text-cyan-200">
                              {node.progress}%
                            </p>
                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${node.progress}%` }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{
                                duration: 0.8,
                                delay: index * 0.08,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_24px_rgba(34,211,238,0.34)]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-8">
                <GlassCard className="relative overflow-hidden p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl"
                  />

                  <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
                          Module 03
                        </p>
                        <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                          Competition Telemetry
                        </h3>
                      </div>

                      <Gauge className="hidden h-8 w-8 text-emerald-300 sm:block" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {telemetryMetrics.map((metric, index) => {
                        const Icon = metric.icon;

                        return (
                          <HoverScale
                            key={metric.label}
                            hoverScale={1.015}
                            lift={4}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.45 }}
                              transition={{
                                duration: 0.42,
                                delay: index * 0.05,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
                            >
                              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200">
                                <Icon className="h-5 w-5" />
                              </div>

                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                                {metric.label}
                              </p>

                              <p className="mt-2 text-3xl font-black text-white">
                                {metric.value}
                              </p>

                              <p className="mt-1 text-xs text-white/45">
                                {metric.helper}
                              </p>
                            </motion.div>
                          </HoverScale>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl"
                  />

                  <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                          Module 04
                        </p>
                        <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                          Live Activity Feed Simulation
                        </h3>
                      </div>

                      <Activity className="hidden h-8 w-8 text-blue-300 sm:block" />
                    </div>

                    <div className="space-y-3">
                      {activityFeed.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: 18 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.45 }}
                          transition={{
                            duration: 0.42,
                            delay: index * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="group flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.05]"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-sm font-black text-cyan-200">
                            {item.signal}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 truncate text-sm text-white/45">
                              {item.meta}
                            </p>
                          </div>

                          <motion.span
                            animate={{ opacity: [0.25, 1, 0.25] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: index * 0.15,
                            }}
                            className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}

function FlowStepCard({ step, index }: { step: FlowStep; index: number }) {
  const Icon = step.icon;
  const tone = toneClasses[step.tone];

  return (
    <div>
      <HoverScale hoverScale={1.012} lift={4}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: 0.42,
            delay: index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`group relative overflow-hidden rounded-[1.5rem] border p-4 backdrop-blur-xl transition duration-500 ${tone.node}`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${tone.glow} blur-3xl transition duration-500 group-hover:opacity-90`}
          />

          <div className="relative z-10 flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 ${tone.icon}`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div>
              <p className={`font-black ${tone.text}`}>{step.label}</p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      </HoverScale>

      {index < flowSteps.length - 1 && (
        <div className="flex justify-center py-2">
          <motion.div
            animate={{ opacity: [0.35, 1, 0.35], y: [0, 4, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: index * 0.1,
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
