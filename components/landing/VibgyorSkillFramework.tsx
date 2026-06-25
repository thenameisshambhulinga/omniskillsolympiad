"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Cpu,
  Layers3,
  RadioTower,
  Rocket,
  Wrench,
} from "lucide-react";

type OmniStep = {
  code: "O" | "M" | "N" | "I";
  meaning: string;
  step: string;
};

type VibgyorCard = {
  letter: string;
  colorName: string;
  title: string;
  description: string;
  nextStage: string;
  gradient: string;
  glow: string;
  border: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  omni: OmniStep[];
};

const frameworks: VibgyorCard[] = [
  {
    letter: "V",
    colorName: "Violet",
    title: "Foundation Electronics Skills",
    description: "Build practical electronics confidence from the ground up.",
    nextStage: "Indigo",
    gradient: "from-violet-500/20 to-purple-500/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(139,92,246,0.24)]",
    border: "group-hover:border-violet-300/45",
    text: "text-violet-200",
    icon: Layers3,
    omni: [
      { code: "O", meaning: "Observe", step: "Component Identification" },
      { code: "M", meaning: "Measure", step: "Tools & Instruments" },
      { code: "N", meaning: "Navigate", step: "Breadboard Circuits" },
      { code: "I", meaning: "Initiate", step: "Electronics Fundamentals" },
    ],
  },
  {
    letter: "I",
    colorName: "Indigo",
    title: "Analog & Digital Engineering",
    description: "Understand signals, logic, behaviour and debugging.",
    nextStage: "Blue",
    gradient: "from-indigo-500/20 to-blue-500/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(99,102,241,0.24)]",
    border: "group-hover:border-indigo-300/45",
    text: "text-indigo-200",
    icon: CircuitBoard,
    omni: [
      { code: "O", meaning: "Observe Signals", step: "Signal Analysis" },
      { code: "M", meaning: "Model Logic", step: "Logic Design" },
      { code: "N", meaning: "Normalize Circuits", step: "Circuit Behaviour" },
      {
        code: "I",
        meaning: "Investigate Faults",
        step: "Debugging Foundations",
      },
    ],
  },
  {
    letter: "B",
    colorName: "Blue",
    title: "Embedded Systems Engineering",
    description: "Move from circuits to programmable hardware systems.",
    nextStage: "Green",
    gradient: "from-sky-500/20 to-cyan-500/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(14,165,233,0.24)]",
    border: "group-hover:border-sky-300/45",
    text: "text-sky-200",
    icon: Cpu,
    omni: [
      { code: "O", meaning: "Operate Hardware", step: "Microcontrollers" },
      { code: "M", meaning: "Manage Inputs", step: "GPIO" },
      {
        code: "N",
        meaning: "Network Components",
        step: "Peripheral Integration",
      },
      { code: "I", meaning: "Implement Logic", step: "Firmware" },
    ],
  },
  {
    letter: "G",
    colorName: "Green",
    title: "Product Engineering",
    description: "Convert working prototypes into testable products.",
    nextStage: "Yellow",
    gradient: "from-emerald-500/20 to-green-500/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(16,185,129,0.24)]",
    border: "group-hover:border-emerald-300/45",
    text: "text-emerald-200",
    icon: Wrench,
    omni: [
      { code: "O", meaning: "Organize Design", step: "PCB Design" },
      { code: "M", meaning: "Manufacture Systems", step: "Assembly" },
      { code: "N", meaning: "Normalize Production", step: "Manufacturing" },
      { code: "I", meaning: "Inspect Quality", step: "Testing" },
    ],
  },
  {
    letter: "Y",
    colorName: "Yellow",
    title: "IoT & Automation",
    description: "Connect electronics systems into intelligent networks.",
    nextStage: "Orange",
    gradient: "from-yellow-500/20 to-amber-500/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(234,179,8,0.24)]",
    border: "group-hover:border-yellow-300/45",
    text: "text-yellow-200",
    icon: RadioTower,
    omni: [
      { code: "O", meaning: "Observe Environment", step: "Sensors" },
      { code: "M", meaning: "Monitor Systems", step: "Connectivity" },
      { code: "N", meaning: "Network Devices", step: "MQTT" },
      { code: "I", meaning: "Integrate Intelligence", step: "Smart Systems" },
    ],
  },
  {
    letter: "O",
    colorName: "Orange",
    title: "Robotics & Industrial Systems",
    description: "Engineer motion, automation and diagnostics.",
    nextStage: "Red",
    gradient: "from-orange-500/20 to-amber-600/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(249,115,22,0.24)]",
    border: "group-hover:border-orange-300/45",
    text: "text-orange-200",
    icon: Bot,
    omni: [
      { code: "O", meaning: "Operate Motion", step: "Motor Control" },
      { code: "M", meaning: "Mechanize Tasks", step: "Automation" },
      {
        code: "N",
        meaning: "Navigate Industry",
        step: "Industrial Diagnostics",
      },
      { code: "I", meaning: "Integrate Systems", step: "System Integration" },
    ],
  },
  {
    letter: "R",
    colorName: "Red",
    title: "Innovation & Grand Challenge",
    description: "Advance into R&D, innovation and national competition.",
    nextStage: "Champion",
    gradient: "from-red-500/20 to-rose-500/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(244,63,94,0.24)]",
    border: "group-hover:border-red-300/45",
    text: "text-red-200",
    icon: Rocket,
    omni: [
      { code: "O", meaning: "Originate Innovation", step: "R&D" },
      { code: "M", meaning: "Mobilize Ideas", step: "Innovation Sprint" },
      {
        code: "N",
        meaning: "National Competition",
        step: "Industry Challenges",
      },
      {
        code: "I",
        meaning: "Inspire Excellence",
        step: "National Championship",
      },
    ],
  },
];

const path = [
  "Components",
  "Circuits",
  "Embedded Systems",
  "IoT",
  "Product Engineering",
  "Robotics",
  "Industrial Innovation",
];

export default function VibgyorSkillFramework() {
  return (
    <section className="relative z-10 border-t border-white/10 px-6 py-24 md:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(139,92,246,0.12),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(34,211,238,0.1),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(244,63,94,0.1),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            VIBGYOR Electronics Skill Framework
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            India&apos;s Practical Electronics
            <span className="block bg-linear-to-r from-violet-300 via-cyan-200 to-red-300 bg-clip-text text-transparent">
              Engineering Growth Path
            </span>
          </h2>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/62">
            Progress through structured engineering stages from electronics
            foundations to national innovation challenges through the OMNI
            learning method.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2 2xl:grid-cols-7">
          {frameworks.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.letter}
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8, scale: 1.012 }}
                className={`group relative min-h-[660px] overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br ${item.gradient} p-5 shadow-[0_28px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition duration-500 ${item.border} ${item.glow}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_34%)] opacity-70 transition duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl transition duration-700 group-hover:bg-white/15" />

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <motion.span
                    animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
                    transition={{
                      duration: 14,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -left-3 top-14 text-[11rem] font-black leading-none text-white/[0.035]"
                  >
                    O
                  </motion.span>

                  <motion.span
                    animate={{ y: [8, -8, 8], rotate: [2, -2, 2] }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -right-7 top-32 text-[10rem] font-black leading-none text-white/[0.03]"
                  >
                    M
                  </motion.span>

                  <motion.span
                    animate={{ y: [-6, 6, -6], rotate: [1.5, -1.5, 1.5] }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -left-4 bottom-24 text-[10rem] font-black leading-none text-white/[0.028]"
                  >
                    N
                  </motion.span>

                  <motion.span
                    animate={{ y: [6, -6, 6], rotate: [-1.5, 1.5, -1.5] }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -right-1 bottom-8 text-[11rem] font-black leading-none text-white/[0.034]"
                  >
                    I
                  </motion.span>

                </div>
                

                <motion.div
                  aria-hidden="true"
                  animate={{ x: ["-40%", "145%"] }}
                  transition={{
                    duration: 6 + index * 0.3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent"
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/25 text-3xl font-black text-white shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                        {item.letter}
                      </div>

                      <p
                        className={`mt-4 text-xs font-black uppercase tracking-[0.24em] ${item.text}`}
                      >
                        {item.colorName}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                      <Icon className={`h-5 w-5 ${item.text}`} />
                    </div>
                  </div>

                  <h3 className="mt-7 text-2xl font-black leading-tight text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/62">
                    {item.description}
                  </p>

                  <div className="mt-7 grid gap-3">
                    {item.omni.map((step, stepIndex) => (
                      <motion.div
                        key={`${item.letter}-${step.code}-${step.step}`}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.04 + stepIndex * 0.04,
                        }}
                        className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/20 p-4 backdrop-blur-md transition duration-300 group-hover:border-white/15 group-hover:bg-white/[0.065]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/[0.045] to-transparent opacity-80" />

                        <div className="relative z-10 flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl font-black ${item.text}`}
                          >
                            {step.code}
                          </div>

                          <div className="min-w-0">
                            {/* <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                              OMNI Protocol {stepIndex + 1}
                            </p> */}

                            <h4
                              className={`mt-1 text-sm font-black uppercase tracking-[0.14em] ${item.text}`}
                            >
                              {step.meaning}
                            </h4>

                            <p className="mt-2 text-sm font-bold leading-6 text-white/78">
                              {step.step}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/38">
                        Next Stage
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p
                          className={`text-sm font-black uppercase ${item.text}`}
                        >
                          {item.colorName}
                        </p>

                        <ArrowRight className="h-4 w-4 text-white/35" />

                        <p className="text-sm font-black uppercase text-cyan-100">
                          {item.nextStage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-14 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {path.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                  {step}
                </span>

                {index < path.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-white/35" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
