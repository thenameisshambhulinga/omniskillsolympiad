import Image from "next/image";

import styles from "@/components/public-site/phase-three-storytelling.module.css";

export default function OsoRoadmapSection() {
  return (
    <section
      id="roadmap"
      className={`${styles.roadmapSection} ${styles.roadmapImageSection}`}
      aria-labelledby="roadmap-title"
    >
      <div className={styles.storyContainer}>
        <h2 id="roadmap-title" className={styles.srOnly}>
          Competition Roadmap
        </h2>

        <div className={styles.roadmapImageFrame}>
          <Image
            src="/illustrations/oso/competition-roadmap-banner.png"
            alt="Competition Roadmap showing eight OSO milestones from launch to global skills recognition."
            width={1823}
            height={863}
            priority
            className={styles.roadmapImage}
          />
        </div>
      </div>
    </section>
  );
}
