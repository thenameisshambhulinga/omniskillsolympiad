import {
  Award,
  BookOpenCheck,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Wrench,
} from "lucide-react";

import styles from "@/components/public-site/about-why-oso.module.css";

const learnerBenefits = [
  { title: "Apply what they learn", icon: BookOpenCheck },
  { title: "Build practical skills", icon: Wrench },
  { title: "Solve real-world challenges", icon: Target },
  { title: "Learn through hands-on experiences", icon: Lightbulb },
  { title: "Showcase their talent", icon: Trophy },
  { title: "Gain recognition", icon: Award },
  { title: "Prepare for future opportunities", icon: Rocket },
] as const;

export default function WhyOsoSection() {
  return (
    <section
      id="why-oso"
      className={styles.whySection}
      aria-labelledby="why-oso-title"
    >
      <div className={styles.whyTexture} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <header className={styles.whyHeader}>
          <span className={styles.sectionEyebrow}>
            <Sparkles aria-hidden="true" />
            Why OSO?
          </span>

          <h2 id="why-oso-title" className={styles.whyTitle}>
            Because <span>Skills Shape the Future</span>
          </h2>

          <p>
            Turning Knowledge into Skills. Skills into Opportunities.
          </p>
        </header>

        <div className={styles.whyRefinedLayout}>
          <div className={styles.whyIllustrationSurface} aria-hidden="true">
            <div className={styles.whyIllustrationGlow} />
            <div
              className={styles.progressionArtwork}
              role="img"
              aria-label="Education, experience, skills, and opportunities progression pathway"
            />
          </div>

          <article className={styles.refinedBenefitsPanel}>
            <div className={styles.benefitsPanelHeader}>
              <span>
                <Target aria-hidden="true" />
              </span>

              <h3>
                OMNI Skills Olympiad provides a platform where learners can:
              </h3>
            </div>

            <div className={styles.refinedBenefitsGrid}>
              {learnerBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className={styles.refinedBenefitItem}
                  >
                    <span>
                      <Icon aria-hidden="true" />
                    </span>

                    <strong>{benefit.title}</strong>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <div className={styles.whyClosing}>
          <Sparkles aria-hidden="true" />
          <strong>
            Because learning becomes meaningful when knowledge is put into action.
          </strong>
          <Sparkles aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
