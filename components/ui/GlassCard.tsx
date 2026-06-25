"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={`
        flex flex-col justify-start gap-4
        rounded-[32px]
        border border-white/10
        bg-white/4
        p-6
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(6,182,212,0.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
