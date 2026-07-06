"use client";

import type { ReactNode } from "react";

import OsoGlassSurface, {
  clampPercent,
  getProgressClass,
  getToneClass,
  type OsoTone,
} from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoProgressBar from "@/components/oso/OsoProgressBar";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";

export type CompetitionTone = OsoTone;

export default function CompetitionGlassPanel({
  children,
  className = "",
  delay: _delay = 0,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <OsoGlassSurface hover={hover} className={className}>
      {children}
    </OsoGlassSurface>
  );
}

export function CompetitionSectionHeading({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <OsoSectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      icon={icon}
    />
  );
}

export function CompetitionMetricTile({
  icon,
  label,
  value,
  helper,
  tone = "blue",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper?: string;
  tone?: CompetitionTone;
}) {
  return (
    <OsoMetricTile
      icon={icon}
      label={label}
      value={value}
      helper={helper}
      tone={tone}
    />
  );
}

export function CompetitionProgressBar({
  value,
  tone = "blue",
  className = "",
}: {
  value: number;
  tone?: CompetitionTone;
  className?: string;
}) {
  return <OsoProgressBar value={value} tone={tone} className={className} />;
}

export function CompetitionStatusPill({
  label,
  tone = "blue",
}: {
  label: string;
  tone?: CompetitionTone;
}) {
  return <OsoStatusPill label={label} tone={tone} />;
}

export { clampPercent, getProgressClass, getToneClass };