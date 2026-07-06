"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Fingerprint,
  Medal,
  Route,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import InteractiveEcosystemMap, {
  type EcosystemIconRegistry,
} from "@/components/public-site/InteractiveEcosystemMap";
import PublicSectionIntro from "@/components/public-site/PublicSectionIntro";
import sectionStyles from "@/components/public-site/ecosystem-experience.module.css";
import styles from "@/components/public-site/public-site.module.css";
import { osoEcosystemMap } from "@/data/oso-ecosystem-map";
import { programmeArchitecture } from "@/data/public-site";

const iconRegistry: EcosystemIconRegistry = {
  identity: Fingerprint,
  practice: Route,
  assess: ClipboardCheck,
  compete: Trophy,
  benchmark: Medal,
  recognise: BadgeCheck,
} satisfies Readonly<Record<string, LucideIcon>>;

export default function EcosystemExperience() {
  const initialNodeId = osoEcosystemMap.nodes[0].id;
  const [activeId, setActiveId] = useState(initialNodeId);
  const [visitedIds, setVisitedIds] = useState<ReadonlySet<string>>(
    () => new Set([initialNodeId]),
  );
  const reduceMotion = useReducedMotion();

  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        osoEcosystemMap.nodes.findIndex((node) => node.id === activeId),
      ),
    [activeId],
  );

  const activeNode = osoEcosystemMap.nodes[activeIndex];
  const ActiveIcon = iconRegistry[activeNode.iconKey];

  const activateNode = useCallback((nodeId: string) => {
    setActiveId(nodeId);
    setVisitedIds((current) => {
      if (current.has(nodeId)) {
        return current;
      }

      const next = new Set(current);
      next.add(nodeId);
      return next;
    });
  }, []);

  const moveStage = useCallback(
    (direction: -1 | 1) => {
      const nextIndex =
        (activeIndex + direction + osoEcosystemMap.nodes.length) %
        osoEcosystemMap.nodes.length;

      activateNode(osoEcosystemMap.nodes[nextIndex].id);
    },
    [activeIndex, activateNode],
  );

  return (
    <section
      id="ecosystem"
      className={`${styles.section} ${sectionStyles.section} scroll-mt-24`}
    >
      <div className={sectionStyles.container}>
        <PublicSectionIntro
          eyebrow="What OSO connects"
          title="Not a quiz website. A connected skill-development system."
          description="OSO links identity, guided practice, protected assessment, practical competition, benchmarking, and recognition into one continuously progressing participant journey."
        />

        <div className={sectionStyles.experienceGrid}>
          <aside
            className={sectionStyles.capabilityPanel}
            aria-live="polite"
            style={
              {
                "--capability-color": activeNode.accent.color,
                "--capability-soft": activeNode.accent.soft,
                "--capability-glow": activeNode.accent.glow,
              } as CSSProperties
            }
          >
            <div className={sectionStyles.stageMetaRow}>
              <span>Progression stage</span>
              <strong>
                {String(activeIndex + 1).padStart(2, "0")} / {" "}
                {String(osoEcosystemMap.nodes.length).padStart(2, "0")}
              </strong>
            </div>

            <div className={sectionStyles.capabilityHeader}>
              <div className={sectionStyles.capabilityHeading}>
                <p className={sectionStyles.capabilityEyebrow}>
                  {activeNode.shortLabel}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h3
                    key={activeNode.id}
                    className={sectionStyles.capabilityTitle}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.22 }}
                  >
                    {activeNode.title}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`${activeNode.id}-icon`}
                  className={sectionStyles.activeIcon}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.82, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.82, rotate: 8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                >
                  {ActiveIcon ? (
                    <ActiveIcon aria-hidden="true" className="h-7 w-7" />
                  ) : null}
                </motion.span>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeNode.id}
                className={sectionStyles.capabilityBody}
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.24 }}
              >
                <p className={sectionStyles.capabilityDescription}>
                  {activeNode.description}
                </p>
                <div className={sectionStyles.evidenceBlock}>
                  <span>Existing OSO capability</span>
                  <p>{activeNode.evidence}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className={sectionStyles.stageProgress} aria-hidden="true">
              {osoEcosystemMap.nodes.map((node, index) => (
                <span
                  key={node.id}
                  data-active={index === activeIndex}
                  data-reached={index <= activeIndex}
                  style={{ backgroundColor: node.accent.color }}
                />
              ))}
            </div>

            <div className={sectionStyles.stageControls}>
              <button
                type="button"
                onClick={() => moveStage(-1)}
                aria-label="Show previous OSO progression stage"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => moveStage(1)}
                aria-label="Show next OSO progression stage"
              >
                Next stage
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </aside>

          <InteractiveEcosystemMap
            config={osoEcosystemMap}
            activeId={activeId}
            visitedIds={visitedIds}
            icons={iconRegistry}
            onActiveChange={activateNode}
          />
        </div>

        <div className={sectionStyles.programmeGrid}>
          <article className={sectionStyles.programmeCard}>
            <p className={sectionStyles.programmeEyebrowBlue}>
              {programmeArchitecture.flagship.label}
            </p>
            <h3>{programmeArchitecture.flagship.title}</h3>
            <p>{programmeArchitecture.flagship.description}</p>
          </article>

          <article className={sectionStyles.programmeCard}>
            <p className={sectionStyles.programmeEyebrowCyan}>
              {programmeArchitecture.future.label}
            </p>
            <h3>{programmeArchitecture.future.title}</h3>
            <p>{programmeArchitecture.future.description}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
