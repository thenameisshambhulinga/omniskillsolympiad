import type { EcosystemMapConfig } from "@/components/public-site/interactive-ecosystem-map.types";

export const osoEcosystemMap: EcosystemMapConfig = {
  ariaLabel:
    "Interactive map showing how OMNI Skills Olympiad connects identity, practice, assessment, competition, benchmarking, and recognition",
  width: 900,
  height: 620,
  center: {
    x: 450,
    y: 310,
    eyebrow: "Parent ecosystem",
    title: "OMNI Skills Olympiad",
    subtitle: "One identity · one progression system",
  },
  nodes: [
    {
      id: "identity",
      shortLabel: "Identity",
      title: "Profile & OMNI Identity",
      description:
        "Participants complete onboarding and build a persistent engineering identity anchored by their OMNI ID.",
      evidence:
        "Existing onboarding, profile, OMNI ID, and student-dashboard flows.",
      iconKey: "identity",
      x: 450,
      y: 92,
      bend: -18,
      accent: {
        color: "#2563eb",
        soft: "#eff6ff",
        glow: "rgba(37, 99, 235, 0.28)",
      },
    },
    {
      id: "practice",
      shortLabel: "Practice",
      title: "Guided skill practice",
      description:
        "Short engineering challenges build consistency, technical recall, and the habit of continuous improvement.",
      evidence:
        "Existing Daily Challenge engine, attempts, results, streaks, and leaderboards.",
      iconKey: "practice",
      x: 746,
      y: 190,
      bend: -44,
      accent: {
        color: "#0891b2",
        soft: "#ecfeff",
        glow: "rgba(8, 145, 178, 0.28)",
      },
    },
    {
      id: "assess",
      shortLabel: "Assess",
      title: "Protected assessment engine",
      description:
        "Controlled, one-attempt assessments measure performance through verified scoring and selection workflows.",
      evidence:
        "Existing admin publishing, protected attempts, scoring, and selection-result flows.",
      iconKey: "assess",
      x: 746,
      y: 438,
      bend: 44,
      accent: {
        color: "#7c3aed",
        soft: "#f5f3ff",
        glow: "rgba(124, 58, 237, 0.28)",
      },
    },
    {
      id: "compete",
      shortLabel: "Compete",
      title: "Skill-on-Circuit competitions",
      description:
        "Participants progress into practical, domain-specific competition experiences governed through the OSO ecosystem.",
      evidence:
        "Current flagship programme for ECE and allied circuit branches, with a model designed to expand across disciplines.",
      iconKey: "compete",
      x: 450,
      y: 535,
      bend: 18,
      accent: {
        color: "#ea580c",
        soft: "#fff7ed",
        glow: "rgba(234, 88, 12, 0.26)",
      },
    },
    {
      id: "benchmark",
      shortLabel: "Benchmark",
      title: "Performance benchmarking",
      description:
        "Results, rankings, qualification status, and progressive benchmarks make capability visible over time.",
      evidence:
        "Existing scoring, leaderboards, selection engine, and competition statistics.",
      iconKey: "benchmark",
      x: 154,
      y: 438,
      bend: -44,
      accent: {
        color: "#16a34a",
        soft: "#f0fdf4",
        glow: "rgba(22, 163, 74, 0.25)",
      },
    },
    {
      id: "recognise",
      shortLabel: "Recognise",
      title: "Recognition & progression",
      description:
        "Skills, achievements, results, certificates, and future opportunities form a long-term record of growth.",
      evidence:
        "Existing profile, achievement, result, competition-history, and recognition architecture.",
      iconKey: "recognise",
      x: 154,
      y: 190,
      bend: 44,
      accent: {
        color: "#ca8a04",
        soft: "#fefce8",
        glow: "rgba(202, 138, 4, 0.25)",
      },
    },
  ],
} as const;
