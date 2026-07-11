import {
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";

import styles from "@/components/public-site/about-why-oso.module.css";

const progression = [
  {
    step: "01",
    title: "Education",
    description: "Education teaches concepts.",
    icon: GraduationCap,
    tone: "orange",
  },
  {
    step: "02",
    title: "Experience",
    description: "Experience builds confidence.",
    icon: BriefcaseBusiness,
    tone: "blue",
  },
  {
    step: "03",
    title: "Skills",
    description: "Skills create opportunities.",
    icon: Target,
    tone: "violet",
  },
] as const;

const learnerBenefits = [
  {
    title: "Apply what they learn",
    icon: BookOpenCheck,
  },
  {
    title: "Build practical skills",
    icon: Wrench,
  },
  {
    title: "Solve real-world challenges",
    icon: Target,
  },
  {
    title: "Learn through hands-on experiences",
    icon: Lightbulb,
  },
  {
    title: "Showcase their talent",
    icon: Trophy,
  },
  {
    title: "Gain recognition",
    icon: Award,
  },
  {
    title: "Prepare for future opportunities",
    icon: Rocket,
  },
] as const;

const philosophyItems = [
  {
    title: "Every talent deserves an opportunity",
    icon: Users,
  },
  {
    title: "Every success starts with believing in yourself",
    icon: Trophy,
  },
  {
    title: "From curiosity to capability",
    icon: Lightbulb,
  },
  {
    title: "From learning to leadership",
    icon: GraduationCap,
  },
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

        <div className={styles.whyLayout}>
          <div className={styles.progressionColumn}>
            <div className={styles.progressionList}>
              {progression.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.step}
                    className={styles.progressionCard}
                    data-tone={item.tone}
                  >
                    <span className={styles.progressionStep}>
                      {item.step}
                    </span>

                    <span className={styles.progressionIcon}>
                      <Icon aria-hidden="true" />
                    </span>

                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}

              <article className={styles.opportunityCard}>
                <span className={styles.opportunityIcon}>
                  <Trophy aria-hidden="true" />
                </span>

                <div>
                  <h3>Opportunities</h3>
                  <p>
                    Unlock your future with every achievement.
                  </p>
                </div>
              </article>
            </div>

            <div
              className={styles.whyImageStage}
              role="img"
              aria-label="Learners preparing for practical skill development and future opportunities"
            >
              <span className={styles.whyImageDots} aria-hidden="true" />
              <span className={styles.whyImageArc} aria-hidden="true" />
              <span className={styles.whyStudentsImage} aria-hidden="true" />
            </div>
          </div>

          <article className={styles.benefitsPanel}>
            <div className={styles.benefitsPanelHeader}>
              <span>
                <Target aria-hidden="true" />
              </span>

              <h3>
                OMNI Skills Olympiad provides a platform where learners can:
              </h3>
            </div>

            <div className={styles.benefitsList}>
              {learnerBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className={styles.benefitRow}
                  >
                    <span>
                      <Icon aria-hidden="true" />
                    </span>

                    <strong>{benefit.title}</strong>

                    <CheckCircle2 aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <div className={styles.philosophyStrip}>
          {philosophyItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={styles.philosophyItem}
              >
                <span>
                  <Icon aria-hidden="true" />
                </span>

                <p>{item.title}</p>
              </article>
            );
          })}
        </div>

        <div className={styles.whyClosing}>
          <Sparkles aria-hidden="true" />

          <strong>
            Because learning becomes meaningful when knowledge is put
            into action.
          </strong>

          <Sparkles aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
