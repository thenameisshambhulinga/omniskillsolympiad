import type { OfflineAssessment } from "@/lib/profile/assessment-ledger";
import type {
  CompetitionPassport,
  CompetitionPassportTimelineItem,
} from "@/lib/profile/competition-passport";

export type VerificationStatus =
  | "Submitted"
  | "Pending"
  | "Under Review"
  | "Verified"
  | "Approved"
  | "Rejected";

export type VerificationCategory =
  | "Assessment"
  | "Stage"
  | "Points"
  | "Leaderboard"
  | "Passport"
  | "Readiness";

export type VerificationReviewer = {
  id: string;
  name: string;
  role: "Mentor" | "Judge" | "Coordinator" | "Competition Operations";
};

export type VerificationReview = {
  id: string;
  category: VerificationCategory;
  title: string;
  status: VerificationStatus;
  submittedAt: string;
  verifiedAt: string | null;
  reviewer: VerificationReviewer;
  remarks: string;
};

export type MentorVerification = {
  id: string;
  mentorName: string;
  verificationDate: string;
  remarks: string;
  status: VerificationStatus;
};

export type JudgeVerification = {
  id: string;
  judgeName: string;
  evaluationScore: number;
  comments: string;
  status: VerificationStatus;
};

export type VerificationTimelineItem = {
  id: string;
  title: string;
  description: string;
  status: VerificationStatus;
  date: string;
};

export type VerificationSummaryData = {
  verifiedAssessments: number;
  verifiedStages: number;
  verifiedPoints: number;
  pendingReviews: number;
  rejectedReviews: number;
};

export type VerificationEngineInput = {
  passport: CompetitionPassport;
  assessments: OfflineAssessment[];
  passportTimeline: CompetitionPassportTimelineItem[];
};

function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "Pending";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toReviewStatus(
  status: OfflineAssessment["status"],
): VerificationStatus {
  if (status === "Completed") return "Verified";
  if (status === "In Review") return "Under Review";
  return "Pending";
}

export function getVerificationStatus(input: VerificationEngineInput) {
  const pendingReviews = getPendingReviews(input).length;
  const rejectedReviews = getAllVerificationReviews(input).filter(
    (review) => review.status === "Rejected",
  ).length;

  if (rejectedReviews > 0) return "Rejected";
  if (pendingReviews > 0) return "Under Review";
  return "Verified";
}

export function getAllVerificationReviews(
  input: VerificationEngineInput,
): VerificationReview[] {
  const assessmentReviews: VerificationReview[] = input.assessments.map(
    (assessment) => ({
      id: `assessment-${assessment.id}`,
      category: "Assessment",
      title: assessment.title,
      status: toReviewStatus(assessment.status),
      submittedAt: assessment.date,
      verifiedAt: assessment.status === "Completed" ? assessment.date : null,
      reviewer: {
        id: `mentor-${assessment.id}`,
        name: assessment.evaluatorType,
        role: "Mentor",
      },
      remarks: assessment.notes,
    }),
  );

  const stageReviews: VerificationReview[] = input.passport.milestones.map(
    (milestone: CompetitionPassport["milestones"][number]) => ({
      id: `milestone-${milestone.id}`,
      category: milestone.title.includes("Stage") ? "Stage" : "Passport",
      title: milestone.title,
      status:
        milestone.status === "COMPLETED"
          ? "Verified"
          : milestone.status === "IN_PROGRESS"
            ? "Under Review"
            : "Pending",
      submittedAt: formatDate(new Date()),
      verifiedAt:
        milestone.status === "COMPLETED" ? formatDate(new Date()) : null,
      reviewer: {
        id: "competition-ops",
        name: "Competition Operations",
        role: "Competition Operations",
      },
      remarks: milestone.description,
    }),
  );

  return [...assessmentReviews, ...stageReviews];
}

export function getPendingReviews(
  input: VerificationEngineInput,
): VerificationReview[] {
  return getAllVerificationReviews(input).filter(
    (review) =>
      review.status === "Pending" ||
      review.status === "Submitted" ||
      review.status === "Under Review",
  );
}

export function getVerifiedAssessments(
  input: VerificationEngineInput,
): VerificationReview[] {
  return getAllVerificationReviews(input).filter(
    (review) =>
      review.category === "Assessment" &&
      (review.status === "Verified" || review.status === "Approved"),
  );
}

export function getVerifiedStages(
  input: VerificationEngineInput,
): VerificationReview[] {
  return getAllVerificationReviews(input).filter(
    (review) =>
      review.category === "Stage" &&
      (review.status === "Verified" || review.status === "Approved"),
  );
}

export function getMentorVerification(
  input: VerificationEngineInput,
): MentorVerification {
  const latestAssessment =
    input.assessments.find((assessment) => assessment.status === "Completed") ??
    input.assessments[0];

  return {
    id: "mentor-verification-current",
    mentorName: latestAssessment?.evaluatorType ?? "Mentor Review Queue",
    verificationDate: latestAssessment?.date ?? "Pending",
    remarks:
      latestAssessment?.notes ??
      "Mentor verification will appear once offline assessment review is prepared.",
    status: latestAssessment
      ? toReviewStatus(latestAssessment.status)
      : "Pending",
  };
}

export function getJudgeVerification(
  input: VerificationEngineInput,
): JudgeVerification {
  const latestAssessment =
    input.assessments.find((assessment) => assessment.status === "Completed") ??
    input.assessments[0];

  return {
    id: "judge-verification-current",
    judgeName: "Judge Panel",
    evaluationScore: latestAssessment?.score ?? 0,
    comments:
      latestAssessment?.status === "Completed"
        ? `${latestAssessment.title} approved for passport readiness impact.`
        : "Judge approval pending future review workflow integration.",
    status: latestAssessment
      ? toReviewStatus(latestAssessment.status)
      : "Pending",
  };
}

export function getVerificationTimeline(
  input: VerificationEngineInput,
): VerificationTimelineItem[] {
  const passportEvents: VerificationTimelineItem[] = input.passportTimeline.map(
    (event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      status: "Verified",
      date: event.date,
    }),
  );

  const assessmentEvents: VerificationTimelineItem[] = input.assessments.map(
    (assessment) => ({
      id: `assessment-${assessment.id}`,
      title: assessment.title,
      description: `${assessment.score}% • ${assessment.evaluatorType}`,
      status: toReviewStatus(assessment.status),
      date: assessment.date,
    }),
  );

  return [...assessmentEvents, ...passportEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getVerificationSummary(
  input: VerificationEngineInput,
): VerificationSummaryData {
  const reviews = getAllVerificationReviews(input);
  const verifiedAssessments = getVerifiedAssessments(input).length;
  const verifiedStages = getVerifiedStages(input).length;
  const pendingReviews = getPendingReviews(input).length;
  const rejectedReviews = reviews.filter(
    (review) => review.status === "Rejected",
  ).length;

  return {
    verifiedAssessments,
    verifiedStages,
    verifiedPoints: reviews.filter(
      (review) =>
        review.category === "Points" &&
        (review.status === "Verified" || review.status === "Approved"),
    ).length,
    pendingReviews,
    rejectedReviews,
  };
}
