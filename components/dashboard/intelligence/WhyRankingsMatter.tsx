"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const panels = [
  {
    title: "National Ranking",
    copy: "Your current position reflects consistency, accuracy, and challenge participation across the wider student network.",
  },
  {
    title: "Visibility",
    copy: "Better rankings make your profile easier to discover for colleges, mentors, and competition selectors.",
  },
  {
    title: "Competition Access",
    copy: "Higher visibility often opens doors to advanced contests, talent scouts, and performance-based opportunities.",
  },
  {
    title: "WorldSkills Pathway",
    copy: "This momentum supports your path toward stronger engineering recognition, broader networks, and future pathways.",
  },
];

export default function WhyRankingsMatter() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mt-12 rounded-[28px] border border-white/10 bg-white/3 p-5 shadow-[0_18px_50px_rgba(8,15,35,0.35)] backdrop-blur-xl">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
            Ranking Intelligence
          </p>
          <h3 className="mt-2 text-xl font-black text-white">
            Why Rankings Matter
          </h3>
        </div>
        <p className="text-sm text-white/55">Educational accordion</p>
      </div>

      <div className="mt-5 space-y-3">
        {panels.map((panel, index) => {
          const isOpen = index === openIndex;
          return (
            <article
              key={panel.title}
              className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-sm font-black uppercase tracking-[0.18em] text-white">
                  {panel.title}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-100"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-sm leading-6 text-white/75">
                      {panel.copy}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}
