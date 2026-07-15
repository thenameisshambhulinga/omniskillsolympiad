import styles from "@/components/public-site/phase-three-storytelling.module.css";

const FAQS = [
  {
    question: "Who can participate in OSO?",
    answer:
      "OSO welcomes participants from different educational backgrounds, disciplines, and skill levels. The eligibility published for each championship remains the final reference.",
  },
  {
    question: "Is prior experience required?",
    answer:
      "No single starting level defines the OSO journey. Participants can begin from different levels and use practice, learning resources, and competition pathways to grow.",
  },
  {
    question: "Are competitions individual or team-based?",
    answer:
      "The format can vary by championship and challenge. Each published competition will clearly state whether participation is individual, team-based, or supports both.",
  },
  {
    question: "Will participants receive certificates?",
    answer:
      "Certification and recognition details are announced with each program or competition. Participants should refer to the published rules for the applicable criteria.",
  },
  {
    question: "How are winners evaluated?",
    answer:
      "Evaluation follows the criteria announced for each championship and may consider skill, creativity, technical knowledge, practical execution, and impact.",
  },
  {
    question: "Are competitions available for different age groups?",
    answer:
      "Age and educational eligibility may differ across programs. Every championship will publish its applicable participant category before registration.",
  },
  {
    question: "Can institutions register multiple participants?",
    answer:
      "Institutional participation options and participant limits are defined for each program. Institutions should follow the registration instructions published for that championship.",
  },
  {
    question: "What learning resources are provided?",
    answer:
      "Where applicable, OSO can provide curated learning materials, tutorials, practice opportunities, and industry insights aligned with the participant journey.",
  },
  {
    question: "Are there online and offline competitions?",
    answer:
      "Competition delivery modes may vary. The official announcement for each championship will specify whether activities are online, offline, hybrid, or stage-based.",
  },
  {
    question: "How can organizations partner with OSO?",
    answer:
      "Organizations can use the official OSO contact and association channels to discuss institutional, industry, mentorship, evaluation, or ecosystem collaboration.",
  },
] as const;

export default function OsoFaqSection() {
  return (
    <section
      id="faq"
      data-theme="light"
      className={styles.faqSection}
      aria-labelledby="faq-title"
    >
      <div className={styles.faqBackdrop} aria-hidden="true" />

      <div className={styles.storyContainer}>
        <header className={styles.faqHeader}>
          <p className={styles.eyebrow}>Frequently asked questions</p>
          <h2 id="faq-title">Questions before you begin?</h2>
        </header>

        <div className={styles.faqGrid}>
          {FAQS.map((faqItem, index) => (
            <details key={faqItem.question} className={styles.faqItem}>
              <summary>
                <span className={styles.faqIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{faqItem.question}</strong>
                <span className={styles.faqToggle} aria-hidden="true" />
              </summary>

              <div className={styles.faqAnswer}>
                <p>{faqItem.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
