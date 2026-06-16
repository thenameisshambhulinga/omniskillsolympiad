import type { ReactNode } from "react";
import { Trophy } from "lucide-react";

import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";

type OsoMilestoneHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  children?: ReactNode;
  showAccent?: boolean;
};

export default function OsoMilestoneHeader({
  eyebrow,
  title,
  description,
  align = "left",
  children,
  showAccent = true,
}: OsoMilestoneHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`relative z-10 ${
        isCenter ? "mx-auto max-w-4xl text-center" : "max-w-4xl"
      }`}
    >
      <div
        className={`mb-4 flex items-center gap-3 ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        {showAccent ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-visible rounded-2xl bg-blue-50">
            <OsoIllustrationAsset
              src={OSO_ILLUSTRATIONS.starAccent}
              alt="Star accent"
              decorative
              blend
              imageClassName="h-12 w-12 object-contain"
            />
          </div>
        ) : null}

        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-700">
          <Trophy className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
      </div>

      <h2 className="oso-heading text-4xl font-black leading-tight text-[#1a202c] sm:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
        {description}
      </p>

      {children}
    </div>
  );
}