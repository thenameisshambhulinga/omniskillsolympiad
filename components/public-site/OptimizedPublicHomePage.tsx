"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Code2,
  Cpu,
  Factory,
  GraduationCap,
  Handshake,
  HardHat,
  Lightbulb,
  Medal,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import styles from "@/components/public-site/optimized-public-home.module.css";

type Tone =
  | "green"
  | "blue"
  | "violet"
  | "orange"
  | "rose"
  | "cyan"
  | "amber";

const capabilities = [
  {
    title: "Daily Challenges",
    detail: "Practice consistently",
    icon: BookOpenCheck,
  },
  {
    title: "Proctored Assessments",
    detail: "Prove your skills",
    icon: ShieldCheck,
  },
  {
    title: "National Competitions",
    detail: "Compete with purpose",
    icon: Trophy,
  },
  {
    title: "Rankings & Recognition",
    detail: "Track visible progress",
    icon: BarChart3,
  },
] as const;

const potentialCards = [
  {
    title: "Practice",
    description:
      "Learn by solving meaningful engineering problems every day.",
    icon: BookOpenCheck,
    tone: "green" satisfies Tone,
  },
  {
    title: "Prove",
    description:
      "Validate knowledge through secure, structured, proctored assessments.",
    icon: ShieldCheck,
    tone: "blue" satisfies Tone,
  },
  {
    title: "Progress",
    description:
      "Advance through competitions, rankings, feedback, and recognition.",
    icon: BarChart3,
    tone: "violet" satisfies Tone,
  },
] as const;

const programmeCards = [
  {
    title: "Skill on Circuit",
    discipline: "ECE, EEE, EIE",
    description:
      "Electronics, embedded systems, IoT, signal processing, and hardware design.",
    icon: CircuitBoard,
    tone: "green" satisfies Tone,
    status: "Flagship programme",
  },
  {
    title: "Skill on Code",
    discipline: "CSE, ISE, IT",
    description:
      "Programming, algorithms, web systems, cybersecurity, and software engineering.",
    icon: Code2,
    tone: "blue" satisfies Tone,
    status: "Planned pathway",
  },
  {
    title: "Skill on Build",
    discipline: "Civil",
    description:
      "Structures, construction systems, BIM, surveying, and sustainable infrastructure.",
    icon: HardHat,
    tone: "orange" satisfies Tone,
    status: "Planned pathway",
  },
  {
    title: "Skill on Design",
    discipline: "Mechanical",
    description:
      "Machine design, CAD/CAE, manufacturing systems, robotics, and automation.",
    icon: Cpu,
    tone: "violet" satisfies Tone,
    status: "Planned pathway",
  },
  {
    title: "Skill on Energy",
    discipline: "Chemical",
    description:
      "Power systems, drives, renewable energy, controls, and industrial automation.",
    icon: Zap,
    tone: "amber" satisfies Tone,
    status: "Planned pathway",
  },
  {
    title: "Skill on Intelligence",
    discipline: "AI / ML",
    description:
      "Artificial intelligence, data science, analytics, and intelligent systems.",
    icon: BrainCircuit,
    tone: "cyan" satisfies Tone,
    status: "Planned pathway",
  },
] as const;

const journeySteps = [
  {
    title: "Create Your Engineering Identity",
    description: "Build your OSO profile and choose a focused pathway.",
    icon: Users,
    tone: "green" satisfies Tone,
  },
  {
    title: "Practice Daily",
    description: "Solve guided challenges and strengthen practical skills.",
    icon: BookOpenCheck,
    tone: "blue" satisfies Tone,
  },
  {
    title: "Prove Your Skills",
    description: "Take protected assessments and generate credible evidence.",
    icon: ShieldCheck,
    tone: "violet" satisfies Tone,
  },
  {
    title: "Compete Nationally",
    description: "Participate in structured competitions and showcase talent.",
    icon: Trophy,
    tone: "orange" satisfies Tone,
  },
  {
    title: "Benchmark Performance",
    description: "Track rankings, compare performance, and improve continuously.",
    icon: BarChart3,
    tone: "rose" satisfies Tone,
  },
  {
    title: "Earn Recognition",
    description: "Build a record of certificates, badges, and achievements.",
    icon: Medal,
    tone: "cyan" satisfies Tone,
  },
  {
    title: "Unlock Opportunities",
    description: "Move toward internships, mentorship, projects, and careers.",
    icon: Rocket,
    tone: "violet" satisfies Tone,
  },
] as const;

const opportunityCards = [
  {
    title: "Industry Internships",
    description:
      "Work with organisations and gain meaningful real-world exposure.",
    icon: Building2,
  },
  {
    title: "Career Opportunities",
    description:
      "Build visibility with employers through evidence-backed performance.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Industry Mentorship",
    description:
      "Learn from experienced professionals who can guide your development.",
    icon: Handshake,
  },
  {
    title: "Industry Visits",
    description:
      "Explore professional environments beyond the classroom.",
    icon: Factory,
  },
  {
    title: "National Recognition",
    description:
      "Earn recognition through credible performance, competition, and impact.",
    icon: Medal,
  },
] as const;

const progressionSteps = [
  {
    number: "01",
    title: "Identity",
    subtitle: "Profile & OSO ID",
    description:
      "Build a persistent engineering identity and select your pathway.",
    icon: Users,
    tone: "green" satisfies Tone,
  },
  {
    number: "02",
    title: "Practice",
    subtitle: "Guided skill practice",
    description:
      "Strengthen capability through recurring, discipline-focused challenges.",
    icon: BookOpenCheck,
    tone: "blue" satisfies Tone,
  },
  {
    number: "03",
    title: "Assess",
    subtitle: "Protected assessments",
    description:
      "Generate credible performance evidence through structured evaluation.",
    icon: ShieldCheck,
    tone: "violet" satisfies Tone,
  },
  {
    number: "04",
    title: "Compete",
    subtitle: "Purposeful competition",
    description:
      "Apply skills in progressively challenging competitive environments.",
    icon: Trophy,
    tone: "orange" satisfies Tone,
  },
  {
    number: "05",
    title: "Benchmark",
    subtitle: "Performance intelligence",
    description:
      "Compare, analyse, and improve using continuous performance feedback.",
    icon: BarChart3,
    tone: "green" satisfies Tone,
  },
  {
    number: "06",
    title: "Recognise",
    subtitle: "Recognition & progression",
    description:
      "Turn achievement into meaningful recognition and future opportunities.",
    icon: Medal,
    tone: "amber" satisfies Tone,
  },
] as const;

const partnerLogos = [
  { src: "/bcic.png", alt: "BCIC" },
  { src: "/fkcci.png", alt: "FKCCI" },
  { src: "/ieee.png", alt: "IEEE" },
  { src: "/iesa.png", alt: "IESA" },
  { src: "/inbcc.png", alt: "INBCC" },
  { src: "/nasscom.png", alt: "NASSCOM" },
 
  { src: "/sims-logo.png", alt: "SiMS" },

] as const;

function useRevealObserver() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-oso-reveal]"),
    );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-oso-visible", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function ProgressiveGrowthModel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.72;
      const end = -rect.height * 0.32;
      const value = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, value)));
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ecosystem"
      className={`${styles.section} ${styles.progressionSection}`}
      data-oso-reveal
    >
      <div className={styles.sectionHeading}>
        <span className={styles.kicker}>What OSO connects</span>
        <h2>A progressive skill-development ecosystem.</h2>
        <p>
          Every stage remains connected, building one continuous engineering
          journey instead of disconnected events.
        </p>
      </div>

      <div className={styles.progressionStage}>
        <div className={styles.progressionRail} aria-hidden="true">
          <span
            className={styles.progressionFill}
            style={{ "--oso-progress": progress } as CSSProperties}
          />
        </div>

        <div className={styles.progressionGrid}>
          {progressionSteps.map((step, index) => {
            const Icon = step.icon;
            const activationPoint = index / Math.max(1, progressionSteps.length - 1);
            const active = progress >= activationPoint - 0.04;

            return (
              <article
                key={step.number}
                className={`${styles.progressionCard} ${
                  active ? styles.progressionCardActive : ""
                }`}
                data-tone={step.tone}
              >
                <div className={styles.progressionNode}>
                  <Icon aria-hidden="true" />
                </div>
                <span className={styles.progressionNumber}>{step.number}</span>
                <span className={styles.progressionSubtitle}>
                  {step.subtitle}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className={styles.cardArrow} aria-hidden="true">
                  <ArrowRight />
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function OptimizedPublicHomePage() {
  useRevealObserver();

  const repeatedLogos = useMemo(
    () => [...partnerLogos, ...partnerLogos],
    [],
  );

  return (
    <div id="main-content" className={styles.page}>
      <section id="home" className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy} data-oso-reveal>
            <span className={styles.heroKicker}>
              <Sparkles aria-hidden="true" />
              Beyond classrooms
            </span>

            <h1>
              The Playground of <span>Future Innovators</span>
            </h1>

            <p className={styles.heroDescription}>
              Practice every day. Prove your skills. Compete with purpose.
              Build a visible engineering journey through continuous learning,
              protected assessment, meaningful competition, and recognition.
            </p>

            <div className={styles.capabilityGrid}>
              {capabilities.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className={styles.capabilityCard}>
                    <span className={styles.capabilityIcon}>
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.heroActions}>
              <a href="#ecosystem" className={styles.primaryButton}>
                Explore the Ecosystem
                <ArrowRight aria-hidden="true" />
              </a>

              <a href="#journey" className={styles.secondaryButton}>
                How OSO Works
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.heroVisual} data-oso-reveal>
            <div className={styles.heroVisualHalo} aria-hidden="true" />

            <div className={styles.heroImageCard}>
              <Image
                src="/illustrations/oso/laptop-exploerer.png"
                alt="Engineering learner exploring a connected skill journey"
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 52vw"
                className={styles.heroImage}
              />
            </div>

            <div className={styles.heroSignalCard}>
              <Lightbulb aria-hidden="true" />
              <div>
                <strong>One ecosystem</strong>
                <span>Practice â†’ Assess â†’ Compete â†’ Improve</span>
              </div>
            </div>

            <div className={styles.heroOutcomeStrip}>
              <span>Daily practice</span>
              <span>Credible evidence</span>
              <span>Visible progression</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="who-we-are"
        className={`${styles.section} ${styles.potentialSection}`}
        data-oso-reveal
      >
        <div className={styles.potentialIntro}>
          <span className={styles.kicker}>Why engineering deserves more</span>
          <h2>We exist to unlock your true potential.</h2>
          <p>
            OSO is more than a competition website. It is a continuous
            engineering development ecosystem designed around learning,
            assessment, competition, benchmarking, and opportunity.
          </p>
        </div>

        <div className={styles.potentialGrid}>
          {potentialCards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={styles.liftCard}
                data-tone={item.tone}
              >
                <span className={styles.largeIcon}>
                  <Icon aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className={styles.cardArrow} aria-hidden="true">
                  <ArrowRight />
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="why-oso"
        className={`${styles.section} ${styles.differenceSection}`}
        data-oso-reveal
      >
        <div className={styles.sectionHeadingCentered}>
          <span className={styles.kicker}>One place. Every possibility.</span>
          <h2>What makes OSO different?</h2>
        </div>

        <div className={styles.comparisonGrid}>
          <article className={styles.comparisonCard}>
            <span className={styles.comparisonLabel}>Typical event model</span>
            <ul>
              <li>One-time competition</li>
              <li>Registration followed by a single event</li>
              <li>Static certificates</li>
              <li>One leaderboard</li>
              <li>Limited feedback</li>
              <li>Disconnected disciplines</li>
            </ul>
          </article>

          <div className={styles.vsBadge}>VS</div>

          <article className={styles.comparisonCardStrong}>
            <span className={styles.comparisonLabelStrong}>
              Omni Skills Olympiad
            </span>
            <ul>
              <li>Continuous learning journey</li>
              <li>Practice â†’ Assess â†’ Compete â†’ Improve</li>
              <li>Persistent skill profile</li>
              <li>Multi-level progression</li>
              <li>Continuous analytics and feedback</li>
              <li>Multidisciplinary ecosystem</li>
            </ul>
          </article>

          <article className={styles.purposeCard}>
            <span>Compete with purpose</span>
            <h3>Every challenge should move you toward something bigger.</h3>
            <Rocket aria-hidden="true" />
          </article>
        </div>
      </section>

      <section
        id="programs"
        className={`${styles.section} ${styles.programmesSection}`}
        data-oso-reveal
      >
        <div className={styles.sectionHeadingCentered}>
          <span className={styles.kicker}>
            Every discipline. One ecosystem.
          </span>
          <h2>Choose your engineering path.</h2>
          <p>
            Skill on Circuit is the current flagship programme. Additional
            discipline pathways are planned as the ecosystem grows.
          </p>
        </div>

        <div className={styles.programmeGrid}>
          {programmeCards.map((programme) => {
            const Icon = programme.icon;

            return (
              <article
                key={programme.title}
                className={styles.programmeCard}
                data-tone={programme.tone}
              >
                <div className={styles.programmeTop}>
                  <span className={styles.programmeIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.programmeStatus}>
                    {programme.status}
                  </span>
                </div>

                <h3>{programme.title}</h3>
                <strong>{programme.discipline}</strong>
                <p>{programme.description}</p>

                <a href="#contact" className={styles.inlineLink}>
                  Explore pathway
                  <ArrowRight aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="journey"
        className={`${styles.section} ${styles.journeySection}`}
        data-oso-reveal
      >
        <div className={styles.sectionHeadingCentered}>
          <span className={styles.kicker}>Your journey begins here</span>
          <h2>How your OSO journey works.</h2>
        </div>

        <div className={styles.journeyPath}>
          {journeySteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className={styles.journeyStep}
                data-tone={step.tone}
              >
                <span className={styles.journeyNode}>
                  <Icon aria-hidden="true" />
                </span>
                <span className={styles.journeyNumber}>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.opportunitiesSection} data-oso-reveal>
        <div className={styles.opportunityIntro}>
          <span className={styles.darkKicker}>Real perks. Real impact.</span>
          <h2>Your skills can take you further than you imagine.</h2>
          <p>
            Strong performance can create visibility for internships,
            mentorship, professional exposure, recognition, and career
            pathways.
          </p>
          <Link href="/auth/continue" className={styles.primaryButton}>
            Enter OSO Platform
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.opportunityGrid}>
          {opportunityCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className={styles.opportunityCard}>
                <Icon aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}

          <article className={styles.worldSkillsCard}>
            <GraduationCap aria-hidden="true" />
            <span>Advanced opportunity pathway</span>
            <h3>WorldSkills-aligned progression</h3>
            <p>
              Exceptional performers may become eligible for consideration
              within relevant official selection and partner pathways, subject
              to applicable rules and processes.
            </p>
          </article>
        </div>
      </section>

      <ProgressiveGrowthModel />

      <section
        id="associations"
        className={`${styles.section} ${styles.partnerSection}`}
        data-oso-reveal
      >
        <div className={styles.sectionHeading}>
          <span className={styles.kicker}>Stronger together</span>
          <h2>Associations and ecosystem organisations.</h2>
          <p>
            A growing network of organisations connected to engineering,
            learning, industry, innovation, and skill development.
          </p>
        </div>

        <div className={styles.marqueeViewport}>
          <div className={styles.marqueeTrack}>
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className={styles.logoCard}
                aria-hidden={index >= partnerLogos.length}
              >
                <Image
                  src={logo.src}
                  alt={index < partnerLogos.length ? logo.alt : ""}
                  width={190}
                  height={80}
                  sizes="190px"
                  className={styles.partnerLogo}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={styles.finalCta} data-oso-reveal>
        <div>
          <span className={styles.darkKicker}>Ready to take the next step?</span>
          <h2>Your future in engineering starts with one purposeful step.</h2>
        </div>

        <div className={styles.finalActions}>
          <a href="#ecosystem" className={styles.lightButton}>
            Explore the Ecosystem
            <ArrowRight aria-hidden="true" />
          </a>

          <Link href="/auth/continue" className={styles.primaryButton}>
            Enter OSO Platform
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
