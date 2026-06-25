import type { ReactNode } from "react";

export type OsoTone = "blue" | "cyan" | "emerald" | "yellow" | "slate" | "rose";

type OsoGlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  tone?: OsoTone;
  hover?: boolean;
  pattern?: boolean;
};

export default function OsoGlassSurface({
  children,
  className = "",
  tone = "blue",
  hover = true,
  pattern = true,
}: OsoGlassSurfaceProps) {
  return (
    <section
      className={[
        "relative isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-white/78 shadow-[0_22px_64px_rgba(15,23,42,0.07)] backdrop-blur-2xl",
        hover
          ? "transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_78px_rgba(15,23,42,0.10)]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {pattern ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 ${getSurfaceGlow(
            tone,
          )}`}
        />
      ) : null}

      {children}
    </section>
  );
}

export function getToneClass(tone: OsoTone) {
  if (tone === "cyan") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "yellow") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (tone === "rose") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (tone === "slate") {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export function getProgressClass(tone: OsoTone) {
  if (tone === "cyan") {
    return "bg-cyan-600";
  }

  if (tone === "emerald") {
    return "bg-emerald-600";
  }

  if (tone === "yellow") {
    return "bg-yellow-500";
  }

  if (tone === "rose") {
    return "bg-rose-600";
  }

  if (tone === "slate") {
    return "bg-slate-800";
  }

  return "bg-blue-600";
}

function getSurfaceGlow(tone: OsoTone) {
  if (tone === "yellow") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_32%)]";
  }

  if (tone === "emerald") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.07),transparent_32%)]";
  }

  if (tone === "cyan") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.07),transparent_32%)]";
  }

  if (tone === "rose") {
    return "bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_32%)]";
  }

  return "bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.07),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.09),transparent_32%)]";
}

export function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}