"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

type MetricInfoTooltipProps = {
  title: string;
  description: string;
  improvement?: string;
  rewardImpact?: string;
};

type TooltipPosition = {
  top: number;
  left: number;
};

const TOOLTIP_WIDTH = 320;
const TOOLTIP_GAP = 12;
const VIEWPORT_PADDING = 16;

function getSafeLeft(anchorLeft: number, anchorWidth: number) {
  const centeredLeft = anchorLeft + anchorWidth / 2 - TOOLTIP_WIDTH / 2;
  const maxLeft = window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING;

  return Math.min(Math.max(centeredLeft, VIEWPORT_PADDING), maxLeft);
}

function getSafeTop(anchorTop: number, anchorBottom: number) {
  const preferredTop = anchorBottom + TOOLTIP_GAP;
  const estimatedTooltipHeight = 260;
  const wouldOverflowBottom =
    preferredTop + estimatedTooltipHeight >
    window.innerHeight - VIEWPORT_PADDING;

  if (wouldOverflowBottom) {
    return Math.max(
      anchorTop - estimatedTooltipHeight - TOOLTIP_GAP,
      VIEWPORT_PADDING,
    );
  }

  return preferredTop;
}

export default function MetricInfoTooltip({
  title,
  description,
  improvement,
  rewardImpact,
}: MetricInfoTooltipProps) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: getSafeTop(rect.top, rect.bottom),
      left: getSafeLeft(rect.left, rect.width),
    });
  };
  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const showTooltip = () => {
    updatePosition();
    setOpen(true);
  };

  const hideTooltip = () => {
    setOpen(false);
  };

  const tooltip =
    mounted && open && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence initial={false}>
            <motion.div
              id={tooltipId}
              role="tooltip"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: TOOLTIP_WIDTH,
                zIndex: 2147483647,
              }}
              className="pointer-events-none rounded-2xl border border-cyan-300/25 bg-slate-950/95 p-4 text-left shadow-[0_24px_90px_rgba(0,0,0,0.78),0_0_48px_rgba(34,211,238,0.18)] backdrop-blur-2xl"
            >
              <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-cyan-300/25 bg-slate-950/95" />

              <p className="relative text-sm font-black text-white">{title}</p>

              <p className="relative mt-2 text-xs leading-6 text-white/68">
                {description}
              </p>

              {improvement && (
                <p className="relative mt-3 text-xs leading-6 text-cyan-100/78">
                  <span className="font-black text-cyan-200">Improve: </span>
                  {improvement}
                </p>
              )}

              {rewardImpact && (
                <p className="relative mt-2 text-xs leading-6 text-purple-100/78">
                  <span className="font-black text-purple-200">Impact: </span>
                  {rewardImpact}
                </p>
              )}
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`About ${title}`}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 transition hover:bg-cyan-300/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {tooltip}
    </>
  );
}

