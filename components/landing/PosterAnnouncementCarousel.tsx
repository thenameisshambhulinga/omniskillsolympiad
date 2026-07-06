"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ImageOff,
  Radio,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export type PosterAnnouncement = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  ctaLabel: string;
  ctaHref: string;
  placement?: string;
  priority?: number;
  isHero?: boolean;
  highlights?: string[];
};

export default function PosterAnnouncementCarousel({
  posters = [],
  className = "",
}: {
  posters?: PosterAnnouncement[];
  className?: string;
}) {
  const publishedPosters = useMemo(() => {
    return posters.filter((poster) => poster.imageUrl && poster.title);
  }, [posters]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (publishedPosters.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % publishedPosters.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [publishedPosters.length]);

  const activePoster = publishedPosters[activeIndex];

  if (!activePoster) {
    return (
      <section
        className={`relative overflow-hidden rounded-[2.35rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${className}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_34%)]" />

        <div className="relative z-10 flex min-h-[26rem] flex-col items-center justify-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
            <ImageOff className="h-7 w-7 text-cyan-200" />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Live Poster Board
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            No Live Posters Yet
          </h2>

          <p className="mt-3 max-w-md text-sm leading-7 text-white/50">
            Admin can publish posters from Announcement Center. No manual or
            mock poster data is shown here.
          </p>

          <Link
            href="/admin/announcements"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-400/20"
          >
            Open Announcement Center
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-[2.35rem] border border-cyan-400/20 bg-white/[0.045] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_34%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2">
            <Radio className="h-3.5 w-3.5 text-cyan-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
              Live Poster Board
            </span>
          </div>

          <div className="flex items-center gap-2">
            {publishedPosters.map((poster, index) => (
              <button
                key={poster.id}
                type="button"
                aria-label={`Show poster ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={
                  index === activeIndex
                    ? "h-2.5 w-8 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                    : "h-2.5 w-2.5 rounded-full bg-white/20 transition hover:bg-white/45"
                }
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[26rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/35">
          <AnimatePresence mode="wait">
            <motion.article
              key={activePoster.id}
              initial={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={activePoster.mobileImageUrl || activePoster.imageUrl}
                alt={activePoster.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.24),transparent_34%)]" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {activePoster.status}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    {activePoster.category}
                  </span>

                  {activePoster.isHero && (
                    <span className="rounded-full border border-purple-400/25 bg-purple-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">
                      Hero
                    </span>
                  )}
                </div>

                <h2 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {activePoster.title}
                </h2>

                <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-white/65 sm:text-base">
                  {activePoster.subtitle}
                </p>

                {activePoster.highlights && activePoster.highlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activePoster.highlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={activePoster.ctaHref}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black shadow-[0_0_35px_rgba(34,211,238,0.26)] transition hover:bg-cyan-200"
                >
                  {activePoster.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] border border-white/10" />
        </div>
      </div>
    </section>
  );
}