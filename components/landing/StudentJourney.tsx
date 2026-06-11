"use client";

import { motion } from "framer-motion";
import { ArrowRight, Crown, Rocket, Sparkles } from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

type JourneyStage = {
  label: string;
  description: string;
  progress: number;
};

const stages: JourneyStage[] = [
  {
    label: "Beginner",
    description: "Starts with daily exposure and guided challenge attempts.",
    progress: 12,
  },
  {
    label: "Explorer",
    description: "Discovers engineering tracks and builds confidence.",
    progress: 28,
  },
  {
    label: "Builder",
    description: "Applies concepts through repeated technical missions.",
    progress: 46,
  },
  {
    label: "Engineer",
    description: "Competes consistently with measurable performance.",
    progress: 64,
  },
  {
    label: "Elite",
    description: "Climbs rankings and proves competition readiness.",
    progress: 82,
  },
  {
    label: "Master",
    description: "Develops industry-ready technical identity.",
    progress: 100,
  },
];

export default function StudentJourney() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-24 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,85,247,0.12),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.1),transparent_32%)]" />
        <div className="absolute -left-32 top-20 h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <MotionWrapper>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-purple-300">
                Student Progression Journey
              </p>

              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                From first attempt to{" "}
                <span className="bg-linear-to-r from-purple-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  engineering identity
                </span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                Silicon Skillathon gives students a visible growth path. Every
                challenge becomes part of a larger transformation.
              </p>
            </div>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-purple-400/25 bg-purple-400/10 p-3">
                  <Crown className="h-6 w-6 text-purple-200" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                    Growth Outcome
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-white">
                    Industry-Ready Engineer
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/55">
                The platform’s progression language helps students see where
                they are, where they are going, and why consistency matters.
              </p>
            </GlassCard>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.08}>
          <div className="relative mt-16 overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_34px_150px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_35%)]" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-6">
              {stages.map((stage, index) => (
                <HoverScale key={stage.label} hoverScale={1.016} lift={5}>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.055]"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />

                    <div className="relative z-10">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-sm font-black text-cyan-200">
                        {index + 1}
                      </div>

                      <h3 className="text-xl font-black text-white">
                        {stage.label}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-white/55">
                        {stage.description}
                      </p>

                      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stage.progress}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_24px_rgba(34,211,238,0.34)]"
                        />
                      </div>
                    </div>
                  </motion.div>
                </HoverScale>
              ))}
            </div>

            <div className="relative z-10 mt-8 hidden items-center justify-between px-8 lg:flex">
              {stages.slice(0, -1).map((stage, index) => (
                <motion.div
                  key={stage.label}
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

        <MotionWrapper delay={0.16}>
          <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="h-6 w-6 text-cyan-200" />
              <p className="font-bold text-white">
                The journey is designed to make progress visible, competitive,
                and repeatable.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Growth System Active
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
