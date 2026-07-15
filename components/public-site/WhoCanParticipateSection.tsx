import Image from "next/image";

import styles from "@/components/public-site/who-can-participate-visual.module.css";

type ParticipantCard = {
  title: string;
  detail: string;
  image: string;
  tone: "blue" | "green" | "orange";
};

const PARTICIPANT_CARDS: readonly ParticipantCard[] = [
  {
    title: "Every background",
    detail: "Different educational journeys are welcome.",
    image: "/illustrations/oso/wh-1.png",
    tone: "blue",
  },
  {
    title: "Every discipline",
    detail: "Skills can begin in any field of knowledge.",
    image: "/illustrations/oso/wh-2.png",
    tone: "green",
  },
  {
    title: "Every skill level",
    detail: "Your starting point does not define your potential.",
    image: "/illustrations/oso/wh-3.png",
    tone: "orange",
  },
] as const;

export default function WhoCanParticipateSection() {
  return (
    <section
      id="participants"
      data-theme="light"
      className={styles.section}
      aria-labelledby="participants-title"
    >
      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Who can participate?</p>

          <h2 id="participants-title" className={styles.title}>
            A Platform for the Skilled
          </h2>
        </header>

        <div className={styles.cardGrid}>
          {PARTICIPANT_CARDS.map((card) => (
            <article
              key={card.title}
              className={styles.card}
              data-tone={card.tone}
            >
              <div className={styles.visual}>
                <Image
                  src={card.image}
                  alt=""
                  width={1600}
                  height={1200}
                  loading="eager"
                  sizes="(max-width: 720px) 88vw, (max-width: 1080px) 44vw, 29vw"
                  className={styles.visualImage}
                  aria-hidden="true"
                />
              </div>

              <div className={styles.cardBody}>
                <h3>{card.title}</h3>
                <span className={styles.cardAccent} aria-hidden="true" />
                <p>{card.detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.statement}>
          <span>Begin where you are</span>

          <span
            className={styles.statementDivider}
            aria-hidden="true"
          />

          <strong>Build what comes next.</strong>
        </div>
      </div>
    </section>
  );
}
