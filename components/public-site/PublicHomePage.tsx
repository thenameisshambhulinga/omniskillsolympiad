import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HeroCapabilityStatsSection from "@/components/public-site/HeroCapabilityStatsSection";
import HomepageStatsSection from "@/components/public-site/HomepageStatsSection";
import OsoFaqSection from "@/components/public-site/OsoFaqSection";
import OsoJourneyWorksSection from "@/components/public-site/OsoJourneyWorksSection";
import OsoPhilosophySection from "@/components/public-site/OsoPhilosophySection";
import OsoRoadmapSection from "@/components/public-site/OsoRoadmapSection";
import PublicHeroShowcase from "@/components/public-site/PublicHeroShowcase";
import WhatWillYouGainSection from "@/components/public-site/WhatWillYouGainSection";
import WhoCanParticipateSection from "@/components/public-site/WhoCanParticipateSection";
import WhoWeAreSection from "@/components/public-site/WhoWeAreSection";
import WhyOsoSection from "@/components/public-site/WhyOsoSection";
import foundationStyles from "@/components/public-site/public-site-foundation.module.css";
import styles from "@/components/public-site/public-site.module.css";

const associationLogos = [
  { name: "BCIC", src: "/bcic.png" },
  { name: "FKCCI", src: "/fkcci.png" },
  { name: "IEEE", src: "/ieee.png" },
  { name: "IESA", src: "/iesa.png" },
  { name: "NASSCOM", src: "/nasscom.png" },
  { name: "VTU", src: "/vtu.png" },
  { name: "SiMS", src: "/sims-logo.png" },
] as const;

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
      <OsoJourneyWorksSection />
      <WhatWillYouGainSection />
      <OsoRoadmapSection />
      <OsoFaqSection />

      <section id="associations" className={styles.osoAssociations}>
        <div className={styles.osoAssociationIntro}>
          <h2>Proud Associations &amp; Partners</h2>
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
                aria-hidden={index >= associationLogos.length || undefined}
              >
                <Image
                  src={item.src}
                  alt={index >= associationLogos.length ? "" : item.name}
                  width={180}
                  height={80}
                  loading="eager"
                  className={styles.osoAssociationLogo}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="platform-entry" className={styles.osoFinalCta}>
        <div className={styles.osoFinalCtaCopy}>
          <h2>Your future starts with one skill—and one bold step.</h2>
        </div>

        <div className={styles.osoFinalCtaActions}>
          <Link href="/login" className={styles.osoPrimaryBtn}>
            Enter OSO Platform <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
