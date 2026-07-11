"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  CalendarDays,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import InteractiveNarrativeFlow from "@/components/public-site/InteractiveNarrativeFlow";
import { omniFrameworkFlow } from "@/data/omni-framework-flow";
import { heroContent } from "@/data/public-site";
import styles from "@/components/public-site/public-site.module.css";

const capabilities = [
  {
    label: "Daily Challenges",
    description: "Build consistency through focused engineering practice.",
    icon: CalendarDays,
  },
  {
    label: "Proctored Assessments",
    description: "Demonstrate ability through protected evaluations.",
    icon: ShieldCheck,
  },
  {
    label: "National Competitions",
    description: "Apply skills in structured competitive pathways.",
    icon: Trophy,
  },
  {
    label: "Rankings & Recognition",
    description: "Turn performance into visible progression.",
    icon: BarChart3,
  },
] as const;

export default function PublicHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className={`${styles.section} ${styles.hero} ${styles.phaseOneHero}`}
    >
      <div className={styles.phaseOneHeroShell}>
        <div className={styles.phaseOneHeroGrid}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
            className={styles.phaseOneHeroContent}
          >
            <div className={styles.phaseOneEyebrow}>
              <Sparkles aria-hidden="true" />
              <span>{heroContent.eyebrow}</span>
            </div>

            <h1 className={styles.phaseOneTitle}>
              <span>{heroContent.title.prefix}</span>
              <span className={styles.phaseOneTitleAccent}>
                {heroContent.title.accent}
              </span>
            </h1>

            <p className={styles.phaseOneDescription}>
              {heroContent.description}
            </p>

            <div
              className={styles.phaseOneCapabilityGrid}
              aria-label="OMNI Skills Olympiad capabilities"
            >
              {capabilities.map((capability) => {
                const Icon = capability.icon;

                return (
                  <article
                    key={capability.label}
                    className={styles.phaseOneCapabilityCard}
                  >
                    <span className={styles.phaseOneCapabilityIcon}>
                      <Icon aria-hidden="true" />
                    </span>

                    <span className={styles.phaseOneCapabilityCopy}>
                      <strong>{capability.label}</strong>
                      <small>{capability.description}</small>
                    </span>
                  </article>
                );
              })}
            </div>

            <div className={styles.phaseOneActions}>
              <a
                href={heroContent.primaryCta.href}
                className={styles.phaseOnePrimaryAction}
              >
                {heroContent.primaryCta.label}
                <ArrowDown aria-hidden="true" />
              </a>

              <a href="#journey" className={styles.phaseOneSecondaryAction}>
                How OSO works
                <ArrowRight aria-hidden="true" />
              </a>

              <Link
                href={heroContent.platformCta.href}
                className={styles.phaseOnePlatformAction}
              >
                {heroContent.platformCta.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.phaseOneAccessNote}>
              <LockKeyhole aria-hidden="true" />
              <span>{heroContent.publicNote}</span>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.76,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={styles.phaseOneVisualColumn}
          >
            <div className={styles.phaseOneVisualHeader}>
              <div>
                <span>Continuous engineering journey</span>
                <strong>Practice. Prove. Progress.</strong>
              </div>

              <span className={styles.phaseOneLiveBadge}>
                <span aria-hidden="true" />
                OSO ecosystem
              </span>
            </div>

            <div className={styles.phaseOneFlowFrame}>
              <InteractiveNarrativeFlow config={omniFrameworkFlow} />
            </div>

            <div className={styles.phaseOneVisualFooter}>
              <span>One persistent engineering identity</span>
              <span>Multiple discipline pathways</span>
              <span>Evidence-led progression</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
