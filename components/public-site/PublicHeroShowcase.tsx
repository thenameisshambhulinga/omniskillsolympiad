"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Pause,
  Play,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

import styles from "@/components/public-site/public-hero-showcase.module.css";

const HERO_SLIDES = [
  {
    src: "/illustrations/oso/hero_image1.png",
    alt: "OMNI Skills Olympiad learning and competition ecosystem",
  },
  {
    src: "/illustrations/oso/hero_image2.png",
    alt: "Learners building practical skills through technology and innovation",
  },
  {
    src: "/illustrations/oso/hero_image3.png",
    alt: "National competitions, recognition and future opportunities",
  },
] as const;

const SLIDE_DURATION_MS = 5600;

export default function PublicHeroShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (isPaused || !isPageVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [activeSlide, isPageVisible, isPaused]);

  return (
    <section
      id="home"
      className={styles.heroSection}
      aria-labelledby="oso-hero-title"
    >
      <div className={styles.posterCanvas} aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={styles.posterSlide}
            data-active={index === activeSlide ? "true" : "false"}
            data-slide={index + 1}
          >
            <Image
              priority
              loading="eager"
              fetchPriority="high"
              src={slide.src}
              alt=""
              fill
              quality={82}
              sizes="100vw"
              className={styles.posterImage}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className={styles.readabilityLayer} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          {/* <p className={styles.eyebrow}>OMNI Skills Olympiad</p> */}

          <h1
            id="oso-hero-title"
            className={styles.heroPosterTitle}
          >
            <span className={styles.heroTitleLine}>
              India&apos;s Largest
            </span>
            <span className={styles.heroTitleLine}>
              Skills Olympiad
            </span>
          </h1>

          <p className={styles.tagline}>
            Learn. Build. Compete. Innovate.
          </p>

          <div className={styles.heroNarrative}>
            <p>
              Empowering learners across disciplines through hands-on
              competitions,
              real-world challenges, innovation and industry
              collaboration.
            </p>

            <p>
              Whether you&apos;re a student, learner or a practitioner, the
              OMNI Skills Olympiad (OSO) provides a platform to discover your
              potential, showcase your abilities and prepare for the
              opportunities of tomorrow.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Link href="/login" className={styles.primaryAction}>
              Register Now
              <ArrowRight aria-hidden="true" />
            </Link>

            <Link
              href="/skill-championships"
              className={styles.secondaryAction}
            >
              <Trophy aria-hidden="true" />
              Explore Skill Championships
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.carouselDock}>
        <div className={styles.slideDots} aria-label="Choose hero poster">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={styles.slideDot}
              data-active={index === activeSlide ? "true" : "false"}
              aria-label={`Show hero poster ${index + 1}`}
              aria-pressed={index === activeSlide}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.pauseButton}
          onClick={() => setIsPaused((current) => !current)}
          aria-label={isPaused ? "Resume hero posters" : "Pause hero posters"}
        >
          {isPaused ? (
            <Play aria-hidden="true" />
          ) : (
            <Pause aria-hidden="true" />
          )}
          <span>{isPaused ? "Play" : "Pause"}</span>
        </button>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <span
          key={activeSlide}
          className={styles.progressFill}
          data-paused={isPaused || !isPageVisible ? "true" : "false"}
        />
      </div>

      <div className={styles.semanticPosterDescription}>
        {HERO_SLIDES[activeSlide].alt}
      </div>
    </section>
  );
}
