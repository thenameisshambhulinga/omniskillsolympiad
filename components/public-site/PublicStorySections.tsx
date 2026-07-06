import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDashed,
  Mail,
  Network,
  Sparkles,
} from "lucide-react";

import {
  associatedOrganizations,
  contactInformation,
  identityContent,
  omniFramework,
  whyContent,
} from "@/data/public-site";
import styles from "@/components/public-site/public-site.module.css";

export function WhoWeAreSection() {
  return (
    <section id="who-we-are" className={`${styles.section} scroll-mt-24 bg-white`}>
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-start xl:gap-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-800">
              {identityContent.eyebrow}
            </p>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
              {identityContent.title}
            </h2>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              {identityContent.introduction}
            </p>
            <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600">
              {identityContent.supporting}
            </p>

            <blockquote className="mt-10 border-l-2 border-blue-700 pl-6">
              <p className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl">
                “{identityContent.motto}”
              </p>
              <footer className="mt-3 text-sm font-bold uppercase tracking-[0.11em] text-slate-500">
                OMNI Skills Olympiad motto
              </footer>
            </blockquote>
          </div>

          <div className="grid gap-5">
            <article className="relative overflow-hidden border-t-2 border-blue-700 bg-[#f7f9fc] p-7 sm:p-9">
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full border-[24px] border-blue-100/80" />
              <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-800">
                Vision
              </p>
              <h3 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                A world-class ecosystem for technical excellence, innovation, and future-ready competencies.
              </h3>
              <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600">
                {identityContent.vision}
              </p>
            </article>

            <article className="relative overflow-hidden border-t-2 border-cyan-700 bg-white p-7 shadow-[0_22px_65px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-9">
              <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-16 translate-y-16 rounded-full bg-cyan-100/70 blur-2xl" />
              <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan-800">
                Mission
              </p>
              <h3 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                Bridge academic knowledge and industrial expectations through progressive practical evaluation.
              </h3>
              <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600">
                {identityContent.mission}
              </p>
            </article>
          </div>
        </div>

        <div className={`${styles.frameworkTrack} mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4`}>
          {omniFramework.map((stage, index) => (
            <article key={stage.code} className="relative z-10 bg-white pt-1">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-2xl font-black text-blue-800 shadow-[0_12px_28px_rgba(25,89,209,0.1)]">
                {stage.code}
              </span>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-950">{stage.title}</h3>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                {stage.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyOsoSection() {
  return (
    <section id="why-oso" className={`${styles.section} ${styles.tintedSection} scroll-mt-24`}>
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end xl:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-800">
              {whyContent.eyebrow}
            </p>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
              {whyContent.title}
            </h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-8 text-slate-600 lg:justify-self-end">
            {whyContent.description}
          </p>
        </div>

        <div className={`${styles.problemBridge} mt-14 grid gap-6 lg:grid-cols-2`}>
          <article className="bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] ring-1 ring-slate-200 sm:p-9 lg:mr-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Without a continuous ecosystem
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  {whyContent.from.label}
                </h3>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                <CircleDashed className="h-5 w-5" />
              </span>
            </div>
            <ul className="mt-7 space-y-4">
              {whyContent.from.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-base font-semibold leading-7 text-slate-600">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                  {point}
                </li>
              ))}
            </ul>
          </article>

          <article className="relative overflow-hidden bg-[#0f2d67] p-7 text-white shadow-[0_26px_75px_rgba(15,45,103,0.2)] sm:p-9 lg:ml-6">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">
                  With the OSO progression model
                </p>
                <h3 className="mt-2 text-3xl font-black text-white">
                  {whyContent.to.label}
                </h3>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0f2d67]">
                <Network className="h-5 w-5" />
              </span>
            </div>
            <ul className="relative mt-7 space-y-4">
              {whyContent.to.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-base font-semibold leading-7 text-white/78">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-200 text-[#0f2d67]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function AssociationsSection() {
  const featured = associatedOrganizations.find((organization) => organization.featured);
  const associated = associatedOrganizations.filter((organization) => !organization.featured);

  return (
    <section id="associations" className={`${styles.section} ${styles.associationSurface} scroll-mt-24`}>
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end xl:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-800">
              Associated organisations
            </p>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
              Collaboration strengthens practical engineering education.
            </h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-8 text-slate-600 lg:justify-self-end">
            The official association material describes a collaborative ecosystem spanning academia, industry bodies, professional organisations, technology organisations, and technical partners. Relationship wording is preserved below without inventing additional affiliations.
          </p>
        </div>

        {featured ? (
          <article className="mt-14 grid overflow-hidden border border-slate-200 bg-white shadow-[0_26px_75px_rgba(15,23,42,0.09)] lg:grid-cols-[0.65fr_1.35fr]">
            <div className="flex min-h-[220px] items-center justify-center bg-[#f7f9fc] p-8 sm:p-10">
              <Image
                src="/sims-logo.png"
                alt="Silicon Microsystems"
                width={853}
                height={235}
                className="h-auto w-full max-w-[360px] object-contain"
              />
            </div>
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-800">
                {featured.relationship}
              </p>
              <h3 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-slate-600">
                {featured.description}
              </p>
            </div>
          </article>
        ) : null}

        <div className="mt-6 grid border-l border-t border-slate-200 sm:grid-cols-2 xl:grid-cols-3">
          {associated.map((organization) => (
            <article
              key={organization.shortName}
              className="group min-h-[270px] border-b border-r border-slate-200 bg-white p-6 transition hover:bg-blue-50/45 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-slate-950 px-3 text-sm font-black text-white"
                >
                  {organization.shortName}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  {organization.relationship}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-black leading-tight text-slate-950">
                {organization.name}
              </h3>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                {organization.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 max-w-4xl text-sm font-semibold leading-7 text-slate-500">
          Text-only organisation identifiers are used where approved logo assets are not present in the current project. No unofficial third-party logos have been downloaded or reproduced.
        </p>
      </div>
    </section>
  );
}

export function FinalGatewaySection() {
  return (
    <section className={`${styles.gateway} text-white`}>
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-200 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Public exploration complete
          </div>
          <h2 className="mt-5 max-w-[18ch] text-[28px] font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-[32px] lg:text-[40px]">
            Ready to take part in the ecosystem?
          </h2>
          <p className="mt-4 max-w-xl text-[17px] font-medium leading-7 text-white/70">
            Sign in to continue through the existing OSO onboarding, dashboard, assessment, and competition experience.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/continue"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-[#0b1730] shadow-[0_18px_42px_rgba(0,0,0,0.2)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1730]"
            >
              Enter the OSO platform
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href={contactInformation.emailHref}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/24 bg-white/7 px-7 py-4 text-sm font-black text-white outline-none backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1730]"
            >
              <Mail className="h-4 w-4" />
              Contact OSO
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-white/[0.055] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">
            What happens next
          </p>
          <ol className="mt-6 space-y-5">
            {[
              "Authenticate through the existing Google login flow.",
              "Complete onboarding and establish your participant profile.",
              "Access the dashboard, challenges, assessments, competitions, and results allowed for your role.",
            ].map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-200 text-sm font-black text-[#0b1730]">
                  {index + 1}
                </span>
                <span className="pt-1 text-base font-semibold leading-7 text-white/76">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <a
            href={contactInformation.websiteHref}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-cyan-200 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            Visit {contactInformation.websiteDisplay}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
