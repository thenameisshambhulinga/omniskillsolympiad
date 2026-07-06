import type { CompetitionPassport } from "@/lib/profile/competition-passport";
import type { EngineeringReadinessResult } from "@/lib/profile/readiness-engine";
import type { AssessmentTrend } from "@/lib/profile/assessment-ledger";

export type QualificationZone =
  | "Borderline Zone"
  | "Safe Zone"
  | "Advancing Zone"
  | "Champion Zone";

export type EliminationRisk = "Low" | "Medium" | "High";

export type CompetitionStanding = {
  nationalRank: string;
  stateRank: string;
  collegeRank: string;
  percentile: number;
  participantsAhead: number;
  participantsBehind: number;
  totalParticipants: number;
};

export type CompetitionMomentum = {
  weeklyRankChange: number;
  weeklyPointGain: number;
  readinessImprovement: number;
  assessmentImprovement: number;
  label: "Rising" | "Stable" | "Needs Push";
};

export type QualificationStatus = {
  zone: QualificationZone;
  progressToNextZone: number;
  nextZone: QualificationZone | null;
};

export type CompetitionInsights = {
  strengths: string[];
  risks: string[];
  opportunities: string[];
};

export type CompetitionPulseItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
};

export type CompetitionOperationsInput = {
  passport: CompetitionPassport;
  readiness: EngineeringReadinessResult;
  assessmentTrend: AssessmentTrend;
  totalParticipants: number;
  weeklyRankChange: number;
  weeklyPointGain: number;
  activityCount: number;
};

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

function parseRank(rank: string) {
  const parsed = Number.parseInt(rank.replace("#", ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getCompetitionStanding(
  input: CompetitionOperationsInput,
): CompetitionStanding {
  const totalParticipants = Math.max(1, input.totalParticipants);
  const rank = parseRank(input.passport.currentRank);
  const participantsAhead = Math.max(0, rank - 1);
  const participantsBehind = Math.max(0, totalParticipants - rank);
  const percentile = clamp((participantsBehind / totalParticipants) * 100);

  return {
    nationalRank: input.passport.currentRank,
    stateRank: input.passport.stateRank,
    collegeRank: input.passport.collegeRank,
    percentile,
    participantsAhead,
    participantsBehind,
    totalParticipants,
  };
}

export function getCompetitionMomentum(
  input: CompetitionOperationsInput,
): CompetitionMomentum {
  const readinessImprovement =
    input.readiness.score - Math.max(0, input.readiness.score - 4);

  const assessmentImprovement = input.assessmentTrend.improvementPercent;

  const label =
    input.weeklyPointGain > 0 ||
    input.weeklyRankChange > 0 ||
    assessmentImprovement > 0
      ? "Rising"
      : input.readiness.score < 35
        ? "Needs Push"
        : "Stable";

  return {
    weeklyRankChange: input.weeklyRankChange,
    weeklyPointGain: input.weeklyPointGain,
    readinessImprovement,
    assessmentImprovement,
    label,
  };
}

export function getQualificationStatus(
  input: CompetitionOperationsInput,
): QualificationStatus {
  const standing = getCompetitionStanding(input);
  const score = Math.round(
    standing.percentile * 0.45 +
      input.readiness.score * 0.35 +
      input.passport.journeyCompletion * 0.2,
  );

  if (score >= 90) {
    return {
      zone: "Champion Zone",
      progressToNextZone: 100,
      nextZone: null,
    };
  }

  if (score >= 70) {
    return {
      zone: "Advancing Zone",
      progressToNextZone: clamp(((score - 70) / 20) * 100),
      nextZone: "Champion Zone",
    };
  }

  if (score >= 45) {
    return {
      zone: "Safe Zone",
      progressToNextZone: clamp(((score - 45) / 25) * 100),
      nextZone: "Advancing Zone",
    };
  }

  return {
    zone: "Borderline Zone",
    progressToNextZone: clamp((score / 45) * 100),
    nextZone: "Safe Zone",
  };
}

export function getEliminationRisk(
  input: CompetitionOperationsInput,
): EliminationRisk {
  const riskScore =
    (input.readiness.score < 35 ? 30 : 0) +
    (input.passport.latestAssessmentScore < 50 ? 25 : 0) +
    (input.weeklyPointGain <= 0 ? 20 : 0) +
    (input.activityCount <= 0 ? 15 : 0) +
    (input.passport.journeyCompletion < 20 ? 10 : 0);

  if (riskScore >= 55) return "High";
  if (riskScore >= 28) return "Medium";
  return "Low";
}

export function getCompetitionInsights(
  input: CompetitionOperationsInput,
): CompetitionInsights {
  const momentum = getCompetitionMomentum(input);
  const qualification = getQualificationStatus(input);
  const risk = getEliminationRisk(input);

  const strengths = [
    ...input.readiness.strengthAreas,
    momentum.label === "Rising" ? "Competition Momentum" : null,
    input.passport.journeyCompletion >= 40 ? "Stage Progression" : null,
  ].filter(Boolean) as string[];

  const risks = [
    risk !== "Low" ? `${risk} Elimination Risk` : null,
    input.weeklyPointGain <= 0 ? "Low Weekly Point Gain" : null,
    input.passport.latestAssessmentScore < 60 ? "Assessment Score Needs Push" : null,
  ].filter(Boolean) as string[];

  const opportunities = [
    qualification.nextZone
      ? `Push toward ${qualification.nextZone}`
      : "Maintain Champion Zone",
    ...input.readiness.focusAreas.slice(0, 3),
  ];

  return {
    strengths: strengths.slice(0, 5),
    risks: risks.slice(0, 5),
    opportunities: opportunities.slice(0, 5),
  };
}

export function getCompetitionPulse(
  input: CompetitionOperationsInput,
): CompetitionPulseItem[] {
  return input.passport.timeline.slice(0, 6).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type,
    date: item.date,
  }));
}