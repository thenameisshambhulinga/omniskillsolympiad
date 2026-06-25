"use client";

import { motion } from "framer-motion";

import type { OsoTone } from "@/components/oso/OsoGlassSurface";
import {
  clampPercent,
  getProgressClass,
} from "@/components/oso/OsoGlassSurface";

type OsoProgressBarProps = {
  value: number;
  tone?: OsoTone;
  className?: string;
};

export default function OsoProgressBar({
  value,
  tone = "blue",
  className = "",
}: OsoProgressBarProps) {
  const safeValue = clampPercent(value);

  return (
    <div
      className={`h-2.5 overflow-hidden rounded-full bg-slate-200 ${className}`}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${safeValue}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full ${getProgressClass(tone)}`}
      />
    </div>
  );
}