import Image from "next/image";

import styles from "@/components/public-site/about-why-oso.module.css";

export default function WhoWeAreSection() {
  return (
    <section
      id="about"
      className={styles.aboutSection}
      aria-labelledby="about-oso-title"
    >
      <div className={styles.aboutTexture} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <header className={styles.aboutHeader}>
          <p className={styles.sectionEyebrow}>About OSO</p>

          <h2
            id="about-oso-title"
            className={styles.aboutTitle}
          >
            OMNI Skills Olympiad(OSO)
          </h2>
        </header>

        <div className={styles.aboutImageLayout}>
          <div className={styles.aboutEditorial}>
            <div className={styles.aboutCopy}>
              <p className={styles.aboutLead}>
                The OMNI Skills Olympiad is a national multidisciplinary
                skills competition designed to identify, nurture and
                celebrate talent across diverse domains.
              </p>

              <p>
                It brings together learners from different educational
                backgrounds and disciplines, providing equal opportunities
                to learn, compete, grow and excel.
              </p>

              <p>
                Whether you are passionate about creating, solving complex
                problems, making or fixing things, helping people, using
                technology, working with tools, collaborating in teams,
                leading others, communicating ideas, building innovations,
                working outdoors or exploring any field of skill and
                knowledge, the OMNI Skills Olympiad provides a platform to
                learn, build, compete, innovate and unlock infinite
                opportunities.
              </p>
            </div>
          </div>

          <div className={styles.aboutImageColumn}>
            <Image
              src="/illustrations/oso/about-image.png"
              alt="OMNI Skills Olympiad multidisciplinary learning and innovation ecosystem"
              width={2508}
              height={2508}
              loading="eager"
              sizes="(max-width: 900px) 100vw, 46vw"
              className={styles.aboutMainImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
