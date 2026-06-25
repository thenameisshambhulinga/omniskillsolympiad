"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Crosshair,
  Gauge,
} from "lucide-react";

import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";
import OsoMilestoneHeader from "@/components/landing/clean/OsoMilestoneHeader";

const benchmarkSignals = [
  {
    title: "Structured Evaluation",
    description: "Challenge attempts become measurable engineering signals.",
    icon: Crosshair,
  },
  {
    title: "Performance Benchmarking",
    description:
      "Omni Score, Silicon Points and ranking convert activity into progress.",
    icon: BarChart3,
  },
  {
    title: "Readiness Calibration",
    description:
      "Students can see how close they are to advanced competition readiness.",
    icon: Gauge,
  },
];

export default function OsoBenchmarkEnvironmentSection({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <section className="oso-section overflow-hidden bg-[#f8f9fa]">
      <div className="oso-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] xl:gap-14">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <OsoMilestoneHeader
              eyebrow="Benchmark Environment"
              title="Build a benchmark-ready environment for engineering growth."
              description="OSO should not feel like a normal quiz site. It is a measurable competition environment where skill activity becomes visible, comparable and progressively stronger."
            />

            <div className="mt-8 grid gap-4">
              {benchmarkSignals.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex gap-4 rounded-[1.35rem] border border-slate-200 bg-white/88 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.045)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_44px_rgba(15,23,42,0.075)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="oso-heading text-xl font-black text-slate-950">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-base font-medium leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/daily-leaderboard"
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              View Ranking Intelligence
              <ArrowRight className="h-4 w-4" />
            </Link>
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
           <div className="oso-floating-illustration-stage mx-auto w-full max-w-[760px] px-0 py-2 sm:py-4">
  <OsoIllustrationAsset
    src={OSO_ILLUSTRATIONS.benchmarkEnvironment}
    alt="Technical benchmark environment with modular blocks, server architecture, calibration marks and data flow lines."
    blend
    decorative={false}
    imageClassName="oso-floating-illustration-img mx-auto max-h-[500px] max-w-[740px]"
  />
</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}