"use client";

import { signIn } from "next-auth/react";
import { ShieldCheck } from "lucide-react";

import { posterAnnouncements } from "@/data/posterAnnouncements";
import PosterAnnouncementCarousel from "@/components/landing/PosterAnnouncementCarousel";

export default function LoginClient() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-36 top-24 h-[38rem] w-[38rem] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[92rem] items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <PosterAnnouncementCarousel posters={posterAnnouncements} />
        <section
          aria-label="Authentication"
          className="group relative overflow-hidden rounded-[2.75rem] border border-cyan-300/25 bg-white/[0.065] p-6 shadow-[0_38px_160px_rgba(0,0,0,0.62),0_0_90px_rgba(34,211,238,0.14)] backdrop-blur-2xl sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_34%)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-cyan-400/14 blur-3xl transition duration-700 group-hover:bg-cyan-400/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-purple-500/14 blur-3xl transition duration-700 group-hover:bg-purple-500/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-px rounded-[2.72rem] border border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-cyan-300/80 to-transparent"
          />

          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
              <ShieldCheck className="h-4 w-4" />
              Secure Access
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Continue to Omni Skills Olympiad
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/60">
              Apply from the poster board, authenticate with Google, and enter
              your engineering competition workspace.
            </p>

            <div className="relative my-8">
              <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-cyan-300/0 via-cyan-300/65 to-cyan-300/0" />

              <div className="relative flex items-center justify-between">
                {["Apply Now", "Authenticate", "Join Event"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />

                        <span
                          className="absolute inset-0 rounded-full border border-cyan-300/30"
                          style={{
                            animation: `pulse ${1.8 + index * 0.2}s ease-in-out infinite`,
                          }}
                        />
                      </div>

                      <span className="text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/onboarding",
                })
              }
              className="group/google relative inline-flex w-full min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_0_44px_rgba(255,255,255,0.12)] transition hover:scale-[1.015] hover:bg-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-cyan-200/60 to-transparent transition duration-700 group-hover/google:translate-x-full" />

              <svg
                aria-hidden="true"
                className="relative z-10 h-5 w-5"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>

              <span className="relative z-10">Continue with Google</span>
            </button>

            <div className="mt-6 grid gap-3">
              {[
                "Secure Authentication",
                "One-click Sign In",
                "Verified Student Access",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white/62"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-black">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
