"use client";

import { motion } from "framer-motion";
import {
  Award,
  BriefcaseBusiness,
  Crown,
  GraduationCap,
  Handshake,
  Medal,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

type Outcome = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "cyan" | "purple" | "emerald" | "amber" | "blue";
};

const outcomes: Outcome[] = [
  {
    title: "Rankings",
    description:
      "Students see measurable competitive growth through live performance rankings.",
    icon: Trophy,
    tone: "cyan",
  },
  {
    title: "Recognition",
    description:
      "Consistent performers earn visibility through points, tiers, and leaderboard movement.",
    icon: Medal,
    tone: "purple",
  },
  {
    title: "Mentorship",
    description:
      "High performers can move toward guided preparation and advanced technical direction.",
    icon: Handshake,
    tone: "emerald",
  },
  {
    title: "Industry Exposure",
    description:
      "The ecosystem connects practical skill-building with industry-readiness outcomes.",
    icon: BriefcaseBusiness,
    tone: "blue",
  },
  {
    title: "WorldSkills Readiness",
    description:
      "Structured competition habits support stronger preparation for elite skill pathways.",
    icon: Award,
    tone: "amber",
  },
];

const toneClasses: Record<
  Outcome["tone"],
  {
    shell: string;
    glow: string;
    icon: string;
  }
> = {
  cyan: {
    shell: "border-cyan-400/30 bg-cyan-400/10",
    glow: "bg-cyan-400/18",
    icon: "text-cyan-200",
  },
  purple: {
    shell: "border-purple-400/30 bg-purple-400/10",
    glow: "bg-purple-500/18",
    icon: "text-purple-200",
  },
  emerald: {
    shell: "border-emerald-400/30 bg-emerald-400/10",
    glow: "bg-emerald-400/18",
    icon: "text-emerald-200",
  },
  amber: {
    shell: "border-amber-400/30 bg-amber-400/10",
    glow: "bg-amber-400/18",
    icon: "text-amber-200",
  },
  blue: {
    shell: "border-blue-400/30 bg-blue-400/10",
    glow: "bg-blue-400/18",
    icon: "text-blue-200",
  },
};

export default function OutcomesSection() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-24 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.11),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(168,85,247,0.1),transparent_34%)]" />
        <div className="absolute -left-32 top-20 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-[32rem] w-[32rem] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <MotionWrapper>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-cyan-300">
                Outcomes & Rewards
              </p>

              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                The reward is not just points. It is{" "}
                <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  readiness
                </span>
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              Silicon Skillathon makes technical growth visible through
              rankings, recognition, mentorship direction, industry exposure,
              and competition readiness.
            </p>
          </div>
        </MotionWrapper>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {outcomes.map((outcome, index) => (
            <OutcomeCard key={outcome.title} outcome={outcome} index={index} />
          ))}
        </div>

        <MotionWrapper delay={0.18}>
          <GlassCard className="mt-8 overflow-hidden p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-purple-400/25 bg-purple-400/10 p-4">
                  <Crown className="h-8 w-8 text-purple-200" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                    Final Outcome
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    Industry-Ready Engineering Identity
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
                <GraduationCap className="h-7 w-7 shrink-0 text-cyan-200" />
                <p className="text-sm leading-7 text-white/60">
                  Students build confidence through a system that rewards
                  consistency, competitive improvement, and domain exposure.
                </p>
              </div>
            </div>
          </GlassCard>
        </MotionWrapper>
      </div>
    </section>
  );
}

function OutcomeCard({ outcome, index }: { outcome: Outcome; index: number }) {
  const Icon = outcome.icon;
  const tone = toneClasses[outcome.tone];

  return (
    <MotionWrapper delay={index * 0.05}>
      <HoverScale hoverScale={1.018} lift={5}>
        <div
          className={`group relative h-full overflow-hidden rounded-[2rem] border p-5 backdrop-blur-xl transition duration-500 ${tone.shell}`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${tone.glow} blur-3xl transition group-hover:opacity-90`}
          />

          <div className="relative z-10">
            <div
              className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 ${tone.icon}`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-black text-white">{outcome.title}</h3>

            <p className="mt-3 text-sm leading-7 text-white/58">
              {outcome.description}
            </p>

            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: index * 0.15,
              }}
              className="mt-6 h-1.5 w-16 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
            />
          </div>
        </div>
      </HoverScale>
    </MotionWrapper>
  );
}
