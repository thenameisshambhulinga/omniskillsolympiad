"use client";

import { motion } from "framer-motion";

const steps = [
  "Challenges",
  "Accuracy",
  "Omni Score",
  "Rankings",
  "Opportunities",
];

export default function MetricFlow() {
  return (
    <section className="mt-12 rounded-[28px] border border-white/10 bg-white/3 p-5 shadow-[0_18px_50px_rgba(8,15,35,0.35)] backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
        Ecosystem Map
      </p>
      <h3 className="mt-2 text-xl font-black text-white">Metric Flow</h3>
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-1 flex-col items-center gap-3 text-center"
          >
            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
              {step}
            </div>
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="h-px w-full bg-linear-to-r from-cyan-400/0 via-cyan-300/70 to-cyan-400/0 md:w-16 md:rotate-90"
              />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
