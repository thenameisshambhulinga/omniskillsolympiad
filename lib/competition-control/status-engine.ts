import type { OfflineAssessment } from "@/lib/profile/assessment-ledger";
import type { VerificationStatus } from "@/lib/competition/verification-engine";
import type { EngineeringReadinessResult } from "@/lib/profile/readiness-engine";
import type { TierProgress } from "@/lib/profile/tier-engine";
import type { VibgyorJourneySnapshot } from "@/lib/profile/vibgyor-progress";

export type CompetitionControlAssessmentStatus =
  | "Not Started"
  | "In Review"
  | "Completed";

export type CompetitionControlVerificationStatus =
  | "Pending"
  | "Under Review"
  | "Verified";

export type CompetitionControlStatus = {
  stage: {
    label: string;
    description: string;
  };
  omniStep: {
    label: string;
    description: string;
  };
  assessmentStatus: CompetitionControlAssessmentStatus;
  verificationStatus: CompetitionControlVerificationStatus;
  readinessPercent: number;
  nationalRank: string;
  siliconPoints: number;
  engineeringTier: string;
};

export type CompetitionControlStatusInput = {
  vibgyorSnapshot: VibgyorJourneySnapshot | null;
  latestAssessment: OfflineAssessment | null;
  verificationStatus: VerificationStatus | null;
  readiness: EngineeringReadinessResult | null;
  tierProgress: TierProgress | null;
  nationalRank: string | null;
  siliconPoints: number | null;
};

function normalizeNumber(value: number | null | undefined) {
  return Math.max(0, Number.isFinite(value ?? 0) ? Math.round(value ?? 0) : 0);
}

function normalizeAssessmentStatus(
  assessment: OfflineAssessment | null,
): CompetitionControlAssessmentStatus {
  if (!assessment) return "Not Started";
  if (assessment.status === "Completed") return "Completed";
  if (assessment.status === "In Review") return "In Review";
  return "Not Started";
}

function normalizeVerificationStatus(
  status: VerificationStatus | null,
): CompetitionControlVerificationStatus {
  if (status === "Verified" || status === "Approved") return "Verified";
  if (status === "Under Review" || status === "Submitted") return "Under Review";
  return "Pending";
}

export function getCompetitionStatus(
  input: CompetitionControlStatusInput,
): CompetitionControlStatus {
  return {
    stage: {
      label: input.vibgyorSnapshot?.currentStage.name ?? "Pending",
      description:
        input.vibgyorSnapshot?.currentStage.purpose ?? "Not Available",
    },
    omniStep: {
      label: input.vibgyorSnapshot?.currentStep.code
        ? `${input.vibgyorSnapshot.currentStep.code} — ${input.vibgyorSnapshot.currentStep.meaning}`
        : "Pending",
      description: input.vibgyorSnapshot?.currentStep.skill ?? "Not Available",
    },
    assessmentStatus: normalizeAssessmentStatus(input.latestAssessment),
    verificationStatus: normalizeVerificationStatus(input.verificationStatus),
    readinessPercent: normalizeNumber(input.readiness?.score),
    nationalRank: input.nationalRank ?? "Pending",
    siliconPoints: normalizeNumber(input.siliconPoints),
    engineeringTier:
      input.tierProgress?.currentTier ??
      input.vibgyorSnapshot?.currentTier ??
      "Pending",
  };
}
