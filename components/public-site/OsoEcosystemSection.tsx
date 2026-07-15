import Image from "next/image";
import styles from "@/components/public-site/oso-ecosystem-image.module.css";

export default function OsoEcosystemSection() {
  return (
    <section
      id="ecosystem"
      className={styles.section}
      aria-labelledby="ecosystem-title"
    >
      <h2 id="ecosystem-title" className={styles.srOnly}>
        Our Ecosystem
      </h2>

      <Image
        src="/illustrations/oso/ecosystem-image.png"
        alt="The OMNI Skills Olympiad connected ecosystem"
        width={1536}
        height={1024}
        loading="eager"
        sizes="100vw"
        className={styles.image}
      />
    </section>
  );
}
