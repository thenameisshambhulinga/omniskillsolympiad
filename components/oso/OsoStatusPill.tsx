import type { ReactNode } from "react";

import type { OsoTone } from "@/components/oso/OsoGlassSurface";
import { getToneClass } from "@/components/oso/OsoGlassSurface";

type OsoStatusPillProps = {
  label: string;
  tone?: OsoTone;
  icon?: ReactNode;
  className?: string;
};

export default function OsoStatusPill({
  label,
  tone = "blue",
  icon,
  className = "",
}: OsoStatusPillProps) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${getToneClass(
        tone,
      )} ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}