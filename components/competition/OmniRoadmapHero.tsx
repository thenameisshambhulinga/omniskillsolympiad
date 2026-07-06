"use client";

import {
  ArrowRight,
  BadgeCheck,
  CircuitBoard,
  Flag,
  Gauge,
  Route,
  Sparkles,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionMetricTile,
  CompetitionProgressBar,
  CompetitionSectionHeading,
  CompetitionStatusPill,
  clampPercent,
} from "@/components/competition/CompetitionGlassPanel";

export default function OmniRoadmapHero({ snapshot }: { snapshot: unknown }) {
  const data = toRecord(snapshot);
  const points = getNumber(data, "points", getNumber(data, "siliconPoints", 0));
  const currentTier = getDisplayValue(data.currentTier, "name", "Emerging Engineer");
  const currentStage = getDisplayValue(data.currentStage, "name", "Foundation");
  const nextStage = getDisplayValue(data.nextStage, "name", "Next Stage");
  const nextStep = getDisplayValue(data.nextOmniStep, "meaning", "Continue the next mission");
  const completedSteps = getNumber(data, "completedSteps", 0);
  const totalSteps = Math.max(1, getNumber(data, "totalSteps", 28));
  const progressPercent = clampPercent(
    getNumber(data, "progressPercent", (completedSteps / totalSteps) * 100),
  );
  const tierProgress = clampPercent(getNumber(data, "tierProgress", 0));

  return (
    <CompetitionGlassPanel className="p-6 sm:p-8 lg:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <CompetitionSectionHeading
            eyebrow="OMNI Roadmap"
            title="Your engineering growth journey is now measurable."
            description="Track points, stage movement, next OMNI step, tier growth and readiness signals inside a single competition pathway."
            icon={<Route className="h-5 w-5" />}
          />

          <div className="mt-7 flex flex-wrap gap-3">
            <CompetitionStatusPill label={currentTier} tone="blue" />
            <CompetitionStatusPill label={currentStage} tone="emerald" />
            <CompetitionStatusPill label={`${progressPercent}% Complete`} tone="yellow" />
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Total Silicon Points
                </p>
                <p className="oso-heading mt-2 text-4xl font-black text-slate-950">
                  {points}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm font-black">Next: {nextStage}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Journey Progress
                </p>
                <p className="text-sm font-black text-slate-950">
                  {completedSteps}/{totalSteps} steps
                </p>
              </div>

              <CompetitionProgressBar value={progressPercent} tone="blue" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CompetitionMetricTile
            icon={<CircuitBoard className="h-5 w-5" />}
            label="Current Stage"
            value={currentStage}
            helper="Active VIBGYOR engineering stage"
            tone="blue"
          />

          <CompetitionMetricTile
            icon={<BadgeCheck className="h-5 w-5" />}
            label="Current Tier"
            value={currentTier}
            helper="Based on progress and points"
            tone="emerald"
          />

          <CompetitionMetricTile
            icon={<Gauge className="h-5 w-5" />}
            label="Tier Progress"
            value={`${tierProgress}%`}
            helper="Momentum toward the next tier"
            tone="yellow"
          />

          <CompetitionMetricTile
            icon={<Flag className="h-5 w-5" />}
            label="Next OMNI Step"
            value={nextStep}
            helper="Recommended next movement"
            tone="cyan"
          />
        </div>
      </div>
    </CompetitionGlassPanel>
  );
}

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getNumber(record: Record<string, unknown>, key: string, fallback: number) {
  const value = record[key];

  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getDisplayValue(value: unknown, preferredKey: string, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const preferred = record[preferredKey];
    const name = record.name;
    const label = record.label;
    const title = record.title;

    if (typeof preferred === "string" && preferred.trim()) {
      return preferred.trim();
    }

    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }

    if (typeof label === "string" && label.trim()) {
      return label.trim();
    }

    if (typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  return fallback;
}