"use client";

import { useEffect, useRef, useState } from "react";

import styles from "@/components/public-site/public-experience-layer.module.css";

const SECTION_ACCENTS = [
  "37 99 235",
  "124 58 237",
  "249 115 22",
  "14 165 233",
  "34 197 94",
  "236 72 153",
  "79 70 229",
  "8 145 178",
] as const;

export default function PublicExperienceLayer() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [sectionCount, setSectionCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const anchor = anchorRef.current;
    const shell = anchor?.parentElement;

    if (!anchor || !(shell instanceof HTMLElement)) {
      return;
    }

    const sections = Array.from(
      shell.querySelectorAll<HTMLElement>(":scope > section"),
    );

    if (sections.length === 0) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    shell.classList.add(styles.experienceShell);
    shell.dataset.osoExperience = "true";
    setSectionCount(sections.length);

    sections.forEach((section, index) => {
      section.dataset.osoEnhanced = "true";
      section.dataset.osoIndex = String(index + 1);
      section.style.setProperty(
        "--oso-section-accent-rgb",
        SECTION_ACCENTS[index % SECTION_ACCENTS.length],
      );
      section.style.setProperty(
        "--oso-reveal-x",
        index % 2 === 0 ? "-18px" : "18px",
      );

      if (reducedMotionQuery.matches) {
        section.dataset.osoSeen = "true";
      }
    });

    const observer = reducedMotionQuery.matches
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                (entry.target as HTMLElement).dataset.osoSeen = "true";
              }
            });
          },
          {
            threshold: 0.12,
            rootMargin: "0px 0px -12% 0px",
          },
        );

    sections.forEach((section) => observer?.observe(section));

    let scrollFrame = 0;
    let pointerFrame = 0;

    const updateScrollExperience = () => {
      cancelAnimationFrame(scrollFrame);

      scrollFrame = requestAnimationFrame(() => {
        const documentElement = document.documentElement;
        const scrollableDistance = Math.max(
          1,
          documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(
          1,
          Math.max(0, window.scrollY / scrollableDistance),
        );

        shell.style.setProperty(
          "--oso-scroll-progress",
          progress.toFixed(4),
        );
        shell.style.setProperty(
          "--oso-scroll-shift",
          `${Math.round(progress * 120)}px`,
        );

        const focusLine = window.innerHeight * 0.44;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        sections.forEach((section, index) => {
          const rectangle = section.getBoundingClientRect();
          const sectionFocusPoint =
            rectangle.top +
            Math.min(rectangle.height * 0.34, window.innerHeight * 0.36);
          const distance = Math.abs(sectionFocusPoint - focusLine);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        sections.forEach((section, index) => {
          section.dataset.osoCurrent =
            index === nearestIndex ? "true" : "false";
        });

        setActiveIndex(nearestIndex);
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (
        reducedMotionQuery.matches ||
        event.pointerType === "touch"
      ) {
        return;
      }

      cancelAnimationFrame(pointerFrame);

      pointerFrame = requestAnimationFrame(() => {
        shell.style.setProperty(
          "--oso-pointer-x",
          `${event.clientX}px`,
        );
        shell.style.setProperty(
          "--oso-pointer-y",
          `${event.clientY}px`,
        );
      });
    };

    window.addEventListener("scroll", updateScrollExperience, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollExperience);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    const readyFrame = requestAnimationFrame(() => {
      shell.dataset.osoReady = "true";
      updateScrollExperience();
    });

    return () => {
      cancelAnimationFrame(readyFrame);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);

      observer?.disconnect();

      window.removeEventListener(
        "scroll",
        updateScrollExperience,
      );
      window.removeEventListener(
        "resize",
        updateScrollExperience,
      );
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      sections.forEach((section) => {
        delete section.dataset.osoEnhanced;
        delete section.dataset.osoSeen;
        delete section.dataset.osoCurrent;
        delete section.dataset.osoIndex;
        section.style.removeProperty(
          "--oso-section-accent-rgb",
        );
        section.style.removeProperty("--oso-reveal-x");
      });

      delete shell.dataset.osoExperience;
      delete shell.dataset.osoReady;
      shell.classList.remove(styles.experienceShell);
      shell.style.removeProperty("--oso-scroll-progress");
      shell.style.removeProperty("--oso-scroll-shift");
      shell.style.removeProperty("--oso-pointer-x");
      shell.style.removeProperty("--oso-pointer-y");
    };
  }, []);

  return (
    <div
      ref={anchorRef}
      className={styles.experienceAnchor}
      aria-hidden="true"
    >
      <div className={styles.edgeCircuitField} />
      <div className={styles.pointerAura} />

      <div className={styles.ambientOrb} data-orb="one" />
      <div className={styles.ambientOrb} data-orb="two" />
      <div className={styles.ambientOrb} data-orb="three" />

      <div className={styles.storyRail}>
        <div className={styles.storyRailTrack}>
          <div className={styles.storyRailProgress} />
        </div>

        <div className={styles.storyRailDots}>
          {Array.from({ length: sectionCount }, (_, index) => (
            <span
              key={index}
              className={styles.storyRailDot}
              data-active={index === activeIndex}
            />
          ))}
        </div>

        <span className={styles.storyRailStart}>START</span>
        <span className={styles.storyRailEnd}>FORWARD</span>
      </div>
    </div>
  );
}
