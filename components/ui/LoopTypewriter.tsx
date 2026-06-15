"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LoopTypewriterProps = {
  text: string;
  className?: string;
  cursorClassName?: string;
  speedMs?: number;
  deleteSpeedMs?: number;
  pauseMs?: number;
  startDelayMs?: number;
};

export default function LoopTypewriter({
  text,
  className = "",
  cursorClassName = "",
  speedMs = 38,
  deleteSpeedMs = 22,
  pauseMs = 1700,
  startDelayMs = 250,
}: LoopTypewriterProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"starting" | "typing" | "pausing" | "deleting">(
    "starting",
  );

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    if (!text.trim()) {
      setVisibleCount(0);
      return;
    }

    if (phase === "starting") {
      timeoutRef.current = window.setTimeout(() => {
        setPhase("typing");
      }, startDelayMs);
    }

    if (phase === "typing") {
      timeoutRef.current = window.setTimeout(() => {
        setVisibleCount((current) => {
          if (current >= text.length) {
            setPhase("pausing");
            return current;
          }

          return current + 1;
        });
      }, speedMs);
    }

    if (phase === "pausing") {
      timeoutRef.current = window.setTimeout(() => {
        setPhase("deleting");
      }, pauseMs);
    }

    if (phase === "deleting") {
      timeoutRef.current = window.setTimeout(() => {
        setVisibleCount((current) => {
          if (current <= 0) {
            setPhase("typing");
            return 0;
          }

          return current - 1;
        });
      }, deleteSpeedMs);
    }

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [deleteSpeedMs, pauseMs, phase, speedMs, startDelayMs, text]);

  const visibleText = useMemo(() => text.slice(0, visibleCount), [text, visibleCount]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      <span
        aria-hidden="true"
        className={`ml-1 inline-block h-[0.85em] w-[4px] translate-y-1 animate-pulse rounded-full bg-blue-600 ${cursorClassName}`}
      />
    </span>
  );
}