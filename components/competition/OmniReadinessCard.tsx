"use client";

import { Activity, BrainCircuit, Gauge, Lightbulb, Target } from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionMetricTile,
  CompetitionProgressBar,
  CompetitionSectionHeading,
  CompetitionStatusPill,
  clampPercent,
} from "@/components/competition/CompetitionGlassPanel";

export default function OmniReadinessCard({ snapshot }: { snapshot: unknown }) {
  const data = toRecord(snapshot);
  const score = clampPercent(getNumber(data, "readinessScore", 0));
  const level = getString(data, "readinessLevel", getReadinessLabel(score));
  const completion = clampPercent(getNumber(data, "journeyCompletion", 0));
  const tierProgress = clampPercent(getNumber(data, "tierProgressPercent", 0));
  const remainingSteps = Math.max(0, getNumber(data, "remainingSteps", 0));
  const currentStage = getDisplayValue(data.currentStage, "name", "Foundation");

  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <CompetitionSectionHeading
            eyebrow="OMNI Readiness"
            title="Competition readiness snapshot."
            description="This card converts journey movement into a simple readiness signal for students."
            icon={<Gauge className="h-5 w-5" />}
          />

          <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Readiness Score
                </p>

                <p className="oso-heading mt-2 text-5xl font-black text-slate-950">
                  {score}%
                </p>
              </div>

              <CompetitionStatusPill
                label={level}
                tone={score >= 75 ? "emerald" : score >= 45 ? "yellow" : "blue"}
              />
            </div>

            <div className="mt-5">
              <CompetitionProgressBar
                value={score}
                tone={score >= 75 ? "emerald" : score >= 45 ? "yellow" : "blue"}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CompetitionMetricTile
            icon={<BrainCircuit className="h-5 w-5" />}
            label="Current Stage"
            value={currentStage}
            helper="Active engineering stage"
            tone="blue"
          />

          <CompetitionMetricTile
            icon={<Activity className="h-5 w-5" />}
            label="Journey"
            value={`${completion}%`}
            helper="Overall VIBGYOR movement"
            tone="emerald"
          />

          <CompetitionMetricTile
            icon={<Target className="h-5 w-5" />}
            label="Tier Growth"
            value={`${tierProgress}%`}
            helper="Progress toward the next tier"
            tone="yellow"
          />

          <CompetitionMetricTile
            icon={<Lightbulb className="h-5 w-5" />}
            label="Remaining Steps"
            value={remainingSteps}
            helper="Growth path still open"
            tone="cyan"
          />
        </div>
      </div>
    </CompetitionGlassPanel>
  );
}

function getReadinessLabel(score: number) {
  if (score >= 85) {
    return "Competition Ready";
  }

  if (score >= 65) {
    return "Strong Progress";
  }

  if (score >= 40) {
    return "Building Readiness";
  }

  return "Awaiting Evaluation";
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