"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type ExpandableTone = "blue" | "yellow" | "emerald" | "cyan" | "slate";

export type OsoExpandableGlassItem = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  icon: ReactNode;
  tone?: ExpandableTone;
  content: ReactNode;
};

type OsoExpandableGlassSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: OsoExpandableGlassItem[];
  defaultOpenId?: string | null;
};

export default function OsoExpandableGlassSection({
  eyebrow,
  title,
  description,
  items,
  defaultOpenId = null,
}: OsoExpandableGlassSectionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/78 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.07),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.09),transparent_32%)]"
      />

      <div className="relative z-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-700">
            {eyebrow}
          </p>

          <h2 className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>

          <p className="mt-3 max-w-3xl text-base font-medium leading-8 text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-7 grid gap-4">
          {items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/82 shadow-sm backdrop-blur-xl"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="group flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-blue-50/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <div className="flex min-w-0 gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${getToneClass(
                        item.tone ?? "blue",
                      )}`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                        {item.eyebrow}
                      </p>

                      <h3 className="oso-heading mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-4xl text-sm font-semibold leading-7 text-slate-600">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`mt-2 h-5 w-5 shrink-0 text-slate-400 transition duration-300 group-hover:text-blue-700 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-200 p-5">
                        {item.content}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getToneClass(tone: ExpandableTone) {
  if (tone === "yellow") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "cyan") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  if (tone === "slate") {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}