"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  Cpu,
  FileCheck2,
  Flag,
  GraduationCap,
  Handshake,
  Lightbulb,
  Presentation,
  Rocket,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import styles from "@/components/public-site/oso-journey-works.module.css";

type StageTone =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

type JourneyStage = {
  step: string;
  title: string;
  description: string;
  tone: StageTone;
  icon: LucideIcon;
};

const journeyStages: JourneyStage[] = [
  {
    step: "01",
    title: "Registration",
    description: "Sign up and become a part of the OSO community.",
    tone: "red",
    icon: ClipboardCheck,
  },
  {
    step: "02",
    title: "Orientation",
    description: "Get to know OSO, its platform, guidelines and opportunities.",
    tone: "orange",
    icon: Presentation,
  },
  {
    step: "03",
    title: "Learning Resources",
    description: "Access curated learning materials, tutorials and industry insights.",
    tone: "yellow",
    icon: BookOpenCheck,
  },
  {
    step: "04",
    title: "Skill Challenges",
    description: "Take on skill-based challenges to test and improve your abilities.",
    tone: "green",
    icon: Target,
  },
  {
    step: "05",
    title: "Practical Competitions",
    description: "Apply your skills in real-world problem solving and hands-on competitions.",
    tone: "cyan",
    icon: Cpu,
  },
  {
    step: "06",
    title: "Innovation Showcase",
    description: "Present your projects and innovative ideas to the expert panel and community.",
    tone: "blue",
    icon: Lightbulb,
  },
  {
    step: "07",
    title: "Evaluation",
    description: "Judged on skill, creativity, technical knowledge and impact.",
    tone: "indigo",
    icon: FileCheck2,
  },
  {
    step: "08",
    title: "Recognition & Awards",
    description: "Top performers are recognized and awarded for their excellence.",
    tone: "purple",
    icon: Trophy,
  },
  {
    step: "09",
    title: "National Progression",
    description: "Winners advance to national-level events and bigger opportunities.",
    tone: "pink",
    icon: Flag,
  },
];

const journeyMilestones = [
  { label: "Start your journey" },
  { label: "Explore & Learn" },
  { label: "Institutions & Mentors" },
  { label: "Compete & Collaborate"},
  { label: "Showcase & Inspire" },
  { label: "Excel & Achieve" },
  { label: "Advance & Succeed" },
] satisfies Array<{
  label: string;
 
}>;

export default function OsoJourneyWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="journey"
      className={styles.section}
      aria-labelledby="oso-journey-title"
    >
      <div className={styles.generatedBackgroundLayer} aria-hidden="true">
        <Image
      loading="eager"
          src="/illustrations/oso/oso-journey-background.png"
          alt=""
          fill
          sizes="100vw"
          draggable={false}
          className={styles.generatedBackgroundImage}
        />
      </div>

      <span className={styles.backgroundVeil} aria-hidden="true" />
      <span className={styles.cornerGlowLeft} aria-hidden="true" />
      <span className={styles.cornerGlowRight} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.headingCircuit} aria-hidden="true" />

            <h2 id="oso-journey-title" className={styles.title}>
              HOW OSO WORKS
            </h2>

            <span
              className={`${styles.headingCircuit} ${styles.headingCircuitRight}`}
              aria-hidden="true"
            />
          </div>

          <p className={styles.brushTitle}>
            <span>Your Journey Towards Excellence</span>
          </p>

          <p className={styles.description}>
            Every stage is designed to help participants improve, regardless of
            their starting level.
          </p>
        </header>

        <div className={styles.board}>
          <div className={styles.desktopFlow} aria-label="How OSO works stages">
            {journeyStages.map((stage, index) => {
              const Icon = stage.icon;
              const active = index === activeIndex;
              const reached = index <= activeIndex;

              return (
                <motion.button
                  key={stage.step}
                  type="button"
                  className={styles.stageCard}
                  data-tone={stage.tone}
                  data-active={active}
                  data-reached={reached}
                  aria-label={`${stage.step} ${stage.title}. ${stage.description}`}
                  aria-pressed={active}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.38,
                    delay: reduceMotion ? 0 : index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={styles.stageNumber}>{stage.step}</span>
                  <span className={styles.iconBadge} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </motion.button>
              );
            })}
          </div>

          <div className={styles.mobileFlow} aria-label="How OSO works stages">
            {journeyStages.map((stage, index) => {
              const Icon = stage.icon;
              const active = index === activeIndex;
              const reached = index <= activeIndex;

              return (
                <motion.button
                  key={stage.step}
                  type="button"
                  className={styles.mobileStage}
                  data-tone={stage.tone}
                  data-active={active}
                  data-reached={reached}
                  aria-label={`${stage.step} ${stage.title}. ${stage.description}`}
                  aria-pressed={active}
                  initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.34,
                    delay: reduceMotion ? 0 : index * 0.035,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={styles.mobileNumber}>{stage.step}</span>
                  <span className={styles.mobileIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={styles.mobilePanel}>
                    <strong>{stage.title}</strong>
                    <span>{stage.description}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className={styles.milestoneStrip} aria-label="OSO broader journey">
            {journeyMilestones.map((milestone, index) => {
              // const Icon = milestone.icon;

              return (
                <span
                  key={milestone.label}
                  className={styles.milestone}
                  // data-tone={milestone.tone}
                >
                  {/* <Icon aria-hidden="true" /> */}
                  <span>{milestone.label}</span>
                  {index < journeyMilestones.length - 1 ? (
                    <ArrowRight aria-hidden="true" />
                  ) : null}
                </span>
              );
            })}
          </div>

          <div className={styles.bottomBadge}>
            <strong>ONE PLATFORM.</strong>
            <span data-highlight="gold">ENDLESS OPPORTUNITIES.</span>
            <span data-highlight="green">LIMITLESS GROWTH.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
