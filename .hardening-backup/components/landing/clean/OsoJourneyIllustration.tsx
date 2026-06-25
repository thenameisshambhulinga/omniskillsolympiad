"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

const MOUNTAIN_ASSET_PATHS = [
  "/illustrations/oso/kaggle-mountain-climb.png",
  "/illustrations/kaggle-mountain-climb.png",
  "/illustrations/kaggle-mountain-climb-transparent-clean.png",
];

type OsoJourneyIllustrationProps = {
  alt?: string;
  className?: string;
};

export default function OsoJourneyIllustration({
  alt = "A student climbing a mountain trail toward a summit flag, representing learning progress, milestones and skill achievement.",
  className = "",
}: OsoJourneyIllustrationProps) {
  const [pathIndex, setPathIndex] = useState(0);
  const [failedAll, setFailedAll] = useState(false);

  const activeSrc = MOUNTAIN_ASSET_PATHS[pathIndex];

  if (failedAll) {
    return (
      <div
        className={`mx-auto flex min-h-[220px] w-full max-w-[860px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center ${className}`}
      >
        <div className="max-w-sm">
          <ImageOff className="mx-auto h-9 w-9 text-slate-400" />

          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Illustration asset missing
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            Add the mountain PNG at{" "}
            <span className="font-black text-slate-950">
              public/illustrations/oso/kaggle-mountain-climb.png
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        const nextIndex = pathIndex + 1;

        if (nextIndex >= MOUNTAIN_ASSET_PATHS.length) {
          setFailedAll(true);
          return;
        }

        setPathIndex(nextIndex);
      }}
      className={`mountain-illustration-fixed mx-auto block h-auto w-full object-contain object-center ${className}`}
    />
  );
} 