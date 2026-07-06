"use client";

import { useState } from "react";

import SectionBackgroundStorytelling from "@/components/public-site/SectionBackgroundStorytelling";
import storyStyles from "@/components/public-site/section-background-storytelling.module.css";
import styles from "@/components/public-site/public-site.module.css";
import { identityContent } from "@/data/public-site";
import { whoWeAreStoryConfig } from "@/data/section-storytelling";

type StoryFocus = "ecosystem" | "vision" | "mission";

function VisionGlyph() {
  return (
    <svg width="31" height="31" viewBox="0 0 31 31" fill="none" aria-hidden="true">
      <circle cx="15.5" cy="15.5" r="10.5" stroke="#8B5CF6" strokeWidth="2" />
      <circle cx="15.5" cy="15.5" r="4" fill="#F6B73C" />
      <path d="M15.5 1.5V6M15.5 25V29.5M1.5 15.5H6M25 15.5H29.5" stroke="#091E42" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MissionGlyph() {
  return (
    <svg width="32" height="31" viewBox="0 0 32 31" fill="none" aria-hidden="true">
      <circle cx="6" cy="16" r="4" fill="#20B8D4" />
      <circle cx="26" cy="7" r="4" fill="#42B883" />
      <circle cx="25" cy="25" r="4" fill="#8B5CF6" />
      <path d="M10 14L22 8.5M10 18L21 23" stroke="#091E42" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function WhoWeAreSection() {
  const [activeFocus, setActiveFocus] = useState<StoryFocus>("ecosystem");

  return (
    <section
      id="who-we-are"
      className={`${styles.section} ${storyStyles.sectionSurface} scroll-mt-24`}
      onPointerLeave={() => setActiveFocus("ecosystem")}
    >
      <SectionBackgroundStorytelling config={whoWeAreStoryConfig} activeTarget={activeFocus} />

      <div className={`${storyStyles.contentLayer} mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24`}>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:gap-20">
          <div
            className={storyStyles.introduction}
            tabIndex={0}
            onPointerEnter={() => setActiveFocus("ecosystem")}
            onFocus={() => setActiveFocus("ecosystem")}
            aria-label="About OMNI Skills Olympiad"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-800">
              {identityContent.eyebrow}
            </p>

            <h2 className={storyStyles.sectionTitle}>{identityContent.title}</h2>

            <p className="mt-5 max-w-xl text-[17px] font-medium leading-7 text-slate-600">
              {identityContent.introduction}
            </p>

            <p className="mt-3 max-w-xl text-[15.5px] font-medium leading-7 text-slate-600">
              {identityContent.supporting}
            </p>

            <blockquote className={storyStyles.motto}>
              <p className="text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-2xl">
                “{identityContent.motto}”
              </p>
              <footer className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                OMNI Skills Olympiad motto
              </footer>
            </blockquote>
          </div>

          <div className={storyStyles.storyColumn}>
            <article
              className={`${storyStyles.storyCard} ${storyStyles.visionCard}`}
              data-active={activeFocus === "vision"}
              tabIndex={0}
              onPointerEnter={() => setActiveFocus("vision")}
              onFocus={() => setActiveFocus("vision")}
              onClick={() => setActiveFocus("vision")}
              aria-label="OMNI Skills Olympiad vision"
            >
              <div className={storyStyles.cardGlyph}><VisionGlyph /></div>
              <p className="relative z-10 text-xs font-black uppercase tracking-[0.14em] text-violet-700">Vision</p>
              <h3 className="relative z-10 mt-3 max-w-[24ch] pr-0 text-[22px] font-black leading-[1.15] tracking-[-0.03em] text-slate-950 sm:pr-16 sm:text-2xl">
                Technical excellence, innovation, and future-ready capability.
              </h3>
              <p className="relative z-10 mt-4 max-w-3xl text-[15.5px] font-medium leading-7 text-slate-600">
                {identityContent.vision}
              </p>
            </article>

            <article
              className={`${storyStyles.storyCard} ${storyStyles.missionCard}`}
              data-active={activeFocus === "mission"}
              tabIndex={0}
              onPointerEnter={() => setActiveFocus("mission")}
              onFocus={() => setActiveFocus("mission")}
              onClick={() => setActiveFocus("mission")}
              aria-label="OMNI Skills Olympiad mission"
            >
              <div className={storyStyles.cardGlyph}><MissionGlyph /></div>
              <p className="relative z-10 text-xs font-black uppercase tracking-[0.14em] text-cyan-700">Mission</p>
              <h3 className="relative z-10 mt-3 max-w-[25ch] pr-0 text-[22px] font-black leading-[1.15] tracking-[-0.03em] text-slate-950 sm:pr-16 sm:text-2xl">
                Turn academic knowledge into practical, measurable engineering progress.
              </h3>
              <p className="relative z-10 mt-4 max-w-3xl text-[15.5px] font-medium leading-7 text-slate-600">
                {identityContent.mission}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
