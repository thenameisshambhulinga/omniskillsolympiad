"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type { OsoTone } from "@/components/oso/OsoGlassSurface";
import OsoGlassSurface, {
  getToneClass,
} from "@/components/oso/OsoGlassSurface";

type OsoExpandableSurfaceProps = {
  eyebrow: string;
  title: string;
  summary: string;
  icon: ReactNode;
  children: ReactNode;
  tone?: OsoTone;
  defaultOpen?: boolean;
};

export default function OsoExpandableSurface({
  eyebrow,
  title,
  summary,
  icon,
  children,
  tone = "blue",
  defaultOpen = false,
}: OsoExpandableSurfaceProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <OsoGlassSurface hover={false} className="overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-blue-50/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${getToneClass(
              tone,
            )}`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              {eyebrow}
            </p>

            <h3 className="oso-heading mt-1 text-xl font-black text-slate-950 sm:text-2xl">
              {title}
            </h3>

            <p className="mt-2 max-w-4xl text-sm font-semibold leading-7 text-slate-600">
              {summary}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`mt-2 h-5 w-5 shrink-0 text-slate-400 transition duration-300 group-hover:text-blue-700 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
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
            <div className="border-t border-slate-200 p-5">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </OsoGlassSurface>
  );
}