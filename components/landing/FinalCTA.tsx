"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, ShieldCheck, Sparkles } from "lucide-react";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";

export default function FinalCTA() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-28 md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.13),transparent_34%)]" />
        <div className="absolute -left-32 top-12 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-32 bottom-12 h-[34rem] w-[34rem] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <MotionWrapper>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_42%)]" />

          <motion.div
            aria-hidden="true"
            animate={{ x: ["-30%", "130%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/80 to-transparent"
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                <Rocket className="h-4 w-4" />
                Begin Your Engineering Journey
              </div>

              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Start building your{" "}
                <span className="bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  industry-ready identity
                </span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                Enter the Silicon Skillathon ecosystem, complete daily
                challenges, earn Silicon Points, climb ranks, and unlock your
                engineering progression.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <HoverScale>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-300 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(34,211,238,0.22)] transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                  >
                    Start Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </HoverScale>

                <HoverScale>
                  <Link
                    href="/daily-challenges"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                  >
                    View Challenges
                  </Link>
                </HoverScale>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-cyan-200" />
                  <h3 className="text-xl font-black text-white">
                    Daily Progression
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  Every attempt builds momentum toward rank, tier, and
                  readiness.
                </p>
              </div>

              <div className="rounded-[2rem] border border-purple-400/20 bg-purple-400/10 p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-purple-200" />
                  <h3 className="text-xl font-black text-white">
                    Competitive Identity
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  Your performance becomes visible through points, scores, and
                  leaderboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MotionWrapper>
    </section>
  );
}
