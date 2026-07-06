import AudienceValueSection from "@/components/public-site/AudienceValueSection";
import EcosystemExperience from "@/components/public-site/EcosystemExperience";
import JourneyFlow from "@/components/public-site/JourneyFlow";
import PublicHero from "@/components/public-site/PublicHero";
import WhyOsoSection from "@/components/public-site/WhyOsoSection";
import WhoWeAreSection from "@/components/public-site/WhoWeAreSection";
import {
  FinalGatewaySection,
} from "@/components/public-site/PublicStorySections";
import styles from "@/components/public-site/public-site.module.css";
import AssociationsSection from "@/components/public-site/AssociationsSection";

export default function PublicHomePage() {
  return (
    <div id="main-content" tabIndex={-1} className={styles.page}>
      <PublicHero />
      <WhoWeAreSection />
      <WhyOsoSection />
      <EcosystemExperience />
      <JourneyFlow />
      <AudienceValueSection />
      <AssociationsSection />
      <FinalGatewaySection />
    </div>
  );
}
