//file location -- components/landing/clean/OsoLivePosterBoard.tsx
"use client";

import type { ReactNode } from "react";
import OsoIllustrationAsset, {
  OSO_ILLUSTRATIONS,
} from "@/components/landing/clean/OsoIllustrationAsset";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Radio,
  Sparkles,
} from "lucide-react";

import LoopTypewriter from "@/components/ui/LoopTypewriter";

export type LivePosterItem = {
  id: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  imageUrl?: string;
  tag?: string;
  updatedAt?: string;
};

type ApiPosterRecord = Record<string, unknown>;

type OsoLivePosterBoardProps = {
  posters?: LivePosterItem[];
  apiEndpoint?: string;
};

const AUTO_ROTATE_MS = 5200;
const DEFAULT_API_ENDPOINT = "/api/public/announcement-posters";

export default function OsoLivePosterBoard({
  posters = [],
  apiEndpoint = DEFAULT_API_ENDPOINT,
}: OsoLivePosterBoardProps) {
  const [livePosters, setLivePosters] = useState<LivePosterItem[]>(posters);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastPayloadKeyRef = useRef("");

  const safePosters = useMemo(() => {
    if (livePosters.length > 0) {
      return livePosters;
    }

    return getFallbackPosters();
  }, [livePosters]);

  const ingestPosterPayload = useCallback((payload: unknown) => {
    const normalized = normalizeApiPayload(payload);

    if (normalized.length === 0) {
      return;
    }

    const nextKey = createPayloadKey(normalized);

    if (nextKey === lastPayloadKeyRef.current) {
      return;
    }

    lastPayloadKeyRef.current = nextKey;
    setLivePosters(normalized);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (posters.length > 0) {
      lastPayloadKeyRef.current = createPayloadKey(posters);
      setLivePosters(posters);
    }
  }, [posters]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLivePosters() {
      try {
        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload: unknown = await response.json();
        ingestPosterPayload(payload);
      } catch {
        // Keep initial posters/fallback alive. No layout crash.
      }
    }

    loadLivePosters();

    return () => controller.abort();
  }, [apiEndpoint, ingestPosterPayload]);

  useEffect(() => {
    if (safePosters.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safePosters.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [safePosters.length]);

  useEffect(() => {
    if (activeIndex > safePosters.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, safePosters.length]);

  const activePoster = safePosters[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8f9fa] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
      >
        <OsoIllustrationAsset
          src={OSO_ILLUSTRATIONS.postCardPattern}
          alt="Abstract OSO post card background pattern"
          decorative
          imageClassName="h-full w-full object-cover mix-blend-multiply"
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:px-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              Live Poster Board
            </p>
<h2 className="oso-heading mt-1 min-h-10 text-[1.9rem] font-black leading-tight text-slate-950">
  <LoopTypewriter
    text="Latest OSO Updates"
    speedMs={45}
    deleteSpeedMs={25}
    pauseMs={2200}
    startDelayMs={500}
  />
</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
              Active
            </span>

            <div className="flex items-center gap-2">
              <PosterNavButton
                label="Show previous poster"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === 0 ? safePosters.length - 1 : current - 1,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </PosterNavButton>

              <PosterNavButton
                label="Show next poster"
                onClick={() =>
                  setActiveIndex(
                    (current) => (current + 1) % safePosters.length,
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </PosterNavButton>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.article
              key={activePoster.id}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.985 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Link
                href={activePoster.ctaHref}
                className="group grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_20px_48px_rgba(15,23,42,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:grid-cols-[260px_1fr]"
              >
                <div className="relative min-h-[235px] overflow-hidden border-b border-slate-200 bg-slate-200 md:border-b-0 md:border-r">
                  {activePoster.imageUrl ? (
                    <img
                      src={activePoster.imageUrl}
                      alt={activePoster.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#eef2ff)]">
                      <div className="rounded-[1.4rem] border border-white/70 bg-white/85 px-8 py-6 text-center shadow-lg backdrop-blur">
                        <Sparkles className="mx-auto h-8 w-8 text-blue-700" />
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                          OSO Live
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                      {activePoster.tag ?? "Announcement"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                      <Radio className="h-3.5 w-3.5" />
                      Live
                    </span>
                  </div>

                  <h3 className="oso-heading mt-5 text-[2rem] font-black leading-tight text-slate-950">
                    {activePoster.title}
                  </h3>

                  <p className="mt-4 text-[1.08rem] font-medium leading-8 text-slate-600">
                    {activePoster.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-blue-700">
                    {activePoster.ctaLabel}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.article>
          </AnimatePresence>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {safePosters.slice(0, 4).map((item, index) => {
              const active = index === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-2xl border px-4 py-3 text-left transition duration-200 ${
                    active
                      ? "border-blue-300 bg-blue-50 shadow-[0_10px_22px_rgba(37,99,235,0.10)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  aria-label={`Show poster ${item.title}`}
                  aria-pressed={active}
                >
                  <p className="truncate text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {item.tag ?? "Poster"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-black leading-6 text-slate-900">
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterNavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

function normalizeApiPayload(payload: unknown): LivePosterItem[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizePosterRecord).filter(Boolean) as LivePosterItem[];
  }

  if (isRecord(payload)) {
    const possibleArrays = [payload.posters, payload.data, payload.items];

    for (const item of possibleArrays) {
      if (Array.isArray(item)) {
        return item
          .map(normalizePosterRecord)
          .filter(Boolean) as LivePosterItem[];
      }
    }
  }

  return [];
}

function normalizePosterRecord(value: unknown): LivePosterItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = getString(value.id);
  const title = getString(value.title) ?? getString(value.name);
  const description =
    getString(value.description) ??
    getString(value.subtitle) ??
    getString(value.summary);
  const ctaHref =
    getString(value.ctaHref) ??
    getString(value.href) ??
    getString(value.link) ??
    "/competition";
  const ctaLabel =
    getString(value.ctaLabel) ??
    getString(value.buttonLabel) ??
    getString(value.actionLabel) ??
    "Explore";
  const imageUrl =
    getString(value.imageUrl) ??
    getString(value.mobileImageUrl) ??
    getString(value.image) ??
    getString(value.posterUrl);
  const tag =
    getString(value.category) ?? getString(value.tag) ?? getString(value.type);
  const updatedAt = getString(value.updatedAt);

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    description:
      description ??
      "Explore competitions, announcements and skill development opportunities.",
    ctaHref,
    ctaLabel,
    imageUrl,
    tag,
    updatedAt,
  };
}

function createPayloadKey(items: LivePosterItem[]) {
  return items
    .map((item) => `${item.id}:${item.updatedAt ?? ""}:${item.title}`)
    .join("|");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getFallbackPosters(): LivePosterItem[] {
  return [
    {
      id: "oso-live-1",
      title: "Omni Skills Olympiad",
      description:
        "Discover current student opportunities, competition updates and live ecosystem announcements.",
      ctaHref: "/competition",
      ctaLabel: "Explore",
      tag: "Omni Skills Olympiad",
    },
  ];
}
