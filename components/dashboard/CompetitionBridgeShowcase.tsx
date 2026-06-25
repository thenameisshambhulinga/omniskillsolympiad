import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CircuitBoard,
  ExternalLink,
  Filter,
  Globe2,
  MapPinned,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";

const discoveryChips = [
  "All Competitions",
  "Skill Arenas",
  "Hackathons",
  "National Pathways",
  "Research",
  "Community",
] as const;

const platformCards = [
  {
    title: "WorldSkills Global",
    type: "International Skill Stage",
    description:
      "Explore the global skills movement and competition ecosystem that celebrates excellence across technical and vocational domains.",
    href: "https://worldskills.org/",
    primaryTag: "Global",
    secondaryTag: "Official",
    theme: "blue" as const,
    icon: <Globe2 className="h-6 w-6" />,
  },
  {
    title: "IndiaSkills / WorldSkills India",
    type: "National Skill Gateway",
    description:
      "Discover the India-facing skill competition pathway that can guide learners toward state, national and global representation.",
    href: "https://www.worldskillsindia.co.in/",
    primaryTag: "National",
    secondaryTag: "Progression",
    theme: "emerald" as const,
    icon: <MapPinned className="h-6 w-6" />,
  },
  {
    title: "Kaggle Competitions",
    type: "AI Competition Model",
    description:
      "A reference-style discovery experience for data challenges, AI competitions, research-style tasks and hackathon energy.",
    href: "https://www.kaggle.com/competitions",
    primaryTag: "AI",
    secondaryTag: "Discovery",
    theme: "cyan" as const,
    icon: <BrainCircuit className="h-6 w-6" />,
  },
] as const;

export default function CompetitionBridgeShowcase() {
  return (
    <OsoGlassSurface hover={false} className="overflow-hidden p-6 sm:p-8">
      <OsoSectionHeader
        eyebrow="Competition Bridge"
        title="Your pathway beyond campus."
        description="A competition discovery layer inspired by modern challenge platforms — helping students see where OMNI can connect them with recognized ecosystems and bigger opportunity spaces."
        icon={<Trophy className="h-5 w-5" />}
      />

      <div className="mt-7 space-y-6">
        <div className="rounded-[1.7rem] border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 shadow-inner">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <span className="text-sm font-semibold text-slate-400">
                Search competition platforms, skill stages and opportunity tracks...
              </span>
            </div>

            <div className="inline-flex min-h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">
              <Filter className="h-4 w-4 text-slate-500" />
              Filters
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {discoveryChips.map((chip, index) => (
              <span
                key={chip}
                className={`rounded-full border px-4 py-2 text-xs font-black tracking-[0.02em] ${
                  index === 0
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.09)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden bg-slate-950 p-7 text-white sm:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.45),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(20,184,166,0.30),transparent_30%),radial-gradient(circle_at_52%_100%,rgba(250,204,21,0.22),transparent_32%),linear-gradient(135deg,#020617_0%,#020617_28%,#0f172a_46%,#052e45_100%)]"
              />

              <div
                aria-hidden="true"
                className="absolute right-8 top-7 h-24 w-24 rounded-full border border-white/12"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-10 h-28 w-28 rounded-full bg-yellow-400/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-12 right-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl"
              />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">
                  <CircuitBoard className="h-4 w-4" />
                  OMNI Competition Discovery
                </div>

                <h3 className="oso-heading mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                  Practice locally. <br />
                  Compete nationally. <br />
                  Aim globally.
                </h3>

                <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/78">
                  This bridge should feel like a launchpad. Students discover
                  challenge ecosystems, understand the next stage after OMNI and
                  explore real competition destinations with clarity.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/competition"
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-950 transition hover:-translate-y-0.5"
                  >
                    Explore OMNI Competitions
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="https://worldskills.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    See Global Pathway
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <HeroMiniStat label="OMNI" value="Practice" />
                  <HeroMiniStat label="IndiaSkills" value="National" />
                  <HeroMiniStat label="WorldSkills" value="Global" />
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-7 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.18),transparent_18%),radial-gradient(circle_at_80%_22%,rgba(16,185,129,0.16),transparent_18%),radial-gradient(circle_at_62%_78%,rgba(250,204,21,0.18),transparent_22%)]"
              />

              <div className="relative z-10 flex h-full items-center justify-center">
                <div className="relative h-[290px] w-full max-w-[510px]">
                  <div className="absolute left-0 top-10 w-[56%] rotate-[-5deg] overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/90 shadow-[0_22px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                    <div className="h-32 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-400">
                      <IllustrationOverlay />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">
                        Global Skill Stage
                      </div>
                      <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                      <div className="h-3 w-full rounded-full bg-slate-100" />
                      <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                    </div>
                  </div>

                  <div className="absolute right-0 top-0 w-[50%] rotate-[6deg] overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/92 shadow-[0_22px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                    <div className="h-28 bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-300">
                      <IllustrationOverlay />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                        National Gateway
                      </div>
                      <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                      <div className="h-3 w-full rounded-full bg-slate-100" />
                      <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-[20%] w-[62%] rotate-[2deg] overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_26px_56px_rgba(15,23,42,0.14)] backdrop-blur-xl">
                    <div className="h-36 bg-gradient-to-br from-cyan-500 via-sky-400 to-violet-400">
                      <IllustrationOverlay />
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-700">
                          AI Competition Model
                        </div>

                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                          <Trophy className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                          Discover
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                          Compete
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                          Grow
                        </span>
                      </div>

                      <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                      <div className="h-3 w-full rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {platformCards.map((card) => (
            <PlatformCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </OsoGlassSurface>
  );
}

function PlatformCard({
  card,
}: {
  card: {
    title: string;
    type: string;
    description: string;
    href: string;
    primaryTag: string;
    secondaryTag: string;
    theme: "blue" | "emerald" | "cyan";
    icon: ReactNode;
  };
}) {
  const theme =
    card.theme === "emerald"
      ? {
          hero: "from-emerald-500 via-teal-400 to-cyan-300",
          chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
          soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-200/50",
        }
      : card.theme === "cyan"
        ? {
            hero: "from-cyan-500 via-sky-400 to-violet-400",
            chip: "border-cyan-200 bg-cyan-50 text-cyan-700",
            soft: "bg-cyan-50 text-cyan-700 border-cyan-200",
            dot: "bg-cyan-200/50",
          }
        : {
            hero: "from-blue-600 via-indigo-500 to-cyan-400",
            chip: "border-blue-200 bg-blue-50 text-blue-700",
            soft: "bg-blue-50 text-blue-700 border-blue-200",
            dot: "bg-blue-200/50",
          };

  return (
    <article className="group overflow-hidden rounded-[1.85rem] border border-slate-200 bg-white shadow-[0_18px_52px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
      <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${theme.hero}`}>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,0.7),transparent_14%),radial-gradient(circle_at_78%_26%,rgba(255,255,255,0.22),transparent_18%),radial-gradient(circle_at_76%_76%,rgba(255,255,255,0.26),transparent_20%)]"
        />

        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-xl">
          {card.icon}
          {card.type}
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="relative rounded-[1.45rem] border border-white/35 bg-white/16 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-white/70" />
                <span className="h-3 w-3 rounded-full bg-white/45" />
                <span className="h-3 w-3 rounded-full bg-white/25" />
              </div>

              <Sparkles className="h-4 w-4 text-white/85" />
            </div>

            <div className="mt-4 grid gap-2">
              <div className="h-3 w-3/4 rounded-full bg-white/70" />
              <div className="h-3 w-full rounded-full bg-white/35" />
              <div className="h-3 w-5/6 rounded-full bg-white/35" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${theme.chip}`}
          >
            {card.primaryTag}
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${theme.soft}`}
          >
            {card.secondaryTag}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
          {card.title}
        </h3>

        <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
          {card.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <a
            href={card.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-blue-700 transition hover:text-blue-900"
          >
            Visit Platform
            <ExternalLink className="h-4 w-4" />
          </a>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
            Active Link
          </div>
        </div>
      </div>
    </article>
  );
}

function HeroMiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function IllustrationOverlay() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-6 top-5 h-12 w-12 rounded-full border border-white/40 bg-white/18 backdrop-blur-xl" />
      <div className="absolute right-8 top-7 h-16 w-16 rounded-full border border-white/30 bg-white/12 backdrop-blur-xl" />
      <div className="absolute bottom-5 left-8 h-10 w-24 rounded-full border border-white/30 bg-white/16 backdrop-blur-xl" />
      <div className="absolute bottom-6 right-6 h-12 w-12 rounded-2xl border border-white/28 bg-white/15 backdrop-blur-xl" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="absolute left-[22%] top-[58%] h-px w-[48%] rotate-[-20deg] bg-white/35" />
      <div className="absolute left-[38%] top-[30%] h-px w-[32%] rotate-[25deg] bg-white/35" />
    </div>
  );
}
