"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function ChallengeSecurityOverlay({
  violations,
}: {
  violations: number;
}) {
  const maxViolations = 5;
  const safeViolations = Math.max(0, Math.min(violations, maxViolations));
  const severity =
    safeViolations >= 4 ? "critical" : safeViolations >= 2 ? "warning" : "safe";

  return (
    <AnimatePresence>
      {safeViolations > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          aria-live="polite"
          className="relative overflow-hidden rounded-[1.5rem] border border-amber-400/25 bg-amber-500/10 p-4 shadow-[0_0_44px_rgba(251,191,36,0.14)] backdrop-blur-2xl sm:p-5"
        >
          <motion.div
            aria-hidden="true"
            animate={
              severity === "critical"
                ? { opacity: [0.18, 0.4, 0.18], scale: [1, 1.04, 1] }
                : { opacity: [0.1, 0.22, 0.1] }
            }
            transition={{ duration: 1.1, repeat: Infinity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.22),transparent_34%)]"
          />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{
                  boxShadow:
                    severity === "critical"
                      ? [
                          "0 0 18px rgba(248,113,113,0.35)",
                          "0 0 34px rgba(248,113,113,0.75)",
                          "0 0 18px rgba(248,113,113,0.35)",
                        ]
                      : [
                          "0 0 16px rgba(251,191,36,0.28)",
                          "0 0 28px rgba(251,191,36,0.55)",
                          "0 0 16px rgba(251,191,36,0.28)",
                        ],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10"
              >
                <span className="text-lg font-black text-amber-200">!</span>
              </motion.div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
                  Security Monitor Active
                </p>

                <h3 className="mt-2 text-base font-black text-white sm:text-lg">
                  Challenge integrity warning detected
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Fullscreen, focus, and tab activity are monitored during this
                  challenge session.
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                Violations
              </p>

              <p className="mt-1 text-2xl font-black tabular-nums text-amber-200">
                {safeViolations}/{maxViolations}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-5 gap-2">
            {Array.from({ length: maxViolations }).map((_, index) => {
              const isActive = index < safeViolations;

              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.28,
                    scale: isActive ? 1 : 0.96,
                  }}
                  className={
                    isActive
                      ? "h-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)]"
                      : "h-2 rounded-full bg-white/10"
                  }
                />
              );
            })}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
