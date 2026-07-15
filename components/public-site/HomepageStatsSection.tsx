import HomepageHeroStats from "@/components/public-site/HomepageHeroStats";
import styles from "@/components/public-site/public-hero-showcase.module.css";

export default function HomepageStatsSection() {
  return (
    <section
      className={styles.detachedStatsSection}
      aria-label="OSO platform statistics"
    >
      <div className={styles.detachedStatsInner}>
        <HomepageHeroStats />
      </div>
    </section>
  );
}
