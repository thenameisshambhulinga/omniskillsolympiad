import { getTier, getTierProgress } from "@/lib/profile/tier-engine";
import type {
  EngineeringTierName,
  VibgyorStageName,
} from "@/lib/profile/tier-engine";

export type VibgyorStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

export type OmniCode = "O" | "M" | "N" | "I";

export type VibgyorStep = {
  code: OmniCode;
  meaning: string;
  skill: string;
};

export type VibgyorStageProgress = {
  key: string;
  letter: "V" | "I" | "B" | "G" | "Y" | "O" | "R";
  name: VibgyorStageName;
  minPoints: number;
  color: string;
  softColor: string;
  glow: string;
  purpose: string;
  steps: VibgyorStep[];
};

export type VibgyorJourneySnapshot = {
  siliconPoints: number;
  currentTier: EngineeringTierName;
  currentStage: VibgyorStageProgress;
  nextStage: VibgyorStageProgress | null;
  currentStep: VibgyorStep;
  completedStages: VibgyorStageProgress[];
  completedSteps: number;
  remainingSteps: number;
  totalSteps: number;
  journeyCompletion: number;
  tierProgressPercent: number;
  readinessScore: number;
  readinessLevel:
    | "Beginner"
    | "Developing"
    | "Advanced"
    | "Competition Ready"
    | "WorldSkills Ready";
};

export const VIBGYOR_PROGRESS_STAGES: VibgyorStageProgress[] = [
  {
    key: "violet",
    letter: "V",
    name: "Violet",
    minPoints: 0,
    color: "#7F00FF",
    softColor: "rgba(127,0,255,0.16)",
    glow: "rgba(127,0,255,0.32)",
    purpose:
      "Build electronics confidence through component recognition, instruments, breadboard circuits and basic fundamentals.",
    steps: [
      { code: "O", meaning: "Observe", skill: "Component Identification" },
      { code: "M", meaning: "Measure", skill: "Tools & Instruments" },
      { code: "N", meaning: "Navigate", skill: "Breadboard Circuits" },
      { code: "I", meaning: "Initiate", skill: "Electronics Fundamentals" },
    ],
  },
  {
    key: "indigo",
    letter: "I",
    name: "Indigo",
    minPoints: 100,
    color: "#4B0082",
    softColor: "rgba(75,0,130,0.18)",
    glow: "rgba(75,0,130,0.34)",
    purpose:
      "Strengthen analog and digital thinking through signal analysis, logic design, circuit behaviour and debugging.",
    steps: [
      { code: "O", meaning: "Observe Signals", skill: "Signal Analysis" },
      { code: "M", meaning: "Model Logic", skill: "Logic Design" },
      { code: "N", meaning: "Normalize Circuits", skill: "Circuit Behaviour" },
      {
        code: "I",
        meaning: "Investigate Faults",
        skill: "Debugging Foundations",
      },
    ],
  },
  {
    key: "blue",
    letter: "B",
    name: "Blue",
    minPoints: 300,
    color: "#007BFF",
    softColor: "rgba(0,123,255,0.18)",
    glow: "rgba(0,123,255,0.34)",
    purpose:
      "Move into embedded systems through microcontrollers, GPIO, peripheral integration and firmware implementation.",
    steps: [
      { code: "O", meaning: "Operate Hardware", skill: "Microcontrollers" },
      { code: "M", meaning: "Manage Inputs", skill: "GPIO" },
      {
        code: "N",
        meaning: "Network Components",
        skill: "Peripheral Integration",
      },
      { code: "I", meaning: "Implement Logic", skill: "Firmware" },
    ],
  },
  {
    key: "green",
    letter: "G",
    name: "Green",
    minPoints: 700,
    color: "#00C853",
    softColor: "rgba(0,200,83,0.16)",
    glow: "rgba(0,200,83,0.34)",
    purpose:
      "Convert prototypes into product thinking through PCB design, assembly, manufacturing discipline and testing.",
    steps: [
      { code: "O", meaning: "Organize Design", skill: "PCB Design" },
      { code: "M", meaning: "Manufacture Systems", skill: "Assembly" },
      { code: "N", meaning: "Normalize Production", skill: "Manufacturing" },
      { code: "I", meaning: "Inspect Quality", skill: "Testing" },
    ],
  },
  {
    key: "yellow",
    letter: "Y",
    name: "Yellow",
    minPoints: 1500,
    color: "#FFD600",
    softColor: "rgba(255,214,0,0.15)",
    glow: "rgba(255,214,0,0.3)",
    purpose:
      "Build IoT and automation readiness through sensors, connectivity, MQTT and smart systems integration.",
    steps: [
      { code: "O", meaning: "Observe Environment", skill: "Sensors" },
      { code: "M", meaning: "Monitor Systems", skill: "Connectivity" },
      { code: "N", meaning: "Network Devices", skill: "MQTT" },
      { code: "I", meaning: "Integrate Intelligence", skill: "Smart Systems" },
    ],
  },
  {
    key: "orange",
    letter: "O",
    name: "Orange",
    minPoints: 3000,
    color: "#FF6D00",
    softColor: "rgba(255,109,0,0.16)",
    glow: "rgba(255,109,0,0.32)",
    purpose:
      "Prepare for robotics and industrial systems through motor control, automation, diagnostics and system integration.",
    steps: [
      { code: "O", meaning: "Operate Motion", skill: "Motor Control" },
      { code: "M", meaning: "Mechanize Tasks", skill: "Automation" },
      {
        code: "N",
        meaning: "Navigate Industry",
        skill: "Industrial Diagnostics",
      },
      { code: "I", meaning: "Integrate Systems", skill: "System Integration" },
    ],
  },
  {
    key: "red",
    letter: "R",
    name: "Red",
    minPoints: 5000,
    color: "#D50000",
    softColor: "rgba(213,0,0,0.16)",
    glow: "rgba(213,0,0,0.34)",
    purpose:
      "Reach innovation readiness through R&D, innovation sprints, industry challenges and national championship preparation.",
    steps: [
      { code: "O", meaning: "Originate Innovation", skill: "R&D" },
      { code: "M", meaning: "Mobilize Ideas", skill: "Innovation Sprint" },
      {
        code: "N",
        meaning: "National Competition",
        skill: "Industry Challenges",
      },
      {
        code: "I",
        meaning: "Inspire Excellence",
        skill: "National Championship",
      },
    ],
  },
];

function normalizePoints(pointsInput: number) {
  return Math.max(0, Number.isFinite(pointsInput) ? pointsInput : 0);
}

function getCurrentStageIndex(pointsInput: number) {
  const points = normalizePoints(pointsInput);

  return VIBGYOR_PROGRESS_STAGES.reduce(
    (activeIndex, stage, index) =>
      points >= stage.minPoints ? index : activeIndex,
    0,
  );
}

export function getCurrentStage(pointsInput: number): VibgyorStageProgress {
  return VIBGYOR_PROGRESS_STAGES[getCurrentStageIndex(pointsInput)];
}

export function getCompletedStages(
  pointsInput: number,
): VibgyorStageProgress[] {
  const currentIndex = getCurrentStageIndex(pointsInput);

  return VIBGYOR_PROGRESS_STAGES.slice(0, currentIndex);
}

export function getNextStage(pointsInput: number): VibgyorStageProgress | null {
  return VIBGYOR_PROGRESS_STAGES[getCurrentStageIndex(pointsInput) + 1] ?? null;
}

export function getStageStatus(
  stage: VibgyorStageProgress,
  pointsInput: number,
): VibgyorStatus {
  const currentStage = getCurrentStage(pointsInput);
  const currentIndex = VIBGYOR_PROGRESS_STAGES.findIndex(
    (item) => item.key === currentStage.key,
  );
  const stageIndex = VIBGYOR_PROGRESS_STAGES.findIndex(
    (item) => item.key === stage.key,
  );

  if (stageIndex < currentIndex) return "COMPLETED";
  if (stageIndex === currentIndex) return "IN_PROGRESS";
  return "LOCKED";
}

export function getCompletedSteps(pointsInput: number): number {
  const points = normalizePoints(pointsInput);
  const currentIndex = getCurrentStageIndex(points);
  const currentStage = VIBGYOR_PROGRESS_STAGES[currentIndex];
  const nextStage = VIBGYOR_PROGRESS_STAGES[currentIndex + 1] ?? null;

  const previousCompletedSteps = currentIndex * 4;

  if (!nextStage) {
    return VIBGYOR_PROGRESS_STAGES.length * 4;
  }

  const stageRange = nextStage.minPoints - currentStage.minPoints;
  const pointsInsideStage = Math.max(0, points - currentStage.minPoints);
  const currentStageCompletedSteps = Math.min(
    3,
    Math.floor((pointsInsideStage / stageRange) * 4),
  );

  return previousCompletedSteps + currentStageCompletedSteps;
}

export function getCurrentStep(pointsInput: number): VibgyorStep {
  const completedSteps = getCompletedSteps(pointsInput);
  const currentStage = getCurrentStage(pointsInput);
  const stepIndex = Math.min(3, completedSteps % 4);

  return currentStage.steps[stepIndex];
}

export function getJourneyCompletion(pointsInput: number): number {
  const totalSteps = VIBGYOR_PROGRESS_STAGES.length * 4;
  const completedSteps = getCompletedSteps(pointsInput);

  return Math.min(
    100,
    Math.max(0, Math.round((completedSteps / totalSteps) * 100)),
  );
}

function getReadinessLevel(
  score: number,
): VibgyorJourneySnapshot["readinessLevel"] {
  if (score >= 90) return "WorldSkills Ready";
  if (score >= 78) return "Competition Ready";
  if (score >= 60) return "Advanced";
  if (score >= 35) return "Developing";
  return "Beginner";
}

export function getVibgyorJourneySnapshot(
  pointsInput: number,
): VibgyorJourneySnapshot {
  const points = normalizePoints(pointsInput);
  const totalSteps = VIBGYOR_PROGRESS_STAGES.length * 4;
  const completedSteps = getCompletedSteps(points);
  const journeyCompletion = getJourneyCompletion(points);
  const tierProgress = getTierProgress(points);

  const readinessScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        journeyCompletion * 0.45 +
          tierProgress.progressPercent * 0.25 +
          Math.min(100, points / 50) * 0.3,
      ),
    ),
  );

  return {
    siliconPoints: points,
    currentTier: getTier(points),
    currentStage: getCurrentStage(points),
    nextStage: getNextStage(points),
    currentStep: getCurrentStep(points),
    completedStages: getCompletedStages(points),
    completedSteps,
    remainingSteps: totalSteps - completedSteps,
    totalSteps,
    journeyCompletion,
    tierProgressPercent: tierProgress.progressPercent,
    readinessScore,
    readinessLevel: getReadinessLevel(readinessScore),
  };
}
