"use client";

import {
  BadgeCheck,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  Flag,
  Gauge,
  ListChecks,
  Medal,
  Route,
  Target,
  Trophy,
} from "lucide-react";

import type {
  AssessmentCategory,
  AssessmentTrend,
  OfflineAssessment,
} from "@/lib/profile/assessment-ledger";
import type { CompetitionPassport } from "@/lib/profile/competition-passport";
import type { EngineeringReadinessResult } from "@/lib/profile/readiness-engine";

import {
  CompetitionMetricTile,
  CompetitionProgressBar,
  CompetitionStatusPill,
} from "@/components/competition/CompetitionGlassPanel";
import OsoExpandableGlassSection from "@/components/competition/OsoExpandableGlassSection";

type OsoCompetitionProgressiveDetailsProps = {
  latestAssessment: OfflineAssessment | null;
  assessmentHistory: OfflineAssessment[];
  upcomingAssessmentAreas: AssessmentCategory[];
  assessmentTrend: AssessmentTrend;
  averageAssessmentScore: number;
  passport: CompetitionPassport;
  readiness: EngineeringReadinessResult;
};

export default function OsoCompetitionProgressiveDetails({
  latestAssessment,
  assessmentHistory,
  upcomingAssessmentAreas,
  assessmentTrend,
  averageAssessmentScore,
  passport,
  readiness,
}: OsoCompetitionProgressiveDetailsProps) {
  const visibleAssessments = assessmentHistory.slice(-4).reverse();
  const visibleMilestones = passport.milestones.slice(0, 4);
  const visibleTimeline = passport.timeline.slice(0, 5);

  return (
    <OsoExpandableGlassSection
      eyebrow="Explore Details"
      title="Open only what you need."
      description="Detailed assessment, passport, ranking and timeline information is still available, but it no longer overloads the first view."
      items={[
        {
          id: "assessment",
          eyebrow: "Assessment",
          title: latestAssessment?.title ?? "Assessment details",
          summary:
            latestAssessment !== null
              ? `Latest score ${latestAssessment.score}% · ${assessmentTrend.trend} trend · ${averageAssessmentScore}% average.`
              : "Assessment details will appear once verified evaluation data is available.",
          icon: <ClipboardCheck className="h-5 w-5" />,
          tone: "blue",
          content: (
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                <CompetitionMetricTile
                  icon={<Gauge className="h-5 w-5" />}
                  label="Latest Score"
                  value={
                    latestAssessment ? `${latestAssessment.score}%` : "Pending"
                  }
                  helper={latestAssessment?.category ?? "No category yet"}
                  tone="blue"
                />

                <CompetitionMetricTile
                  icon={<BarChart3 className="h-5 w-5" />}
                  label="Average"
                  value={`${averageAssessmentScore}%`}
                  helper={`${assessmentHistory.length} total assessment signal${
                    assessmentHistory.length === 1 ? "" : "s"
                  }`}
                  tone="yellow"
                />

                <CompetitionMetricTile
                  icon={<Medal className="h-5 w-5" />}
                  label="Trend"
                  value={assessmentTrend.trend}
                  helper={`Improvement: ${assessmentTrend.improvementPercent}%`}
                  tone="emerald"
                />

                <CompetitionMetricTile
                  icon={<Target className="h-5 w-5" />}
                  label="Next Focus"
                  value={
                    upcomingAssessmentAreas.length
                      ? upcomingAssessmentAreas[0]
                      : "Practice"
                  }
                  helper="Upcoming assessment area"
                  tone="cyan"
                />
              </div>

              <div className="rounded-[1.35rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Recent Assessment Ledger
                </p>

                <div className="mt-4 grid gap-3">
                  {visibleAssessments.length > 0 ? (
                    visibleAssessments.map((assessment) => (
                      <AssessmentMiniRow
                        key={assessment.id}
                        assessment={assessment}
                      />
                    ))
                  ) : (
                    <EmptyMiniState label="No assessment ledger entries yet." />
                  )}
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "passport",
          eyebrow: "Skill Passport",
          title: "Passport, milestones and identity",
          summary: `${passport.omniId} · ${passport.currentTier} · ${passport.currentSiliconPoints} Silicon Points.`,
          icon: <BadgeCheck className="h-5 w-5" />,
          tone: "emerald",
          content: (
            <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <CompetitionMetricTile
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="OMNI ID"
                  value={passport.omniId}
                  helper="Permanent skill identity"
                  tone="blue"
                />

                <CompetitionMetricTile
                  icon={<Trophy className="h-5 w-5" />}
                  label="Current Tier"
                  value={passport.currentTier}
                  helper={passport.currentStage}
                  tone="yellow"
                />
              </div>

              <div className="rounded-[1.35rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Milestones
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {visibleMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-black leading-6 text-slate-950">
                          {milestone.title}
                        </h4>

                        <CompetitionStatusPill
                          label={milestone.status.replace("_", " ")}
                          tone={
                            milestone.status === "COMPLETED"
                              ? "emerald"
                              : milestone.status === "IN_PROGRESS"
                                ? "blue"
                                : "slate"
                          }
                        />
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                        {milestone.description}
                      </p>

                      <div className="mt-4">
                        <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          <span>Progress</span>
                          <span>{milestone.completionPercent}%</span>
                        </div>
                        <CompetitionProgressBar
                          value={milestone.completionPercent}
                          tone="blue"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "ranking",
          eyebrow: "Ranking",
          title: "Ranks and next target",
          summary: `${passport.currentRank} national · ${passport.stateRank} state · next stage ${passport.nextStage}.`,
          icon: <Flag className="h-5 w-5" />,
          tone: "yellow",
          content: (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <CompetitionMetricTile
                icon={<Trophy className="h-5 w-5" />}
                label="National"
                value={passport.currentRank}
                tone="blue"
              />

              <CompetitionMetricTile
                icon={<Flag className="h-5 w-5" />}
                label="State"
                value={passport.stateRank}
                tone="emerald"
              />

              <CompetitionMetricTile
                icon={<Medal className="h-5 w-5" />}
                label="College"
                value={passport.collegeRank}
                tone="yellow"
              />

              <CompetitionMetricTile
                icon={<Target className="h-5 w-5" />}
                label="Next Target"
                value={passport.nextStage}
                helper={`${passport.pointsRequired} points · ${passport.stepsRequired} steps`}
                tone="cyan"
              />
            </div>
          ),
        },
        {
          id: "timeline",
          eyebrow: "Timeline",
          title: "Progress timeline",
          summary: `${visibleTimeline.length} recent timeline signal${
            visibleTimeline.length === 1 ? "" : "s"
          } available for deeper review.`,
          icon: <Route className="h-5 w-5" />,
          tone: "cyan",
          content: (
            <div className="rounded-[1.35rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Recent Timeline
              </p>

              <div className="mt-5 grid gap-3">
                {visibleTimeline.length > 0 ? (
                  visibleTimeline.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-[150px_1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                          Date
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-950">
                          {item.date}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-950">
                          {item.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                          {item.description}
                        </p>
                      </div>

                      <CompetitionStatusPill
                        label={item.status.replace("_", " ")}
                        tone={
                          item.status === "COMPLETED"
                            ? "emerald"
                            : item.status === "IN_PROGRESS"
                              ? "blue"
                              : "slate"
                        }
                      />
                    </div>
                  ))
                ) : (
                  <EmptyMiniState label="Timeline will appear after more tracked activity." />
                )}
              </div>
            </div>
          ),
        },
        {
          id: "readiness",
          eyebrow: "Readiness",
          title: "Readiness factors",
         summary: `${readiness.score}% · ${readiness.level}. Focus: ${
  readiness.focusAreas[0] ?? "daily practice"
}.`,
          icon: <ListChecks className="h-5 w-5" />,
          tone: "blue",
          content: (
            <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[1.35rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Readiness Score
                </p>

                <p className="oso-heading mt-3 text-5xl font-black text-slate-950">
                  {readiness.score}%
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {readiness.improvementGuidance}
                </p>

                <CompetitionProgressBar
                  value={readiness.score}
                  tone={readiness.score >= 75 ? "emerald" : "blue"}
                  className="mt-5"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SignalList
                  title="Strength Areas"
                  items={readiness.strengthAreas}
                  emptyLabel="Strengths will appear after more signals."
                />

                <SignalList
                  title="Focus Areas"
                  items={readiness.focusAreas}
                  emptyLabel="Focus areas will appear after more signals."
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

function AssessmentMiniRow({ assessment }: { assessment: OfflineAssessment }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <h4 className="font-black text-slate-950">{assessment.title}</h4>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
          {assessment.category} · {assessment.date}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CompetitionStatusPill
          label={assessment.status}
          tone={
            assessment.status === "Completed"
              ? "emerald"
              : assessment.status === "In Review"
                ? "blue"
                : "slate"
          }
        />

        <p className="text-sm font-black text-slate-950">
          {assessment.score}%
        </p>
      </div>
    </div>
  );
}

function SignalList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
        {title}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-blue-700"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm font-semibold leading-6 text-slate-500">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyMiniState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}