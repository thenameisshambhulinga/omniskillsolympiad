import type { ReactNode } from "react";

import type { OmniColorTone } from "@/data/omni-theme";
import { getOmniToneStyle } from "@/data/omni-theme";

type OsoColorCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  tone?: OmniColorTone;
  children?: ReactNode;
  className?: string;
};

export default function OsoColorCard({
  eyebrow,
  title,
  description,
  icon,
  tone = "blue",
  children,
  className = "",
}: OsoColorCardProps) {
  const style = getOmniToneStyle(tone);

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-[1.9rem] border ${style.border} bg-white/82 p-5 shadow-[0_18px_54px_rgba(15,23,42,0.065)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_72px_rgba(15,23,42,0.095)] ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${style.glow} blur-3xl transition duration-300 group-hover:scale-110`}
      />

      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${style.gradient}`}
      />

      <div className="relative z-10">
        {icon ? (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${style.iconBg}`}
          >
            {icon}
          </div>
        ) : null}

        {eyebrow ? (
          <p className={`mt-5 text-xs font-black uppercase tracking-[0.2em] ${style.text}`}>
            {eyebrow}
          </p>
        ) : null}

        <h3 className="oso-heading mt-2 text-xl font-black leading-tight text-slate-950">
          {title}
        </h3>

        {description ? (
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
            {description}
          </p>
        ) : null}

        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </article>
  );
}