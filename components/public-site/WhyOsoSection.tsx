import Image from "next/image";

import styles from "@/components/public-site/why-oso-clean.module.css";

const OUTCOMES = [
  "Gain recognition",
  "Apply what they learn",
  "Showcase their talent",
  "Build practical skills",
  "Solve real-world challenges",
  "Prepare for future opportunities",
  "Learn through hands-on experiences",
] as const;

export default function WhyOsoSection() {
  return (
    <section
      id="why-oso"
      data-theme="dark"
      className={styles.whySection}
      aria-labelledby="why-oso-title"
    >
      <div className={styles.ambientGrid} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <header className={styles.whyHeader}>
          <p className={styles.sectionEyebrow}>Why OSO?</p>

          <h2 id="why-oso-title" className={styles.whyTitle}>
            <span>Turning Knowledge into Skills.</span>
            <span>Skills into Opportunities.</span>
          </h2>
        </header>

        <div className={styles.whyLayout}>
          <div className={styles.whyImageColumn}>
            <Image
              src="/illustrations/oso/why-oso-image.png"
              alt="Skills developing into practical capability and future opportunities"
              width={1448}
              height={1086}
              loading="eager"
              sizes="(max-width: 900px) 100vw, 46vw"
              className={styles.whyMainImage}
            />
          </div>

          <div className={styles.outcomesArea}>
            <h3>
              OMNI Skills Olympiad provides a platform where learners can:
            </h3>

            <ul className={styles.outcomeList}>
              {OUTCOMES.map((outcome) => (
                <li key={outcome} className={styles.outcomeItem}>
                  <span className={styles.outcomeBullet} aria-hidden="true" />
                  <span className={styles.outcomeText}>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
