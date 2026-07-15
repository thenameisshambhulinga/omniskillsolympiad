import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
  Trophy,
  TrendingUp,
} from "lucide-react";

import styles from "@/components/public-site/public-hero-showcase.module.css";

const CAPABILITIES = [
  {
    title: "Daily Challenges",
    icon: CalendarDays,
    tone: "violet",
  },
  {
    title: "Proctored Assessments",
    icon: ShieldCheck,
    tone: "indigo",
  },
  {
    title: "Competitions",
    icon: Trophy,
    tone: "blue",
  },
  {
    title: "Rankings & Recognition",
    icon: TrendingUp,
    tone: "green",
  },
  {
    title: "Internships & Placements",
    icon: BriefcaseBusiness,
    tone: "yellow",
  },
  {
    title: "Mentorship",
    icon: Award,
    tone: "orange",
  },
  {
    title: "OSO Community",
    icon: GraduationCap,
    tone: "red",
  },
  {
    title: "Entrepreneurship Journey",
    icon: Lightbulb,
    tone: "amber",
  },
] as const;

export default function HeroCapabilityStatsSection() {
  return (
    <section
      className={styles.credibilitySection}
      aria-labelledby="oso-features-title"
    >
      <div className={styles.credibilityInner}>
        <header className={styles.capabilityHeader}>
          <h2
            id="oso-features-title"
            className={styles.capabilitySectionTitle}
          >
            Features in OSO
          </h2>
        </header>

        <div
          className={styles.capabilityRail}
          aria-label="OSO participant journey capabilities"
        >
          {CAPABILITIES.map((capability) => {
            const Icon = capability.icon;

            return (
              <article
                key={capability.title}
                className={styles.capabilityCard}
                data-tone={capability.tone}
              >
                <span className={styles.capabilityIcon}>
                  <Icon aria-hidden="true" />
                </span>

                <h3 className={styles.capabilityTitle}>
                  {capability.title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
