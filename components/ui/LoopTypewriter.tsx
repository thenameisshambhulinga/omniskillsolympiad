"use client";

import { useEffect, useMemo, useState } from "react";

type LoopTypewriterProps = {
  text: string;
  className?: string;
  cursorClassName?: string;

  speedMs?: number;
  deleteSpeedMs?: number;
  pauseMs?: number;

  typeSpeed?: number;
  deleteSpeed?: number;
  holdDelay?: number;

  startDelayMs?: number;
};

export default function LoopTypewriter({
  text,
  className = "",
  cursorClassName = "",
  speedMs,
  deleteSpeedMs,
  pauseMs,
  typeSpeed,
  deleteSpeed,
  holdDelay,
  startDelayMs = 250,
}: LoopTypewriterProps) {
  const cleanText = useMemo(() => text.trim(), [text]);

  const typingDelay = typeSpeed ?? speedMs ?? 42;
  const deletingDelay = deleteSpeed ?? deleteSpeedMs ?? 22;
  const holdingDelay = holdDelay ?? pauseMs ?? 1800;

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!cleanText) {
      return;
    }

    if (!hasStarted) {
      const starter = window.setTimeout(() => {
        setHasStarted(true);
      }, startDelayMs);

      return () => window.clearTimeout(starter);
    }

    const isFullyTyped = displayText === cleanText;
    const isFullyDeleted = displayText.length === 0;

    let delay = isDeleting ? deletingDelay : typingDelay;

    if (!isDeleting && isFullyTyped) {
      delay = holdingDelay;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (isFullyTyped) {
          setIsDeleting(true);
          return;
        }

        setDisplayText(cleanText.slice(0, displayText.length + 1));
        return;
      }

      if (isFullyDeleted) {
        setIsDeleting(false);
        return;
      }

      setDisplayText(cleanText.slice(0, displayText.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    cleanText,
    deletingDelay,
    displayText,
    hasStarted,
    holdingDelay,
    isDeleting,
    startDelayMs,
    typingDelay,
  ]);

  return (
    <span className={className} aria-label={cleanText || text}>
      <span>{displayText}</span>
      <span
        aria-hidden="true"
        className={`ml-1 inline-block h-[0.85em] w-[4px] translate-y-1 animate-pulse rounded-full bg-blue-600 ${cursorClassName}`}
      />
    </span>
  );
}
