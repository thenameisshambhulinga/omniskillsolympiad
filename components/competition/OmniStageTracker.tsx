"use client";

import { CheckCircle2, Circle, Crown, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

import CompetitionGlassPanel, {
  CompetitionProgressBar,
  CompetitionSectionHeading,
  CompetitionStatusPill,
  clampPercent,
} from "@/components/competition/CompetitionGlassPanel";

const VIBGYOR_STAGES = [
  {
    name: "Violet",
    title: "Electronics Explorer",
    focus: "Foundation electronics",
    tone: "bg-violet-500",
  },
  {
    name: "Indigo",
    title: "Circuit Builder",
    focus: "Analog and digital circuits",
    tone: "bg-indigo-500",
  },
  {
    name: "Blue",
    title: "Embedded Engineer",
    focus: "Microcontrollers and firmware",
    tone: "bg-blue-600",
  },
  {
    name: "Green",
    title: "Product Developer",
    focus: "PCB and product engineering",
    tone: "bg-emerald-600",
  },
  {
    name: "Yellow",
    title: "IoT Innovator",
    focus: "Sensors and smart systems",
    tone: "bg-yellow-500",
  },
  {
    name: "Orange",
    title: "Automation Specialist",
    focus: "Robotics and automation",
    tone: "bg-orange-500",
  },
  {
    name: "Red",
    title: "Innovation Champion",
    focus: "Grand challenges and R&D",
    tone: "bg-red-500",
  },
];

export default function OmniStageTracker({ snapshot }: { snapshot: unknown }) {
  const data = toRecord(snapshot);
  const currentStage = getDisplayValue(data.currentStage, "name", "Violet");
  const completedStages = getArray(data.completedStages)
    .map((stage) => getDisplayValue(stage, "name", ""))
    .filter(Boolean);
  const completedSteps = getNumber(data, "completedSteps", 0);
  const totalSteps = Math.max(1, getNumber(data, "totalSteps", 28));
  const progress = clampPercent(
    getNumber(data, "journeyCompletion", (completedSteps / totalSteps) * 100),
  );

  const activeIndex = Math.max(
    0,
    VIBGYOR_STAGES.findIndex(
      (stage) => stage.name.toLowerCase() === currentStage.toLowerCase(),
    ),
  );

  return (
    <CompetitionGlassPanel className="p-6 sm:p-8">
      <CompetitionSectionHeading
        eyebrow="VIBGYOR Stage Tracker"
        title="A game-like engineering progression map."
        description="Students move through VIBGYOR levels from electronics foundation to innovation championship."
        icon={<Crown className="h-5 w-5" />}
      />

      <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <CompetitionStatusPill label={`${progress}% Journey`} tone="blue" />
          <p className="text-sm font-black text-slate-950">
            {completedSteps}/{totalSteps} steps
          </p>
        </div>

        <CompetitionProgressBar value={progress} tone="blue" />
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {VIBGYOR_STAGES.map((stage, index) => {
          const isCompleted =
            index < activeIndex ||
            completedStages.some(
              (item) => item.toLowerCase() === stage.name.toLowerCase(),
            );
          const isActive = index === activeIndex;
          const isLocked = index > activeIndex;

          return (
            <motion.article
              key={stage.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.36,
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={[
                "relative isolate overflow-hidden rounded-[1.5rem] border p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1",
                isActive
                  ? "border-blue-200 bg-blue-50/85 shadow-[0_18px_44px_rgba(37,99,235,0.12)]"
                  : isCompleted
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-slate-200 bg-white/80",
              ].join(" ")}
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-0 h-1.5 w-full ${stage.tone}`}
              />

              <div className="flex items-center justify-between gap-3">
                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-2xl border",
                    isActive
                      ? "border-blue-200 bg-white text-blue-700"
                      : isCompleted
                        ? "border-emerald-200 bg-white text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-400",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isActive ? (
                    <Zap className="h-5 w-5" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>

                <span className="text-xs font-black text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {stage.name}
              </p>

              <h3 className="oso-heading mt-2 text-lg font-black leading-tight text-slate-950">
                {stage.title}
              </h3>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                {stage.focus}
              </p>

              <div className="mt-5">
                <CompetitionStatusPill
                  label={
                    isActive ? "Active" : isCompleted ? "Completed" : "Locked"
                  }
                  tone={isActive ? "blue" : isCompleted ? "emerald" : "slate"}
                />
              </div>
            </motion.article>
          );
        })}
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

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function getDisplayValue(value: unknown, preferredKey: string, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const preferred = record[preferredKey];
    const name = record.name;
    const title = record.title;

    if (typeof preferred === "string" && preferred.trim()) {
      return preferred.trim();
    }

    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }

    if (typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  return fallback;
}