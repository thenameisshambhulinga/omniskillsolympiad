"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

type OsoJourneyIllustrationProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function OsoJourneyIllustration({
  src = "/illustrations/kaggle-mountain-climb.png",
  alt = "A student climbing a mountain trail toward a summit flag, representing learning progress, milestones and skill achievement.",
  className = "",
}: OsoJourneyIllustrationProps) {
  const [assetFailed, setAssetFailed] = useState(false);

  if (!src || assetFailed) {
    return (
      <div
        className={`mx-auto flex min-h-[220px] w-full max-w-[760px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center ${className}`}
      >
        <div className="max-w-sm">
          <ImageOff className="mx-auto h-9 w-9 text-slate-400" />

          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Illustration asset missing
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            Add the transparent PNG at{" "}
            <span className="font-black text-slate-950">
              public/illustrations/kaggle-mountain-climb.png
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setAssetFailed(true)}
      className={`mountain-illustration-fixed mx-auto block h-auto w-full object-contain object-center transition-transform duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.035] ${className}`}
    />
  );
}