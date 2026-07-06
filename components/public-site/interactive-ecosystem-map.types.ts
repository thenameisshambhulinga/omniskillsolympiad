export type EcosystemMapAccent = {
  color: string;
  soft: string;
  glow: string;
};

export type EcosystemMapNode = {
  id: string;
  shortLabel: string;
  title: string;
  description: string;
  evidence: string;
  iconKey: string;
  x: number;
  y: number;
  bend?: number;
  accent: EcosystemMapAccent;
};

export type EcosystemMapConfig = {
  ariaLabel: string;
  width: number;
  height: number;
  center: {
    x: number;
    y: number;
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  nodes: readonly EcosystemMapNode[];
};
