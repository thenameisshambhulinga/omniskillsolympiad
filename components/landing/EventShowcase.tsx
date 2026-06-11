"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Radar,
  Sparkles,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";

type EventShowcaseItem = {
  title: string;
  category: string;
  status: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  accent: "cyan" | "purple" | "emerald" | "amber" | "blue" | "rose";
};

const featuredEvents: EventShowcaseItem[] = [
  {
    title: "Omni Skills Olympiad Season 1",
    category: "Flagship Competition",
    status: "Live Arena",
    description:
      "A structured engineering competition season built around daily technical challenges, rankings, streaks, and skill acceleration.",
    cta: "Explore Season",
    href: "/daily-challenges",
    icon: Trophy,
    accent: "cyan",
  },
  {
    title: "Embedded Systems Sprint",
    category: "Firmware Track",
    status: "Coming Soon",
    description:
      "Microcontroller, firmware, debugging, and real-world embedded problem solving for hands-on engineering competitors.",
    cta: "View Track",
    href: "/worldskills",
    icon: Cpu,
    accent: "purple",
  },
  {
    title: "VLSI Design Championship",
    category: "Semiconductor Arena",
    status: "Preview",
    description:
      "Digital design, logic thinking, verification readiness, and semiconductor-focused challenges for future chip engineers.",
    cta: "Enter Preview",
    href: "/competition",
    icon: CircuitBoard,
    accent: "blue",
  },
  {
    title: "AI & Robotics Arena",
    category: "Autonomous Systems",
    status: "Innovation Track",
    description:
      "Applied intelligence, automation, robotics workflows, and engineering creativity through competitive build missions.",
    cta: "Discover Arena",
    href: "/competition",
    icon: BrainCircuit,
    accent: "emerald",
  },
  {
    title: "PCB Innovation Challenge",
    category: "Hardware Design",
    status: "Lab Ready",
    description:
      "Circuit thinking, PCB workflows, hardware debugging, assembly discipline, and electronics innovation challenges.",
    cta: "View Challenge",
    href: "/worldskills",
    icon: Zap,
    accent: "amber",
  },
  {
    title: "WorldSkills Preparation Track",
    category: "Elite Skill Pathway",
    status: "Mentor Track",
    description:
      "A practical preparation pathway for advanced technical competitions, industry readiness, and engineering confidence.",
    cta: "Start Pathway",
    href: "/worldskills",
    icon: Radar,
    accent: "rose",
  },
];

const accentClasses: Record<
  EventShowcaseItem["accent"],
  {
    badge: string;
    glow: string;
    icon: string;
    border: string;
    button: string;
  }
> = {
  cyan: {
    badge: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    glow: "bg-cyan-400/18",
    icon: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    border: "group-hover:border-cyan-300/40",
    button:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20",
  },
  purple: {
    badge: "border-purple-400/30 bg-purple-400/10 text-purple-200",
    glow: "bg-purple-500/18",
    icon: "border-purple-400/30 bg-purple-400/10 text-purple-200",
    border: "group-hover:border-purple-300/40",
    button:
      "border-purple-400/30 bg-purple-400/10 text-purple-100 hover:bg-purple-400/20",
  },
  emerald: {
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    glow: "bg-emerald-400/16",
    icon: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    border: "group-hover:border-emerald-300/40",
    button:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20",
  },
  amber: {
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    glow: "bg-amber-400/16",
    icon: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    border: "group-hover:border-amber-300/40",
    button:
      "border-amber-400/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20",
  },
  blue: {
    badge: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    glow: "bg-blue-400/16",
    icon: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    border: "group-hover:border-blue-300/40",
    button:
      "border-blue-400/30 bg-blue-400/10 text-blue-100 hover:bg-blue-400/20",
  },
  rose: {
    badge: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    glow: "bg-rose-400/16",
    icon: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    border: "group-hover:border-rose-300/40",
    button:
      "border-rose-400/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20",
  },
};

export default function EventShowcase() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-24 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-12rem] top-10 h-[32rem] w-[32rem] rounded-full bg-cyan-400/12 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.2, 0.48, 0.2], scale: [1.06, 1, 1.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-14rem] top-28 h-[36rem] w-[36rem] rounded-full bg-purple-500/12 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.1),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_42%,rgba(34,211,238,0.025))]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

        {[
          "left-[10%] top-[18%]",
          "left-[26%] top-[78%]",
          "left-[52%] top-[12%]",
          "left-[78%] top-[24%]",
          "left-[90%] top-[72%]",
        ].map((position, index) => (
          <motion.span
            key={position}
            animate={{ opacity: [0.16, 0.72, 0.16], y: [0, -12, 0] }}
            transition={{
              duration: 3.5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute h-1.5 w-1.5 rounded-full bg-cyan-200/60 shadow-[0_0_18px_rgba(103,232,249,0.75)] ${position}`}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <MotionWrapper>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.1)]">
                <Sparkles className="h-4 w-4" />
                Flagship Showcase
              </div>

              <p className="mb-4 text-sm font-bold uppercase tracking-[0.32em] text-purple-300">
                Engineering Events
              </p>

              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Engineering Events &{" "}
                <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Innovation Arena
                </span>
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
                Compete. Build. Innovate. Accelerate.
              </p>
            </div>

            <p className="max-w-xl text-base leading-8 text-zinc-300">
              Explore flagship competitions, future hardware tracks, robotics
              arenas, and WorldSkills-oriented preparation pathways designed for
              ambitious engineers.
            </p>
          </div>
        </MotionWrapper>

        <div className="mt-14 flex gap-5 overflow-x-auto pb-5 pr-6 [scrollbar-width:none] md:mt-16 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 lg:pr-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {featuredEvents.map((event, index) => (
            <MotionWrapper
              key={event.title}
              delay={index * 0.07}
              className="min-w-[86vw] sm:min-w-[28rem] lg:min-w-0"
            >
              <EventCard event={event} index={index} />
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
}: {
  event: EventShowcaseItem;
  index: number;
}) {
  const Icon = event.icon;
  const accent = accentClasses[event.accent];

  return (
    <HoverScale hoverScale={1.018} lift={6} className="h-full">
      <GlassCard
        className={`group relative h-full overflow-hidden p-0 transition duration-500 ${accent.border}`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full ${accent.glow} blur-3xl transition duration-700 group-hover:opacity-90`}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_40%)]"
        />

        <motion.div
          aria-hidden="true"
          animate={{ x: ["-40%", "140%"] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.2,
          }}
          className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/70 to-transparent"
        />

        <div className="relative z-10 flex h-full min-h-[25rem] flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-[0_0_32px_rgba(34,211,238,0.08)] ${accent.icon}`}
            >
              <Icon className="h-7 w-7" />
            </div>

            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${accent.badge}`}
            >
              {event.status}
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-white/38">
              {event.category}
            </p>

            <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
              {event.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {event.description}
            </p>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Arena Signal
                </p>
                <p className="mt-1 text-sm font-bold text-white/70">
                  Engineering track available
                </p>
              </div>

              <div className="flex gap-1.5">
                {[0, 1, 2].map((item) => (
                  <motion.span
                    key={item}
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      delay: item * 0.2,
                    }}
                    className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-7">
            <Link
              href={event.href}
              className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl border px-5 py-3 text-sm font-black uppercase tracking-[0.16em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 ${accent.button}`}
            >
              {event.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </GlassCard>
    </HoverScale>
  );
}
