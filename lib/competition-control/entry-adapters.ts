export type AdapterStatus = "READY_FOR_INTEGRATION";

export type AdapterPreview = {
  status: AdapterStatus;
  message: string;
  referenceId: string;
  submittedAt: string;
};

export type ParticipantLookupType = "OMNI_ID" | "EMAIL" | "NAME";

export type ParticipantLookupDraft = {
  lookupType: ParticipantLookupType;
  query: string;
};

export type AssessmentEntryDraft = {
  assessmentName: string;
  score: number;
  remarks: string;
  date: string;
};

export type StageCompletionDraft = {
  stage: VibgyorControlStage;
  completionStatus: "Complete";
  evaluator: string;
  remarks: string;
  date: string;
};

export type SiliconPointsAwardDraft = {
  points: number;
  reason: string;
};

export type JudgeEvaluationDraft = {
  overallScore: number;
  technicalSkill: number;
  presentation: number;
  innovation: number;
  execution: number;
  comments: string;
};

export type CompetitionEventDraft = {
  eventType: CompetitionEventType;
  eventName: string;
  participationMode: string;
  date: string;
  notes: string;
};

export type VibgyorControlStage =
  | "Violet"
  | "Indigo"
  | "Blue"
  | "Green"
  | "Yellow"
  | "Orange"
  | "Red";

export type CompetitionEventType =
  | "Workshop"
  | "Bootcamp"
  | "Assessment"
  | "Competition Round"
  | "Industry Session"
  | "Participation";

export const VIBGYOR_CONTROL_STAGES: VibgyorControlStage[] = [
  "Violet",
  "Indigo",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Red",
];

export const SILICON_POINT_PRESETS = [10, 25, 50, 100];

export const COMPETITION_EVENT_TYPES: CompetitionEventType[] = [
  "Workshop",
  "Bootcamp",
  "Assessment",
  "Competition Round",
  "Industry Session",
  "Participation",
];

function createPreview(scope: string, message: string): AdapterPreview {
  return {
    status: "READY_FOR_INTEGRATION",
    message,
    referenceId: `${scope}-${new Date().toISOString().replace(/[:.]/g, "-")}`,
    submittedAt: new Date().toISOString(),
  };
}

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

export function prepareParticipantLookup(
  draft: ParticipantLookupDraft,
): AdapterPreview {
  const query = cleanText(draft.query);

  return createPreview(
    "participant-lookup",
    query
      ? `Participant lookup prepared for ${draft.lookupType.replace("_", " ")}: ${query}.`
      : "Participant lookup requires a search value.",
  );
}

export function prepareAssessmentEntry(
  draft: AssessmentEntryDraft,
): AdapterPreview {
  return createPreview(
    "assessment-entry",
    `Assessment entry prepared: ${cleanText(draft.assessmentName)} with score ${clampScore(
      draft.score,
    )}%.`,
  );
}

export function prepareStageCompletion(
  draft: StageCompletionDraft,
): AdapterPreview {
  return createPreview(
    "stage-completion",
    `${draft.stage} stage completion prepared for future verification workflow.`,
  );
}

export function prepareSiliconPointsAward(
  draft: SiliconPointsAwardDraft,
): AdapterPreview {
  return createPreview(
    "silicon-points-award",
    `Silicon Points award prepared: +${Math.max(0, Math.round(draft.points))} for ${cleanText(
      draft.reason,
    )}.`,
  );
}

export function prepareJudgeEvaluation(
  draft: JudgeEvaluationDraft,
): AdapterPreview {
  const average = clampScore(
    (draft.technicalSkill +
      draft.presentation +
      draft.innovation +
      draft.execution) /
      4,
  );

  return createPreview(
    "judge-evaluation",
    `Judge evaluation prepared with overall score ${clampScore(
      draft.overallScore,
    )}% and competency average ${average}%.`,
  );
}

export function prepareCompetitionEvent(
  draft: CompetitionEventDraft,
): AdapterPreview {
  return createPreview(
    "competition-event",
    `${draft.eventType} entry prepared: ${cleanText(draft.eventName)}.`,
  );
}