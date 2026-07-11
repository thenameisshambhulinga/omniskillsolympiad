import {
  ArrowUpRight,
  BarChart3,
  Lightbulb,
  Sparkles,
  Target,
  Users,
  Wrench,
} from "lucide-react";

import styles from "@/components/public-site/about-why-oso.module.css";

const aboutFeatures = [
  {
    title: "Practical Skills",
    description:
      "Real-world challenges that build hands-on capability, creativity, teamwork, innovation, and problem-solving.",
    icon: Wrench,
    tone: "violet",
  },
  {
    title: "Equal Opportunity",
    description:
      "A meaningful platform for learners across educational backgrounds, disciplines, and skill levels.",
    icon: Users,
    tone: "indigo",
  },
  {
    title: "Connected Growth",
    description:
      "Learn, build, compete, innovate, gain recognition, and progress through one connected ecosystem.",
    icon: BarChart3,
    tone: "orange",
  },
] as const;

export default function WhoWeAreSection() {
  return (
    <section
      id="about"
      className={styles.aboutSection}
      aria-labelledby="about-oso-title"
    >
      <div className={styles.aboutTexture} aria-hidden="true" />
      <div className={styles.sectionContainer}>
        <header className={styles.aboutHeader}>
          <span className={styles.sectionEyebrow}>
            <Sparkles aria-hidden="true" />
            About OSO
          </span>

          <h2 id="about-oso-title" className={styles.aboutTitle}>
            What is the{" "}
            <span>OMNI Skills Olympiad?</span>
          </h2>
        </header>

        <div className={styles.aboutLayout}>
          <div className={styles.aboutEditorial}>
            <div className={styles.aboutCopy}>
              <p className={styles.aboutLead}>
                The OMNI Skills Olympiad is a national multidisciplinary
                skills competition designed to identify, nurture, and
                celebrate talent across diverse domains.
              </p>

              <p>
                Unlike traditional competitions that primarily assess
                theoretical knowledge, OSO focuses on practical skills,
                creativity, problem-solving, innovation, teamwork, and
                real-world application.
              </p>

              <p>
                It brings together learners from different educational
                backgrounds and disciplines, providing equal opportunities
                to learn, compete, grow, and excel.
              </p>

              <p>
                Whether you are passionate about creating, solving complex
                problems, making or fixing things, using technology,
                collaborating, leading, communicating ideas, or building
                innovations, OSO provides a platform to learn, build,
                compete, innovate, and unlock infinite opportunities.
              </p>
            </div>

            <div
              className={styles.aboutImageStage}
              role="img"
              aria-label="Students collaborating on a practical engineering and robotics project"
            >
              <span className={styles.imageDots} aria-hidden="true" />
              <span className={styles.imageArc} aria-hidden="true" />
              <span className={styles.aboutStudentsImage} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.aboutFeatureColumn}>
            {aboutFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className={styles.aboutFeature}
                  data-tone={feature.tone}
                >
                  <span className={styles.featureIcon}>
                    <Icon aria-hidden="true" />
                  </span>

                  <div className={styles.featureContent}>
                    <span className={styles.featureNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>

                  <ArrowUpRight
                    className={styles.featureArrow}
                    aria-hidden="true"
                  />
                </article>
              );
            })}

            <blockquote className={styles.aboutQuote}>
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>

              <div>
                <strong>
                  Infinite <span>Opportunities.</span>
                </strong>

                <p>
                  A platform where every learner can discover, demonstrate,
                  and strengthen their potential.
                </p>
              </div>

              <Lightbulb aria-hidden="true" />
            </blockquote>
          </div>
        </div>

        <div className={styles.aboutFooterStrip}>
          <span className={styles.footerStripIcon}>
            <Target aria-hidden="true" />
          </span>

          <div>
            <small>Built for diverse talent</small>
            <strong>There is more than one way to be skilled.</strong>
          </div>

          <div className={styles.aboutKeywords}>
            <span>Creating and building</span>
            <span>Solving complex problems</span>
            <span>Technology and tools</span>
            <span>Teamwork and leadership</span>
            <span>Communicating ideas</span>
            <span>Innovation and exploration</span>
          </div>
        </div>
      </div>
    </section>
  );
}
