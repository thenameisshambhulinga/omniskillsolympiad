export type StoryAccent =
  | "blue"
  | "cyan"
  | "violet"
  | "green"
  | "amber"
  | "ink";

export type StoryShapeType = "circle" | "rect" | "path";

export type StoryShapeMotion =
  | "none"
  | "float"
  | "drift"
  | "rotate"
  | "pulse";

export interface StoryShape {
  id: string;
  type: StoryShapeType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  cornerRadius?: number;
  d?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotate?: number;
  motion?: StoryShapeMotion;
  targets?: string[];
  mobileHidden?: boolean;
}

export interface StoryNode {
  id: string;
  x: number;
  y: number;
  size: number;
  label?: string;
  caption?: string;
  accent?: StoryAccent;
  kind?: "center" | "satellite";
  targets?: string[];
  mobileHidden?: boolean;
}

export interface StoryConnection {
  id: string;
  from: string;
  to: string;
  bend?: number;
  accent?: StoryAccent;
  targets?: string[];
  opacity?: number;
  mobileHidden?: boolean;
}

export interface StoryAnnotation {
  id: string;
  x: number;
  y: number;
  label: string;
  accent?: StoryAccent;
  targets?: string[];
  mobileHidden?: boolean;
}

export interface StoryOrbit {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  accent?: StoryAccent;
  dashed?: boolean;
  targets?: string[];
}

export interface SectionBackgroundStoryConfig {
  id: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  shapes: readonly StoryShape[];
  nodes: readonly StoryNode[];
  connections: readonly StoryConnection[];
  annotations?: readonly StoryAnnotation[];
  orbits?: readonly StoryOrbit[];
}
