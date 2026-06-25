"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Cpu,
  Factory,
  Gauge,
  Layers3,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

type PathwayNode = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "cyan" | "purple" | "blue" | "emerald" | "amber" | "rose";
};

type Metric = {
  label: string;
  value: string;
  helper: string;
};

type TimelineStep = {
  label: string;
  description: string;
};

const pathwayNodes: PathwayNode[] = [
  {
    title: "Embedded Systems",
    subtitle: "Firmware • MCUs • Debugging",
    icon: Cpu,
    tone: "cyan",
  },
  {
    title: "VLSI",
    subtitle: "Logic • Design • Verification",
    icon: Layers3,
    tone: "purple",
  },
  {
    title: "PCB Design",
    subtitle: "Circuits • Layout • Hardware",
    icon: Route,
    tone: "amber",
  },
  {
    title: "AI & Robotics",
    subtitle: "Autonomy • Vision • Control",
    icon: BrainCircuit,
    tone: "emerald",
  },
  {
    title: "Industry Challenges",
    subtitle: "Innovation • Products • Teams",
    icon: Factory,
    tone: "blue",
  },
  {
    title: "WorldSkills",
    subtitle: "Precision • Practice • Mastery",
    icon: Trophy,
    tone: "rose",
  },
];

const metrics: Metric[] = [
  {
    label: "Active Competitions",
    value: "12+",
    helper: "Engineering arenas",
  },
  {
    label: "Engineering Tracks",
    value: "06",
    helper: "Specialized pathways",
  },
  {
    label: "Innovation Missions",
    value: "40+",
    helper: "Build-focused tasks",
  },
  {
    label: "Skill Pathways",
    value: "05",
    helper: "Learn to master",
  },
  {
    label: "Learning Hours",
    value: "120+",
    helper: "Guided preparation",
  },
  {
    label: "Technical Challenges",
    value: "300+",
    helper: "Competition problems",
  },
];

const timeline: TimelineStep[] = [
  {
    label: "Learn",
    description: "Build technical foundations",
  },
  {
    label: "Build",
    description: "Apply engineering skills",
  },
  {
    label: "Compete",
    description: "Enter challenge arenas",
  },
  {
    label: "Rank",
    description: "Climb live leaderboards",
  },
  {
    label: "Master",
    description: "Reach elite readiness",
  },
];

const toneClasses: Record<
  PathwayNode["tone"],
  {
    node: string;
    glow: string;
    icon: string;
    text: string;
  }
> = {
  cyan: {
    node: "border-cyan-400/30 bg-cyan-400/10",
    glow: "bg-cyan-400/20",
    icon: "text-cyan-200",
    text: "text-cyan-200",
  },
  purple: {
    node: "border-purple-400/30 bg-purple-400/10",
    glow: "bg-purple-500/20",
    icon: "text-purple-200",
    text: "text-purple-200",
  },
  blue: {
    node: "border-blue-400/30 bg-blue-400/10",
    glow: "bg-blue-400/20",
    icon: "text-blue-200",
    text: "text-blue-200",
  },
  emerald: {
    node: "border-emerald-400/30 bg-emerald-400/10",
    glow: "bg-emerald-400/20",
    icon: "text-emerald-200",
    text: "text-emerald-200",
  },
  amber: {
    node: "border-amber-400/30 bg-amber-400/10",
    glow: "bg-amber-400/20",
    icon: "text-amber-200",
    text: "text-amber-200",
  },
  rose: {
    node: "border-rose-400/30 bg-rose-400/10",
    glow: "bg-rose-400/20",
    icon: "text-rose-200",
    text: "text-rose-200",
  },
};

export default function InnovationPoster() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-24 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.24, 0.52, 0.24], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-14rem] top-8 h-[34rem] w-[34rem] rounded-full bg-cyan-400/12 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.2, 0.48, 0.2], scale: [1.06, 1, 1.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-14rem] top-32 h-[36rem] w-[36rem] rounded-full bg-purple-500/12 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.18, 0.42, 0.18], x: [0, 24, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.1),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_42%,rgba(34,211,238,0.025))]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

        {[
          "left-[10%] top-[18%]",
          "left-[24%] top-[74%]",
          "left-[48%] top-[12%]",
          "left-[72%] top-[22%]",
          "left-[88%] top-[70%]",
          "left-[58%] top-[84%]",
        ].map((position, index) => (
          <motion.span
            key={position}
            animate={{ opacity: [0.14, 0.7, 0.14], y: [0, -14, 0] }}
            transition={{
              duration: 3.6 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute h-1.5 w-1.5 rounded-full bg-cyan-200/60 shadow-[0_0_18px_rgba(103,232,249,0.75)] ${position}`}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <MotionWrapper>
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.1)]">
              <Sparkles className="h-4 w-4" />
              Future Electronics Talent Platform
            </div>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-purple-300">
              Engineering Innovation Ecosystem
            </p>

            <h2 className="mx-auto max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Build the next generation of{" "}
              <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                competition-ready engineers
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              A cinematic engineering mission control layer connecting embedded
              systems, semiconductor design, robotics, WorldSkills preparation,
              innovation challenges, and industry-grade readiness.
            </p>
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

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="relative min-h-[35rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/25 p-5 sm:p-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_45%)]"
                />

                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                  className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
                />

                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
                  className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/10"
                />

                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden h-px w-[82%] -translate-x-1/2 bg-linear-to-r from-transparent via-cyan-300/25 to-transparent md:block"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 hidden h-[72%] w-px -translate-y-1/2 bg-linear-to-b from-transparent via-purple-300/25 to-transparent md:block"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-[18%] top-[25%] hidden h-px w-[66%] rotate-[28deg] bg-linear-to-r from-transparent via-white/15 to-transparent md:block"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-[18%] top-[72%] hidden h-px w-[66%] -rotate-[28deg] bg-linear-to-r from-transparent via-white/15 to-transparent md:block"
                />

                <div className="relative z-10 grid min-h-[31rem] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pathwayNodes.map((node, index) => (
                    <PathwayNodeCard key={node.title} node={node} index={index} />
                  ))}
                </div>

                <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_80px_rgba(34,211,238,0.18)] backdrop-blur-xl md:flex">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    className="text-center"
                  >
                    <Radio className="mx-auto h-6 w-6 text-cyan-200" />
                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100">
                      Live Sync
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-5">
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-3">
                      <Gauge className="h-6 w-6 text-cyan-200" />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                        Live Engineering Metrics
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-white">
                        Ecosystem Telemetry
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {metrics.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 0.42,
                          delay: index * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-3xl font-black text-white">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          {metric.helper}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-purple-400/25 bg-purple-400/10 p-3">
                      <Zap className="h-6 w-6 text-purple-200" />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                        Innovation Timeline
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-white">
                        Learn → Master
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {timeline.map((step, index) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: 14 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                          duration: 0.42,
                          delay: index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-sm font-black text-cyan-200">
                          {index + 1}
                        </div>

                        <div>
                          <p className="font-black text-white">{step.label}</p>
                          <p className="mt-1 text-sm text-white/50">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
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

function PathwayNodeCard({
  node,
  index,
}: {
  node: PathwayNode;
  index: number;
}) {
  const Icon = node.icon;
  const tone = toneClasses[node.tone];

  return (
    <HoverScale hoverScale={1.018} lift={5}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{
          duration: 0.46,
          delay: index * 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`group relative h-full overflow-hidden rounded-[1.75rem] border p-5 backdrop-blur-xl transition duration-500 ${tone.node}`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${tone.glow} blur-3xl transition duration-500 group-hover:opacity-90`}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_42%)]"
        />

        <div className="relative z-10">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 ${tone.icon}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3 className={`mt-5 text-lg font-black ${tone.text}`}>
            {node.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {node.subtitle}
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