import AssociationStoryRail from "@/components/public-site/AssociationStoryRail";
import PublicSectionIntro from "@/components/public-site/PublicSectionIntro";
import styles from "@/components/public-site/associations-section.module.css";
import { associationStories } from "@/data/association-stories";

export default function AssociationsSection() {
  return (
    <section id="associations" className={styles.section}>
      <div className={styles.sectionGrid} aria-hidden="true" />
      <div className={styles.sectionAurora} aria-hidden="true" />
      <div className={styles.sectionParticles} aria-hidden="true" />

      <div className={styles.container}>
        <PublicSectionIntro
          eyebrow="Our trusted associations"
          title="One ecosystem, strengthened by trusted organisations."
          description="Academic, industry, professional, and technology organisations each add a distinct layer of credibility, relevance, and opportunity to OSO."
          tone="dark"
          align="left"
        />

        <AssociationStoryRail items={associationStories} />
      </div>
    </section>
  );
}
