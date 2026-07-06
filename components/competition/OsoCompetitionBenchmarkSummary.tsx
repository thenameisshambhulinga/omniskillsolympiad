"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Gauge, Radar } from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionMetricTile,
} from "@/components/competition/CompetitionGlassPanel";
import OsoFloatingIllustrationStage from "@/components/landing/clean/OsoFloatingIllustrationStage";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

type OsoCompetitionBenchmarkSummaryProps = {
  readinessScore: number;
  averageAssessmentScore: number;
  latestAssessmentTitle: string;
};

export default function OsoCompetitionBenchmarkSummary({
  readinessScore,
  averageAssessmentScore,
  latestAssessmentTitle,
}: OsoCompetitionBenchmarkSummaryProps) {
  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
            Benchmark Summary
          </p>

          <h2 className="oso-heading mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            A clean benchmark view, not another dashboard.
          </h2>

          <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
            OSO should feel measurable. This compact block shows the core
            evaluation signals without repeating every assessment detail.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <CompetitionMetricTile
              icon={<Gauge className="h-5 w-5" />}
              label="Readiness"
              value={`${readinessScore}%`}
              tone="blue"
            />

            <CompetitionMetricTile
              icon={<BarChart3 className="h-5 w-5" />}
              label="Avg Score"
              value={`${averageAssessmentScore}%`}
              tone="yellow"
            />

            <CompetitionMetricTile
              icon={<Radar className="h-5 w-5" />}
              label="Latest"
              value={latestAssessmentTitle}
              tone="emerald"
            />
          </div>

          <Link
            href="/daily-leaderboard"
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            View Leaderboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <OsoFloatingIllustrationStage
          glow="blue"
          className="mx-auto w-full max-w-[720px]"
        >
          <OsoIllustrationAsset
            src={OSO_ILLUSTRATIONS.benchmarkEnvironment}
            alt="Benchmark environment illustration"
            blend
            imageClassName="oso-floating-illustration-img mx-auto max-h-[420px] max-w-[680px]"
          />
        </OsoFloatingIllustrationStage>
      </div>
    </CompetitionGlassPanel>
  );
}