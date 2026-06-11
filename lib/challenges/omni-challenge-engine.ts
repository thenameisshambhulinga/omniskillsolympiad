import {
  getTier,
  getTierProgress,
  getVibgyorProgress,
} from "@/lib/profile/tier-engine";
import type {
  EngineeringTierName,
  VibgyorStageName,
} from "@/lib/profile/tier-engine";

export type OmniChallengeDifficulty =
  | "Foundation"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export type OmniChallengeStatus = "locked" | "available" | "completed";

export type OmniStageLetter = "V" | "I" | "B" | "G" | "Y" | "O" | "R";

export type OmniStepCode = "O" | "M" | "N" | "I";

export type OmniChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: OmniChallengeDifficulty;
  rewardPoints: number;
  estimatedTime: string;
  stage: VibgyorStageName;
  stageLetter: OmniStageLetter;
  stepCode: OmniStepCode;
  stepMeaning: string;
  status: OmniChallengeStatus;
  requirements: string[];
  badgeReward: string;
  stageProgress: number;
  completionPercent: number;
  unlockPoints: number;
};

export type OmniChallengeEngineInput = {
  siliconPoints: number;
  completedChallengeIds?: string[];
};

export type OmniChallengeEngineResult = {
  currentTier: EngineeringTierName;
  currentStage: VibgyorStageName;
  currentRank: string;
  siliconPoints: number;
  completedChallenges: OmniChallenge[];
  availableChallenges: OmniChallenge[];
  upcomingChallenges: OmniChallenge[];
  currentStageChallenges: OmniChallenge[];
  allChallenges: OmniChallenge[];
  totalChallenges: number;
  completedCount: number;
  remainingCount: number;
  journeyProgress: number;
  stageProgress: number;
  pointsToNextTier: number | null;
  pointsToNextStage: number | null;
  nextStage: VibgyorStageName | null;
};

type ChallengeTemplate = Omit<
  OmniChallenge,
  "status" | "stageProgress" | "completionPercent"
>;

const STAGE_UNLOCK_POINTS: Record<VibgyorStageName, number> = {
  Violet: 0,
  Indigo: 100,
  Blue: 300,
  Green: 700,
  Yellow: 1500,
  Orange: 3000,
  Red: 5000,
};

const STAGE_ORDER: VibgyorStageName[] = [
  "Violet",
  "Indigo",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Red",
];

const CHALLENGES: ChallengeTemplate[] = [
  {
    id: "violet-observe-component-identification",
    title: "Component Identification Challenge",
    description:
      "Identify resistors, capacitors, diodes, transistors, ICs and common electronic parts from real-world circuit kits.",
    difficulty: "Foundation",
    rewardPoints: 25,
    estimatedTime: "15 Mins",
    stage: "Violet",
    stageLetter: "V",
    stepCode: "O",
    stepMeaning: "Observe",
    requirements: [
      "Recognize common electronic components",
      "Understand basic component symbols",
    ],
    badgeReward: "Foundation Observer",
    unlockPoints: 0,
  },
  {
    id: "violet-measure-multimeter",
    title: "Multimeter Challenge",
    description:
      "Measure resistance, voltage and continuity using correct probe placement and electronics safety discipline.",
    difficulty: "Foundation",
    rewardPoints: 25,
    estimatedTime: "20 Mins",
    stage: "Violet",
    stageLetter: "V",
    stepCode: "M",
    stepMeaning: "Measure",
    requirements: [
      "Complete Component Identification Challenge",
      "Know basic voltage and resistance units",
    ],
    badgeReward: "Measurement Starter",
    unlockPoints: 25,
  },
  {
    id: "violet-navigate-breadboard",
    title: "Breadboard Challenge",
    description:
      "Build and verify simple LED, resistor and switch circuits using breadboard rails and jumper wiring.",
    difficulty: "Foundation",
    rewardPoints: 25,
    estimatedTime: "25 Mins",
    stage: "Violet",
    stageLetter: "V",
    stepCode: "N",
    stepMeaning: "Navigate",
    requirements: [
      "Understand breadboard rail structure",
      "Use basic passive components",
    ],
    badgeReward: "Breadboard Navigator",
    unlockPoints: 50,
  },
  {
    id: "violet-initiate-electronics-fundamentals",
    title: "Electronics Fundamentals Quiz",
    description:
      "Validate fundamentals of voltage, current, resistance, Ohm's law, polarity and basic circuit behaviour.",
    difficulty: "Foundation",
    rewardPoints: 25,
    estimatedTime: "20 Mins",
    stage: "Violet",
    stageLetter: "V",
    stepCode: "I",
    stepMeaning: "Initiate",
    requirements: [
      "Complete basic measurement and breadboard practice",
      "Understand Ohm's law",
    ],
    badgeReward: "Electronics Initiate",
    unlockPoints: 75,
  },
  {
    id: "indigo-observe-signal-analysis",
    title: "Signal Analysis Challenge",
    description:
      "Observe waveforms, signal levels and timing behaviour using practical analog and digital signal examples.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "30 Mins",
    stage: "Indigo",
    stageLetter: "I",
    stepCode: "O",
    stepMeaning: "Observe Signals",
    requirements: [
      "Complete Violet stage",
      "Understand basic circuit measurements",
    ],
    badgeReward: "Signal Observer",
    unlockPoints: 100,
  },
  {
    id: "indigo-model-logic-design",
    title: "Logic Design Challenge",
    description:
      "Design and reason through gates, truth tables, combinational logic and basic digital decision systems.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "30 Mins",
    stage: "Indigo",
    stageLetter: "I",
    stepCode: "M",
    stepMeaning: "Model Logic",
    requirements: ["Know basic gates", "Understand truth tables"],
    badgeReward: "Logic Modeler",
    unlockPoints: 125,
  },
  {
    id: "indigo-normalize-circuit-behaviour",
    title: "Circuit Behaviour Challenge",
    description:
      "Analyze simple analog and digital circuits to predict expected outputs and identify abnormal behaviour.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "35 Mins",
    stage: "Indigo",
    stageLetter: "I",
    stepCode: "N",
    stepMeaning: "Normalize Circuits",
    requirements: [
      "Understand circuit states",
      "Compare expected and actual behaviour",
    ],
    badgeReward: "Circuit Analyst",
    unlockPoints: 150,
  },
  {
    id: "indigo-investigate-debugging-foundations",
    title: "Debugging Foundations Challenge",
    description:
      "Trace faults in simple circuits using structured observation, measurement and reasoning methods.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "35 Mins",
    stage: "Indigo",
    stageLetter: "I",
    stepCode: "I",
    stepMeaning: "Investigate Faults",
    requirements: [
      "Complete signal and logic challenges",
      "Apply systematic debugging",
    ],
    badgeReward: "Fault Investigator",
    unlockPoints: 175,
  },
  {
    id: "blue-operate-microcontroller",
    title: "Microcontroller Challenge",
    description:
      "Understand MCU architecture basics, pins, clocking, reset behaviour and embedded execution flow.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "40 Mins",
    stage: "Blue",
    stageLetter: "B",
    stepCode: "O",
    stepMeaning: "Operate Hardware",
    requirements: ["Complete Indigo stage", "Know digital electronics basics"],
    badgeReward: "Hardware Operator",
    unlockPoints: 300,
  },
  {
    id: "blue-manage-gpio",
    title: "GPIO Challenge",
    description:
      "Configure digital inputs and outputs, read switches, drive LEDs and understand pull-up/pull-down behaviour.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "40 Mins",
    stage: "Blue",
    stageLetter: "B",
    stepCode: "M",
    stepMeaning: "Manage Inputs",
    requirements: ["Understand MCU pins", "Know input and output logic levels"],
    badgeReward: "GPIO Manager",
    unlockPoints: 325,
  },
  {
    id: "blue-network-peripheral-integration",
    title: "Peripheral Integration Challenge",
    description:
      "Connect sensors, displays and modules to microcontrollers using structured peripheral integration logic.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "45 Mins",
    stage: "Blue",
    stageLetter: "B",
    stepCode: "N",
    stepMeaning: "Network Components",
    requirements: [
      "Complete GPIO challenge",
      "Understand sensor interfacing basics",
    ],
    badgeReward: "Peripheral Integrator",
    unlockPoints: 350,
  },
  {
    id: "blue-implement-firmware",
    title: "Firmware Challenge",
    description:
      "Implement basic embedded logic, control flow, sensor reading and output control in firmware.",
    difficulty: "Intermediate",
    rewardPoints: 25,
    estimatedTime: "45 Mins",
    stage: "Blue",
    stageLetter: "B",
    stepCode: "I",
    stepMeaning: "Implement Logic",
    requirements: [
      "Understand embedded C basics",
      "Complete microcontroller and GPIO challenges",
    ],
    badgeReward: "Firmware Builder",
    unlockPoints: 375,
  },
  {
    id: "green-organize-pcb-design",
    title: "PCB Design Challenge",
    description:
      "Create structured schematic-to-PCB thinking with footprints, routing, power paths and design rules.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "50 Mins",
    stage: "Green",
    stageLetter: "G",
    stepCode: "O",
    stepMeaning: "Organize Design",
    requirements: ["Complete Blue stage", "Understand circuit blocks"],
    badgeReward: "PCB Organizer",
    unlockPoints: 700,
  },
  {
    id: "green-manufacture-assembly",
    title: "Assembly Challenge",
    description:
      "Understand component placement, soldering discipline, board handling and assembly sequencing.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "45 Mins",
    stage: "Green",
    stageLetter: "G",
    stepCode: "M",
    stepMeaning: "Manufacture Systems",
    requirements: [
      "Understand PCB components",
      "Follow hardware assembly safety",
    ],
    badgeReward: "Assembly Engineer",
    unlockPoints: 725,
  },
  {
    id: "green-normalize-manufacturing",
    title: "Manufacturing Challenge",
    description:
      "Learn production consistency, inspection flow, manufacturability and repeatable electronics build quality.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "45 Mins",
    stage: "Green",
    stageLetter: "G",
    stepCode: "N",
    stepMeaning: "Normalize Production",
    requirements: [
      "Complete PCB and assembly foundations",
      "Understand quality checks",
    ],
    badgeReward: "Production Normalizer",
    unlockPoints: 750,
  },
  {
    id: "green-inspect-testing",
    title: "Testing Challenge",
    description:
      "Verify assembled circuits through continuity, power checks, signal testing and controlled debugging.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "50 Mins",
    stage: "Green",
    stageLetter: "G",
    stepCode: "I",
    stepMeaning: "Inspect Quality",
    requirements: [
      "Understand test equipment",
      "Perform board-level verification",
    ],
    badgeReward: "Quality Inspector",
    unlockPoints: 775,
  },
  {
    id: "yellow-observe-sensors",
    title: "Sensor Challenge",
    description:
      "Work with sensor outputs, calibration, thresholds and practical environment-based electronics inputs.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "45 Mins",
    stage: "Yellow",
    stageLetter: "Y",
    stepCode: "O",
    stepMeaning: "Observe Environment",
    requirements: [
      "Complete product engineering stage",
      "Understand analog and digital sensor behaviour",
    ],
    badgeReward: "Sensor Observer",
    unlockPoints: 1500,
  },
  {
    id: "yellow-monitor-connectivity",
    title: "Connectivity Challenge",
    description:
      "Understand wired and wireless connectivity foundations for embedded and IoT-oriented systems.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "45 Mins",
    stage: "Yellow",
    stageLetter: "Y",
    stepCode: "M",
    stepMeaning: "Monitor Systems",
    requirements: [
      "Understand embedded communication basics",
      "Know sensor data flow",
    ],
    badgeReward: "Connectivity Monitor",
    unlockPoints: 1525,
  },
  {
    id: "yellow-network-mqtt",
    title: "MQTT Challenge",
    description:
      "Understand publish-subscribe architecture, topics, payloads and IoT messaging behaviour.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "50 Mins",
    stage: "Yellow",
    stageLetter: "Y",
    stepCode: "N",
    stepMeaning: "Network Devices",
    requirements: ["Understand connectivity", "Know IoT communication basics"],
    badgeReward: "MQTT Networker",
    unlockPoints: 1550,
  },
  {
    id: "yellow-integrate-smart-systems",
    title: "Smart Systems Challenge",
    description:
      "Integrate sensors, embedded decisions and connectivity into practical smart system behaviour.",
    difficulty: "Advanced",
    rewardPoints: 25,
    estimatedTime: "55 Mins",
    stage: "Yellow",
    stageLetter: "Y",
    stepCode: "I",
    stepMeaning: "Integrate Intelligence",
    requirements: [
      "Complete sensor and connectivity challenges",
      "Understand system integration",
    ],
    badgeReward: "Smart Systems Integrator",
    unlockPoints: 1575,
  },
  {
    id: "orange-operate-motor-control",
    title: "Motor Control Challenge",
    description:
      "Understand motor drivers, direction control, PWM speed control and safe motion system basics.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "55 Mins",
    stage: "Orange",
    stageLetter: "O",
    stepCode: "O",
    stepMeaning: "Operate Motion",
    requirements: [
      "Complete IoT and automation stage",
      "Understand embedded output control",
    ],
    badgeReward: "Motion Operator",
    unlockPoints: 3000,
  },
  {
    id: "orange-mechanize-automation",
    title: "Automation Challenge",
    description:
      "Design automatic control logic using sensors, actuators, state transitions and safety constraints.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "60 Mins",
    stage: "Orange",
    stageLetter: "O",
    stepCode: "M",
    stepMeaning: "Mechanize Tasks",
    requirements: [
      "Understand control sequencing",
      "Know sensors and motor control",
    ],
    badgeReward: "Automation Mechanizer",
    unlockPoints: 3025,
  },
  {
    id: "orange-navigate-industrial-diagnostics",
    title: "Industrial Diagnostics Challenge",
    description:
      "Interpret industrial failure symptoms, isolate likely causes and apply structured diagnostics.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "60 Mins",
    stage: "Orange",
    stageLetter: "O",
    stepCode: "N",
    stepMeaning: "Navigate Industry",
    requirements: [
      "Understand hardware fault diagnosis",
      "Know automation system behaviour",
    ],
    badgeReward: "Industrial Diagnostic Engineer",
    unlockPoints: 3050,
  },
  {
    id: "orange-integrate-system-integration",
    title: "System Integration Challenge",
    description:
      "Combine motion, sensors, embedded decisions and diagnostics into a complete industrial system model.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "70 Mins",
    stage: "Orange",
    stageLetter: "O",
    stepCode: "I",
    stepMeaning: "Integrate Systems",
    requirements: [
      "Complete automation and diagnostics challenges",
      "Understand system-level integration",
    ],
    badgeReward: "Systems Integrator",
    unlockPoints: 3075,
  },
  {
    id: "red-originate-rd",
    title: "R&D Challenge",
    description:
      "Define a technical problem, investigate possible approaches and propose an electronics innovation path.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "75 Mins",
    stage: "Red",
    stageLetter: "R",
    stepCode: "O",
    stepMeaning: "Originate Innovation",
    requirements: [
      "Complete robotics and industrial systems stage",
      "Understand innovation framing",
    ],
    badgeReward: "Innovation Originator",
    unlockPoints: 5000,
  },
  {
    id: "red-mobilize-innovation-sprint",
    title: "Innovation Sprint Challenge",
    description:
      "Transform an idea into a structured sprint plan with objectives, risks, prototype path and validation criteria.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "75 Mins",
    stage: "Red",
    stageLetter: "R",
    stepCode: "M",
    stepMeaning: "Mobilize Ideas",
    requirements: ["Complete R&D challenge", "Know product validation basics"],
    badgeReward: "Sprint Mobilizer",
    unlockPoints: 5025,
  },
  {
    id: "red-national-industry-challenge",
    title: "Industry Challenge",
    description:
      "Solve a real-world industry-style electronics scenario with practical constraints and implementation tradeoffs.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "90 Mins",
    stage: "Red",
    stageLetter: "R",
    stepCode: "N",
    stepMeaning: "National Competition",
    requirements: [
      "Complete innovation sprint",
      "Understand industry problem-solving",
    ],
    badgeReward: "Industry Challenger",
    unlockPoints: 5050,
  },
  {
    id: "red-inspire-national-championship",
    title: "National Championship Challenge",
    description:
      "Complete a championship-level innovation evaluation combining electronics, systems thinking and presentation.",
    difficulty: "Expert",
    rewardPoints: 25,
    estimatedTime: "120 Mins",
    stage: "Red",
    stageLetter: "R",
    stepCode: "I",
    stepMeaning: "Inspire Excellence",
    requirements: [
      "Complete all OMNI challenge stages",
      "Demonstrate national-level engineering readiness",
    ],
    badgeReward: "National Championship Candidate",
    unlockPoints: 5075,
  },
];

function stageIndex(stage: VibgyorStageName) {
  return STAGE_ORDER.indexOf(stage);
}

function getStatus(
  challenge: ChallengeTemplate,
  siliconPoints: number,
  completedChallengeIds: Set<string>,
): OmniChallengeStatus {
  if (completedChallengeIds.has(challenge.id)) return "completed";
  if (siliconPoints >= challenge.unlockPoints) return "available";
  return "locked";
}

function getChallengeCompletionPercent(status: OmniChallengeStatus) {
  if (status === "completed") return 100;
  if (status === "available") return 50;
  return 0;
}

function getStageProgress(
  stage: VibgyorStageName,
  challenges: OmniChallenge[],
) {
  const stageChallenges = challenges.filter(
    (challenge) => challenge.stage === stage,
  );
  const completed = stageChallenges.filter(
    (challenge) => challenge.status === "completed",
  ).length;

  if (stageChallenges.length === 0) return 0;

  return Math.round((completed / stageChallenges.length) * 100);
}

export function getOmniChallenges({
  siliconPoints,
  completedChallengeIds = [],
}: OmniChallengeEngineInput): OmniChallenge[] {
  const completedSet = new Set(completedChallengeIds);

  const challenges = CHALLENGES.map((challenge) => {
    const status = getStatus(challenge, siliconPoints, completedSet);

    return {
      ...challenge,
      status,
      stageProgress: 0,
      completionPercent: getChallengeCompletionPercent(status),
    };
  });

  return challenges.map((challenge) => ({
    ...challenge,
    stageProgress: getStageProgress(challenge.stage, challenges),
  }));
}

export function getOmniChallengeEngine(
  input: OmniChallengeEngineInput,
): OmniChallengeEngineResult {
  const siliconPoints = Math.max(
    0,
    Number.isFinite(input.siliconPoints) ? input.siliconPoints : 0,
  );
  const allChallenges = getOmniChallenges({
    siliconPoints,
    completedChallengeIds: input.completedChallengeIds ?? [],
  });

  const currentStage = getVibgyorProgress(siliconPoints).currentStage;
  const currentTier = getTier(siliconPoints);
  const tierProgress = getTierProgress(siliconPoints);
  const vibgyorProgress = getVibgyorProgress(siliconPoints);

  const completedChallenges = allChallenges.filter(
    (challenge) => challenge.status === "completed",
  );
  const availableChallenges = allChallenges.filter(
    (challenge) => challenge.status === "available",
  );
  const upcomingChallenges = allChallenges.filter(
    (challenge) => challenge.status === "locked",
  );
  const currentStageChallenges = allChallenges.filter(
    (challenge) => challenge.stage === currentStage,
  );

  const completedCount = completedChallenges.length;
  const totalChallenges = allChallenges.length;

  return {
    currentTier,
    currentStage,
    currentRank: "#1",
    siliconPoints,
    completedChallenges,
    availableChallenges,
    upcomingChallenges,
    currentStageChallenges,
    allChallenges,
    totalChallenges,
    completedCount,
    remainingCount: totalChallenges - completedCount,
    journeyProgress: Math.round((completedCount / totalChallenges) * 100),
    stageProgress: vibgyorProgress.progressPercent,
    pointsToNextTier: tierProgress.pointsToNextTier,
    pointsToNextStage: vibgyorProgress.pointsToNextStage,
    nextStage: vibgyorProgress.nextStage,
  };
}

export function getStageUnlockProgress(result: OmniChallengeEngineResult) {
  const currentStageIndex = stageIndex(result.currentStage);
  const nextStage = result.nextStage;
  const currentStageChallenges = result.currentStageChallenges;
  const completedCurrentStage = currentStageChallenges.filter(
    (challenge) => challenge.status === "completed",
  ).length;

  return {
    currentStage: result.currentStage,
    nextStage,
    requirements: [
      `${currentStageChallenges.length} current-stage OMNI challenges`,
      `${result.pointsToNextStage ?? 0} Silicon Points to next stage`,
      "Complete available challenge rewards to increase progression",
    ],
    remainingPoints: result.pointsToNextStage ?? 0,
    remainingChallenges: Math.max(
      0,
      currentStageChallenges.length - completedCurrentStage,
    ),
    unlockProgress:
      nextStage === null
        ? 100
        : Math.min(
            100,
            Math.round(
              ((currentStageIndex + result.stageProgress / 100) /
                STAGE_ORDER.length) *
                100,
            ),
          ),
  };
}
