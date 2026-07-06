export type AssociationVisualKind =
  | "academic-orbit"
  | "industry-bridge"
  | "federation-grid"
  | "standards-signal"
  | "semiconductor-core"
  | "international-exchange"
  | "digital-constellation"
  | "technical-foundation";

export type AssociationLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  heroScale: string;
  navigationScale: string;
};

export type AssociationTheme = {
  accent: string;
  secondary: string;
  soft: string;
  glow: string;
  ink: string;
};

export type AssociationStory = {
  id: string;
  shortName: string;
  name: string;
  category: string;
  relationship: string;
  headline: string;
  description: string;
  highlights: readonly string[];
  logo: AssociationLogo;
  theme: AssociationTheme;
  visualKind: AssociationVisualKind;
  visualSeed: number;
  website?: string;
  ctaLabel?: string;
  featured?: boolean;
};
