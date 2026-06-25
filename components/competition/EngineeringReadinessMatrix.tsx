"use client";

import {
  Activity,
  BarChart3,
  CheckCircle2,
  Compass,
  Gauge,
  Lightbulb,
  Target,
  Trophy,
} from "lucide-react";

import CompetitionGlassPanel, {
  CompetitionMetricTile,
  CompetitionProgressBar,
  CompetitionSectionHeading,
  CompetitionStatusPill,
  clampPercent,
} from "@/components/competition/CompetitionGlassPanel";

const factorLabels: Record<string, string> = {
  tier: "Tier Strength",
  siliconPoints: "Silicon Points",
  journeyCompletion: "Journey Completion",
  dailyParticipation: "Daily Participation",
  consistency: "Consistency",
  activity: "Activity Signal",
};

export default function EngineeringReadinessMatrix({
  readiness,
}: {
  readiness: unknown;
}) {
  const data = toRecord(readiness);
  const score = clampPercent(getNumber(data, "score", 0));
  const level = getString(data, "level", getReadinessLabel(score));
  const factors = toRecord(data.factors);
  const strengthAreas = getStringArray(data.strengthAreas);
  const focusAreas = getStringArray(data.focusAreas);
  const guidance = getString(
    data,
    "improvementGuidance",
    "Continue completing challenges and assessments to improve readiness.",
  );
  const nextMilestone = getString(
    data,
    "nextMilestone",
    "Complete the next competition milestone.",
  );

  const factorEntries = Object.entries(factors).filter(
    ([, value]) => typeof value === "number" && Number.isFinite(value),
  );

  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <CompetitionSectionHeading
        eyebrow="Engineering Readiness Matrix"
        title="Benchmark-style readiness intelligence."
        description="A clean evaluation matrix that converts participation, consistency, activity and progression into visible engineering readiness."
        icon={<BarChart3 className="h-5 w-5" />}
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Overall Readiness
              </p>

              <p className="oso-heading mt-2 text-6xl font-black text-slate-950">
                {score}%
              </p>
            </div>

            <CompetitionStatusPill
              label={level}
              tone={score >= 75 ? "emerald" : score >= 45 ? "yellow" : "blue"}
            />
          </div>

          <div className="mt-6">
            <CompetitionProgressBar
              value={score}
              tone={score >= 75 ? "emerald" : score >= 45 ? "yellow" : "blue"}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CompetitionMetricTile
              icon={<Target className="h-5 w-5" />}
              label="Next Milestone"
              value={nextMilestone}
              tone="blue"
            />

            <CompetitionMetricTile
              icon={<Compass className="h-5 w-5" />}
              label="Guidance"
              value="Action Plan"
              helper={guidance}
              tone="yellow"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {factorEntries.length > 0 ? (
            factorEntries.map(([key, value]) => {
              const percent = clampPercent(value as number);

              return (
                <div
                  key={key}
                  className="rounded-[1.4rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                      <Gauge className="h-5 w-5" />
                    </div>

                    <p className="text-sm font-black text-slate-950">
                      {percent}%
                    </p>
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    {factorLabels[key] ?? formatFactorLabel(key)}
                  </p>

                  <div className="mt-3">
                    <CompetitionProgressBar value={percent} tone="blue" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white/70 p-5 text-sm font-semibold text-slate-500 sm:col-span-2">
              Readiness factors will appear after evaluation signals are
              available.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <SignalList
          title="Strength Areas"
          icon={<CheckCircle2 className="h-5 w-5" />}
          items={strengthAreas}
          emptyLabel="Strength areas will appear after more completed signals."
          tone="emerald"
        />

        <SignalList
          title="Focus Areas"
          icon={<Lightbulb className="h-5 w-5" />}
          items={focusAreas}
          emptyLabel="Focus areas will appear after more completed signals."
          tone="yellow"
        />
      </div>
    </CompetitionGlassPanel>
  );
}

function SignalList({
  title,
  icon,
  items,
  emptyLabel,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyLabel: string;
  tone: "emerald" | "yellow";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClass}`}>
          {icon}
        </div>

        <h3 className="oso-heading text-xl font-black text-slate-950">
          {title}
        </h3>
      </div>

      <div className="mt-5 grid gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <p className="text-sm font-semibold leading-6 text-slate-600">
                {item}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-500">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
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

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function formatFactorLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}