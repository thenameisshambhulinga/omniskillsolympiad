"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, CheckCircle2, GraduationCap, Handshake, UsersRound, type LucideIcon } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import PublicSectionIntro from "@/components/public-site/PublicSectionIntro";
import { audienceGroups } from "@/data/public-site";

const audienceIcons: readonly LucideIcon[] = [GraduationCap, Building2, UsersRound, Handshake] as const;

export default function AudienceValueSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const activeAudience = audienceGroups[activeIndex];
  const ActiveIcon = audienceIcons[activeIndex];

  function selectTab(index: number, moveFocus = false) {
    const boundedIndex = (index + audienceGroups.length) % audienceGroups.length;
    setActiveIndex(boundedIndex);
    if (moveFocus) window.requestAnimationFrame(() => tabRefs.current[boundedIndex]?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault(); selectTab(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault(); selectTab(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault(); selectTab(0, true);
    } else if (event.key === "End") {
      event.preventDefault(); selectTab(audienceGroups.length - 1, true);
    }
  }

  return (
    <section id="audiences" className="scroll-mt-24 border-y border-slate-200/80 bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <PublicSectionIntro
          eyebrow="Value across the ecosystem"
          title="Different stakeholders. One shared engineering mission."
          description="OSO gives students, institutions, mentors, and industry a clear role in one practical engineering ecosystem."
        />

        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div role="tablist" aria-label="Audience value" className="grid border-b border-slate-200 sm:grid-cols-2 xl:grid-cols-4">
            {audienceGroups.map((audience, index) => {
              const Icon = audienceIcons[index];
              const active = activeIndex === index;

              return (
                <button
                  key={audience.id}
                  ref={(element) => { tabRefs.current[index] = element; }}
                  id={`audience-tab-${audience.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`audience-panel-${audience.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectTab(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`flex min-h-[72px] items-center gap-3 border-b border-slate-200 px-5 py-3 text-left outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-100 sm:border-r xl:border-b-0 ${active ? "bg-blue-50 text-blue-900" : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
                >
                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm font-black">{audience.label}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeAudience.id}
            id={`audience-panel-${activeAudience.id}`}
            role="tabpanel"
            aria-labelledby={`audience-tab-${activeAudience.id}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:p-9"
          >
            <div className="relative overflow-hidden rounded-[1.4rem] bg-[#0b1730] p-6 text-white sm:p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-300/16 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-violet-300/14 blur-3xl" />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0b1730]">
                <ActiveIcon className="h-5 w-5" />
              </span>
              <p className="relative mt-6 text-xs font-black uppercase tracking-[0.14em] text-cyan-200">{activeAudience.label}</p>
              <h3 className="relative mt-2 text-2xl font-black leading-tight tracking-[-0.03em] text-white">{activeAudience.headline}</h3>
              <p className="relative mt-4 text-[15px] font-medium leading-7 text-white/70">{activeAudience.description}</p>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">Value areas</p>
              <ul className="mt-4 space-y-3">
                {activeAudience.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-blue-700" />
                    <span className="text-[15.5px] font-semibold leading-7 text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
