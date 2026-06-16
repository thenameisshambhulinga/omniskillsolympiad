import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
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

export default function OsoEcosystemOverview() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] py-16 sm:py-20">
      <div className="oso-container">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <Network className="h-4 w-4" />
            National Engineering Skills Ecosystem
          </div>

          <h2 className="oso-heading mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            Not just competitions. A complete skill-growth ecosystem.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
            {omniBrand.secondaryTagline}. Students learn, practice, compete,
            build proof of skill, get ranked and grow toward national recognition.
          </p>
        </div>

        <div className="mt-10 rounded-[2.25rem] border border-slate-200 bg-white/82 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-7">
          <div className="flex flex-wrap justify-center gap-3">
            {omniGrowthLoop.map((step, index) => (
              <div
                key={step}
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <div
          id="skill-schools"
          className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <section className="rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                <School className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                  Skill Schools
                </p>
                <h3 className="oso-heading text-2xl font-black text-slate-950">
                  Multi-domain engineering pathways
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {skillSchools.map((school) => (
                <article
                  key={school.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-white/78 p-4"
                >
                  <h4 className="font-black text-slate-950">{school.title}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.domains.map((domain) => (
                      <span
                        key={domain}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-blue-700"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-5">
            <section
              id="omni-levels"
              className="rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-200 bg-yellow-50 text-yellow-700">
                  <Layers3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                    OMNI Levels
                  </p>
                  <h3 className="oso-heading text-2xl font-black text-slate-950">
                    Institution to international growth
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {omniLevels.map((level) => (
                  <div
                    key={level.code}
                    className="grid gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-[90px_1fr]"
                  >
                    <p className="text-sm font-black text-blue-700">
                      {level.code}
                    </p>
                    <div>
                      <p className="font-black text-slate-950">{level.title}</p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {level.scope}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <Route className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                    WorldSkills Pathway
                  </p>
                  <h3 className="oso-heading text-2xl font-black text-slate-950">
                    Road to national and international recognition
                  </h3>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {worldSkillsPathway.map((step, index) => (
                  <div
                    key={step}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-emerald-700"
                  >
                    <span>{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>

              <Link
                href="/worldskills"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore WorldSkills
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <EcosystemCard
            id="career-hub"
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="Career Hub"
            description="Career roadmaps, skill gaps, internships and placement readiness."
          />

          <EcosystemCard
            id="mentor-portal"
            icon={<UsersRound className="h-5 w-5" />}
            title="Mentor Portal"
            description="Mentor dashboards, impact index, recognition and guided learning."
          />

          <EcosystemCard
            id="industry-portal"
            icon={<Building2 className="h-5 w-5" />}
            title="Industry Portal"
            description="Sponsored challenges, talent search and skill-based recruitment."
          />

          <EcosystemCard
            id="awards"
            icon={<Award className="h-5 w-5" />}
            title="Awards & Recognition"
            description="Student, mentor and institution awards for national visibility."
          />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-5">
          {competitionEcosystem.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200"
            >
              <Trophy className="h-5 w-5 text-blue-700" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                {item.rhythm}
              </p>
              <h3 className="oso-heading mt-2 text-xl font-black text-slate-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                {item.scope}
              </p>
              <ArrowRight className="mt-4 h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" />
            </Link>
          ))}
        </div>

        <div
          id="community"
          className="mt-10 rounded-[2rem] border border-blue-200 bg-blue-50/80 p-6 text-blue-950"
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
      </div>
    </section>
  );
}

function EcosystemCard({
  id,
  icon,
  title,
  description,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article
      id={id}
      className="rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl"
    >
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