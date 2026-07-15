import {
  Building2,
  Flag,
  Globe2,
  Handshake,
  Landmark,
  Lightbulb,
  Network,
  Rocket,
} from "lucide-react";

import styles from "@/components/public-site/phase-three-storytelling.module.css";

const roadmap = [
  {
    step: "01",
    title: "Launch of OMNI Skills Olympiad",
    icon: Rocket,
    tone: "orange",
  },
  {
    step: "02",
    title: "Expansion Across Multiple Skill Domains",
    icon: Network,
    tone: "violet",
  },
  {
    step: "03",
    title: "State Championships",
    icon: Landmark,
    tone: "blue",
  },
  {
    step: "04",
    title: "National Championships",
    icon: Flag,
    tone: "pink",
  },
  {
    step: "05",
    title: "Industry Collaboration",
    icon: Handshake,
    tone: "cyan",
  },
  {
    step: "06",
    title: "Innovation & Startup Programs",
    icon: Lightbulb,
    tone: "yellow",
  },
  {
    step: "07",
    title: "International Partnerships",
    icon: Building2,
    tone: "green",
  },
  {
    step: "08",
    title: "Global Skills Recognition",
    icon: Globe2,
    tone: "indigo",
  },
] as const;

export default function OsoRoadmapSection() {
  return (
    <section
      id="roadmap"
      className={styles.roadmapSection}
      aria-labelledby="roadmap-title"
    >
      <div className={styles.roadmapBackdrop} aria-hidden="true" />

      <div className={styles.storyContainer}>
        <header className={styles.roadmapHeader}>
          <div className={styles.roadmapYear} aria-hidden="true">
            <span>2</span>
            <span>0</span>
            <span>2</span>
            <span>6</span>
          </div>

          <div>
            <p className={styles.eyebrow}>Competition roadmap</p>
            <h2 id="roadmap-title">
              From launch to global skills recognition.
            </h2>
            <p>
              One connected route. Eight milestones. A long-term national
              skills ecosystem built to expand responsibly.
            </p>
          </div>
        </header>

        <div className={styles.roadmapJourney}>
          <div className={styles.roadmapTrail} aria-hidden="true" />

          {roadmap.map((milestone, index) => {
            const Icon = milestone.icon;

            return (
              <article
                key={milestone.step}
                className={styles.roadmapMilestone}
                data-tone={milestone.tone}
                data-side={index % 2 === 0 ? "left" : "right"}
              >
                <div className={styles.roadmapPoint}>
                  <Icon aria-hidden="true" />
                </div>

                <div className={styles.roadmapCard}>
                  <span>{milestone.step}</span>
                  <h3>{milestone.title}</h3>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.roadmapDestination}>
          <Globe2 aria-hidden="true" />
          <div>
            <span>THE DESTINATION KEEPS EXPANDING</span>
            <strong>One recognizable OSO ecosystem across disciplines.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
