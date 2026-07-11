"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  MapPinned,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import HomepageHeroStats from "@/components/public-site/HomepageHeroStats";
import WhoWeAreSection from "@/components/public-site/WhoWeAreSection";
import WhyOsoSection from "@/components/public-site/WhyOsoSection";
import OsoJourneyWorksSection from "@/components/public-site/OsoJourneyWorksSection";
import styles from "@/components/public-site/public-site.module.css";
import heroStyles from "@/components/public-site/next-gen-public-home.module.css";

const whyCards = [
  {
    title: "Practice",
    icon: BookOpen,
    text: "Learn by solving real engineering problems every day.",
  },
  {
    title: "Prove",
    icon: ShieldCheck,
    text: "Validate your knowledge through secure, proctored assessments.",
  },
  {
    title: "Progress",
    icon: BarChart3,
    text: "Advance through competitions, rankings, and recognition.",
  },
];


const perks = [
  {
    title: "Industry Internships",
    text: "Work with leading companies and gain real experience.",
    icon: Building2,
  },
  {
    title: "Career Opportunities",
    text: "Get noticed by employers through evidence-backed performance.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Industry Mentorship",
    text: "Learn from industry experts who guide your growth.",
    icon: Users,
  },
  {
    title: "Industry Visits",
    text: "Explore real-world engineering environments beyond classrooms.",
    icon: MapPinned,
  },
  {
    title: "National Recognition",
    text: "Top performers earn visibility through achievement, competition, and impact.",
    icon: Trophy,
    highlight: true,
  },
];

const ecosystem = [
  "Identity",
  "Practice",
  "Assess",
  "Compete",
  "Benchmark",
  "Recognise",
];

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
    <main className={styles.osoRedesign}>
      

    <section id="home" className={heroStyles.hero}>
  <div className={heroStyles.heroArtwork}>
    <Image
      src="/illustrations/oso/image_illustrated.png"
      alt="India's Largest Skills Olympiad, where learners learn, build, compete and innovate through engineering challenges"
      fill
      priority
      sizes="100vw"
      draggable={false}
      className={heroStyles.heroImage}
    />
  </div>

  <div className={heroStyles.heroDock}>
    <div className={heroStyles.statsWrap}>
      <HomepageHeroStats />
    </div>

    <div className={heroStyles.actions}>
      <Link href="/login" className={heroStyles.primaryButton}>
        Register Now
        <ArrowRight aria-hidden="true" />
      </Link>

     <Link
  href="/skill-championships"
  className={styles.osoSecondaryBtn}
>
  <PlayCircle aria-hidden="true" />
  Explore Skill Championships
</Link>
    </div>
  </div>
</section>

      <WhoWeAreSection />

      <WhyOsoSection />

    
      <OsoJourneyWorksSection />

      <section className={styles.osoPerks}>
        <div className={styles.osoPerksIntro}>
          <h2>Your Skills Can Take You Further Than You Imagine.</h2>
          <p>
            Top performers earn more than recognition. They unlock real-world
            opportunities that shape their future.
          </p>
        <Link
  href="/skill-championships"
  className={styles.osoPrimaryBtn}
>
  View Skill Championships
  <ArrowRight aria-hidden="true" />
</Link>
        </div>

        <div className={styles.osoPerksGrid}>
          {perks.map((perk) => {
            const Icon = perk.icon;

            return (
              <article
                key={perk.title}
                className={perk.highlight ? styles.osoPerkHighlight : ""}
              >
                <Icon aria-hidden="true" />
                <h3>{perk.title}</h3>
                <p>{perk.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="ecosystem" className={styles.osoConnected}>
        <div className={styles.osoSectionIntro}>
          <h2>A connected skill-development system.</h2>
          <p>
            OSO links identity, guided practice, protected assessment,
            competition, benchmarking, and recognition into one continuous
            participant journey.
          </p>
        </div>

        <div className={styles.osoEcosystemFlow}>
          {ecosystem.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
              <p>
                {item === "Identity" && "Build your OSO profile and path."}
                {item === "Practice" && "Daily challenges to level up."}
                {item === "Assess" && "Secure and fair evaluations."}
                {item === "Compete" && "Showcase. Compete. Excel."}
                {item === "Benchmark" && "Track, compare, and improve."}
                {item === "Recognise" && "Achievements that open doors."}
              </p>
            </article>
          ))}
        </div>
      </section>

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
          aria-label="OSO associations and partners"
        >
          <div className={styles.osoAssociationLogoTrack}>
            {[...associationLogos, ...associationLogos].map((item, index) => (
              <span
                key={`${item.name}-${index}`}
                className={styles.osoAssociationLogoItem}
                aria-hidden={index >= associationLogos.length ? true : undefined}
              >
                <Image
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

      <section id="contact" className={styles.osoFinalCta}>
        <div>
          <h2>Your future in engineering starts with a single step.</h2>
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
    </main>
  );
}


