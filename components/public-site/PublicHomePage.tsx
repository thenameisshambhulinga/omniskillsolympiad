import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";

import OsoJourneyWorksSection from "@/components/public-site/OsoJourneyWorksSection";
import styles from "@/components/public-site/public-site.module.css";
import WhoWeAreSection from "@/components/public-site/WhoWeAreSection";
import WhyOsoSection from "@/components/public-site/WhyOsoSection";
import WhatWillYouGainSection from "@/components/public-site/WhatWillYouGainSection";
import OsoEcosystemSection from "@/components/public-site/OsoEcosystemSection";
import WhoCanParticipateSection from "@/components/public-site/WhoCanParticipateSection";
import OsoPhilosophySection from "@/components/public-site/OsoPhilosophySection";
import VisionMissionValuesSection from "@/components/public-site/VisionMissionValuesSection";
import OsoRoadmapSection from "@/components/public-site/OsoRoadmapSection";
import OsoFaqSection from "@/components/public-site/OsoFaqSection";
import foundationStyles from "@/components/public-site/public-site-foundation.module.css";
import PublicHeroShowcase from "@/components/public-site/PublicHeroShowcase";
import HeroCapabilityStatsSection from "@/components/public-site/HeroCapabilityStatsSection";
import HomepageStatsSection from "@/components/public-site/HomepageStatsSection";
const associationLogos = [
  { name: "BCIC", src: "/bcic.png" },
  { name: "FKCCI", src: "/fkcci.png" },
  { name: "IEEE", src: "/ieee.png" },
  { name: "IESA", src: "/iesa.png" },
  { name: "NASSCOM", src: "/nasscom.png" },
  { name: "VTU", src: "/vtu.png" },
  { name: "SiMS", src: "/sims-logo.png" },
];

export default function PublicHomePage() {
  return (
    <div className={`${styles.osoRedesign} ${foundationStyles.foundationShell}`}>

    <PublicHeroShowcase />

      

    <HeroCapabilityStatsSection />
      <WhoWeAreSection />

      <WhyOsoSection />

      <HomepageStatsSection />

      <WhoCanParticipateSection />

      

      <OsoPhilosophySection />
      {/* <section className={styles.osoDifferent}>
        <p className={styles.osoEyebrowCenter}>One place. Every possibility.</p>
        <h2>What Makes OSO Different?</h2>

        <div className={styles.osoCompareGrid}>
          <article>
            <h3>Most Competition Websites</h3>
            {[
              "One-time event",
              "Registration to competition only",
              "Static certificates",
              "Single leaderboard",
              "Limited feedback",
              "One discipline",
            ].map((item) => (
              <p key={item}>— {item}</p>
            ))}
          </article>

          <div className={styles.osoVs}>VS</div>

          <article className={styles.osoCompareStrong}>
            <h3>Omni Skills Olympiad (OSO)</h3>
            {[
              "Continuous learning journey",
              "Practice → Assess → Compete → Improve",
              "Continuous skill profile",
              "Multi-level progression",
              "Continuous analytics and feedback",
              "Multi-disciplinary ecosystem",
            ].map((item) => (
              <p key={item}>
                <CheckCircle2 aria-hidden="true" /> {item}
              </p>
            ))}
          </article>

          <aside>
            <p>Compete with purpose</p>
            <h3>Every challenge moves you closer to something bigger.</h3>
            <Rocket aria-hidden="true" />
          </aside>
        </div>
      </section> */}

    
      <OsoJourneyWorksSection />

            <WhatWillYouGainSection />


            <VisionMissionValuesSection />
            <OsoEcosystemSection />

            <OsoRoadmapSection />
            
            <OsoFaqSection />
      <section id="associations" className={styles.osoAssociations}>
        <div className={styles.osoAssociationIntro}>
          <h2>Proud Associations & Partners</h2>
          <p>
            A growing network of institutional, industry, and ecosystem
            associations supporting skill development and recognition.
          </p>
        </div>

        <div
          className={styles.osoAssociationLogoStrip}
          aria-label="Associations and Partners supporting OSO"
        >
          <div className={styles.osoAssociationLogoTrack}>
            {[...associationLogos, ...associationLogos].map((item, index) => (
              <span
                key={`${item.name}-${index}`}
                className={styles.osoAssociationLogoItem}
                aria-hidden={index >= associationLogos.length ? true : undefined}
              >
                <Image
      loading="eager"
                  src={item.src}
                  alt={index >= associationLogos.length ? "" : item.name}
                  width={180}
                  height={80}
                  className={styles.osoAssociationLogo}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="platform-entry" className={styles.osoFinalCta}>
        <div>
          <h2>Your future starts with one skill—and one bold step.</h2>
        </div>

        <div>
          <a href="#ecosystem" className={styles.osoSecondaryBtn}>
            Explore the Ecosystem
          </a>
          <Link href="/login" className={styles.osoPrimaryBtn}>
            Enter OSO Platform <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}


