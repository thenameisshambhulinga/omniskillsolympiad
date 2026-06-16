import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import type { OsoTone } from "@/components/oso/OsoGlassSurface";
import { getToneClass } from "@/components/oso/OsoGlassSurface";

type OsoActionTileProps = {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  meta?: string;
  tone?: OsoTone;
};

export default function OsoActionTile({
  href,
  icon,
  title,
  description,
  meta,
  tone = "blue",
}: OsoActionTileProps) {
  return (
    <Link
      href={href}
      className="group relative isolate flex h-full min-h-[220px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_62px_rgba(15,23,42,0.085)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${getToneClass(
            tone,
          )}`}
        >
          {icon}
        </div>

        <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
      </div>

      {meta ? (
        <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
          {meta}
        </p>
      ) : null}

      <h3 className="oso-heading mt-2 text-xl font-black leading-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-3 flex-1 text-sm font-medium leading-7 text-slate-600">
        {description}
      </p>
    </Link>
  );
}