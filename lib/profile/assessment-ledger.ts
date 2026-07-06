import type { EngineeringReadinessResult } from "@/lib/profile/readiness-engine";
import type { VibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export type AssessmentStatus = "Completed" | "In Review" | "Upcoming";

export type AssessmentCategory =
  | "Component Identification"
  | "Circuit Analysis"
  | "Embedded Systems"
  | "PCB Design"
  | "IoT Systems"
  | "Industrial Automation"
  | "Innovation Sprint";

export type OfflineAssessment = {
  id: string;
  category: AssessmentCategory;
  title: string;
  score: number;
  status: AssessmentStatus;
  date: string;
  readinessImpact: number;
  evaluatorType: "Lab Mentor" | "Workshop Mentor" | "Judge Panel";
  notes: string;
};

export type AssessmentTrend = {
  scores: number[];
  improvementPercent: number;
  trend: "Improving" | "Stable" | "Needs Attention" | "No Data";
};

export type AssessmentLedgerInput = {
  snapshot: VibgyorJourneySnapshot;
  readiness: EngineeringReadinessResult;
  assessments?: OfflineAssessment[];
};

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

export function getAssessmentHistory(
  input: AssessmentLedgerInput,
): OfflineAssessment[] {
  return input.assessments ?? [];
}

export function getLatestAssessment(
  input: AssessmentLedgerInput,
): OfflineAssessment | null {
  const completed = getAssessmentHistory(input).filter(
    (assessment) => assessment.status === "Completed",
  );

  return completed.at(-1) ?? null;
}

export function getAverageAssessmentScore(input: AssessmentLedgerInput): number {
  const completed = getAssessmentHistory(input).filter(
    (assessment) => assessment.status === "Completed",
  );

  if (!completed.length) return 0;

  return clampScore(
    completed.reduce((total, assessment) => total + assessment.score, 0) /
      completed.length,
  );
}

export function getAssessmentTrend(input: AssessmentLedgerInput): AssessmentTrend {
  const scores = getAssessmentHistory(input)
    .filter((assessment) => assessment.status === "Completed")
    .map((assessment) => assessment.score);

  if (!scores.length) {
    return {
      scores: [],
      improvementPercent: 0,
      trend: "No Data",
    };
  }

  if (scores.length === 1) {
    return {
      scores,
      improvementPercent: 0,
      trend: "Stable",
    };
  }

  const first = scores[0];
  const latest = scores.at(-1) ?? first;
  const improvementPercent = latest - first;

  return {
    scores,
    improvementPercent,
    trend:
      improvementPercent >= 8
        ? "Improving"
        : improvementPercent >= 0
          ? "Stable"
          : "Needs Attention",
  };
}

export function getUpcomingAssessmentAreas(
  input: AssessmentLedgerInput,
): AssessmentCategory[] {
  const focusMap: Record<string, AssessmentCategory> = {
    "PCB Design": "PCB Design",
    Diagnostics: "Circuit Analysis",
    "IoT Systems": "IoT Systems",
    "Industrial Automation": "Industrial Automation",
    "Innovation Skills": "Innovation Sprint",
    "Embedded Systems": "Embedded Systems",
    "Engineering Foundations": "Component Identification",
  };

  return Array.from(
    new Set(
      input.readiness.focusAreas
        .map((area) => focusMap[area])
        .filter((area): area is AssessmentCategory => Boolean(area)),
    ),
  );
}