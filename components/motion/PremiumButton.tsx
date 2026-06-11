"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type PremiumButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function PremiumButton({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: PremiumButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    primary:
      "border-cyan-400/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.18)] hover:border-cyan-300/60 hover:bg-cyan-400/20",
    secondary:
      "border-purple-400/30 bg-purple-400/15 text-purple-100 shadow-[0_0_40px_rgba(168,85,247,0.16)] hover:border-purple-300/60 hover:bg-purple-400/20",
    ghost:
      "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/20 hover:bg-white/[0.08]",
  };

  return (
    <motion.button
      type={type}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -2,
              scale: 1.015,
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: 0.975,
            }
      }
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 24,
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
