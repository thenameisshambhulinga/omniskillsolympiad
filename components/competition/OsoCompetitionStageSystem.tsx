"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BrainCircuit,
  CircuitBoard,
  GraduationCap,
  Lightbulb,
  Trophy,
} from "lucide-react";

const stages = [
  {
    id: "stage-1",
    label: "Stage 01",
    title: "Electronics Fundamentals Screening",
    description:
      "Lab-based screening focused on component recognition, circuit theory, analog electronics, digital systems and troubleshooting.",
    format: "Lab",
    icon: CircuitBoard,
  },
  {
    id: "stage-2",
    label: "Stage 02",
    title: "Workshop & Technical Demonstration",
    description:
      "Mentor-led technical engagement, guided implementation and practical engineering demonstrations.",
    format: "Workshop",
    icon: GraduationCap,
  },
  {
    id: "stage-3",
    label: "Stage 03",
    title: "Practical Skillathon Evaluation",
    description:
      "Hands-on embedded systems, debugging, PCB implementation and electronics practical evaluation.",
    format: "Assessment",
    icon: BrainCircuit,
  },
  {
    id: "stage-4",
    label: "Final Stage",
    title: "WorldSkills Talent Selection",
    description:
      "High-potential students move toward advanced mentorship, finishing school and WorldSkills preparation pathways.",
    format: "Selection",
    icon: Trophy,
  },
];

export default function OsoCompetitionStageSystem() {
  return (
    <section className="relative z-10 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
              Competition Structure
            </p>

            <h2 className="oso-heading mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Multi-stage evaluation ecosystem.
            </h2>

            <p className="mt-4 text-lg font-medium leading-8 text-slate-600">
              OSO competitions move from fundamentals to practical
              demonstration, evaluation and WorldSkills-oriented recognition.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-yellow-700">
            <Lightbulb className="h-4 w-4" />
            Skill to recognition
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {stages.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <motion.article
                key={stage.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{
                  duration: 0.42,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/78 p-6 shadow-[0_20px_58px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_26px_74px_rgba(15,23,42,0.095)] sm:p-7"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.07),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_34%)]"
                />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </div>

                      <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                        {stage.label}
                      </p>
                    </div>

                    <h3 className="oso-heading mt-5 text-2xl font-black text-slate-950">
                      {stage.title}
                    </h3>

                    <p className="mt-3 text-base font-medium leading-8 text-slate-600">
                      {stage.description}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-2xl border border-slate-200 bg-white/80 px-6 py-5 text-center shadow-sm backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      Format
                    </p>

                    <p className="mt-2 text-2xl font-black text-slate-950">
                      {stage.format}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Tracked
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}