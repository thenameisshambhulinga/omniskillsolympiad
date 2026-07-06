export type NarrativeFlowIconName =
  | "ecosystem"
  | "observe"
  | "build"
  | "navigate"
  | "invent"
  | "spark";

export type NarrativeFlowPosition = {
  x: number;
  y: number;
};

export type NarrativeFlowMetadata = {
  label: string;
  value: string;
};

export type NarrativeFlowNode = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  color: string;
  icon: NarrativeFlowIconName;
  position: NarrativeFlowPosition;
  isCenter?: boolean;
  sequence?: string;
  status?: string;
  metadata?: readonly NarrativeFlowMetadata[];
  cta?: {
    label: string;
    href: string;
  };
};

export type NarrativeFlowConnection = {
  id: string;
  from: string;
  to: string;
  curve?: number;
  particleDuration?: number;
};

export type NarrativeFlowConfig = {
  id: string;
  ariaLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  interactionHint?: string;
  viewBox: {
    width: number;
    height: number;
  };
  initialNodeId?: string;
  nodes: readonly NarrativeFlowNode[];
  connections: readonly NarrativeFlowConnection[];
};
