"use client";

import { useState, type ReactNode } from "react";
import { ImageOff } from "lucide-react";

export const OSO_ILLUSTRATIONS = {
  starAccent: "/illustrations/oso/star-accen.png",
winnerCup: "/illustrations/oso/star-accen.png",
  exploreLaptop: "/illustrations/oso/laptop-exploerer.png",
  competitionsWinner: "/illustrations/oso/competitions-winner.png",
  benchmarkEnvironment: "/illustrations/oso/benchmark-environment.png",
  postCardPattern: "/illustrations/oso/post-card-bg-pattern.png",
  mountainClimb: "/illustrations/oso/kaggle-mountain-climb.png",
} as const;

type OsoIllustrationAssetProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackTitle?: string;
  fallbackIcon?: ReactNode;
  decorative?: boolean;
  blend?: boolean;
  hover?: boolean;
};

export default function OsoIllustrationAsset({
  src,
  alt,
  className = "",
  imageClassName = "",
  fallbackTitle = "Illustration asset missing",
  fallbackIcon,
  decorative = false,
  blend = true,
  hover = false,
}: OsoIllustrationAssetProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex min-h-[180px] w-full items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center ${className}`}
        aria-label={decorative ? undefined : fallbackTitle}
        aria-hidden={decorative}
      >
        <div className="max-w-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            {fallbackIcon ?? <ImageOff className="h-5 w-5" />}
          </div>

          {!decorative ? (
            <>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                {fallbackTitle}
              </p>

              <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-500">
                {src}
              </p>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={[
  "oso-illustration-clean",
  blend ? "oso-illustration-blend" : "",
  hover ? "oso-illustration-hover" : "",
  imageClassName,
  className,
]
  .filter(Boolean)
  .join(" ")}
    />
  );
}