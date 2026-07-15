import styles from "@/components/public-site/phase-two-sections.module.css";

const outcomeGroups = [
  {
    label: "Practical capability",
    outcomes: [
      "Practical Skills",
      "Problem-Solving Ability",
      "Creativity & Innovation",
      "Confidence in Applying Knowledge",
    ],
  },
  {
    label: "Proof and recognition",
    outcomes: [
      "Industry Exposure",
      "National Recognition",
      "Professional Certifications",
      "Project Portfolio",
    ],
  },
  {
    label: "People and collaboration",
    outcomes: [
      "Networking Opportunities",
      "Leadership Skills",
      "Teamwork Experience",
    ],
  },
  {
    label: "Future readiness",
    outcomes: [
      "Entrepreneurial Mindset",
      "Internship Opportunities",
      "Career Readiness",
    ],
  },
] as const;

export default function WhatWillYouGainSection() {
  return (
    <section
      id="outcomes"
      className={styles.outcomesSection}
      aria-labelledby="outcomes-title"
    >
      <div className={styles.outcomesGridTexture} aria-hidden="true" />
      <span className={styles.outcomesGlowOne} aria-hidden="true" />
      <span className={styles.outcomesGlowTwo} aria-hidden="true" />

      <div className={styles.sectionShell}>
        <header className={styles.outcomesHeader}>
          <p className={styles.darkEyebrow}>
            What will you gain?
          </p>

          <h2 id="outcomes-title" className={styles.darkTitle}>
            Participating in OSO helps you build much more than academic
            knowledge.
          </h2>
        </header>

        <div className={styles.outcomeGroups}>
          {outcomeGroups.map((group) => (
            <article
              key={group.label}
              className={styles.outcomeGroup}
            >
              <h3>{group.label}</h3>

              <ul>
                {group.outcomes.map((outcome) => (
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
