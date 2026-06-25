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

function getMetricGlow(tone: OsoTone) {
  if (tone === "cyan") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.07),transparent_36%)]";
  }

  if (tone === "emerald") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_36%)]";
  }

  if (tone === "yellow") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_36%)]";
  }

  if (tone === "rose") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_36%)]";
  }

  if (tone === "slate") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.06),transparent_36%)]";
  }

  return "bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_36%)]";
}

function getMetricAccent(tone: OsoTone) {
  if (tone === "cyan") {
    return "from-cyan-500 via-sky-400 to-blue-400";
  }

  if (tone === "emerald") {
    return "from-emerald-500 via-teal-400 to-cyan-400";
  }

  if (tone === "yellow") {
    return "from-yellow-400 via-amber-400 to-orange-400";
  }

  if (tone === "rose") {
    return "from-rose-500 via-pink-400 to-orange-400";
  }

  if (tone === "slate") {
    return "from-slate-700 via-slate-500 to-slate-400";
  }

  return "from-blue-600 via-indigo-500 to-cyan-400";
}

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
      className={`group relative isolate overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white/88 p-4 shadow-[0_16px_46px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_26px_60px_rgba(15,23,42,0.10)] ${className}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 ${getMetricGlow(
          tone,
        )}`}
      />

      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${getMetricAccent(
          tone,
        )}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${getToneClass(
            tone,
          )}`}
        >
          {icon}
        </div>

        <span
          className={`inline-flex h-3 w-3 rounded-full bg-gradient-to-br ${getMetricAccent(
            tone,
          )}`}
        />
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-black leading-none text-slate-950">
        {value}
      </p>

      {helper ? (
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
