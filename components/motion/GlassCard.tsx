"use client";

import { type ReactNode } from "react";
import HoverScale from "@/components/motion/HoverScale";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export default function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  const cardClassName = cn(
    "relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl",
    "before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-br before:from-white/10 before:via-transparent before:to-cyan-400/5",
    "after:pointer-events-none after:absolute after:inset-px after:rounded-[31px] after:border after:border-white/5",
    className,
  );

  if (!hover) {
    return <div className={cardClassName}>{children}</div>;
  }

  return (
    <HoverScale className={cardClassName}>
      <div className="relative z-10">{children}</div>
    </HoverScale>
  );
}
