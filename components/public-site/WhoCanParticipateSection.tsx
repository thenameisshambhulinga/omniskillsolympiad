import styles from "@/components/public-site/phase-three-storytelling.module.css";

const PARTICIPANT_POINTS = [
  {
    title: "Every background",
    detail: "Different educational journeys are welcome.",
  },
  {
    title: "Every discipline",
    detail: "Skills can begin in any field of knowledge.",
  },
  {
    title: "Every skill level",
    detail: "Your starting point does not define your potential.",
  },
  {
    title: "One shared platform",
    detail: "Practice, compete, grow, and move forward together.",
  },
] as const;

export default function WhoCanParticipateSection() {
  return (
    <section
      id="participants"
      className={styles.participantsSection}
      aria-labelledby="participants-title"
    >
      <div className={styles.sectionAmbient} aria-hidden="true" />

      <div className={styles.storyContainer}>
        <header className={styles.participantsHeader}>
          <p className={styles.eyebrow}>
            Who can participate?
          </p>

          <h2 id="participants-title">
            A Platform for the Skilled
          </h2>
        </header>

        <div className={styles.entryJourney}>
          {PARTICIPANT_POINTS.map((point) => (
            <article
              key={point.title}
              className={styles.entryStop}
            >
              <div className={styles.entryContent}>
                <h3>{point.title}</h3>
                <p>{point.detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.participantsStatement}>
          <span>BEGIN WHERE YOU ARE</span>
          <strong>Build what comes next.</strong>
        </div>
      </div>
    </section>
  );
}
