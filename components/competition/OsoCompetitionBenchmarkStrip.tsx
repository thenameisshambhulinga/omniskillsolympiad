"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Gauge, Radar, Trophy } from "lucide-react";

import OsoFloatingIllustrationStage from "@/components/landing/clean/OsoFloatingIllustrationStage";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

type OsoCompetitionBenchmarkStripProps = {
  readinessScore: number;
  averageAssessmentScore: number;
  latestAssessmentTitle: string;
};

export default function OsoCompetitionBenchmarkStrip({
  readinessScore,
  averageAssessmentScore,
  latestAssessmentTitle,
}: OsoCompetitionBenchmarkStripProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/76 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.09),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.12),transparent_32%)]"
      />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
            Benchmark Environment
          </p>

          <h2 className="oso-heading mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Your competition progress behaves like a benchmark system.
          </h2>

          <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
            Readiness, assessment scores, ranking signals and competition
            milestones are presented like an engineering evaluation environment,
            not a generic quiz result page.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <BenchmarkMetric
              icon={<Gauge className="h-5 w-5" />}
              label="Readiness"
              value={`${readinessScore}%`}
            />
            <BenchmarkMetric
              icon={<BarChart3 className="h-5 w-5" />}
              label="Avg Score"
              value={`${averageAssessmentScore}%`}
            />
            <BenchmarkMetric
              icon={<Radar className="h-5 w-5" />}
              label="Latest"
              value={latestAssessmentTitle}
            />
          </div>

          <Link
            href="/daily-leaderboard"
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            View Ranking Intelligence
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <OsoFloatingIllustrationStage
            glow="blue"
            className="mx-auto w-full max-w-[760px]"
          >
            <OsoIllustrationAsset
              src={OSO_ILLUSTRATIONS.benchmarkEnvironment}
              alt="Technical benchmark environment with modular server blocks, calibration panels and data flow lines."
              blend
              imageClassName="oso-floating-illustration-img mx-auto max-h-[490px] max-w-[740px]"
            />
          </OsoFloatingIllustrationStage>
        </motion.div>
      </div>
    </section>
  );
}

function BenchmarkMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/78 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
        {icon}
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-base font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}