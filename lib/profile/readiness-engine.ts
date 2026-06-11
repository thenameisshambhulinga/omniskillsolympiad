import { getTierProgress } from "@/lib/profile/tier-engine";
import type { EngineeringTierName } from "@/lib/profile/tier-engine";
import type { VibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export type ReadinessLevel =
  | "Beginner"
  | "Developing"
  | "Advanced"
  | "Competition Ready"
  | "WorldSkills Ready";

export type ReadinessInput = {
  siliconPoints: number;
  currentTier: EngineeringTierName;
  journeyCompletion: number;
  completedSteps: number;
  totalSteps: number;
  dailyCompletedCount: number;
  activityCount: number;
  consistencyScore: number;
  averageAccuracy: number;
  skills: string[];
  careerInterests: string[];
};

export type EngineeringReadinessResult = {
  score: number;
  level: ReadinessLevel;
  factors: {
    tier: number;
    siliconPoints: number;
    journeyCompletion: number;
    dailyParticipation: number;
    consistency: number;
    activity: number;
  };
  strengthAreas: string[];
  focusAreas: string[];
  improvementGuidance: string;
  nextMilestone: string;
};

const TIER_SCORE: Record<EngineeringTierName, number> = {
  Explorer: 15,
  Builder: 32,
  Innovator: 50,
  Architect: 68,
  Champion: 82,
  Elite: 92,
  Legend: 100,
};

function clamp(value: number) {
  return Math.min(
    100,
    Math.max(0, Math.round(Number.isFinite(value) ? value : 0)),
  );
}

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score <= 20) return "Beginner";
  if (score <= 40) return "Developing";
  if (score <= 60) return "Advanced";
  if (score <= 80) return "Competition Ready";
  return "WorldSkills Ready";
}

export function getStrengthAreas(input: ReadinessInput): string[] {
  const normalizedSkills = input.skills.map((skill) => skill.toLowerCase());
  const strengths: string[] = [];

  if (
    normalizedSkills.some(
      (skill) =>
        skill.includes("embedded") ||
        skill.includes("microcontroller") ||
        skill.includes("firmware"),
    )
  ) {
    strengths.push("Embedded Systems");
  }

  if (
    normalizedSkills.some(
      (skill) =>
        skill.includes("electronics") ||
        skill.includes("circuit") ||
        skill.includes("analog") ||
        skill.includes("digital"),
    ) ||
    input.completedSteps >= 4
  ) {
    strengths.push("Engineering Foundations");
  }

  if (input.consistencyScore >= 70 || input.dailyCompletedCount >= 5) {
    strengths.push("Consistency");
  }

  if (input.activityCount >= 5 || input.dailyCompletedCount >= 3) {
    strengths.push("Technical Participation");
  }

  if (input.siliconPoints >= 100 || input.journeyCompletion >= 25) {
    strengths.push("Competition Momentum");
  }

  if (input.averageAccuracy >= 75) {
    strengths.push("Assessment Performance");
  }

  return strengths.length ? strengths.slice(0, 5) : ["Engineering Foundations"];
}

export function getFocusAreas(input: ReadinessInput): string[] {
  const normalizedSkills = input.skills.map((skill) => skill.toLowerCase());
  const normalizedInterests = input.careerInterests.map((interest) =>
    interest.toLowerCase(),
  );
  const combined = [...normalizedSkills, ...normalizedInterests].join(" ");

  const focusAreas: string[] = [];

  if (!combined.includes("pcb")) {
    focusAreas.push("PCB Design");
  }

  if (!combined.includes("diagnostic") && !combined.includes("debug")) {
    focusAreas.push("Diagnostics");
  }

  if (!combined.includes("iot") && !combined.includes("mqtt")) {
    focusAreas.push("IoT Systems");
  }

  if (!combined.includes("automation") && !combined.includes("industrial")) {
    focusAreas.push("Industrial Automation");
  }

  if (!combined.includes("innovation") && !combined.includes("r&d")) {
    focusAreas.push("Innovation Skills");
  }

  return focusAreas.slice(0, 5);
}

function getImprovementGuidance(level: ReadinessLevel) {
  if (level === "WorldSkills Ready") {
    return "Continue advanced mentor evaluations, national-level demonstrations and innovation-focused preparation.";
  }

  if (level === "Competition Ready") {
    return "Strengthen practical demonstrations, diagnostics speed and judge-facing explanation quality.";
  }

  if (level === "Advanced") {
    return "Focus on PCB design, embedded debugging, IoT integration and structured lab evaluation performance.";
  }

  if (level === "Developing") {
    return "Build consistency through lab participation, electronics fundamentals and guided mentor assessments.";
  }

  return "Start with foundation electronics, component identification, measurement practice and breadboard demonstrations.";
}

function getNextMilestone(input: ReadinessInput, score: number) {
  const tierProgress = getTierProgress(input.siliconPoints);

  if (tierProgress.nextTier && tierProgress.pointsToNextTier !== null) {
    return `${tierProgress.pointsToNextTier} Silicon Points to ${tierProgress.nextTier}`;
  }

  if (score < 80) {
    return "Reach Competition Ready readiness level";
  }

  if (score < 90) {
    return "Reach WorldSkills Ready readiness level";
  }

  return "Maintain elite engineering readiness";
}

export function getEngineeringReadiness(
  input: ReadinessInput,
): EngineeringReadinessResult {
  const tier = clamp(TIER_SCORE[input.currentTier] ?? 0);
  const siliconPoints = clamp((input.siliconPoints / 5000) * 100);
  const journeyCompletion = clamp(input.journeyCompletion);
  const dailyParticipation = clamp((input.dailyCompletedCount / 30) * 100);
  const consistency = clamp(input.consistencyScore);
  const activity = clamp((input.activityCount / 20) * 100);

  const score = clamp(
    tier * 0.18 +
      siliconPoints * 0.17 +
      journeyCompletion * 0.25 +
      dailyParticipation * 0.14 +
      consistency * 0.16 +
      activity * 0.1,
  );

  const level = getReadinessLevel(score);

  return {
    score,
    level,
    factors: {
      tier,
      siliconPoints,
      journeyCompletion,
      dailyParticipation,
      consistency,
      activity,
    },
    strengthAreas: getStrengthAreas(input),
    focusAreas: getFocusAreas(input),
    improvementGuidance: getImprovementGuidance(level),
    nextMilestone: getNextMilestone(input, score),
  };
}

export function buildReadinessInputFromSnapshot({
  snapshot,
  dailyCompletedCount,
  activityCount,
  consistencyScore,
  averageAccuracy,
  skills,
  careerInterests,
}: {
  snapshot: VibgyorJourneySnapshot;
  dailyCompletedCount: number;
  activityCount: number;
  consistencyScore: number;
  averageAccuracy: number;
  skills: string[];
  careerInterests: string[];
}): ReadinessInput {
  return {
    siliconPoints: snapshot.siliconPoints,
    currentTier: snapshot.currentTier,
    journeyCompletion: snapshot.journeyCompletion,
    completedSteps: snapshot.completedSteps,
    totalSteps: snapshot.totalSteps,
    dailyCompletedCount,
    activityCount,
    consistencyScore,
    averageAccuracy,
    skills,
    careerInterests,
  };
}
