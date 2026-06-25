"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Copy,
  Home,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

export default function SuccessClient({
  fullName,
  omniId,
}: {
  fullName: string;
  omniId: string;
}) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(9);
  const [copied, setCopied] = useState(false);

  const displayName = fullName?.trim() || "Engineer";

  useEffect(() => {
    const tick = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    const redirect = window.setTimeout(() => {
      router.push("/");
    }, 9000);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(redirect);
    };
  }, [router]);

  const orbitItems = useMemo(
    () => [
      { label: "Verified", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Activated", icon: <Zap className="h-4 w-4" /> },
      { label: "Ready", icon: <Rocket className="h-4 w-4" /> },
      { label: "Rankable", icon: <Trophy className="h-4 w-4" /> },
    ],
    [],
  );

  const copyOmniId = async () => {
    try {
      await navigator.clipboard.writeText(omniId);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_85%_14%,rgba(168,85,247,0.24),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.18),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <CelebrationField />
      <NeonRings />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.045] p-6 text-center shadow-[0_45px_190px_rgba(0,0,0,0.62)] backdrop-blur-2xl sm:p-10 lg:p-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.24),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.18),transparent_36%)]" />

          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="relative mx-auto mb-8 h-52 w-52">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-cyan-300/35"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border border-dashed border-purple-300/30"
              />

              {orbitItems.map((item, index) => {
                const positions = [
                  "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
                  "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
                  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                  "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
                ];

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.12 }}
                    className={`absolute ${positions[index]} inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur-xl`}
                  >
                    <span className="text-cyan-200">{item.icon}</span>
                    {item.label}
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ scale: 0.45, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 13 }}
                className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2.3rem] border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_90px_rgba(16,185,129,0.3)]"
              >
                <BadgeCheck className="h-16 w-16 text-emerald-200 drop-shadow-[0_0_24px_rgba(16,185,129,0.55)]" />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300"
            >
              Registration Successful
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-7xl"
            >
              Welcome, {displayName}
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Engineering Identity Is Live
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-white/58"
            >
              Your official OMNI identity has been generated, verified and
              linked to your competition profile.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.58, duration: 0.6 }}
              className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2.5rem] border border-cyan-400/25 bg-cyan-400/10 p-6 shadow-[0_0_90px_rgba(34,211,238,0.18)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-cyan-200" />
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                    Your Official OMNI ID
                  </p>
                </div>

                <motion.p
                  initial={{ letterSpacing: "0.65em", opacity: 0 }}
                  animate={{ letterSpacing: "0.08em", opacity: 1 }}
                  transition={{ delay: 0.75, duration: 0.85 }}
                  className="mt-5 break-all text-4xl font-black text-white md:text-6xl"
                >
                  {omniId}
                </motion.p>

                <button
                  type="button"
                  onClick={copyOmniId}
                  className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/65 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy ID"}
                </button>
              </div>
            </motion.div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <SuccessMetric icon={<Rocket className="h-5 w-5" />} label="Identity" value="Activated" />
              <SuccessMetric icon={<Trophy className="h-5 w-5" />} label="Competition" value="Ready" />
              <SuccessMetric icon={<Sparkles className="h-5 w-5" />} label="Profile" value="Verified" />
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_50px_rgba(34,211,238,0.22)] transition hover:bg-cyan-200"
              >
                <Home className="h-5 w-5" />
                Go to Home
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="text-sm font-semibold text-white/45">
                Redirecting to Home in {seconds}s
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function SuccessMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200">
        {icon}
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function CelebrationField() {
  const particles = Array.from({ length: 56 }, (_, index) => index);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {particles.map((particle) => {
        const left = `${(particle * 23) % 100}%`;
        const delay = (particle % 16) * 0.11;
        const duration = 4 + (particle % 7) * 0.38;
        const size = 5 + (particle % 4) * 2;

        return (
          <motion.span
            key={particle}
            initial={{ y: "112vh", opacity: 0, scale: 0.4 }}
            animate={{
              y: "-14vh",
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1, 1.2, 0.75],
              rotate: [0, 180, 360],
              x: [0, particle % 2 === 0 ? 34 : -34, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full bg-gradient-to-r from-cyan-300 to-purple-400 shadow-[0_0_18px_rgba(34,211,238,0.65)]"
            style={{
              left,
              width: size,
              height: size,
            }}
          />
        );
      })}
    </div>
  );
}

function NeonRings() {
  const rings = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {rings.map((ring) => (
        <motion.div
          key={ring}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 0.35, 0],
            scale: [0.3, 1.45, 2.2],
          }}
          transition={{
            duration: 4.5,
            delay: ring * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25"
        />
      ))}
    </div>
  );
}