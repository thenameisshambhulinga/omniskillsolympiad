  import {
    getTier,
    getTierProgress,
    getVibgyorProgress,
    getVibgyorStage,
    type EngineeringTierName,
    type TierProgress,
    type VibgyorStageName,
    type VibgyorProgress,
  } from "@/lib/profile/tier-engine";

  export type OmniCode = "O" | "M" | "N" | "I";

  export type OmniStep = {
    id: string;
    code: OmniCode;
    meaning: string;
    skill: string;
    difficulty: "Foundation" | "Intermediate" | "Advanced" | "Expert";
    rewardPoints: number;
  };

  export type OmniStage = {
    key: string;
    letter: "V" | "I" | "B" | "G" | "Y" | "O" | "R";
    name: VibgyorStageName;
    color: string;
    softColor: string;
    glow: string;
    description: string;
    minPoints: number;
    steps: OmniStep[];
  };

  export type OmniRoadmapSnapshot = {
    points: number;
    currentTier: EngineeringTierName;
    tierProgress: TierProgress;
    currentStage: OmniStage;
    vibgyorProgress: VibgyorProgress;
    nextStage: OmniStage | null;
    nextOmniStep:
      | (OmniStep & { stageName: VibgyorStageName; stageLetter: string })
      | null;
    completedSteps: number;
    totalSteps: number;
    progressPercent: number;
  };

  export const OMNI_STAGES: OmniStage[] = [
    {
      key: "violet",
      letter: "V",
      name: "Violet",
      color: "#7F00FF",
      softColor: "rgba(127,0,255,0.16)",
      glow: "rgba(127,0,255,0.32)",
      minPoints: 0,
      description:
        "Foundation electronics skills for identifying, measuring and building basic circuits.",
      steps: [
        {
          id: "violet-o",
          code: "O",
          meaning: "Observe",
          skill: "Component Identification",
          difficulty: "Foundation",
          rewardPoints: 25,
        },
        {
          id: "violet-m",
          code: "M",
          meaning: "Measure",
          skill: "Tools & Instruments",
          difficulty: "Foundation",
          rewardPoints: 25,
        },
        {
          id: "violet-n",
          code: "N",
          meaning: "Navigate",
          skill: "Breadboard Circuits",
          difficulty: "Foundation",
          rewardPoints: 25,
        },
        {
          id: "violet-i",
          code: "I",
          meaning: "Initiate",
          skill: "Electronics Fundamentals",
          difficulty: "Foundation",
          rewardPoints: 25,
        },
      ],
    },
    {
      key: "indigo",
      letter: "I",
      name: "Indigo",
      color: "#4B0082",
      softColor: "rgba(75,0,130,0.18)",
      glow: "rgba(75,0,130,0.34)",
      minPoints: 100,
      description:
        "Analog and digital engineering skills for signals, logic and circuit behaviour.",
      steps: [
        {
          id: "indigo-o",
          code: "O",
          meaning: "Observe Signals",
          skill: "Signal Analysis",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
        {
          id: "indigo-m",
          code: "M",
          meaning: "Model Logic",
          skill: "Logic Design",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
        {
          id: "indigo-n",
          code: "N",
          meaning: "Normalize Circuits",
          skill: "Circuit Behaviour",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
        {
          id: "indigo-i",
          code: "I",
          meaning: "Investigate Faults",
          skill: "Debugging Foundations",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
      ],
    },
    {
      key: "blue",
      letter: "B",
      name: "Blue",
      color: "#007BFF",
      softColor: "rgba(0,123,255,0.18)",
      glow: "rgba(0,123,255,0.34)",
      minPoints: 300,
      description:
        "Embedded systems engineering through microcontrollers, firmware and peripherals.",
      steps: [
        {
          id: "blue-o",
          code: "O",
          meaning: "Operate Hardware",
          skill: "Microcontrollers",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
        {
          id: "blue-m",
          code: "M",
          meaning: "Manage Inputs",
          skill: "GPIO",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
        {
          id: "blue-n",
          code: "N",
          meaning: "Network Components",
          skill: "Peripheral Integration",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
        {
          id: "blue-i",
          code: "I",
          meaning: "Implement Logic",
          skill: "Firmware",
          difficulty: "Intermediate",
          rewardPoints: 25,
        },
      ],
    },
    {
      key: "green",
      letter: "G",
      name: "Green",
      color: "#00C853",
      softColor: "rgba(0,200,83,0.16)",
      glow: "rgba(0,200,83,0.34)",
      minPoints: 700,
      description:
        "Product engineering skills for PCB design, manufacturing and testing.",
      steps: [
        {
          id: "green-o",
          code: "O",
          meaning: "Organize Design",
          skill: "PCB Design",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
        {
          id: "green-m",
          code: "M",
          meaning: "Manufacture Systems",
          skill: "Assembly",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
        {
          id: "green-n",
          code: "N",
          meaning: "Normalize Production",
          skill: "Manufacturing",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
        {
          id: "green-i",
          code: "I",
          meaning: "Inspect Quality",
          skill: "Testing",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
      ],
    },
    {
      key: "yellow",
      letter: "Y",
      name: "Yellow",
      color: "#FFD600",
      softColor: "rgba(255,214,0,0.15)",
      glow: "rgba(255,214,0,0.3)",
      minPoints: 1500,
      description:
        "IoT and automation skills for sensors, connectivity and smart systems.",
      steps: [
        {
          id: "yellow-o",
          code: "O",
          meaning: "Observe Environment",
          skill: "Sensors",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
        {
          id: "yellow-m",
          code: "M",
          meaning: "Monitor Systems",
          skill: "Connectivity",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
        {
          id: "yellow-n",
          code: "N",
          meaning: "Network Devices",
          skill: "MQTT",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
        {
          id: "yellow-i",
          code: "I",
          meaning: "Integrate Intelligence",
          skill: "Smart Systems",
          difficulty: "Advanced",
          rewardPoints: 25,
        },
      ],
    },
    {
      key: "orange",
      letter: "O",
      name: "Orange",
      color: "#FF6D00",
      softColor: "rgba(255,109,0,0.16)",
      glow: "rgba(255,109,0,0.32)",
      minPoints: 3000,
      description:
        "Robotics and industrial systems skills for motion, automation and diagnostics.",
      steps: [
        {
          id: "orange-o",
          code: "O",
          meaning: "Operate Motion",
          skill: "Motor Control",
          difficulty: "Expert",
          rewardPoints: 25,
        },
        {
          id: "orange-m",
          code: "M",
          meaning: "Mechanize Tasks",
          skill: "Automation",
          difficulty: "Expert",
          rewardPoints: 25,
        },
        {
          id: "orange-n",
          code: "N",
          meaning: "Navigate Industry",
          skill: "Industrial Diagnostics",
          difficulty: "Expert",
          rewardPoints: 25,
        },
        {
          id: "orange-i",
          code: "I",
          meaning: "Integrate Systems",
          skill: "System Integration",
          difficulty: "Expert",
          rewardPoints: 25,
        },
      ],
    },
    {
      key: "red",
      letter: "R",
      name: "Red",
      color: "#D50000",
      softColor: "rgba(213,0,0,0.16)",
      glow: "rgba(213,0,0,0.34)",
      minPoints: 5000,
      description:
        "Innovation and grand challenge skills for R&D, national competition and excellence.",
      steps: [
        {
          id: "red-o",
          code: "O",
          meaning: "Originate Innovation",
          skill: "R&D",
          difficulty: "Expert",
          rewardPoints: 25,
        },
        {
          id: "red-m",
          code: "M",
          meaning: "Mobilize Ideas",
          skill: "Innovation Sprint",
          difficulty: "Expert",
          rewardPoints: 25,
        },
        {
          id: "red-n",
          code: "N",
          meaning: "National Competition",
          skill: "Industry Challenges",
          difficulty: "Expert",
          rewardPoints: 25,
        },
        {
          id: "red-i",
          code: "I",
          meaning: "Inspire Excellence",
          skill: "National Championship",
          difficulty: "Expert",
          rewardPoints: 25,
        },
      ],
    },
  ];

  function safePoints(points: number) {
    return Math.max(0, Number.isFinite(points) ? points : 0);
  }

  function getStageIndex(points: number) {
    const currentStage = getVibgyorStage(points);
    return Math.max(
      0,
      OMNI_STAGES.findIndex((stage) => stage.name === currentStage),
    );
  }

  export function getCurrentStage(points: number): OmniStage {
    return OMNI_STAGES[getStageIndex(safePoints(points))];
  }

  export function getNextStage(points: number): OmniStage | null {
    return OMNI_STAGES[getStageIndex(safePoints(points)) + 1] ?? null;
  }

  export function getTotalSteps(): number {
    return OMNI_STAGES.reduce((total, stage) => total + stage.steps.length, 0);
  }

  export function getCompletedSteps(pointsInput: number): number {
    const points = safePoints(pointsInput);
    const currentIndex = getStageIndex(points);
    const currentStage = OMNI_STAGES[currentIndex];
    const nextStage = OMNI_STAGES[currentIndex + 1] ?? null;

    const completedPreviousStages = currentIndex * 4;

    if (!nextStage) {
      return getTotalSteps();
    }

    const stageSpan = nextStage.minPoints - currentStage.minPoints;
    const stageEarned = Math.max(0, points - currentStage.minPoints);
    const currentStageStepProgress = Math.min(
      4,
      Math.floor((stageEarned / stageSpan) * 4),
    );

    return Math.min(
      getTotalSteps(),
      completedPreviousStages + currentStageStepProgress,
    );
  }

  export function getJourneyProgress(points: number): OmniRoadmapSnapshot {
    const normalizedPoints = safePoints(points);
    const currentTier = getTier(normalizedPoints);
    const tierProgress = getTierProgress(normalizedPoints);
    const vibgyorProgress = getVibgyorProgress(normalizedPoints);
    const currentStage = getCurrentStage(normalizedPoints);
    const nextStage = getNextStage(normalizedPoints);
    const completedSteps = getCompletedSteps(normalizedPoints);
    const totalSteps = getTotalSteps();

    return {
      points: normalizedPoints,
      currentTier,
      tierProgress,
      currentStage,
      vibgyorProgress,
      nextStage,
      nextOmniStep: getNextOmniStep(normalizedPoints),
      completedSteps,
      totalSteps,
      progressPercent: Math.min(
        100,
        Math.max(0, Math.round((completedSteps / totalSteps) * 100)),
      ),
    };
  }

  export function getNextOmniStep(
    points: number,
  ): (OmniStep & { stageName: VibgyorStageName; stageLetter: string }) | null {
    const normalizedPoints = safePoints(points);
    const completedSteps = getCompletedSteps(normalizedPoints);
    const totalSteps = getTotalSteps();

    if (completedSteps >= totalSteps) {
      return null;
    }

    const stageIndex = Math.floor(completedSteps / 4);
    const stepIndex = completedSteps % 4;
    const stage = OMNI_STAGES[stageIndex];
    const step = stage.steps[stepIndex];

    return {
      ...step,
      stageName: stage.name,
      stageLetter: stage.letter,
    };
  }
