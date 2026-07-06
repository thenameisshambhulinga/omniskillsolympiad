"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardList,
  Fingerprint,
  Flag,
  LogIn,
  Medal,
  Radar,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import PublicSectionIntro from "@/components/public-site/PublicSectionIntro";
import journeyStyles from "@/components/public-site/journey-flow.module.css";
import styles from "@/components/public-site/public-site.module.css";
import { journeyStages } from "@/data/public-site";

const stageIcons: readonly LucideIcon[] = [
  Radar,
  LogIn,
  Fingerprint,
  Flag,
  ClipboardList,
  Trophy,
  Medal,
  BadgeCheck,
] as const;

const desktopPositions = [
  { x: 92, y: 92 },
  { x: 310, y: 92 },
  { x: 528, y: 92 },
  { x: 746, y: 92 },
  { x: 746, y: 278 },
  { x: 528, y: 278 },
  { x: 310, y: 278 },
  { x: 92, y: 278 },
] as const;

const journeyPath =
  "M92 92 H746 C826 92 826 278 746 278 H92";

export default function JourneyFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const activeStage = journeyStages[activeIndex];
  const ActiveIcon = stageIcons[activeIndex] ?? BadgeCheck;

  function activateStage(index: number, moveFocus = false) {
    const boundedIndex = Math.max(0, Math.min(journeyStages.length - 1, index));
    setActiveIndex(boundedIndex);
    setVisited((current) => {
      const next = new Set(current);
      next.add(boundedIndex);
      return next;
    });

    if (moveFocus) {
      window.requestAnimationFrame(() => buttonRefs.current[boundedIndex]?.focus());
    }
  }

  function handleStageKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      activateStage(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      activateStage(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      activateStage(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      activateStage(journeyStages.length - 1, true);
    }
  }

  return (
    <section
      id="journey"
      className={`${styles.section} ${styles.darkSection} ${journeyStyles.section} scroll-mt-24`}
    >
      <div className={journeyStyles.container}>
        <PublicSectionIntro
          eyebrow="The participant journey"
          title="One connected pathway from discovery to recognition."
          description="Activate each stage to see how public exploration transitions into the existing authenticated OSO platform while preserving login, onboarding, protected assessments, and role controls."
          tone="dark"
        />

        <div className={journeyStyles.workspace}>
          <div className={journeyStyles.trackCard}>
            <svg
              viewBox="0 0 840 370"
              aria-hidden="true"
              className={journeyStyles.pathLayer}
            >
              <defs>
                <linearGradient id="compactJourneyLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3" />
                  <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              <path
                id="compactOsoJourneyPath"
                d={journeyPath}
                fill="none"
                stroke="rgba(255,255,255,0.11)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <motion.path
                d={journeyPath}
                fill="none"
                stroke="url(#compactJourneyLine)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 12"
                animate={reduceMotion ? undefined : { strokeDashoffset: [-44, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 5.8, repeat: Infinity, ease: "linear" }
                }
              />

              {!reduceMotion ? (
                <>
                  <circle r="4.5" fill="#7dd3fc">
                    <animateMotion dur="7s" repeatCount="indefinite" path={journeyPath} />
                  </circle>
                  <circle r="3" fill="#c4b5fd">
                    <animateMotion
                      dur="7s"
                      begin="-3.5s"
                      repeatCount="indefinite"
                      path={journeyPath}
                    />
                  </circle>
                </>
              ) : null}
            </svg>

            {journeyStages.map((stage, index) => {
              const Icon = stageIcons[index] ?? BadgeCheck;
              const active = activeIndex === index;
              const completed = visited.has(index) && !active;
              const position = desktopPositions[index];

              return (
                <motion.button
                  key={stage.title}
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  type="button"
                  className={journeyStyles.stageButton}
                  style={{
                    left: `${(position.x / 840) * 100}%`,
                    top: `${(position.y / 370) * 100}%`,
                  }}
                  data-active={active}
                  data-visited={completed}
                  onClick={() => activateStage(index)}
                  onKeyDown={(event) => handleStageKeyDown(event, index)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Stage ${index + 1}: ${stage.title}. ${stage.description}`}
                  animate={{
                    scale: active ? 1.06 : 1,
                    opacity: active || completed ? 1 : 0.58,
                    y: active && !reduceMotion ? -4 : 0,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <span className={journeyStyles.stageIcon}>
                    {completed ? (
                      <BadgeCheck aria-hidden="true" className="h-5 w-5" />
                    ) : (
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    )}
                  </span>
                  <span className={journeyStyles.stageMeta}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={journeyStyles.stageLabel}>{stage.eyebrow}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeStage.title}
              className={journeyStyles.detailCard}
              initial={reduceMotion ? false : { opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -14 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
              aria-live="polite"
            >
              <span className={journeyStyles.detailIcon}>
                <ActiveIcon aria-hidden="true" className="h-6 w-6" />
              </span>

              <p className={journeyStyles.detailEyebrow}>
                Stage {String(activeIndex + 1).padStart(2, "0")} · {activeStage.eyebrow}
              </p>
              <h3 className={journeyStyles.detailTitle}>{activeStage.title}</h3>
              <p className={journeyStyles.detailDescription}>{activeStage.description}</p>

              <div className={journeyStyles.outcomeBox}>
                <span>Outcome</span>
                <strong>{activeStage.outcome}</strong>
              </div>

              <div className={journeyStyles.gatewayRow}>
                <p>Public exploration ends at the established login gateway.</p>
                <Link href="/auth/continue" className={journeyStyles.gatewayLink}>
                  Enter OSO
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className={journeyStyles.mobileList} aria-label="OSO journey stages">
          {journeyStages.map((stage, index) => {
            const Icon = stageIcons[index] ?? BadgeCheck;
            const active = activeIndex === index;
            const completed = visited.has(index) && !active;

            return (
              <button
                key={stage.title}
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                type="button"
                onClick={() => activateStage(index)}
                onKeyDown={(event) => handleStageKeyDown(event, index)}
                aria-current={active ? "step" : undefined}
                className={journeyStyles.mobileStage}
                data-active={active}
              >
                <span className={journeyStyles.mobileStageHeader}>
                  <span className={journeyStyles.mobileStageIcon}>
                    {completed ? (
                      <BadgeCheck aria-hidden="true" className="h-5 w-5" />
                    ) : (
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    )}
                  </span>
                  <span>
                    <span className={journeyStyles.mobileStageMeta}>
                      {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                    </span>
                    <strong>{stage.title}</strong>
                  </span>
                </span>

                {active ? (
                  <span className={journeyStyles.mobileStageBody}>
                    <span>{stage.description}</span>
                    <span className={journeyStyles.mobileOutcome}>
                      Outcome: {stage.outcome}
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}

          <Link href="/auth/continue" className={journeyStyles.mobileGatewayLink}>
            Enter OSO platform
          </Link>
        </div>
      </div>
    </section>
  );
}
