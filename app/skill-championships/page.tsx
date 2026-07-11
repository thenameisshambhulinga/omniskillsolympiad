import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Building2,
  Code2,
  Cpu,
  Palette,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

import styles from "./skill-championships.module.css";

type Championship = {
  title: string;
  branch: string;
  description: string;
  icon: LucideIcon;
  tone: "green" | "blue" | "orange" | "purple" | "amber" | "cyan";
  status: string;
};

const championships: Championship[] = [
  {
    title: "Skill on Circuit",
    branch: "ECE, EEE, EIE",
    description:
      "Electronics, embedded systems, IoT, signal processing, hardware design, PCB development, and practical circuit engineering.",
    icon: Cpu,
    tone: "green",
    status: "Flagship championship",
  },
  {
    title: "Skill on Code",
    branch: "CSE, ISE, IT",
    description:
      "Programming, algorithms, software engineering, web systems, artificial intelligence, machine learning, and cyber security.",
    icon: Code2,
    tone: "blue",
    status: "Software pathway",
  },
  {
    title: "Skill on Build",
    branch: "Civil Engineering",
    description:
      "Structures, construction technology, BIM, surveying, geotechnical engineering, and sustainable infrastructure.",
    icon: Building2,
    tone: "orange",
    status: "Infrastructure pathway",
  },
  {
    title: "Skill on Design",
    branch: "Mechanical Engineering",
    description:
      "Machine design, CAD and CAE, manufacturing, robotics, industrial automation, and practical product development.",
    icon: Palette,
    tone: "purple",
    status: "Design pathway",
  },
  {
    title: "Skill on Energy",
    branch: "EEE, Energy Systems",
    description:
      "Power systems, electrical drives, renewable energy, control systems, smart grids, and industrial energy engineering.",
    icon: Zap,
    tone: "amber",
    status: "Energy pathway",
  },
  {
    title: "Skill on Intelligence",
    branch: "AI, ML, Data",
    description:
      "Artificial intelligence, machine learning, data engineering, analytics, intelligent systems, and responsible innovation.",
    icon: BrainCircuit,
    tone: "cyan",
    status: "Intelligence pathway",
  },
];

export default function SkillChampionshipsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.gridBackground} aria-hidden="true" />
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft aria-hidden="true" />
          Back to OSO home
        </Link>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Sparkles aria-hidden="true" />
            Every discipline. One connected ecosystem.
          </span>

          <h1>Explore OSO Skill Championships</h1>

          <p>
            Choose the engineering pathway that matches your discipline,
            interests, and future ambitions. Each championship connects
            learning, practical challenges, protected assessment, competition,
            evaluation, and recognition.
          </p>
        </div>
      </header>

      <section
        className={styles.championshipGrid}
        aria-label="Available OSO skill championships"
      >
        {championships.map((championship, index) => {
          const Icon = championship.icon;

          return (
            <article
              key={championship.title}
              className={styles.card}
              data-tone={championship.tone}
            >
              <div className={styles.cardTop}>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.status}>
                  {championship.status}
                </span>
              </div>

              <span className={styles.icon}>
                <Icon aria-hidden="true" />
              </span>

              <h2>{championship.title}</h2>
              <strong>{championship.branch}</strong>
              <p>{championship.description}</p>

              <Link
                href="/login"
                className={styles.cardAction}
                aria-label={`Enter OSO for ${championship.title}`}
              >
                Enter this championship
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </section>

      <section className={styles.bottomCta}>
        <div>
          <span>Ready to begin?</span>
          <h2>Build your engineering identity through OSO.</h2>
          <p>
            Register once, complete your profile, and enter the connected OSO
            learning and competition ecosystem.
          </p>
        </div>

        <div className={styles.bottomActions}>
          <Link href="/" className={styles.secondaryButton}>
            Return home
          </Link>

          <Link href="/login" className={styles.primaryButton}>
            Register Now
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}