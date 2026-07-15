"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Network,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type {
  AssociationStory,
  AssociationVisualKind,
} from "@/components/public-site/association-story.types";
import styles from "@/components/public-site/associations-section.module.css";

const AUTOPLAY_MS = 8000;

type AssociationStoryRailProps = {
  items: readonly AssociationStory[];
};

type ThemeVariables = CSSProperties & {
  "--association-accent": string;
  "--association-secondary": string;
  "--association-soft": string;
  "--association-glow": string;
  "--association-ink": string;
  "--progress-state": "running" | "paused";
};

function getVisualGeometry(kind: AssociationVisualKind, seed: number) {
  const shift = (seed % 4) * 7;

  const geometry: Record<
    AssociationVisualKind,
    {
      ringScale: number;
      lineAngle: number;
      polygonRotation: number;
      nodeOffset: number;
    }
  > = {
    "academic-orbit": {
      ringScale: 1.02,
      lineAngle: -8,
      polygonRotation: -12,
      nodeOffset: 10,
    },
    "industry-bridge": {
      ringScale: 0.92,
      lineAngle: 4,
      polygonRotation: 8,
      nodeOffset: 18,
    },
    "federation-grid": {
      ringScale: 1.08,
      lineAngle: -3,
      polygonRotation: 18,
      nodeOffset: 4,
    },
    "standards-signal": {
      ringScale: 0.98,
      lineAngle: 12,
      polygonRotation: -4,
      nodeOffset: 14,
    },
    "semiconductor-core": {
      ringScale: 0.88,
      lineAngle: -14,
      polygonRotation: 24,
      nodeOffset: 8,
    },
    "international-exchange": {
      ringScale: 1.04,
      lineAngle: 7,
      polygonRotation: -18,
      nodeOffset: 20,
    },
    "digital-constellation": {
      ringScale: 0.96,
      lineAngle: -6,
      polygonRotation: 14,
      nodeOffset: 12,
    },
    "technical-foundation": {
      ringScale: 1.1,
      lineAngle: 2,
      polygonRotation: -8,
      nodeOffset: 6,
    },
  };

  const base = geometry[kind];

  return {
    ...base,
    polygonRotation: base.polygonRotation + shift,
  };
}

function PartnerVisual({ story }: { story: AssociationStory }) {
  const reduceMotion = useReducedMotion();
  const geometry = getVisualGeometry(story.visualKind, story.visualSeed);

  return (
    <div className={styles.visualCanvas} aria-hidden="true">
      <motion.div
        className={styles.visualGlow}
        initial={false}
        animate={{
          scale: reduceMotion ? 1 : [1, 1.06, 1],
          x: `${geometry.nodeOffset}%`,
        }}
        transition={{
          scale: {
            duration: 7.5,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          },
          x: { type: "spring", stiffness: 90, damping: 18 },
        }}
      />

      <motion.div
        className={styles.visualRingOuter}
        initial={false}
        animate={{
          rotate: reduceMotion ? 0 : 360,
          scale: geometry.ringScale,
        }}
        transition={{
          rotate: {
            duration: 72,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "linear",
          },
          scale: { type: "spring", stiffness: 80, damping: 20 },
        }}
      />

      <motion.div
        className={styles.visualRingInner}
        initial={false}
        animate={{
          rotate: reduceMotion ? 0 : -360,
          scale: 2 - geometry.ringScale,
        }}
        transition={{
          rotate: {
            duration: 58,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "linear",
          },
          scale: { type: "spring", stiffness: 80, damping: 20 },
        }}
      />

      <motion.div
        className={styles.visualPolygon}
        initial={false}
        animate={{
          rotate: geometry.polygonRotation,
          x: `${geometry.nodeOffset / 2}%`,
          y: `${-geometry.nodeOffset / 3}%`,
        }}
        transition={{ type: "spring", stiffness: 85, damping: 20 }}
      />

      <motion.div
        className={styles.visualBridge}
        initial={false}
        animate={{ rotate: geometry.lineAngle }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      />

      <div className={styles.visualGrid} />

      {[0, 1, 2, 3, 4].map((index) => (
        <motion.span
          key={index}
          className={styles.visualNode}
          style={{
            left: `${19 + index * 15}%`,
            top: `${27 + ((index + story.visualSeed) % 3) * 18}%`,
          }}
          initial={{ opacity: 0.32, scale: 1 }}
          animate={
            reduceMotion
              ? { opacity: 0.48, scale: 1 }
              : {
                  opacity: [0.32, 0.82, 0.32],
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: 4.4 + index * 0.7,
            delay: index * 0.3,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function AssociationStoryRail({
  items,
}: AssociationStoryRailProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(() => {
    const featuredIndex = items.findIndex((item) => item.featured);
    return featuredIndex >= 0 ? featuredIndex : 0;
  });
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const paused =
    pointerInside || focusInside || pageHidden || Boolean(reduceMotion);
  const story = items[activeIndex];

  const themeStyle = useMemo<ThemeVariables>(
    () => ({
      "--association-accent": story?.theme.accent ?? "#2867e8",
      "--association-secondary": story?.theme.secondary ?? "#20b8d4",
      "--association-soft": story?.theme.soft ?? "#e3eeff",
      "--association-glow":
        story?.theme.glow ?? "rgba(40, 103, 232, 0.36)",
      "--association-ink": story?.theme.ink ?? "#f3f7ff",
      "--progress-state": paused ? "paused" : "running",
    }),
    [paused, story],
  );

  const activate = useCallback(
    (index: number, moveFocus = false) => {
      if (items.length === 0) {
        return;
      }

      const normalized = (index + items.length) % items.length;
      setActiveIndex(normalized);

      if (moveFocus) {
        requestAnimationFrame(() => tabsRef.current[normalized]?.focus());
      }
    },
    [items.length],
  );

  useEffect(() => {
    if (paused || items.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  useEffect(() => {
    const handleVisibility = () => setPageHidden(document.hidden);

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      activate(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      activate(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      activate(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      activate(items.length - 1, true);
    }
  };

  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocusInside(false);
    }
  };

  if (!story) {
    return null;
  }

  return (
    <div
      className={styles.showcase}
      style={themeStyle}
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={handleBlurCapture}
    >
      <div className={styles.showcasePanel}>
        <div className={styles.panelLighting} aria-hidden="true" />

        <div className={styles.featureGrid}>
          <div className={styles.logoStory}>
            <PartnerVisual story={story} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={story.id}
                className={styles.heroLogoWrap}
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -8 }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Image
                  src={story.logo.src}
                  alt={story.logo.alt}
                  width={story.logo.width}
                  height={story.logo.height}
                  priority={story.featured === true}
                  className={styles.heroImage}
                  style={{ width: story.logo.heroScale }}
                  sizes="(max-width: 768px) 78vw, (max-width: 1200px) 44vw, 34vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            id="association-active-panel"
            className={styles.partnerContent}
            role="tabpanel"
            aria-labelledby={`association-tab-${story.id}`}
            aria-live="polite"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.36,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className={styles.categoryRow}>
                  <span className={styles.category}>{story.category}</span>
                  <span className={styles.relationship}>
                    {story.relationship}
                  </span>
                </div>

                <p className={styles.shortName}>{story.shortName}</p>
                <h3 className={styles.partnerName}>{story.name}</h3>
                <p className={styles.partnerHeadline}>{story.headline}</p>
                <p className={styles.partnerDescription}>{story.description}</p>

                <ul
                  className={styles.highlights}
                  aria-label={`${story.name} contribution highlights`}
                >
                  {story.highlights.map((highlight) => (
                    <li key={highlight}>
                      <Network aria-hidden="true" className="h-4 w-4" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {story.website && story.ctaLabel ? (
                  <motion.a
                    href={story.website}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.cta}
                    whileHover={reduceMotion ? undefined : { x: 4 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  >
                    {story.ctaLabel}
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </motion.a>
                ) : (
                  <div className={styles.partnerStatus}>
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    Foundational role within the OSO ecosystem
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.selectorShell}>
          <div className={styles.selectorHeader}>
            <p>Explore the association ecosystem</p>
            <div className={styles.arrowControls}>
              <button
                type="button"
                onClick={() => activate(activeIndex - 1)}
                aria-label="Show previous associated organisation"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => activate(activeIndex + 1)}
                aria-label="Show next associated organisation"
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className={styles.selectorTrack}
            role="tablist"
            aria-label="Associated organisations"
          >
            {items.map((item, index) => {
              const selected = index === activeIndex;

              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabsRef.current[index] = node;
                  }}
                  type="button"
                  id={`association-tab-${item.id}`}
                  role="tab"
                  aria-selected={selected}  
                  aria-controls="association-active-panel"
                  tabIndex={selected ? 0 : -1}
                  className={styles.selectorItem}
                  data-selected={selected}
                  onFocus={() => activate(index)}
                  onClick={() => activate(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  <span className={styles.selectorLogoFrame}>
                    <Image
      loading="eager"
                      src={item.logo.src}
                      alt=""
                      width={item.logo.width}
                      height={item.logo.height}
                      className={styles.selectorLogoImage}
                      style={{ width: item.logo.navigationScale }}
                      sizes="112px"
                    />
                  </span>
                  <span className={styles.selectorName}>{item.shortName}</span>

                  {selected ? (
                    <motion.span
                      layoutId="association-active-underline"
                      className={styles.activeUnderline}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 36,
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <span
              key={`progress-${activeIndex}`}
              className={styles.progressFill}
              data-reduced-motion={reduceMotion ? "true" : "false"}
            />
          </div>
        </div>
      </div>

      <p className={styles.screenReaderStatus}>
        Showing {activeIndex + 1} of {items.length}: {story.name}
      </p>
    </div>
  );
}
