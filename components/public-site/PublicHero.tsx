"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, LockKeyhole, Sparkles } from "lucide-react";

import InteractiveNarrativeFlow from "@/components/public-site/InteractiveNarrativeFlow";
import { omniFrameworkFlow } from "@/data/omni-framework-flow";
import { heroContent } from "@/data/public-site";
import styles from "@/components/public-site/public-site.module.css";

export default function PublicHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className={`${styles.section} ${styles.hero}`}>
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20 xl:px-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className={styles.heroIntro}
        >
          <div className={styles.heroEyebrow}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {heroContent.eyebrow}
          </div>

          <h1 className={styles.heroNarrativeTitle}>
            <span>{heroContent.title.prefix}</span>{" "}
            <span className={styles.heroNarrativeAccent}>
              {heroContent.title.accent}
            </span>
          </h1>

          <p className={styles.heroNarrativeDescription}>
            {heroContent.description}
          </p>

          <div className={styles.heroActions}>
            <a href={heroContent.primaryCta.href} className={styles.heroPrimaryCta}>
              {heroContent.primaryCta.label}
              <ArrowDown aria-hidden="true" />
            </a>

            <Link href={heroContent.platformCta.href} className={styles.heroSecondaryCta}>
              {heroContent.platformCta.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.heroAccessNote}>
            <LockKeyhole aria-hidden="true" />
            <span>{heroContent.publicNote}</span>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.72,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={styles.heroFlowWrap}
        >
          <InteractiveNarrativeFlow config={omniFrameworkFlow} />
        </motion.div>
      </div>
    </section>
  );
}
