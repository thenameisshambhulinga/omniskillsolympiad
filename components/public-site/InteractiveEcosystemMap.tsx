"use client";

import {
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";

import type {
  EcosystemMapConfig,
  EcosystemMapNode,
} from "@/components/public-site/interactive-ecosystem-map.types";
import styles from "@/components/public-site/interactive-ecosystem-map.module.css";

export type EcosystemIconRegistry = Readonly<Record<string, LucideIcon>>;

type Props = {
  config: EcosystemMapConfig;
  activeId: string;
  visitedIds: ReadonlySet<string>;
  icons: EcosystemIconRegistry;
  onActiveChange: (nodeId: string) => void;
};

type StagePoint = {
  x: number;
  y: number;
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 470;

function buildStagePoints(count: number): StagePoint[] {
  if (count <= 1) {
    return [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }];
  }

  const startX = 120;
  const endX = CANVAS_WIDTH - 120;
  const startY = 386;
  const endY = 92;
  const xStep = (endX - startX) / (count - 1);
  const yStep = (startY - endY) / (count - 1);

  return Array.from({ length: count }, (_, index) => ({
    x: startX + xStep * index,
    y: startY - yStep * index,
  }));
}

function buildProgressionPath(points: readonly StagePoint[]) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const middleX = current.x + (next.x - current.x) / 2;

    path += ` C ${middleX} ${current.y}, ${middleX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

export default function InteractiveEcosystemMap({
  config,
  activeId,
  visitedIds,
  icons,
  onActiveChange,
}: Props) {
  const reduceMotion = useReducedMotion();
  const desktopButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const points = useMemo(
    () => buildStagePoints(config.nodes.length),
    [config.nodes.length],
  );
  const progressionPath = useMemo(
    () => buildProgressionPath(points),
    [points],
  );

  const activeIndex = Math.max(
    0,
    config.nodes.findIndex((node) => node.id === activeId),
  );
  const activeNode = config.nodes[activeIndex] ?? config.nodes[0];
  const activePoint = points[activeIndex] ?? points[0];
  const progressRatio =
    config.nodes.length > 1 ? activeIndex / (config.nodes.length - 1) : 1;

  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
    refs: MutableRefObject<Array<HTMLButtonElement | null>>,
  ) => {
    const key = event.key;

    if (
      ![
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
        "ArrowUp",
        "Home",
        "End",
      ].includes(key)
    ) {
      return;
    }

    event.preventDefault();

    let nextIndex = currentIndex;

    if (key === "ArrowRight" || key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % config.nodes.length;
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + config.nodes.length) % config.nodes.length;
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = config.nodes.length - 1;
    }

    const nextNode = config.nodes[nextIndex];
    onActiveChange(nextNode.id);
    refs.current[nextIndex]?.focus();
  };

  if (!activeNode) {
    return null;
  }

  return (
    <div
      className={styles.mapShell}
      aria-label={config.ariaLabel}
      style={
        {
          "--active-color": activeNode.accent.color,
          "--active-soft": activeNode.accent.soft,
          "--active-glow": activeNode.accent.glow,
          "--progress-ratio": progressRatio,
        } as CSSProperties
      }
    >
      <div className={styles.gridLayer} aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className={styles.auroraLayer}
        initial={false}
        animate={
          reduceMotion
            ? { x: "0%", y: "0%", scale: 1 }
            : {
                x: ["-1.5%", "1.5%", "-1.5%"],
                y: ["-1%", "1.5%", "-1%"],
                scale: [1, 1.035, 1],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />

      <div className={styles.graphHeader}>
        <div>
          <p className={styles.graphEyebrow}>Continuous skill progression</p>
          <h3>Every stage builds evidence for the next.</h3>
        </div>
        <div className={styles.stageCounter} aria-live="polite">
          <span>Stage</span>
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <span>of {String(config.nodes.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className={styles.desktopCanvas}>
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className={styles.connectionLayer}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="oso-progression-gradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="34%" stopColor="#0891b2" />
              <stop offset="66%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="oso-progression-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={progressionPath}
            className={styles.pathShadow}
            pathLength={1}
          />
          <path
            d={progressionPath}
            className={styles.pathBase}
            pathLength={1}
          />
          <motion.path
            d={progressionPath}
            className={styles.pathProgress}
            pathLength={1}
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: progressRatio, opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.58,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {points.map((point, index) => {
            const node = config.nodes[index];
            const reached = index <= activeIndex;

            return (
              <g key={node.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="17"
                  className={styles.pathNodeHalo}
                  style={{ opacity: reached ? 1 : 0.34 }}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={reached ? node.accent.color : "#cbd5e1"}
                  className={styles.pathNodeDot}
                />
              </g>
            );
          })}

          <motion.circle
            r="8"
            fill={activeNode.accent.color}
            filter="url(#oso-progression-glow)"
            initial={{
              cx: points[0]?.x ?? 0,
              cy: points[0]?.y ?? 0,
              opacity: 1,
            }}
            animate={{
              cx: activePoint?.x ?? 0,
              cy: activePoint?.y ?? 0,
              opacity: 1,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.58,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </svg>

        {config.nodes.map((node, index) => {
          const Icon = icons[node.iconKey];
          const active = node.id === activeId;
          const visited = visitedIds.has(node.id) || index < activeIndex;
          const point = points[index];

          return (
            <motion.button
              key={node.id}
              ref={(element) => {
                desktopButtonRefs.current[index] = element;
              }}
              type="button"
              className={styles.stageCard}
              style={
                {
                  left: `${(point.x / CANVAS_WIDTH) * 100}%`,
                  top: `${(point.y / CANVAS_HEIGHT) * 100}%`,
                  "--node-color": node.accent.color,
                  "--node-soft": node.accent.soft,
                  "--node-glow": node.accent.glow,
                } as CSSProperties
              }
              data-active={active}
              data-visited={visited}
              data-reached={index <= activeIndex}
              aria-pressed={active}
              aria-label={`${String(index + 1).padStart(2, "0")}. ${node.title}. ${node.description}`}
              onMouseEnter={() => onActiveChange(node.id)}
              onFocus={() => onActiveChange(node.id)}
              onClick={() => onActiveChange(node.id)}
              onKeyDown={(event) =>
                moveFocus(event, index, desktopButtonRefs)
              }
              initial={{ opacity: 0.78, scale: 1, y: 0 }}
              animate={{
                opacity: active ? 1 : index <= activeIndex ? 0.92 : 0.74,
                scale: active ? 1.055 : 1,
                y: active ? -8 : 0,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { scale: active ? 1.055 : 1.025, y: -5 }
              }
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.72,
              }}
            >
              <span className={styles.stageTopRow}>
                <span className={styles.stageIcon}>
                  {Icon ? (
                    <Icon aria-hidden="true" className={styles.iconSvg} />
                  ) : null}
                </span>
                <span className={styles.stageNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className={styles.stageLabel}>{node.shortLabel}</span>
              <span className={styles.stageTitle}>{node.title}</span>
              <span className={styles.stageSignal} aria-hidden="true">
                <span />
                <ArrowRight className={styles.stageArrow} />
              </span>
              {visited ? (
                <span
                  className={styles.visitedBadge}
                  aria-label="Reached progression stage"
                >
                  <Check aria-hidden="true" className={styles.checkIcon} />
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      <div className={styles.mobileNodeList}>
        <div className={styles.mobileProgressLine} aria-hidden="true">
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progressRatio }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>

        {config.nodes.map((node, index) => {
          const Icon = icons[node.iconKey];
          const active = node.id === activeId;
          const visited = visitedIds.has(node.id) || index < activeIndex;

          return (
            <div key={node.id} className={styles.mobileStageWrap}>
              <button
                ref={(element) => {
                  mobileButtonRefs.current[index] = element;
                }}
                type="button"
                className={styles.mobileNodeButton}
                style={
                  {
                    "--node-color": node.accent.color,
                    "--node-soft": node.accent.soft,
                    "--node-glow": node.accent.glow,
                  } as CSSProperties
                }
                data-active={active}
                data-visited={visited}
                aria-pressed={active}
                onClick={() => onActiveChange(node.id)}
                onFocus={() => onActiveChange(node.id)}
                onKeyDown={(event) =>
                  moveFocus(event, index, mobileButtonRefs)
                }
              >
                <span className={styles.mobileStepDot} aria-hidden="true" />
                <span className={styles.mobileIcon}>
                  {Icon ? (
                    <Icon aria-hidden="true" className={styles.iconSvg} />
                  ) : null}
                </span>
                <span className={styles.mobileNodeText}>
                  <span className={styles.mobileNodeMeta}>
                    Stage {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{node.title}</strong>
                </span>
                {visited ? (
                  <Check aria-hidden="true" className={styles.mobileCheck} />
                ) : (
                  <ArrowRight
                    aria-hidden="true"
                    className={styles.mobileArrow}
                  />
                )}
              </button>

              <AnimatePresence initial={false}>
                {active ? (
                  <motion.div
                    className={styles.mobileDescription}
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: reduceMotion ? 0 : 0.24 }}
                  >
                    <p>{node.description}</p>
                    <span>{node.evidence}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
