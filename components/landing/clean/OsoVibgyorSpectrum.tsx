"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Crown,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";

import { vibgyorLevels } from "@/data/omni-ecosystem";

const vibgyorMeta = {
  Violet: {
    role: "Explorer",
    short: "Learn fundamentals",
    image: "/vibyor-img/violet.jpg",
    detail:
      "Students begin with engineering fundamentals, core curiosity, basic concepts and first-stage technical confidence. This level converts normal learning into measurable OMNI skill identity.",
    outcome: "Understands basics and begins structured practice.",
    signal: "Foundation readiness",
  },
  Indigo: {
    role: "Builder",
    short: "Develop core skills",
    image: "/vibyor-img/indigo.jpg",
    detail:
      "Students strengthen core technical ability through guided practice, repeatable problem-solving and basic implementation tasks. This level turns theory into usable engineering skill.",
    outcome: "Builds reliable core engineering habits.",
    signal: "Core skill formation",
  },
  Blue: {
    role: "Practitioner",
    short: "Apply knowledge",
    image: "/vibyor-img/blue.jpg",
    detail:
      "Students apply concepts through challenges, timed tasks and real-world style scenarios. This is where learning starts becoming visible performance.",
    outcome: "Applies concepts under challenge conditions.",
    signal: "Applied performance",
  },
  Green: {
    role: "Developer",
    short: "Build solutions",
    image: "/vibyor-img/green.jpg",
    detail:
      "Students move beyond isolated concepts and begin building complete solutions. This level develops debugging, system thinking and practical execution.",
    outcome: "Builds working solutions with confidence.",
    signal: "Solution capability",
  },
  Yellow: {
    role: "Integrator",
    short: "Integrate technologies",
    image: "/vibyor-img/yellow.jpg",
    detail:
      "Students combine multiple domains, tools and workflows. This stage prepares them for product-level thinking, interdisciplinary challenges and smart engineering systems.",
    outcome: "Integrates multiple skills into one solution.",
    signal: "Product thinking",
  },
  Orange: {
    role: "Specialist",
    short: "Master domains",
    image: "/vibyor-img/orange.jpg",
    detail:
      "Students deepen expertise in selected domains such as embedded systems, automation, AI, PCB, VLSI, robotics or product engineering. This builds competitive technical edge.",
    outcome: "Develops strong domain-specific expertise.",
    signal: "Domain strength",
  },
  Red: {
    role: "Champion",
    short: "Innovate & lead",
    image: "/vibyor-img/red.jpg",
    detail:
      "Students demonstrate innovation, leadership, advanced competition readiness and portfolio-level proof. This stage represents national recognition potential and future WorldSkills direction.",
    outcome: "Innovates, leads and becomes recognition-ready.",
    signal: "Leadership readiness",
  },
} as const;

const vibgyorTheme = {
  Violet: {
    text: "text-violet-700",
    border: "border-violet-300",
    activeRing: "ring-violet-300/70",
    icon: "border-violet-200 bg-violet-50 text-violet-700",
    soft: "border-violet-200 bg-violet-50/80",
    top: "from-violet-600 via-fuchsia-500 to-purple-500",
    glow: "bg-violet-400/35",
    image:
      "linear-gradient(135deg, rgba(124,58,237,0.80), rgba(192,38,211,0.48), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(124,58,237,0.24),0_0_42px_rgba(168,85,247,0.18)]",
  },
  Indigo: {
    text: "text-indigo-700",
    border: "border-indigo-300",
    activeRing: "ring-indigo-300/70",
    icon: "border-indigo-200 bg-indigo-50 text-indigo-700",
    soft: "border-indigo-200 bg-indigo-50/80",
    top: "from-indigo-600 via-blue-600 to-violet-500",
    glow: "bg-indigo-400/35",
    image:
      "linear-gradient(135deg, rgba(79,70,229,0.82), rgba(37,99,235,0.48), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(79,70,229,0.24),0_0_42px_rgba(99,102,241,0.18)]",
  },
  Blue: {
    text: "text-blue-700",
    border: "border-blue-300",
    activeRing: "ring-blue-300/70",
    icon: "border-blue-200 bg-blue-50 text-blue-700",
    soft: "border-blue-200 bg-blue-50/80",
    top: "from-blue-600 via-sky-500 to-cyan-400",
    glow: "bg-blue-400/35",
    image:
      "linear-gradient(135deg, rgba(37,99,235,0.82), rgba(14,165,233,0.48), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(37,99,235,0.24),0_0_42px_rgba(14,165,233,0.18)]",
  },
  Green: {
    text: "text-emerald-700",
    border: "border-emerald-300",
    activeRing: "ring-emerald-300/70",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
    soft: "border-emerald-200 bg-emerald-50/80",
    top: "from-emerald-600 via-green-500 to-teal-400",
    glow: "bg-emerald-400/35",
    image:
      "linear-gradient(135deg, rgba(5,150,105,0.82), rgba(20,184,166,0.48), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(5,150,105,0.22),0_0_42px_rgba(16,185,129,0.18)]",
  },
  Yellow: {
    text: "text-yellow-700",
    border: "border-yellow-300",
    activeRing: "ring-yellow-300/70",
    icon: "border-yellow-200 bg-yellow-50 text-yellow-700",
    soft: "border-yellow-200 bg-yellow-50/85",
    top: "from-yellow-400 via-amber-400 to-orange-400",
    glow: "bg-yellow-300/45",
    image:
      "linear-gradient(135deg, rgba(234,179,8,0.82), rgba(251,146,60,0.48), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(234,179,8,0.24),0_0_42px_rgba(251,191,36,0.2)]",
  },
  Orange: {
    text: "text-orange-700",
    border: "border-orange-300",
    activeRing: "ring-orange-300/70",
    icon: "border-orange-200 bg-orange-50 text-orange-700",
    soft: "border-orange-200 bg-orange-50/85",
    top: "from-orange-500 via-amber-500 to-red-400",
    glow: "bg-orange-400/35",
    image:
      "linear-gradient(135deg, rgba(249,115,22,0.82), rgba(239,68,68,0.44), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(249,115,22,0.24),0_0_42px_rgba(251,146,60,0.18)]",
  },
  Red: {
    text: "text-red-700",
    border: "border-red-300",
    activeRing: "ring-red-300/70",
    icon: "border-red-200 bg-red-50 text-red-700",
    soft: "border-red-200 bg-red-50/80",
    top: "from-red-600 via-rose-500 to-orange-400",
    glow: "bg-red-400/35",
    image:
      "linear-gradient(135deg, rgba(220,38,38,0.82), rgba(244,63,94,0.48), rgba(255,255,255,0.08))",
    activeShadow:
      "shadow-[0_34px_96px_rgba(220,38,38,0.24),0_0_42px_rgba(244,63,94,0.18)]",
  },
} as const;

export default function OsoVibgyorSpectrum() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeLevel = vibgyorLevels[activeIndex];
  const activeColor = activeLevel?.color ?? "Violet";

  const activeMeta = useMemo(() => {
    return vibgyorMeta[activeColor as keyof typeof vibgyorMeta];
  }, [activeColor]);

  useEffect(() => {
    document.getElementById(`oso-vibgyor-card-${activeIndex}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? vibgyorLevels.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === vibgyorLevels.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] py-16 sm:py-20">
      <div className="oso-container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/86 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(124,58,237,0.11),transparent_30%),radial-gradient(circle_at_52%_7%,rgba(37,99,235,0.11),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(250,204,21,0.16),transparent_30%)]"
          />

          <div className="relative z-10">
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                <Layers3 className="h-4 w-4" />
                VIBGYOR Skill Framework
              </div>

              <h2 className="oso-heading mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                A colorful but controlled path from explorer to champion.
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
                Each card is a skill stage. Swipe, scroll, or use arrows to
                move through the track. Select a card to reveal deeper skill
                meaning.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous VIBGYOR level"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-white/90 text-blue-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next VIBGYOR level"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-white/90 text-blue-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-0 top-0 z-20 w-16 bg-gradient-to-r from-white/95 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 right-0 top-0 z-20 w-16 bg-gradient-to-l from-white/95 to-transparent"
              />

              <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-7 pt-4 [scrollbar-color:#2563eb_transparent] [scrollbar-width:thin]">
                {vibgyorLevels.map((level, index) => {
                  const meta =
                    vibgyorMeta[level.color as keyof typeof vibgyorMeta];
                  const theme =
                    vibgyorTheme[level.color as keyof typeof vibgyorTheme];

                  const active = index === activeIndex;
                  const distance = Math.abs(index - activeIndex);

                  return (
                    <button
                      id={`oso-vibgyor-card-${index}`}
                      key={level.color}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group relative w-[330px] shrink-0 snap-center overflow-hidden rounded-[2rem] border text-left backdrop-blur-2xl transition-all duration-500 ease-out sm:w-[380px] ${
                        active
                          ? `${theme.border} ${theme.activeShadow} ${theme.activeRing} scale-[1.035] bg-white/92 ring-2`
                          : distance === 1
                            ? "scale-[0.95] border-slate-200 bg-white/78 opacity-95 shadow-[0_20px_58px_rgba(15,23,42,0.08)] hover:scale-[0.99]"
                            : "scale-[0.9] border-slate-200 bg-white/68 opacity-75 shadow-[0_14px_38px_rgba(15,23,42,0.05)] hover:opacity-90"
                      }`}
                    >
                      <div
                        aria-hidden="true"
                        className={`absolute inset-x-0 top-0 h-3 bg-gradient-to-r ${theme.top}`}
                      />

                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 bg-gradient-to-br ${theme.top} opacity-[0.18] transition duration-500 group-hover:opacity-[0.24]`}
                      />

                      <div
                        aria-hidden="true"
                        className={`absolute -right-16 -top-20 h-56 w-56 rounded-full ${theme.glow} blur-3xl opacity-100 transition duration-500 group-hover:scale-125`}
                      />

                      <div
                        aria-hidden="true"
                        className={`absolute -bottom-20 -left-20 h-56 w-56 rounded-full ${theme.glow} blur-3xl opacity-80 transition duration-500 group-hover:scale-110`}
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,255,255,0.52))]"
                      />

                      <div className="relative z-10 p-5">
                        <div
                          className={`grid transition-all duration-500 ease-out ${
                            active
                              ? "grid-rows-[0fr] opacity-0"
                              : "grid-rows-[1fr] opacity-100"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div
                              className="relative mb-5 h-40 overflow-hidden rounded-[1.45rem] border border-white/80 bg-cover bg-center shadow-[0_18px_44px_rgba(15,23,42,0.12)]"
                              style={{
                                backgroundImage: `${theme.image}, url(${meta.image})`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-white/5" />
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-full border ${theme.icon} shadow-[0_12px_32px_rgba(15,23,42,0.08)]`}
                        >
                          <Sparkles className="h-5 w-5" />
                        </div>

                        <p
                          className={`mt-7 text-xs font-black uppercase tracking-[0.28em] ${theme.text}`}
                        >
                          Level {index + 1}
                        </p>

                        <h3 className="oso-heading mt-3 text-2xl font-black leading-tight text-slate-950">
                          {level.color} · {meta.role}
                        </h3>

                        <p className="mt-4 text-base font-bold leading-7 text-slate-600">
                          {meta.short}
                        </p>

                        <div
                          className={`grid transition-all duration-500 ease-out ${
                            active
                              ? "mt-6 grid-rows-[1fr] opacity-100"
                              : "mt-0 grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="rounded-[1.35rem] border border-white/80 bg-white/88 p-4 shadow-sm backdrop-blur-xl">
                              <div className="flex items-center gap-2">
                                <BadgeCheck className={`h-4 w-4 ${theme.text}`} />
                                <p
                                  className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.text}`}
                                >
                                  {meta.signal}
                                </p>
                              </div>

                              <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                                {meta.detail}
                              </p>

                              <div
                                className={`mt-4 rounded-2xl border ${theme.soft} p-3`}
                              >
                                <p
                                  className={`text-[10px] font-black uppercase tracking-[0.18em] ${theme.text}`}
                                >
                                  Outcome
                                </p>
                                <p className="mt-1 text-sm font-black leading-6 text-slate-800">
                                  {meta.outcome}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                          <span
                            className={`text-xs font-black uppercase tracking-[0.16em] ${theme.text}`}
                          >
                            {active ? "Hide Details" : "More Info"}
                          </span>

                          <ChevronDown
                            className={`h-4 w-4 transition duration-300 ${
                              active
                                ? `rotate-180 ${theme.text}`
                                : "text-slate-400"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-3 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-3">
              <MiniSignal
                icon={<Target className="h-4 w-4" />}
                label={activeColor}
              />
              <MiniSignal
                icon={<Crown className="h-4 w-4" />}
                label={activeMeta?.role ?? "Explorer"}
              />
              <MiniSignal
                icon={<BadgeCheck className="h-4 w-4" />}
                label={activeMeta?.signal ?? "Skill Identity"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniSignal({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-blue-700">
      {icon}
      {label}
    </span>
  );
}