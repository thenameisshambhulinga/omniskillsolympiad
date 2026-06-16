"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Cpu,
  Globe2,
  Layers3,
  Microchip,
  RadioTower,
  Trophy,
} from "lucide-react";

import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

type ArenaItem = {
  title: string;
  category: string;
  description: string;
  status: "Live" | "Upcoming" | "Preparation";
  icon: React.ReactNode;
  href: string;
  tone: "blue" | "yellow" | "emerald";
};

const arenaItems: ArenaItem[] = [
  {
    title: "Embedded Systems Sprint",
    category: "Microcontrollers",
    description:
      "Firmware, GPIO, debugging and peripheral integration missions for applied embedded growth.",
    status: "Live",
    icon: <Cpu className="h-5 w-5" />,
    href: "/daily-challenges",
    tone: "blue",
  },
  {
    title: "PCB Innovation Challenge",
    category: "Hardware Design",
    description:
      "Schematic thinking, signal flow, board-level reasoning and hardware testing readiness.",
    status: "Upcoming",
    icon: <Layers3 className="h-5 w-5" />,
    href: "/competition",
    tone: "yellow",
  },
  {
    title: "VLSI Design Championship",
    category: "Semiconductor",
    description:
      "Digital logic, FPGA, verification and semiconductor fundamentals for deep-tech skill growth.",
    status: "Preparation",
    icon: <Microchip className="h-5 w-5" />,
    href: "/competition",
    tone: "blue",
  },
  {
    title: "AI & Robotics Arena",
    category: "Automation",
    description:
      "Sensors, machine vision, autonomous systems and control logic competitions.",
    status: "Upcoming",
    icon: <Bot className="h-5 w-5" />,
    href: "/competition",
    tone: "emerald",
  },
  {
    title: "WorldSkills Preparation Track",
    category: "Global Readiness",
    description:
      "Precision engineering, international benchmarking and elite competition preparation.",
    status: "Preparation",
    icon: <Globe2 className="h-5 w-5" />,
    href: "/worldskills",
    tone: "yellow",
  },
  {
    title: "IoT & Automation Mission",
    category: "Connected Systems",
    description:
      "Sensors, connectivity, MQTT, diagnostics and smart system implementation challenges.",
    status: "Live",
    icon: <RadioTower className="h-5 w-5" />,
    href: "/daily-challenges",
    tone: "emerald",
  },
];

export default function OsoCompetitionArena() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/76 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_34%)]"
      />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
            Engineering Events & Competition Arenas
          </p>

          <h2 className="oso-heading mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Choose a sprint. Build evidence. Move toward recognition.
          </h2>

          <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
            These arenas map OSO’s practical engineering domains into
            competition-ready pathways without crowding the landing page.
          </p>
        </div>

        <Link
          href="/daily-challenges"
          className="group inline-flex w-fit min-h-13 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Attempt Today
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {arenaItems.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
              duration: 0.42,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative isolate flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/82 p-6 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_62px_rgba(15,23,42,0.085)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16]"
            >
              <OsoIllustrationAsset
                src={OSO_ILLUSTRATIONS.postCardPattern}
                alt="Abstract technology pattern"
                decorative
                blend
                imageClassName="h-full w-full object-cover"
                className="h-full w-full"
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${getToneClass(item.tone)}`}>
                {item.icon}
              </div>

              <div className="flex h-14 w-14 items-center justify-center overflow-visible">
                <OsoIllustrationAsset
                  src={OSO_ILLUSTRATIONS.winnerCup}
                  alt="Winner cup"
                  decorative
                  blend
                  imageClassName="h-14 w-14 object-contain"
                />
              </div>
            </div>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
              {item.category}
            </p>

            <h3 className="oso-heading mt-2 text-2xl font-black leading-tight text-slate-950">
              {item.title}
            </h3>

            <p className="mt-3 flex-1 text-base font-medium leading-7 text-slate-600">
              {item.description}
            </p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className={`rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] ${getToneClass(item.tone)}`}>
                {item.status}
              </span>

              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-slate-950 transition group-hover:text-blue-700"
              >
                Open
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function getToneClass(tone: ArenaItem["tone"]) {
  if (tone === "yellow") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}