import {
  ArrowUpRight,
  HelpCircle,
  MessageCircleQuestion,
} from "lucide-react";

import styles from "@/components/public-site/phase-three-storytelling.module.css";

const faqs = [
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
      className={styles.faqSection}
      aria-labelledby="faq-title"
    >
      <div className={styles.storyContainer}>
        <header className={styles.faqHeader}>
          <div>
            <p className={styles.eyebrow}>Frequently asked questions</p>
            <h2 id="faq-title">Questions before you begin?</h2>
          </div>

          <div className={styles.faqIntro}>
            <MessageCircleQuestion aria-hidden="true" />
            <p>
              Start with the essentials. Program-specific rules remain available
              in each official championship announcement.
            </p>
          </div>
        </header>

        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{faq.question}</strong>
                <HelpCircle aria-hidden="true" />
              </summary>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
                <ArrowUpRight aria-hidden="true" />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
