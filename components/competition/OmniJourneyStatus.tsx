"use client";

import {
  Activity,
  BadgeCheck,
  CircuitBoard,
  Layers3,
  Sparkles,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionMetricTile,
  CompetitionProgressBar,
  CompetitionSectionHeading,
  CompetitionStatusPill,
  clampPercent,
} from "@/components/competition/CompetitionGlassPanel";

export default function OmniJourneyStatus({ snapshot }: { snapshot: unknown }) {
  const data = toRecord(snapshot);
  const siliconPoints = getNumber(data, "siliconPoints", 0);
  const currentTier = getDisplayValue(data.currentTier, "name", "Emerging Engineer");
  const currentStage = toRecord(data.currentStage);
  const currentStep = toRecord(data.currentStep);

  const stageName = getString(currentStage, "name", "Foundation Stage");
  const stageDescription = getString(
    currentStage,
    "description",
    "Current active engineering progression stage.",
  );
  const stepCode = getString(currentStep, "code", "O");
  const stepMeaning = getString(currentStep, "meaning", "Continue learning");
  const stepSkill = getString(currentStep, "skill", "Engineering Skill");
  const difficulty = getString(currentStep, "difficulty", "Core");

  const completedSteps = getNumber(data, "completedSteps", 0);
  const totalSteps = Math.max(1, getNumber(data, "totalSteps", 28));
  const remainingSteps = getNumber(data, "remainingSteps", totalSteps - completedSteps);
  const completion = clampPercent(
    getNumber(data, "journeyCompletion", (completedSteps / totalSteps) * 100),
  );

  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <CompetitionSectionHeading
        eyebrow="Journey Status"
        title="Your current VIBGYOR position."
        description={stageDescription}
        icon={<Activity className="h-5 w-5" />}
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                Active Stage
              </p>

              <h3 className="oso-heading mt-3 text-3xl font-black text-slate-950">
                {stageName}
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
              <CircuitBoard className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Journey Completion
              </p>
              <p className="text-sm font-black text-slate-950">{completion}%</p>
            </div>

            <CompetitionProgressBar value={completion} tone="blue" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <CompetitionStatusPill label={currentTier} tone="emerald" />
            <CompetitionStatusPill label={`${siliconPoints} Points`} tone="yellow" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CompetitionMetricTile
            icon={<Layers3 className="h-5 w-5" />}
            label="Current Step"
            value={`${stepCode} · ${stepMeaning}`}
            helper={stepSkill}
            tone="blue"
          />

          <CompetitionMetricTile
            icon={<BadgeCheck className="h-5 w-5" />}
            label="Difficulty"
            value={difficulty}
            helper="Current OMNI step complexity"
            tone="yellow"
          />

          <CompetitionMetricTile
            icon={<Sparkles className="h-5 w-5" />}
            label="Completed"
            value={`${completedSteps}/${totalSteps}`}
            helper="Tracked progression steps"
            tone="emerald"
          />

          <CompetitionMetricTile
            icon={<Activity className="h-5 w-5" />}
            label="Remaining"
            value={Math.max(0, remainingSteps)}
            helper="Steps left in the full journey"
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

function getString(record: Record<string, unknown>, key: string, fallback: string) {
  const value = record[key];

  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getDisplayValue(value: unknown, preferredKey: string, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const preferred = record[preferredKey];
    const name = record.name;

    if (typeof preferred === "string" && preferred.trim()) {
      return preferred.trim();
    }

    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }
  }

  return fallback;
}