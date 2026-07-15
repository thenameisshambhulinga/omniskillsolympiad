import Image from "next/image";

import styles from "@/components/public-site/what-will-you-gain-visual.module.css";

type OutcomeCard = {
  title: string;
  image: string;
  tone: "blue" | "gold" | "violet" | "orange";
  outcomes: readonly string[];
};

const OUTCOME_CARDS: readonly OutcomeCard[] = [
  {
    title: "Practical Capability",
    image: "/illustrations/oso/wt-4.png",
    tone: "blue",
    outcomes: [
      "Practical Skills",
      "Problem-Solving Ability",
      "Creativity & Innovation",
      "Confidence in Applying Knowledge",
      "Real-World Challenges",
    ],
  },
  {
    title: "Recognition & Credentials",
    image: "/illustrations/oso/wt-1.png",
    tone: "gold",
    outcomes: [
      "National Recognition",
      "Professional Certifications",
      "Project Portfolio",
      "Verified Proof of Skills",
    ],
  },
  {
    title: "People & Collaboration",
    image: "/illustrations/oso/wt-2.png",
    tone: "violet",
    outcomes: [
      "Industry Exposure",
      "Expert Mentorship",
      "Technology Awareness",
      "Networking Opportunities",
      "Leadership Skills",
      "Teamwork Experience",
      "Communication & Collaboration",
    ],
  },
  {
    title: "Future Readiness",
    image: "/illustrations/oso/wt-3.png",
    tone: "orange",
    outcomes: [
      "Entrepreneurial Mindset",
      "Internship Opportunities",
      "Career Readiness",
      "Lifelong Learning Mindset",
    ],
  },
] as const;

export default function WhatWillYouGainSection() {
  return (
    <section
      id="outcomes"
      data-theme="dark"
      className={styles.section}
      aria-labelledby="outcomes-title"
    >
      <div className={styles.gridTexture} aria-hidden="true" />
      <span className={styles.glowLeft} aria-hidden="true" />
      <span className={styles.glowRight} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>What will you gain?</p>

          <h2 id="outcomes-title" className={styles.title}>
            <span>Participating in OSO helps you build</span>
            <span>much more than academic knowledge.</span>
          </h2>
        </header>

        <div className={styles.cardGrid}>
          {OUTCOME_CARDS.map((card) => (
            <article
              key={card.title}
              className={styles.card}
              data-tone={card.tone}
            >
              <div className={styles.visual}>
                <Image
                  src={card.image}
                  alt=""
                  width={1024}
                  height={1024}
                  loading="eager"
                  sizes="(max-width: 720px) 88vw, (max-width: 1180px) 44vw, 22vw"
                  className={styles.visualImage}
                  aria-hidden="true"
                />
              </div>

              <h3>{card.title}</h3>

              <ul>
                {card.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
