import type { ReactNode } from "react";

import type { OsoTone } from "@/components/oso/OsoGlassSurface";
import { getToneClass } from "@/components/oso/OsoGlassSurface";

type OsoMetricTileProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper?: string;
  tone?: OsoTone;
  className?: string;
};

export default function OsoMetricTile({
  icon,
  label,
  value,
  helper,
  tone = "blue",
  className = "",
}: OsoMetricTileProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl ${className}`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${getToneClass(
          tone,
        )}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-xl font-black text-slate-950">
        {value}
      </p>

      {helper ? (
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          {helper}
        </p>
      ) : null}
    </div>
  );
}