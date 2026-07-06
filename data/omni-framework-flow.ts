import type { NarrativeFlowConfig } from "@/components/public-site/narrative-flow.types";

export const omniFrameworkFlow = {
  id: "omni-framework",
  ariaLabel:
    "Interactive OMNI framework showing Observe and Learn, Make and Build, Navigate Innovation, and Invent connected to the OMNI Skills Olympiad ecosystem.",
  eyebrow: "The OMNI framework",
  title: "One connected engineering lifecycle.",
  description:
    "Explore how every discipline-specific Skill-on programme moves participants from awareness to practical creation, integrated problem-solving, and industry-oriented innovation.",
  interactionHint: "Hover, focus, or select a stage to explore its relationship with OSO.",
  viewBox: {
    width: 760,
    height: 340,
  },
  initialNodeId: "omni-ecosystem",
  nodes: [
    {
      id: "omni-ecosystem",
      title: "OMNI Skills Olympiad",
      eyebrow: "Parent ecosystem",
      description:
        "The common ecosystem that connects discipline-specific programmes through one philosophy, progression model, evaluation approach, and long-term participant identity.",
      color: "#1959d1",
      icon: "ecosystem",
      position: { x: 380, y: 232 },
      isCenter: true,
      status: "One ecosystem · many engineering disciplines",
      metadata: [
        { label: "Framework", value: "Observe → Make → Navigate → Invent" },
        { label: "Current flagship", value: "Skill-on-Circuit" },
      ],
    },
    {
      id: "observe-learn",
      title: "Observe & Learn",
      eyebrow: "Foundation",
      description:
        "Develop engineering awareness, identify components and systems, understand principles, and strengthen the fundamentals required for practical work.",
      color: "#2563eb",
      icon: "observe",
      position: { x: 86, y: 90 },
      sequence: "01",
      status: "Build awareness and technical foundations",
      metadata: [
        { label: "Participant shift", value: "From exposure to understanding" },
        { label: "Primary outcome", value: "Confident technical foundations" },
      ],
    },
    {
      id: "make-build",
      title: "Make & Build",
      eyebrow: "Application",
      description:
        "Convert concepts into working circuits, programs, assemblies, models, and prototypes through structured practical challenges.",
      color: "#0891b2",
      icon: "build",
      position: { x: 280, y: 64 },
      sequence: "02",
      status: "Transform concepts into working systems",
      metadata: [
        { label: "Participant shift", value: "From understanding to implementation" },
        { label: "Primary outcome", value: "Practical execution capability" },
      ],
    },
    {
      id: "navigate-innovation",
      title: "Navigate Innovation",
      eyebrow: "Integration",
      description:
        "Integrate technologies, troubleshoot systems, optimise designs, and solve increasingly complex multidisciplinary engineering problems.",
      color: "#7c3aed",
      icon: "navigate",
      position: { x: 480, y: 64 },
      sequence: "03",
      status: "Connect technologies and solve complex problems",
      metadata: [
        { label: "Participant shift", value: "From implementation to integration" },
        { label: "Primary outcome", value: "System-level problem-solving" },
      ],
    },
    {
      id: "invent",
      title: "Invent",
      eyebrow: "Industry orientation",
      description:
        "Develop industry-oriented products, research prototypes, entrepreneurial solutions, and innovative applications with real-world relevance.",
      color: "#ea580c",
      icon: "invent",
      position: { x: 674, y: 90 },
      sequence: "04",
      status: "Create solutions with industrial and societal relevance",
      metadata: [
        { label: "Participant shift", value: "From integration to innovation" },
        { label: "Primary outcome", value: "Industry-oriented creation" },
      ],
    },
  ],
  connections: [
    {
      id: "ecosystem-observe",
      from: "omni-ecosystem",
      to: "observe-learn",
      curve: -34,
      particleDuration: 7.4,
    },
    {
      id: "ecosystem-make",
      from: "omni-ecosystem",
      to: "make-build",
      curve: -18,
      particleDuration: 6.8,
    },
    {
      id: "ecosystem-navigate",
      from: "omni-ecosystem",
      to: "navigate-innovation",
      curve: 18,
      particleDuration: 6.8,
    },
    {
      id: "ecosystem-invent",
      from: "omni-ecosystem",
      to: "invent",
      curve: 34,
      particleDuration: 7.4,
    },
  ],
} as const satisfies NarrativeFlowConfig;
