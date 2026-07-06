"use client";

import { useId, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import type {
  SectionBackgroundStoryConfig,
  StoryAccent,
  StoryConnection,
  StoryShape,
} from "@/components/public-site/section-background-storytelling.types";
import styles from "@/components/public-site/section-background-storytelling.module.css";

type Props = {
  config: SectionBackgroundStoryConfig;
  activeTarget: string;
};

function accentColor(accent?: StoryAccent) {
  switch (accent) {
    case "cyan":
      return "#20B8D4";
    case "violet":
      return "#8B5CF6";
    case "green":
      return "#42B883";
    case "amber":
      return "#F6B73C";
    case "ink":
      return "#091E42";
    case "blue":
    default:
      return "#2457D6";
  }
}

function isMuted(activeTarget: string, targets?: string[]) {
  return (
    activeTarget !== "ecosystem" &&
    !targets?.includes(activeTarget)
  );
}

function shapeTransformOrigin(shape: StoryShape) {
  if (shape.type === "circle") {
    return `${shape.x ?? 0}px ${shape.y ?? 0}px`;
  }

  if (shape.type === "rect") {
    return `${(shape.x ?? 0) + (shape.width ?? 0) / 2}px ${
      (shape.y ?? 0) + (shape.height ?? 0) / 2
    }px`;
  }

  return "center";
}

export default function SectionBackgroundStorytelling({
  config,
  activeTarget,
}: Props) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const visible = useInView(rootRef, { once: true, amount: 0.18 });
  const idPrefix = useId().replace(/:/g, "");

  const nodes = useMemo(
    () => new Map(config.nodes.map((node) => [node.id, node])),
    [config.nodes],
  );

  const connectionPath = (connection: StoryConnection) => {
    const from = nodes.get(connection.from);
    const to = nodes.get(connection.to);

    if (!from || !to) {
      return "";
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    const middleX = (from.x + to.x) / 2;
    const middleY = (from.y + to.y) / 2;
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const bend = connection.bend ?? 0;

    return `M ${from.x} ${from.y} Q ${
      middleX + normalX * bend
    } ${middleY + normalY * bend} ${to.x} ${to.y}`;
  };

  return (
    <div ref={rootRef} className={styles.canvas} aria-hidden="true">
      <div className={styles.aurora} />
      <div className={styles.noise} />
      <div className={styles.lightSweep} />

      <svg
        className={styles.svg}
        viewBox={`0 0 ${config.viewBoxWidth} ${config.viewBoxHeight}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {config.connections.map((connection) => {
            const color = accentColor(connection.accent);

            return (
              <linearGradient
                key={connection.id}
                id={`${idPrefix}-${connection.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.06" />
                <stop offset="45%" stopColor={color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={color} stopOpacity="0.14" />
              </linearGradient>
            );
          })}
        </defs>

        {config.shapes.map((shape, index) => {
          const muted = isMuted(activeTarget, shape.targets);
          const baseOpacity = shape.opacity ?? 1;

          const commonProps = {
            fill: shape.fill ?? "none",
            stroke: shape.stroke ?? "none",
            strokeWidth: shape.strokeWidth ?? 0,
          };

          const renderedShape =
            shape.type === "circle" ? (
              <circle
                cx={shape.x}
                cy={shape.y}
                r={shape.radius}
                {...commonProps}
              />
            ) : shape.type === "rect" ? (
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                rx={shape.cornerRadius}
                {...commonProps}
              />
            ) : (
              <path d={shape.d} {...commonProps} />
            );

          const floatY =
            shape.motion === "float"
              ? [0, -7, 0]
              : shape.motion === "drift"
                ? [0, 5, 0]
                : 0;

          const rotate =
            shape.motion === "rotate"
              ? [
                  shape.rotate ?? 0,
                  (shape.rotate ?? 0) + 360,
                ]
              : shape.rotate ?? 0;

          const pulseScale =
            shape.motion === "pulse"
              ? [1, 1.035, 1]
              : 1;

          return (
            <motion.g
              key={shape.id}
              className={
                shape.mobileHidden ? styles.mobileHidden : undefined
              }
              style={{
                transformOrigin: shapeTransformOrigin(shape),
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: visible
                  ? muted
                    ? baseOpacity * 0.18
                    : baseOpacity
                  : 0,
                scale: visible
                  ? activeTarget !== "ecosystem" &&
                    shape.targets?.includes(activeTarget)
                    ? 1.045
                    : pulseScale
                  : 0.96,
                y: reduceMotion ? 0 : floatY,
                rotate: reduceMotion ? shape.rotate ?? 0 : rotate,
              }}
              transition={{
                opacity: {
                  duration: 0.65,
                  delay: index * 0.035,
                },
                scale: {
                  duration: shape.motion === "pulse" ? 7 : 0.35,
                  repeat:
                    !reduceMotion && shape.motion === "pulse"
                      ? Infinity
                      : 0,
                  ease: "easeInOut",
                },
                y: {
                  duration: 7 + index * 0.22,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration:
                    shape.motion === "rotate" ? 80 : 0.35,
                  repeat:
                    !reduceMotion && shape.motion === "rotate"
                      ? Infinity
                      : 0,
                  ease:
                    shape.motion === "rotate"
                      ? "linear"
                      : "easeOut",
                },
              }}
            >
              {renderedShape}
            </motion.g>
          );
        })}

        {config.orbits?.map((orbit, index) => {
          const muted = isMuted(activeTarget, orbit.targets);

          return (
            <motion.circle
              key={orbit.id}
              cx={orbit.cx}
              cy={orbit.cy}
              r={orbit.radius}
              fill="none"
              stroke={accentColor(orbit.accent)}
              strokeWidth="1.5"
              strokeDasharray={orbit.dashed ? "6 11" : undefined}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: visible
                  ? muted
                    ? 0.045
                    : 0.16
                  : 0,
                pathLength: visible ? 1 : 0,
                rotate: reduceMotion
                  ? 0
                  : index % 2 === 0
                    ? [0, 360]
                    : [0, -360],
              }}
              transition={{
                opacity: { duration: 0.7 },
                pathLength: {
                  duration: 1.2,
                  delay: 0.12 + index * 0.08,
                },
                rotate: {
                  duration: 76 + index * 18,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "linear",
                },
              }}
              style={{
                transformOrigin: `${orbit.cx}px ${orbit.cy}px`,
              }}
            />
          );
        })}

        {config.connections.map((connection, index) => {
          const path = connectionPath(connection);
          const muted = isMuted(
            activeTarget,
            connection.targets,
          );
          const active =
            activeTarget !== "ecosystem" &&
            connection.targets?.includes(activeTarget);
          const pathId = `${idPrefix}-path-${connection.id}`;

          return (
            <g
              key={connection.id}
              className={
                connection.mobileHidden
                  ? styles.mobileHidden
                  : undefined
              }
            >
              <motion.path
                id={pathId}
                d={path}
                fill="none"
                stroke={accentColor(connection.accent)}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, strokeWidth: 1}}
                animate={{
                  pathLength: visible ? 1 : 0,
                  opacity: visible
                    ? muted
                      ? 0.055
                      : connection.opacity ?? 0.3
                    : 0,
                  strokeWidth: active ? 3.2 : 1.7,
                }}
                transition={{
                  pathLength: {
                    duration: 1.05,
                    delay: 0.08 + index * 0.075,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: { duration: 0.35 },
                  strokeWidth: { duration: 0.3 },
                }}
              />

              <motion.path
                d={path}
                fill="none"
                stroke={`url(#${idPrefix}-${connection.id})`}
                strokeLinecap="round"
                strokeDasharray="12 18"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: visible
                    ? muted
                      ? 0.025
                      : active
                        ? 0.95
                        : 0.26
                    : 0,
                  strokeDashoffset: reduceMotion
                    ? 0
                    : active
                      ? [-60, 0]
                      : [-36, 0],
                }}
                transition={{
                  opacity: { duration: 0.35 },
                  strokeDashoffset: {
                    duration: active ? 1.8 : 6.8,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "linear",
                  },
                }}
                strokeWidth={active ? 4 : 2}
              />

              {!reduceMotion && !muted ? (
                <circle
                  r={active ? 4.5 : 3}
                  fill={accentColor(connection.accent)}
                  opacity={active ? 0.95 : 0.5}
                >
                  <animateMotion
                    dur={active ? "3.2s" : "7.2s"}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </circle>
              ) : null}
            </g>
          );
        })}

        {config.nodes.map((node, index) => {
          const muted = isMuted(activeTarget, node.targets);
          const active =
            activeTarget !== "ecosystem" &&
            node.targets?.includes(activeTarget);
          const color = accentColor(node.accent);

          return (
            <motion.g
              key={node.id}
              className={
                node.mobileHidden
                  ? styles.mobileHidden
                  : undefined
              }
              style={{
                transformOrigin: `${node.x}px ${node.y}px`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: visible
                  ? muted
                    ? 0.18
                    : 1
                  : 0,
                scale: visible
                  ? active
                    ? 1.09
                    : node.kind === "center"
                      ? reduceMotion
                        ? 1
                        : [1, 1.025, 1]
                      : reduceMotion
                        ? 1
                        : [1, 1.018, 1]
                  : 0.9,
                y: reduceMotion
                  ? 0
                  : node.kind === "center"
                    ? [0, -3, 0]
                    : [0, -2, 0],
              }}
              transition={{
                opacity: {
                  duration: 0.65,
                  delay: 0.12 + index * 0.045,
                },
                scale: {
                  duration:
                    node.kind === "center" ? 7.4 : 6.2,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "easeInOut",
                },
                y: {
                  duration:
                    node.kind === "center" ? 7.4 : 6.2,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              {node.kind === "center" ? (
                <>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 + 18}
                    fill={color}
                    opacity="0.08"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="#ffffff"
                    stroke={color}
                    strokeOpacity="0.22"
                    strokeWidth="2"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 - 14}
                    fill="#F7FAFF"
                    stroke="#091E42"
                    strokeOpacity="0.05"
                  />
                  <text
                    x={node.x}
                    y={node.y - 5}
                    textAnchor="middle"
                    className={styles.centerLabel}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 17}
                    textAnchor="middle"
                    className={styles.centerCaption}
                  >
                    {node.caption}
                  </text>
                </>
              ) : (
                <>
                  <rect
                    x={node.x - node.size / 2}
                    y={node.y - node.size / 2}
                    width={node.size}
                    height={node.size}
                    rx={node.size * 0.28}
                    fill="#ffffff"
                    stroke={color}
                    strokeOpacity={active ? 0.8 : 0.34}
                    strokeWidth={active ? 2.5 : 1.5}
                  />
                  <rect
                    x={node.x - node.size * 0.17}
                    y={node.y - node.size * 0.17}
                    width={node.size * 0.34}
                    height={node.size * 0.34}
                    rx={node.size * 0.09}
                    fill={color}
                    opacity={active ? 0.96 : 0.72}
                  />
                  <text
                    x={node.x}
                    y={node.y + node.size / 2 + 20}
                    textAnchor="middle"
                    className={styles.nodeLabel}
                  >
                    {node.label}
                  </text>
                  {node.caption ? (
                    <text
                      x={node.x}
                      y={node.y + node.size / 2 + 36}
                      textAnchor="middle"
                      className={styles.nodeCaption}
                    >
                      {node.caption}
                    </text>
                  ) : null}
                </>
              )}
            </motion.g>
          );
        })}

        {config.annotations?.map((annotation, index) => {
          const muted = isMuted(
            activeTarget,
            annotation.targets,
          );

          return (
            <motion.text
              key={annotation.id}
              x={annotation.x}
              y={annotation.y}
              textAnchor="middle"
              fill={accentColor(annotation.accent)}
              className={`${styles.annotation} ${
                annotation.mobileHidden
                  ? styles.mobileHidden
                  : ""
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: visible
                  ? muted
                    ? 0.08
                    : 0.48
                  : 0,
                y: visible ? 0 : 8,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.08,
              }}
            >
              {annotation.label}
            </motion.text>
          );
        })}
      </svg>
    </div>
  );
}
