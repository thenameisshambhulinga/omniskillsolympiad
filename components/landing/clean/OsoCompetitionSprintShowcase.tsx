"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Medal, Sparkles } from "lucide-react";

import OsoCompetitionSprintCard, {
  type OsoCompetitionSprintCardData,
} from "@/components/landing/clean/OsoCompetitionSprintCard";
import OsoFloatingIllustrationStage from "@/components/landing/clean/OsoFloatingIllustrationStage";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";
import OsoMilestoneHeader from "@/components/landing/clean/OsoMilestoneHeader";

const sprintCards: OsoCompetitionSprintCardData[] = [
  {
    title: "Embedded Systems Sprint",
    category: "Embedded",
    deadline: "This Week",
    description:
      "Solve firmware, GPIO, debugging and microcontroller reasoning tasks designed for practical ECE growth.",
    participants: "1.2k+",
    difficulty: "Core",
    href: "/competition",
    accent: "blue",
    metrics: [
      { label: "Firmware Logic", value: "84%", percent: 84 },
      { label: "Debug Accuracy", value: "76%", percent: 76 },
      { label: "Circuit Reasoning", value: "69%", percent: 69 },
    ],
  },
  {
    title: "PCB Innovation Challenge",
    category: "PCB Design",
    deadline: "This Month",
    description:
      "Move from schematic thinking to board-level design confidence with structured PCB and signal-flow tasks.",
    participants: "840+",
    difficulty: "Applied",
    href: "/competition",
    accent: "yellow",
    metrics: [
      { label: "Layout Quality", value: "81%", percent: 81 },
      { label: "Signal Flow", value: "72%", percent: 72 },
      { label: "Design Rules", value: "66%", percent: 66 },
    ],
  },
  {
    title: "AI + Robotics Arena",
    category: "Robotics",
    deadline: "Upcoming",
    description:
      "Attempt automation, sensors, control and intelligent systems challenges for future-ready engineering skills.",
    participants: "980+",
    difficulty: "Advanced",
    href: "/competition",
    accent: "emerald",
    metrics: [
      { label: "Automation", value: "79%", percent: 79 },
      { label: "Sensor Logic", value: "73%", percent: 73 },
      { label: "Control Flow", value: "67%", percent: 67 },
    ],
  },
];

export default function OsoCompetitionSprintShowcase({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <section className="oso-section overflow-hidden bg-white">
      <div className="oso-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.78fr]">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <OsoMilestoneHeader
              eyebrow="Competition Sprints"
              title="Competition cards that feel measurable, ranked and alive."
              description="Every sprint should help students understand what to attempt, how progress is measured, and why their performance matters inside the OSO ecosystem."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <MicroBadge
                icon={<Medal className="h-4 w-4" />}
                label="Ranked Challenges"
              />
              <MicroBadge
                icon={<Sparkles className="h-4 w-4" />}
                label="Skill Recognition"
              />
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.42,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <OsoFloatingIllustrationStage
              glow="yellow"
              className="mx-auto w-full max-w-[520px]"
            >
              <OsoIllustrationAsset
                src={OSO_ILLUSTRATIONS.competitionsWinner}
                alt="A student holding a first-place competition achievement placard."
                blend
                imageClassName="oso-floating-illustration-img mx-auto max-h-[420px] max-w-[500px]"
              />
            </OsoFloatingIllustrationStage>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-5 lg:grid-cols-3"
        >
          {sprintCards.map((item) => (
            <OsoCompetitionSprintCard key={item.title} item={item} />
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/competition"
            className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
          >
            Explore All Competitions
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MicroBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/82 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-600 shadow-sm backdrop-blur-xl">
      <span className="text-blue-700">{icon}</span>
      {label}
    </span>
  );
}