import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Building2,
  Layers3,
  Network,
  Route,
  School,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";

import {
  competitionEcosystem,
  omniBrand,
  omniGrowthLoop,
  omniLevels,
  skillSchools,
  worldSkillsPathway,
} from "@/data/omni-ecosystem";

type AccentTone = {
  text: string;
  border: string;
  chip: string;
  gradient: string;
  glow: string;
  surface: string;
  icon: string;
};

const skillSchoolGlass = {
  section:
    "border-emerald-300/90 bg-emerald-100/78 shadow-[0_30px_90px_rgba(5,150,105,0.22),inset_0_1px_0_rgba(255,255,255,0.72)] ring-1 ring-emerald-200/70",
  card:
    "border-emerald-300/90 bg-emerald-100/82 shadow-[0_18px_56px_rgba(5,150,105,0.18),inset_0_1px_0_rgba(255,255,255,0.70)] ring-1 ring-emerald-200/65 hover:border-emerald-400 hover:bg-emerald-100/95 hover:shadow-[0_28px_82px_rgba(5,150,105,0.26),0_0_38px_rgba(16,185,129,0.18)]",
  icon: "border-emerald-300 bg-emerald-200/95 text-emerald-800 shadow-[0_10px_28px_rgba(5,150,105,0.16)]",
  text: "text-emerald-800",
  chip: "border-emerald-300 bg-white/82 text-emerald-800 shadow-[0_8px_22px_rgba(5,150,105,0.10)]",
  gradient: "from-emerald-700 via-green-500 to-teal-400",
  glow: "bg-emerald-400/60",
};
const omniLevelGlass = {
  section:
    "border-sky-300/90 bg-[linear-gradient(180deg,rgba(224,242,254,0.96)_0%,rgba(219,234,254,0.96)_52%,rgba(224,242,254,0.96)_100%)] shadow-[0_30px_90px_rgba(2,132,199,0.18),inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-sky-200/80",
  card:
    "border-sky-300/90 bg-sky-50/92 shadow-[0_18px_48px_rgba(2,132,199,0.10),inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-sky-200/70 hover:border-sky-400 hover:bg-sky-50 hover:shadow-[0_24px_72px_rgba(2,132,199,0.16),0_0_32px_rgba(56,189,248,0.14)]",
  icon: "border-sky-300 bg-sky-200/95 text-sky-800 shadow-[0_10px_24px_rgba(2,132,199,0.14)]",
  text: "text-sky-800",
  chip: "border-sky-300 bg-sky-50/92 text-sky-800 shadow-[0_8px_20px_rgba(2,132,199,0.10)]",
  gradient: "from-blue-700 via-sky-500 to-cyan-400",
  glow: "bg-sky-400/60",
};
const accentTones: AccentTone[] = [
  {
    text: "text-blue-700",
    border: "border-blue-200/80",
    chip: "border-blue-200 bg-blue-50/85 text-blue-700",
    gradient: "from-blue-600 via-sky-500 to-cyan-400",
    glow: "bg-blue-300/35",
    surface: "bg-blue-50/60",
    icon: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    text: "text-emerald-700",
    border: "border-emerald-200/80",
    chip: "border-emerald-200 bg-emerald-50/85 text-emerald-700",
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
    glow: "bg-emerald-300/35",
    surface: "bg-emerald-50/60",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    text: "text-yellow-700",
    border: "border-yellow-200/80",
    chip: "border-yellow-200 bg-yellow-50/85 text-yellow-700",
    gradient: "from-yellow-400 via-amber-400 to-orange-400",
    glow: "bg-yellow-300/45",
    surface: "bg-yellow-50/60",
    icon: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  {
    text: "text-violet-700",
    border: "border-violet-200/80",
    chip: "border-violet-200 bg-violet-50/85 text-violet-700",
    gradient: "from-violet-600 via-fuchsia-500 to-indigo-500",
    glow: "bg-violet-300/35",
    surface: "bg-violet-50/60",
    icon: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    text: "text-red-700",
    border: "border-red-200/80",
    chip: "border-red-200 bg-red-50/85 text-red-700",
    gradient: "from-red-600 via-rose-500 to-orange-400",
    glow: "bg-red-300/35",
    surface: "bg-red-50/60",
    icon: "border-red-200 bg-red-50 text-red-700",
  },
];

export default function OsoEcosystemOverview() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] py-16 sm:py-20">
      <div className="oso-container">
        <SectionIntro />

        <GrowthLoop />

        <div
          id="skill-schools"
          className="mt-10 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]"
        >
          <SkillSchoolsPanel />

          <div className="grid gap-6">
            <OmniLevelsPanel />
            <WorldSkillsPanel />
          </div>
        </div>

        <EcosystemPortalGrid />

        <CompetitionRhythmGrid />

        <CommunityBanner />
      </div>
    </section>
  );
}

function SectionIntro() {
  return (
    <div className="mx-auto max-w-5xl text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
        <Network className="h-4 w-4" />
        National Engineering Skills Ecosystem
      </div>

      <h2 className="oso-heading mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
        Not just competitions. A complete skill-growth ecosystem.
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
        {omniBrand.secondaryTagline}. Students learn, practice, compete, build
        proof of skill, get ranked and grow toward national recognition.
      </p>
    </div>
  );
}

function GrowthLoop() {
  return (
    <div className="relative mt-10 overflow-hidden rounded-[2.35rem] border border-slate-200/80 bg-white/58 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-7">
      <SectionGlow />

      <div className="relative z-10 flex flex-wrap justify-center gap-3">
        {omniGrowthLoop.map((step, index) => (
          <div
            key={step}
            className="group inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/72 px-4 py-2 text-sm font-black text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]">
              {index + 1}
            </span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillSchoolsPanel() {
  return (
    <section
      className={`relative overflow-hidden rounded-[2.35rem] border p-6 backdrop-blur-2xl sm:p-8 ${skillSchoolGlass.section}`}
    >
      <GreenGlassGlow />

      <PanelHeader
        icon={<School className="h-5 w-5" />}
        eyebrow="Skill Schools"
        title="Multi-domain engineering pathways"
        iconClassName={skillSchoolGlass.icon}
        eyebrowClassName={skillSchoolGlass.text}
      />

      <div className="relative z-10 mt-6 grid gap-4">
        {skillSchools.map((school, index) => (
          <article
            key={school.title}
            className={`group relative isolate overflow-hidden rounded-[1.6rem] border p-4 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 ${skillSchoolGlass.card}`}
          >
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${skillSchoolGlass.gradient}`}
            />

            <div
              aria-hidden="true"
              className={`absolute -right-16 -top-16 h-36 w-36 rounded-full ${skillSchoolGlass.glow} blur-3xl transition duration-300 group-hover:scale-125`}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.56),rgba(255,255,255,0.18))]"
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-[0.22em] ${skillSchoolGlass.text}`}
                  >
                    School {index + 1}
                  </p>

                  <h4 className="oso-heading mt-1 text-xl font-black leading-tight text-slate-950">
                    {school.title}
                  </h4>
                </div>

                <Sparkles
                  className={`h-5 w-5 shrink-0 ${skillSchoolGlass.text}`}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {school.domains.map((domain) => (
                  <span
                    key={domain}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] shadow-sm backdrop-blur-xl ${skillSchoolGlass.chip}`}
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OmniLevelsPanel() {
  return (
    <section
      id="omni-levels"
      className={`relative overflow-hidden rounded-[2.35rem] border p-6 backdrop-blur-2xl sm:p-8 ${omniLevelGlass.section}`}
    >
      <SkyGlassGlow />

      <PanelHeader
        icon={<Layers3 className="h-5 w-5" />}
        eyebrow="OMNI Levels"
        title="Institution to international growth"
        iconClassName={omniLevelGlass.icon}
        eyebrowClassName={omniLevelGlass.text}
      />

      <div className="relative z-10 mt-6 grid gap-3">
        {omniLevels.map((level, index) => (
          <article
            key={level.code}
              className={`group relative isolate grid gap-3 overflow-hidden rounded-[1.35rem] border p-4 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 sm:grid-cols-[150px_1fr_auto] sm:items-center ${omniLevelGlass.card}`}          >
            <div
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${omniLevelGlass.gradient}`}
            />

            <div
              aria-hidden="true"
              className={`absolute -right-16 -top-16 h-32 w-32 rounded-full ${omniLevelGlass.glow} blur-3xl transition duration-300 group-hover:scale-125`}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.54),rgba(255,255,255,0.16))]"
            />

            <p
  className={`relative z-10 pl-2 text-[13px] font-black uppercase leading-5 tracking-[0.08em] ${omniLevelGlass.text}`}
>
  {level.code}
</p>

            <div className="relative z-10">
              <p className="font-black text-slate-950">{level.title}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                {level.scope}
              </p>
            </div>

            <span
              className={`relative z-10 hidden rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-sm backdrop-blur-xl sm:inline-flex ${omniLevelGlass.chip}`}
            >
              Level {index + 1}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorldSkillsPanel() {
  return (
    <section className="relative overflow-hidden rounded-[2.35rem] border border-emerald-200/70 bg-white/60 p-6 shadow-[0_26px_78px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8">
      <SectionGlow />

      <PanelHeader
        icon={<Route className="h-5 w-5" />}
        eyebrow="WorldSkills Pathway"
        title="Road to national and international recognition"
        iconClassName="border-emerald-200 bg-emerald-50 text-emerald-700"
        eyebrowClassName="text-emerald-700"
      />

      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {worldSkillsPathway.map((step, index) => (
          <div
            key={step}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-emerald-700 shadow-sm"
          >
            <span>{index + 1}</span>
            {step}
          </div>
        ))}
      </div>

      <Link href="/worldskills" className="oso-btn relative z-10 mt-6">
        Explore WorldSkills
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function EcosystemPortalGrid() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <EcosystemCard
        id="career-hub"
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        title="Career Hub"
        description="Career roadmaps, skill gaps, internships and placement readiness."
        tone={accentTones[0]}
      />

      <EcosystemCard
        id="mentor-portal"
        icon={<UsersRound className="h-5 w-5" />}
        title="Mentor Portal"
        description="Mentor dashboards, impact index, recognition and guided learning."
        tone={accentTones[1]}
      />

      <EcosystemCard
        id="industry-portal"
        icon={<Building2 className="h-5 w-5" />}
        title="Industry Portal"
        description="Sponsored challenges, talent search and skill-based recruitment."
        tone={accentTones[2]}
      />

      <EcosystemCard
        id="awards"
        icon={<Award className="h-5 w-5" />}
        title="Awards & Recognition"
        description="Student, mentor and institution awards for national visibility."
        tone={accentTones[4]}
      />
    </div>
  );
}

function CompetitionRhythmGrid() {
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-5">
      {competitionEcosystem.map((item, index) => {
        const tone = accentTones[index % accentTones.length];

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`group relative isolate overflow-hidden rounded-[1.75rem] border ${tone.border} ${tone.surface} p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]`}
          >
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tone.gradient}`}
            />

            <div
              aria-hidden="true"
              className={`absolute -right-14 -top-14 h-32 w-32 rounded-full ${tone.glow} blur-3xl transition group-hover:scale-125`}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.20))]"
            />

            <div className="relative z-10">
              <Trophy className={`h-5 w-5 ${tone.text}`} />

              <p
                className={`mt-4 text-xs font-black uppercase tracking-[0.18em] ${tone.text}`}
              >
                {item.rhythm}
              </p>

              <h3 className="oso-heading mt-2 text-xl font-black text-slate-950">
                {item.title}
              </h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                {item.scope}
              </p>

              <ArrowRight className="mt-4 h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function CommunityBanner() {
  return (
    <div
      id="community"
      className="mt-10 rounded-[2rem] border border-blue-200 bg-blue-50/80 p-6 text-blue-950 shadow-[0_18px_54px_rgba(37,99,235,0.08)] backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Community + News + Media
          </p>

          <h3 className="oso-heading mt-2 text-2xl font-black">
            Technical clubs, success stories, webinars and national updates.
          </h3>
        </div>

        <div id="news-media" className="flex flex-wrap gap-2">
          {["Electronics Club", "AI Club", "Robotics Club", "Cyber Club"].map(
            (club) => (
              <span
                key={club}
                className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-blue-700"
              >
                <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                {club}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function PanelHeader({
  icon,
  eyebrow,
  title,
  iconClassName,
  eyebrowClassName,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  iconClassName: string;
  eyebrowClassName: string;
}) {
  return (
    <div className="relative z-10 flex items-center gap-3">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <p
          className={`text-xs font-black uppercase tracking-[0.22em] ${eyebrowClassName}`}
        >
          {eyebrow}
        </p>

        <h3 className="oso-heading text-2xl font-black text-slate-950">
          {title}
        </h3>
      </div>
    </div>
  );
}

function EcosystemCard({
  id,
  icon,
  title,
  description,
  tone,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  tone: AccentTone;
}) {
  return (
    <article
      id={id}
      className={`group relative isolate overflow-hidden rounded-[1.75rem] border ${tone.border} ${tone.surface} p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tone.gradient}`}
      />

      <div
        aria-hidden="true"
        className={`absolute -right-14 -top-14 h-32 w-32 rounded-full ${tone.glow} blur-3xl transition group-hover:scale-125`}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.20))]"
      />

      <div className="relative z-10">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${tone.icon}`}
        >
          {icon}
        </div>

        <h3 className="oso-heading mt-5 text-xl font-black text-slate-950">
          {title}
        </h3>

        <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}

function SectionGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(250,204,21,0.12),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0.30))]"
      />
    </>
  );
}

function GreenGlassGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(5,150,105,0.34),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.28),transparent_32%),radial-gradient(circle_at_48%_100%,rgba(110,231,183,0.62),transparent_44%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.50),rgba(236,253,245,0.34),rgba(209,250,229,0.22))]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-300/34 to-transparent"
      />
    </>
  );
}
function SkyGlassGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(224,242,254,0.94)_0%,rgba(219,234,254,0.96)_48%,rgba(224,242,254,0.94)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(14,165,233,0.16),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(125,211,252,0.22),transparent_42%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-300/24 to-transparent"
      />
    </>
  );
}