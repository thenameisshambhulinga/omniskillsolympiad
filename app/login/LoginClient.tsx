"use client";

import { signIn } from "next-auth/react";

import Image from "next/image";

import { ArrowRight, Trophy, BrainCircuit, ShieldCheck } from "lucide-react";

export default function LoginClient() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[120px] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[380px] w-[380px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]" />
      </div>

      {/* LEFT PANEL */}

      <section className="relative z-10 hidden w-1/2 flex-col justify-between border-r border-white/10 p-16 lg:flex">
        <div>
          {/* <Image
            src="/sims-logo.png"
            alt="SIMS Logo"
            width={220}
            height={80}
            priority
            style={{
              width: "auto",
              height: "auto",
            }}
          /> */}
        </div>

        <div>
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-purple-300">
            Engineering Acceleration Ecosystem
          </p>

          <h1 className="max-w-2xl text-7xl font-bold leading-[0.9]">
            Future Electronics
            <span className="block text-purple-400">Talent Platform</span>
          </h1>

          <p className="mt-10 max-w-xl text-xl leading-[2.1] text-white/78">
            Participate in mock tests, earn Silicon points, compete in
            leaderboards, prepare for WorldSkills and accelerate your
            engineering journey.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="glass-card rounded-[28px] p-6">
            <BrainCircuit className="h-8 w-8 text-purple-400" />

            <p className="mt-5 text-base">Daily Quizzes</p>
          </div>

          <div className="glass-card rounded-[28px] p-6">
            <Trophy className="h-8 w-8 text-cyan-400" />

            <p className="mt-5 text-base">Rankings</p>
          </div>

          <div className="glass-card rounded-[28px] p-6">
            <ShieldCheck className="h-8 w-8 text-purple-400" />

            <p className="mt-5 text-base">Secure Tests</p>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-[36px] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-2xl md:p-14">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.35em] text-purple-300">
              Student Authentication
            </p>

            <h2 className="mt-5 text-5xl font-bold leading-[0.95]">
              Welcome Back
            </h2>

            <p className="mt-6 text-white/75">
              Continue your engineering acceleration journey.
            </p>
          </div>

          {/* GOOGLE BUTTON */}

          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/onboarding",
              })
            }
            className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 transition duration-300 hover:border-purple-500/30 hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black text-lg font-bold">
                G
              </div>

              <div className="text-left">
                <h3 className="text-lg font-semibold">Continue with Google</h3>

                <p className="mt-1 text-sm text-white/60">
                  Secure student authentication
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>

          <div className="mt-10 rounded-2xl border border-purple-500/10 bg-purple-500/5 p-6">
            <p className="leading-[2] text-white/75">
              Your profile securely stores Silicon points, rankings,
              achievements, test analytics and WorldSkills preparation progress.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
