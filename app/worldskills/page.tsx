import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Factory,
  GraduationCap,
  Layers3,
  Medal,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
  Wrench,
  Zap,
} from "lucide-react";

import OsoActionTile from "@/components/oso/OsoActionTile";
import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoPageShell from "@/components/oso/OsoPageShell";
import OsoProgressBar from "@/components/oso/OsoProgressBar";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";
import {
  competitionEcosystem,
  skillSchools,
  vibgyorLevels,
  worldSkillsPathway,
} from "@/data/omni-ecosystem";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const preparationTracks = [
  {
    title: "Electronics & Embedded Systems",
    description:
      "Circuit fundamentals, microcontrollers, firmware, debugging, sensors and product-level implementation.",
    icon: CircuitBoard,
    tone: "blue" as const,
  },
  {
    title: "Robotics & Automation",
    description:
      "PLC, SCADA, robotics logic, instrumentation, automation workflows and practical system integration.",
    icon: Wrench,
    tone: "emerald" as const,
  },
  {
    title: "AI & Smart Systems",
    description:
      "Applied AI, data-driven problem solving, computer vision and intelligent engineering systems.",
    icon: BrainCircuit,
    tone: "cyan" as const,
  },
  {
    title: "Manufacturing & Product Engineering",
    description:
      "CAD/CAM thinking, prototyping, hardware validation, troubleshooting and product readiness.",
    icon: Factory,
    tone: "yellow" as const,
  },
];

const worldSkillsSignals = [
  "Daily skill consistency",
  "Competition performance",
  "Domain specialization",
  "Portfolio proof",
  "Mentor feedback",
  "Industry exposure",
];

export default function WorldSkillsPage() {
  return (
    <OsoPageShell>
      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <OsoStatusPill
                label="WorldSkills Hub"
                tone="blue"
                icon={<GraduationCap className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label="National Pathway"
                tone="emerald"
                icon={<Route className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label="Skill Excellence"
                tone="yellow"
                icon={<Award className="h-3.5 w-3.5" />}
              />
            </div>

            <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Road to{" "}
              <span className="text-blue-600">WorldSkills readiness.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
              OMNI Skills Olympiad prepares students for higher-level skill
              recognition through structured practice, competitions, rankings,
              portfolios, domain specialization and future WorldSkills-aligned
              pathways.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/daily-challenges"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Preparing
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/competition"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Explore Competitions
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Pathway Depth
            </p>

            <p className="oso-heading mt-3 text-6xl font-black text-slate-950">
              {worldSkillsPathway.length}
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Growth stages from institution-level participation to
              international readiness.
            </p>

            <OsoProgressBar value={65} tone="blue" className="mt-5" />
          </div>
        </div>
      </OsoGlassSurface>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <OsoMetricTile
          icon={<Route className="h-5 w-5" />}
          label="Pathway"
          value="6 Stages"
          helper="Institution to international"
          tone="blue"
        />

        <OsoMetricTile
          icon={<CircuitBoard className="h-5 w-5" />}
          label="Skill Schools"
          value={skillSchools.length}
          helper="Multi-domain preparation"
          tone="cyan"
        />

        <OsoMetricTile
          icon={<Trophy className="h-5 w-5" />}
          label="Competitions"
          value={competitionEcosystem.length}
          helper="Daily to national level"
          tone="emerald"
        />

        <OsoMetricTile
          icon={<Layers3 className="h-5 w-5" />}
          label="VIBGYOR"
          value={vibgyorLevels.length}
          helper="Skill progression stages"
          tone="yellow"
        />
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Road to WorldSkills"
          title="A clear pathway from campus to global recognition."
          description="This roadmap gives students, mentors and institutions a structured view of how OMNI participation can grow into national and international skill readiness."
          icon={<Network className="h-5 w-5" />}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {worldSkillsPathway.map((step, index) => (
            <article
              key={step}
              className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.07),transparent_45%)]"
              />

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <span className="text-sm font-black">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="oso-heading mt-5 text-xl font-black text-slate-950">
                  {step}
                </h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
                  {getPathwayDescription(step)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </OsoGlassSurface>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Competition Mapping"
            title="OMNI competitions become preparation signals."
            description="Each competition rhythm builds different types of evidence: consistency, domain skill, ranking strength, portfolio proof and readiness for higher-level evaluations."
            icon={<Trophy className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-4">
            {competitionEcosystem.map((competition, index) => (
              <Link
                key={competition.title}
                href={competition.href}
                className="group grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white/82 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/35 sm:grid-cols-[70px_1fr_auto] sm:items-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <span className="text-sm font-black">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                    {competition.rhythm}
                  </p>

                  <h3 className="mt-1 font-black text-slate-950">
                    {competition.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    {competition.scope}
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
              </Link>
            ))}
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Readiness Signals"
            title="What OMNI should measure for WorldSkills direction."
            description="WorldSkills readiness is not one score. It is a layered signal built from activity, competitions, portfolio quality, domain depth and mentor/industry exposure."
            icon={<Target className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {worldSkillsSignals.map((signal, index) => (
              <article
                key={signal}
                className="rounded-[1.5rem] border border-slate-200 bg-white/82 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Signal {index + 1}
                  </p>
                </div>

                <h3 className="mt-4 font-black text-slate-950">{signal}</h3>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-yellow-200 bg-yellow-50/80 p-5 text-yellow-900">
            <p className="font-black">Production rule</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-yellow-900/80">
              Future WorldSkills scoring should be built from existing OMNI
              data: attempts, points, VIBGYOR stage, badges, portfolio,
              competition history and mentor verification.
            </p>
          </div>
        </OsoGlassSurface>
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Preparation Tracks"
          title="High-value engineering tracks for future skill excellence."
          description="These tracks connect the current competition ecosystem with practical training, finishing-school readiness and industry-facing skill proof."
          icon={<BookOpenCheck className="h-5 w-5" />}
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {preparationTracks.map((track) => {
            const Icon = track.icon;

            return (
              <article
                key={track.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="oso-heading mt-5 text-xl font-black text-slate-950">
                  {track.title}
                </h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
                  {track.description}
                </p>

                <div className="mt-5">
                  <OsoProgressBar value={70} tone={track.tone} />
                </div>
              </article>
            );
          })}
        </div>
      </OsoGlassSurface>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Skill Schools"
            title="Domain schools that feed the WorldSkills pathway."
            description="OMNI Skill Schools make the ecosystem wider than only electronics and help the platform scale nationally across engineering branches."
            icon={<GraduationCap className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-3">
            {skillSchools.slice(0, 5).map((school) => (
              <article
                key={school.title}
                className="rounded-[1.35rem] border border-slate-200 bg-white/82 p-4 shadow-sm"
              >
                <h3 className="font-black text-slate-950">{school.title}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {school.domains.slice(0, 5).map((domain) => (
                    <span
                      key={domain}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-blue-700"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </OsoGlassSurface>

        <OsoGlassSurface hover={false} className="p-6 sm:p-8">
          <OsoSectionHeader
            eyebrow="Industry Exposure"
            title="Top performers should unlock real-world opportunities."
            description="WorldSkills preparation becomes stronger when high-performing students are connected with industry visits, mentor sessions, technical reviews and product-oriented exposure."
            icon={<Building2 className="h-5 w-5" />}
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <OpportunityCard
              icon={<UsersRound className="h-5 w-5" />}
              title="Mentor Review"
              description="Mentors can evaluate portfolio proof, consistency and technical growth."
            />

            <OpportunityCard
              icon={<Factory className="h-5 w-5" />}
              title="Industry Visit"
              description="High Silicon Point earners can be shortlisted for industrial exposure."
            />

            <OpportunityCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Skill Verification"
              description="Admin or mentor verification can strengthen passport credibility."
            />

            <OpportunityCard
              icon={<Medal className="h-5 w-5" />}
              title="Recognition Track"
              description="Badges, awards and rankings make students visible beyond college."
            />
          </div>
        </OsoGlassSurface>
      </section>

      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              Your journey starts with one challenge
            </p>

            <h2 className="oso-heading mt-3 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              Build skill evidence today. Grow toward national recognition
              tomorrow.
            </h2>

            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              Start with daily challenges, build Silicon Points, improve your
              Skill Passport and enter competitions that prepare you for higher
              recognition pathways.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/daily-challenges"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Challenge
              <Zap className="h-4 w-4" />
            </Link>

            <Link
              href="/profile"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              View Passport
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </OsoGlassSurface>

      <section className="grid gap-5 lg:grid-cols-3">
        <OsoActionTile
          href="/daily-challenges"
          icon={<Zap className="h-5 w-5" />}
          title="Practice Daily"
          description="Build consistency signals through short daily competitions."
          meta="Practice"
          tone="blue"
        />

        <OsoActionTile
          href="/competition"
          icon={<Trophy className="h-5 w-5" />}
          title="Enter Competitions"
          description="Move from practice to ranking, recognition and advanced events."
          meta="Compete"
          tone="emerald"
        />

        <OsoActionTile
          href="/profile"
          icon={<Sparkles className="h-5 w-5" />}
          title="Strengthen Passport"
          description="Convert your activity into a profile mentors and industry can understand."
          meta="Identity"
          tone="yellow"
        />
      </section>
    </OsoPageShell>
  );
}

function OpportunityCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white/82 p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h3 className="oso-heading mt-5 text-xl font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function getPathwayDescription(step: string) {
  if (step === "Institution") {
    return "Students begin with campus-level participation, practice and early ranking signals.";
  }

  if (step === "District") {
    return "Strong students become visible beyond their institution through district-level competition signals.";
  }

  if (step === "State") {
    return "State-level readiness grows from consistent performance, portfolio proof and domain depth.";
  }

  if (step === "National") {
    return "National-level recognition requires high-quality evidence across competitions, skills and readiness.";
  }

  if (step === "WorldSkills India") {
    return "Top performers can be mapped toward advanced preparation and national skill excellence pathways.";
  }

  return "The final aspiration is international-level skill excellence and global engineering recognition.";
}