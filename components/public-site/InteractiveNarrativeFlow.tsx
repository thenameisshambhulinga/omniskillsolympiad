"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  Eye,
  Hammer,
  Lightbulb,
  Network,
  Route,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type {
  NarrativeFlowConfig,
  NarrativeFlowConnection,
  NarrativeFlowIconName,
  NarrativeFlowNode,
} from "@/components/public-site/narrative-flow.types";
import styles from "@/components/public-site/interactive-narrative-flow.module.css";

const iconRegistry: Record<NarrativeFlowIconName, LucideIcon> = {
  ecosystem: Network,
  observe: Eye,
  build: Hammer,
  navigate: Route,
  invent: Lightbulb,
  spark: Sparkles,
};

const ambientParticles = [
  { left: "8%", top: "18%", delay: 0 },
  { left: "22%", top: "76%", delay: 1.4 },
  { left: "42%", top: "12%", delay: 2.2 },
  { left: "58%", top: "82%", delay: 0.8 },
  { left: "76%", top: "22%", delay: 2.8 },
  { left: "91%", top: "68%", delay: 1.8 },
] as const;

function createConnectionPath(
  from: NarrativeFlowNode,
  to: NarrativeFlowNode,
  connection: NarrativeFlowConnection,
) {
  const middleX = (from.position.x + to.position.x) / 2;
  const middleY =
    (from.position.y + to.position.y) / 2 + (connection.curve ?? 0);

  return `M ${from.position.x} ${from.position.y} Q ${middleX} ${middleY} ${to.position.x} ${to.position.y}`;
}

function nodePositionStyle(
  node: NarrativeFlowNode,
  config: NarrativeFlowConfig,
): CSSProperties {
  return {
    left: `${(node.position.x / config.viewBox.width) * 100}%`,
    top: `${(node.position.y / config.viewBox.height) * 100}%`,
    "--flow-accent": node.color,
  } as CSSProperties;
}

export type InteractiveNarrativeFlowProps = {
  config: NarrativeFlowConfig;
  className?: string;
};

export default function InteractiveNarrativeFlow({
  config,
  className,
}: InteractiveNarrativeFlowProps) {
  const reduceMotion = useReducedMotion();
  const instanceId = useId().replace(/:/g, "");
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const nodeMap = useMemo(
    () => new Map(config.nodes.map((node) => [node.id, node])),
    [config.nodes],
  );

  const centerNode =
    config.nodes.find((node) => node.isCenter) ?? config.nodes[0];

  const [activeNodeId, setActiveNodeId] = useState(
    config.initialNodeId ?? centerNode.id,
  );

  const activeNode = nodeMap.get(activeNodeId) ?? centerNode;

  const activeDirection =
    activeNode.id === centerNode.id
      ? 0
      : (Math.atan2(
          activeNode.position.y - centerNode.position.y,
          activeNode.position.x - centerNode.position.x,
        ) *
          180) /
        Math.PI;

  const activeConnections = new Set(
    config.connections
      .filter(
        (connection) =>
          activeNode.id === centerNode.id ||
          connection.from === activeNode.id ||
          connection.to === activeNode.id,
      )
      .map((connection) => connection.id),
  );

  const moveFocus = (
    currentNodeId: string,
    direction: 1 | -1,
  ) => {
    const currentIndex = config.nodes.findIndex(
      (node) => node.id === currentNodeId,
    );
    const nextIndex =
      (currentIndex + direction + config.nodes.length) % config.nodes.length;
    const nextNode = config.nodes[nextIndex];

    setActiveNodeId(nextNode.id);
    buttonRefs.current[nextNode.id]?.focus();
  };

  const handleNodeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    nodeId: string,
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(nodeId, 1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(nodeId, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveNodeId(config.nodes[0].id);
      buttonRefs.current[config.nodes[0].id]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastNode = config.nodes[config.nodes.length - 1];
      setActiveNodeId(lastNode.id);
      buttonRefs.current[lastNode.id]?.focus();
    }
  };

  return (
    <section
      className={`${styles.flowShell} ${className ?? ""}`}
      aria-label={config.ariaLabel}
    >
      <div className={styles.flowHeader}>
        <div>
          <p className={styles.flowEyebrow}>{config.eyebrow}</p>
          <h2 className={styles.flowTitle}>{config.title}</h2>
        </div>
        <div className={styles.flowHeaderCopy}>
          <p>{config.description}</p>
          {config.interactionHint ? (
            <p className={styles.interactionHint}>{config.interactionHint}</p>
          ) : null}
        </div>
      </div>

      <div className={styles.flowBody}>
        <div className={styles.desktopCanvas}>
          <div className={styles.ambientLayer} aria-hidden="true">
            <motion.div
              className={styles.activeGlow}
              initial={false}
              animate={{
                left: `${
                  (activeNode.position.x / config.viewBox.width) * 100
                }%`,
                top: `${
                  (activeNode.position.y / config.viewBox.height) * 100
                }%`,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 90, damping: 24 }
              }
            />

            {ambientParticles.map((particle, index) => (
              <motion.span
                key={`${particle.left}-${particle.top}`}
                className={styles.ambientParticle}
                style={{ left: particle.left, top: particle.top }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        x: [0, index % 2 === 0 ? 12 : -10, 0],
                        y: [0, -10, 0],
                        opacity: [0.2, 0.7, 0.2],
                      }
                }
                transition={{
                  duration: 7 + index * 0.7,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <svg
            className={styles.connectionLayer}
            viewBox={`0 0 ${config.viewBox.width} ${config.viewBox.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {config.connections.map((connection, index) => {
                const fromNode = nodeMap.get(connection.from);
                const toNode = nodeMap.get(connection.to);
                if (!fromNode || !toNode) return null;

                return (
                  <linearGradient
                    key={connection.id}
                    id={`${instanceId}-${connection.id}-gradient`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={fromNode.color} />
                    <stop offset="52%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor={toNode.color} />
                    {!reduceMotion ? (
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        from="-0.25 0"
                        to="0.25 0"
                        dur={`${8 + index}s`}
                        repeatCount="indefinite"
                      />
                    ) : null}
                  </linearGradient>
                );
              })}
            </defs>

            {config.connections.map((connection, index) => {
              const fromNode = nodeMap.get(connection.from);
              const toNode = nodeMap.get(connection.to);
              if (!fromNode || !toNode) return null;

              const path = createConnectionPath(
                fromNode,
                toNode,
                connection,
              );
              const isActive = activeConnections.has(connection.id);

              return (
                <g key={connection.id}>
                  <path className={styles.pathBase} d={path} />
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={`url(#${instanceId}-${connection.id}-gradient)`}
                    strokeLinecap="round"
                    strokeDasharray="10 12"
                    initial={false}
                    animate={{
                      opacity: isActive ? 0.95 : 0.13,
                      strokeWidth: isActive ? 3.5 : 1.4,
                      strokeDashoffset: reduceMotion ? 0 : [0, -44],
                    }}
                    transition={{
                      opacity: { duration: 0.35 },
                      strokeWidth: { duration: 0.35 },
                      strokeDashoffset: reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 7 + index * 0.6,
                            repeat: Infinity,
                            ease: "linear",
                          },
                    }}
                  />

                  {!reduceMotion ? (
                    <motion.circle
                      r={isActive ? 4.2 : 2.5}
                      fill={toNode.color}
                      initial={false}
                      animate={{ opacity: isActive ? 0.95 : 0.08 }}
                      transition={{ duration: 0.3 }}
                      className={styles.pathParticle}
                    >
                      <animateMotion
                        dur={`${connection.particleDuration ?? 7}s`}
                        begin={`${index * -1.2}s`}
                        repeatCount="indefinite"
                        path={path}
                      />
                    </motion.circle>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {config.nodes.map((node) => {
            const Icon = iconRegistry[node.icon] ?? Atom;
            const isActive = activeNode.id === node.id;
            const isCenter = node.id === centerNode.id;

            return (
              <div
                key={node.id}
                className={styles.nodeAnchor}
                style={nodePositionStyle(node, config)}
              >
                <motion.button
                  ref={(element) => {
                    buttonRefs.current[node.id] = element;
                  }}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={`${instanceId}-content-panel`}
                  aria-label={`${node.title}. ${node.description}`}
                  className={`${styles.nodeCard} ${
                    isCenter ? styles.centerNodeCard : styles.childNodeCard
                  } ${isActive ? styles.nodeCardActive : ""}`}
                  onMouseEnter={() => setActiveNodeId(node.id)}
                  onFocus={() => setActiveNodeId(node.id)}
                  onClick={() => setActiveNodeId(node.id)}
                  onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
                  initial={false}
                  animate={
                    reduceMotion
                      ? { scale: 1, y: 0 }
                      : {
                          scale: isActive ? 1.06 : 1,
                          y: isActive ? -5 : [0, isCenter ? -2 : -1, 0],
                        }
                  }
                  whileHover={reduceMotion ? undefined : { scale: 1.08, y: -6 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                          y: isActive
                            ? { type: "spring", stiffness: 260, damping: 22 }
                            : {
                                duration: isCenter ? 4.6 : 5.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                        }
                  }
                >
                  {isCenter ? (
                    <>
                      <motion.span
                        className={`${styles.orbitRing} ${styles.orbitRingOne}`}
                        aria-hidden="true"
                        animate={reduceMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.span
                        className={`${styles.orbitRing} ${styles.orbitRingTwo}`}
                        aria-hidden="true"
                        animate={reduceMotion ? undefined : { rotate: -360 }}
                        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.span
                        className={styles.centerDirection}
                        aria-hidden="true"
                        animate={{ rotate: activeDirection }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 90, damping: 20 }
                        }
                      />
                    </>
                  ) : null}

                  <span className={styles.nodeContent}>
                    <motion.span
                      className={styles.nodeIcon}
                      aria-hidden="true"
                      animate={
                        reduceMotion || !isActive
                          ? { rotate: 0, scale: 1 }
                          : { rotate: [0, -7, 6, 0], scale: [1, 1.12, 1] }
                      }
                      transition={{ duration: 0.65, ease: "easeOut" }}
                    >
                      <Icon />
                    </motion.span>

                    <span className={styles.nodeText}>
                      <span className={styles.nodeTopline}>
                        {node.sequence ? (
                          <motion.span
                            className={styles.nodeSequence}
                            animate={
                              isActive && !reduceMotion
                                ? { y: [0, -2, 0], opacity: [0.7, 1, 0.7] }
                                : undefined
                            }
                            transition={{ duration: 1.8, repeat: Infinity }}
                          >
                            {node.sequence}
                          </motion.span>
                        ) : null}
                        <span className={styles.nodeEyebrow}>{node.eyebrow}</span>
                      </span>
                      <span className={styles.nodeTitle}>{node.title}</span>
                    </span>

                    <motion.span
                      className={styles.nodeUnderline}
                      aria-hidden="true"
                      initial={false}
                      animate={{ scaleX: isActive ? 1 : 0.2 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 220, damping: 24 }
                      }
                    />
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>

        <div className={styles.mobileFlow}>
          {config.nodes.map((node, index) => {
            const Icon = iconRegistry[node.icon] ?? Atom;
            const isActive = activeNode.id === node.id;

            return (
              <div key={node.id} className={styles.mobileNodeRow}>
                {index > 0 ? (
                  <motion.span
                    className={styles.mobileConnector}
                    aria-hidden="true"
                    animate={{ opacity: isActive ? 1 : 0.3 }}
                  />
                ) : null}
                <motion.button
                  ref={(element) => {
                    buttonRefs.current[node.id] = element;
                  }}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={`${instanceId}-content-panel`}
                  className={`${styles.mobileNodeButton} ${
                    isActive ? styles.mobileNodeButtonActive : ""
                  }`}
                  style={{ "--flow-accent": node.color } as CSSProperties}
                  onFocus={() => setActiveNodeId(node.id)}
                  onClick={() => setActiveNodeId(node.id)}
                  onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
                  layout
                >
                  <span className={styles.mobileNodeIcon}>
                    <Icon />
                  </span>
                  <span>
                    <span className={styles.mobileNodeEyebrow}>{node.eyebrow}</span>
                    <span className={styles.mobileNodeTitle}>{node.title}</span>
                  </span>
                  <ArrowUpRight className={styles.mobileNodeArrow} aria-hidden="true" />
                </motion.button>
              </div>
            );
          })}
        </div>

        <aside
          id={`${instanceId}-content-panel`}
          className={styles.contentPanel}
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeNode.id}
              className={styles.contentPanelInner}
              initial={reduceMotion ? false : { opacity: 0, x: 18, y: 5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -12, y: -4 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
              }
              layout
            >
              <div className={styles.panelTopline}>
                <span
                  className={styles.panelAccent}
                  style={{ background: activeNode.color }}
                  aria-hidden="true"
                />
                <span>{activeNode.eyebrow}</span>
                {activeNode.sequence ? <span>{activeNode.sequence}</span> : null}
              </div>

              <h3 className={styles.panelTitle}>{activeNode.title}</h3>
              <p className={styles.panelDescription}>{activeNode.description}</p>

              {activeNode.status ? (
                <div className={styles.panelStatus}>
                  <Sparkles aria-hidden="true" />
                  <span>{activeNode.status}</span>
                </div>
              ) : null}

              {activeNode.metadata?.length ? (
                <dl className={styles.metadataGrid}>
                  {activeNode.metadata.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {activeNode.cta ? (
                <Link href={activeNode.cta.href} className={styles.panelCta}>
                  {activeNode.cta.label}
                  <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { x: [0, 3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <ArrowUpRight />
                  </motion.span>
                </Link>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}
