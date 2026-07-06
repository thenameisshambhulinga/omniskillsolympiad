"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CircuitBoard,
  Globe2,
  Trophy,
} from "lucide-react";

import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";
import OsoMilestoneHeader from "@/components/landing/clean/OsoMilestoneHeader";

const exploreItems = [
  {
    title: "Daily Challenges",
    description: "Practice focused engineering missions and build consistency.",
    icon: BookOpenCheck,
  },
  {
    title: "Ranking",
    description: "Convert performance into visible leaderboard momentum.",
    icon: Trophy,
  },
  {
    title: "Skill Passport",
    description: "Build a public-ready engineering identity over time.",
    icon: BadgeCheck,
  },
  {
    title: "Road to WorldSkills",
    description: "Move from campus practice toward national and global readiness.",
    icon: Globe2,
  },
  {
    title: "ECE Tracks",
    description: "Explore embedded, PCB, VLSI, IoT, robotics and hardware skills.",
    icon: CircuitBoard,
  },
];

export default function OsoExploreSection({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <section className="oso-section overflow-hidden bg-white">
      <div className="oso-container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-14">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="oso-floating-illustration-stage mx-auto w-full max-w-[720px] px-0 py-2 sm:py-4">
  <OsoIllustrationAsset
    src={OSO_ILLUSTRATIONS.exploreLaptop}
    alt="A student exploring OSO daily challenges, rankings, skill passport, Road to WorldSkills and ECE tracks from a laptop."
    blend
    decorative={false}
    imageClassName="oso-floating-illustration-img mx-auto max-h-[480px] max-w-[700px]"
  />
</div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <OsoMilestoneHeader
              eyebrow="Explore OSO"
              title="A guided engineering ecosystem."
              description="OSO should feel simple at first sight: students join, practice daily, explore ECE domains, compete, build rankings and move toward global skill readiness."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {exploreItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-[1.35rem] border border-slate-200 bg-white/86 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.045)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.075)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="oso-heading mt-4 text-xl font-black text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-base font-medium leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/daily-challenges"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Daily Challenges
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/competition"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Explore Competitions
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}