// import Image from "next/image";

// import styles from "@/components/public-site/oso-philosophy-grid.module.css";

// type StatementItem = {
//   key: "vision" | "mission" | "values";
//   // label: "VISION" | "MISSION" | "VALUES";
//   image: string;
//   title: string;
//   description: string;
// };

// type PhilosophyItem = {
//   key: "philosophy";
//   // label: "PHILOSOPHY";
//   image: string;
//   points: readonly string[];
// };

// type FoundationItem = StatementItem | PhilosophyItem;

// const FOUNDATION_ITEMS: readonly FoundationItem[] = [
//   {
//     key: "vision",
//     // label: "VISION",
//     image: "/illustrations/oso/vision.png",
//     title: "A globally recognized skills ecosystem.",
//     description:
//       "To build a globally recognized skills ecosystem that empowers learners through practical experiences, innovation, collaboration, and lifelong learning, creating confident individuals ready to contribute to society and the future workforce.",
//   },
//   {
//     key: "mission",
//     // label: "MISSION",
//     image: "/illustrations/oso/mission.png",
//     title: "Bridge education and real-world opportunity.",
//     description:
//       "To bridge the gap between education and real-world opportunities by providing structured competitions, competency-based learning, mentorship, industry engagement, and recognition that inspires continuous growth.",
//   },
//   {
//     key: "values",
//     // label: "VALUES",
//     image: "/illustrations/oso/values.png",
//     title: "Potential becomes impact through culture.",
//     description:
//       "We believe every individual has the potential to make a difference. We are committed to fostering a culture of continuous learning, innovation, integrity, collaboration, inclusivity, and excellence, empowering learners to transform their skills into meaningful opportunities, impactful careers, and lasting contributions to society.",
//   },
//   {
//     key: "philosophy",
//     // label: "PHILOSOPHY",
//     image: "/illustrations/oso/philosophy.png",
//     title: "Skills for Today. Leaders for Tomorrow.",
//     description:
//       "We believe every learner has unique talent, every talent deserves an opportunity, and every opportunity begins with believing in yourself.",
//   },
// ] as const;

// export default function OsoPhilosophySection() {
//   return (
//     <section
//   id="philosophy"
//   className={styles.section}
// >
//       <span
//         id="vision-mission-values"
//         className={styles.anchorTarget}
//         aria-hidden="true"
//       />

//       <div className={styles.backgroundPattern} aria-hidden="true" />

//       <div className={styles.container}>
     

//         <div className={styles.foundationGrid}>
//           {FOUNDATION_ITEMS.map((item) => (
//             <article
//               key={item.key}
//               className={styles.foundationItem}
//               data-tone={item.key}
//             >
//               <div className={styles.iconDock}>
//                 <div className={styles.iconCrop}>
//                   <Image
//                     src={item.image}
//                     alt=""
//                     width={240}
//                     height={240}
//                     loading="eager"
//                     sizes="(max-width: 680px) 42vw, (max-width: 1120px) 22vw, 12vw"
//                     className={styles.foundationImage}
//                     aria-hidden="true"
//                   />
//                 </div>
//               </div>

//               <div className={styles.contentPanel}>
              
//                 {"points" in item ? (
//                   <div className={styles.philosophyContent}>
//                     {item.points.map((point) => (
//                       <p
//                         key={point}
//                         className={styles.philosophyPoint}
//                       >
//                         {point}
//                       </p>
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     <h4 className={styles.itemTitle}>
//                       {item.title}
//                     </h4>

//                     <p className={styles.itemDescription}>
//                       {item.description}
//                     </p>
//                   </>
//                 )}
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import Image from "next/image";

import styles from "@/components/public-site/oso-philosophy-grid.module.css";

type FoundationItem = {
  key: "vision" | "mission" | "values" | "philosophy";

  image: string;
  title: string;
  description: string;
};

const FOUNDATION_ITEMS: readonly FoundationItem[] = [
  {
    key: "vision",
    
    image: "/illustrations/oso/vision.png",
    title: "A globally recognized skills ecosystem.",
    description:
      "To build a globally recognized skills ecosystem that empowers learners through practical experiences, innovation, collaboration, and lifelong learning, creating confident individuals ready to contribute to society and the future workforce.",
  },
  {
    key: "mission",
   
    image: "/illustrations/oso/mission.png",
    title: "Bridge education and real-world opportunity.",
    description:
      "To bridge the gap between education and real-world opportunities by providing structured competitions, competency-based learning, mentorship, industry engagement, and recognition that inspires continuous growth.",
  },
  {
    key: "values",
  
    image: "/illustrations/oso/values.png",
    title: "Potential becomes impact through culture.",
    description:
      "We believe every individual has the potential to make a difference. We are committed to fostering a culture of continuous learning, innovation, integrity, collaboration, inclusivity, and excellence, empowering learners to transform their skills into meaningful opportunities, impactful careers, and lasting contributions to society.",
  },
  {
    key: "philosophy",
   
    image: "/illustrations/oso/philosophy.png",
    title: "Skills for Today. Leaders for Tomorrow.",
    description:
      "We believe every learner has unique talent, every talent deserves an opportunity, and every opportunity begins with believing in yourself.",
  },
] as const;

export default function OsoPhilosophySection() {
  return (
    <section
      id="philosophy"
      className={styles.section}
      aria-labelledby="foundation-title"
    >
      <span
        id="vision-mission-values"
        className={styles.anchorTarget}
        aria-hidden="true"
      />

      <div className={styles.backgroundPattern} aria-hidden="true" />

      <div className={styles.container}>
        

        <div className={styles.foundationGrid}>
          {FOUNDATION_ITEMS.map((item) => (
            <article
              key={item.key}
              className={styles.foundationItem}
              data-tone={item.key}
            >
              <div className={styles.iconDock}>
                <div className={styles.iconCrop}>
                  <Image
                    src={item.image}
                    alt=""
                    width={240}
                    height={240}
                    loading="eager"
                    sizes="(max-width: 680px) 42vw, (max-width: 1120px) 22vw, 12vw"
                    className={styles.foundationImage}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className={styles.contentPanel}>
              
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <p className={styles.itemDescription}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}