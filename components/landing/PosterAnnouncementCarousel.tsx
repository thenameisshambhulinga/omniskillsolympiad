"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";

import type { PosterAnnouncement } from "@/data/posterAnnouncements";

const typingHeadlines = [
  "Hackathon 2026",
  "Internship Drive",
  "Innovation Challenge",
  "Ideathon",
  "WorldSkills Preparation",
];

function getBadgeClass(badge: PosterAnnouncement["badge"]) {
  if (badge === "LIVE") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  if (badge === "NEW") {
    return "border-purple-400/30 bg-purple-400/10 text-purple-200";
  }

  return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
}

export default function PosterAnnouncementCarousel({
  posters,
}: {
  posters: PosterAnnouncement[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const activePoster = posters[activeIndex];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 22 });

  const posterRotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const posterRotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);

  const glowX = useTransform(smoothX, [-0.5, 0.5], ["14%", "86%"]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ["14%", "86%"]);

  const spotlight = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.18), transparent 36%)`;

  useEffect(() => {
    if (shouldReduceMotion || posters.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posters.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [posters.length, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypedText(typingHeadlines[0]);
      return;
    }

    const currentHeadline = typingHeadlines[headlineIndex];
    const typingSpeed = isDeleting ? 45 : 80;
    const pauseTime =
      typedText === currentHeadline && !isDeleting ? 1200 : typingSpeed;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === currentHeadline) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setHeadlineIndex((current) => (current + 1) % typingHeadlines.length);
        return;
      }

      setTypedText((current) =>
        isDeleting
          ? currentHeadline.slice(0, current.length - 1)
          : currentHeadline.slice(0, current.length + 1),
      );
    }, pauseTime);

    return () => window.clearTimeout(timer);
  }, [headlineIndex, isDeleting, shouldReduceMotion, typedText]);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (posters.length === 0) return null;

  return (
    <section
      aria-label="Login poster announcements"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[620px] overflow-hidden rounded-[2.75rem] border border-cyan-300/20 bg-white/[0.035] shadow-[0_42px_180px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          animate={
            shouldReduceMotion ? undefined : { x: [0, 24, 0], y: [0, -18, 0] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:58px_58px] opacity-45 [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : { opacity: [0.34, 0.78, 0.34], scale: [1, 1.1, 1] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : { opacity: [0.24, 0.62, 0.24], scale: [1.06, 1, 1.06] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-28 bottom-16 h-[28rem] w-[28rem] rounded-full bg-purple-500/20 blur-3xl"
        />

        <motion.div
          style={{ background: spotlight }}
          className="absolute inset-0"
        />

        <motion.div
          animate={shouldReduceMotion ? undefined : { x: ["-35%", "135%"] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/90 to-transparent"
        />

        {Array.from({ length: 34 }).map((_, index) => (
          <motion.span
            key={index}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.12, 0.76, 0.12],
                    y: [0, -18, 0],
                    x: [0, index % 2 === 0 ? 8 : -8, 0],
                  }
            }
            transition={{
              duration: 3.5 + (index % 7),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.06,
            }}
            className="absolute h-1 w-1 rounded-full bg-cyan-200/70 shadow-[0_0_16px_rgba(103,232,249,0.8)]"
            style={{
              left: `${8 + ((index * 23) % 84)}%`,
              top: `${8 + ((index * 37) % 84)}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-[620px] flex-col p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.16)] backdrop-blur-xl">
            <Radio className="h-4 w-4" />
            Live Poster Board
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {posters.map((poster, index) => (
              <button
                key={poster.id}
                type="button"
                aria-label={`Show ${poster.title}`}
                onClick={() => setActiveIndex(index)}
                className={
                  index === activeIndex
                    ? "h-2.5 w-8 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)] transition"
                    : "h-2.5 w-2.5 rounded-full bg-white/25 transition hover:bg-white/50"
                }
              />
            ))}
          </div>
        </div>

        <motion.div
          style={{
            rotateX: shouldReduceMotion ? 0 : posterRotateX,
            rotateY: shouldReduceMotion ? 0 : posterRotateY,
            transformPerspective: 1200,
          }}
          animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
          whileHover={shouldReduceMotion ? undefined : { y: -9, scale: 1.01 }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative min-h-[470px] flex-1 overflow-hidden rounded-[2.35rem] border border-cyan-300/20 bg-black/35 shadow-[0_42px_150px_rgba(0,0,0,0.58),0_0_90px_rgba(34,211,238,0.12)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePoster.id}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.94, filter: "blur(18px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, filter: "blur(18px)" }
              }
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <motion.div
                animate={
                  shouldReduceMotion ? undefined : { scale: [1, 1.055, 1] }
                }
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <Image
                  src={activePoster.image}
                  alt={activePoster.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain"
                />
              </motion.div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_36%)]" />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 rounded-[2.35rem] border border-white/10" />

          <motion.div
            aria-hidden="true"
            animate={shouldReduceMotion ? undefined : { x: ["-40%", "140%"] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 top-0 h-full w-1/3 bg-linear-to-r from-transparent via-white/12 to-transparent"
          />

          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-24 bg-cyan-300/10 blur-3xl" />
        </motion.div>

        <div className="mt-4 rounded-[1.75rem] border border-white/10 bg-black/60 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <span
              className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getBadgeClass(
                activePoster.badge,
              )}`}
            >
              {activePoster.badge}
            </span>

            <h2 className="text-xl font-black text-white sm:text-2xl">
              {activePoster.title}
            </h2>

            <p className="mt-2 min-h-6 text-sm font-semibold text-cyan-100">
              {typedText}
              <span className="ml-1 animate-pulse text-cyan-300">|</span>
            </p>
          </div>

          <div className="mt-4 flex flex-col items-start gap-2 sm:mt-0 sm:items-end">
            <Link
              href={activePoster.ctaLink}
              className="group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-cyan-400/40 bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-black shadow-[0_0_50px_rgba(34,211,238,0.34)] transition hover:scale-[1.025] hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent transition duration-700 group-hover:translate-x-full" />

              <span className="relative z-10">{activePoster.ctaText}</span>

              <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200/70">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              Authenticate to continue
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
