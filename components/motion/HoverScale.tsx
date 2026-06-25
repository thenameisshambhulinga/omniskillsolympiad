"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverScaleProps = HTMLMotionProps<"div"> & {
  hoverScale?: number;
  lift?: number;
};

export default function HoverScale({
  children,
  className,
  hoverScale = 1.025,
  lift = 4,
  ...props
}: HoverScaleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scale: hoverScale,
              y: -lift,
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: 0.985,
            }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
