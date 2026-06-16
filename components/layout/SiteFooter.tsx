import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  Mail,
  Network,
  Trophy,
  UsersRound,
} from "lucide-react";


import {
  adminOperations,
  footerGroups,
  omniBrand,
  omniGrowthLoop,
} from "@/data/omni-ecosystem";

export default function SiteFooter() {
  return (
    <footer
      className="relative z-30 isolate border-t border-slate-200 bg-white/95 text-slate-950 shadow-[0_-24px_70px_rgba(15,23,42,0.045)] backdrop-blur-xl"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
        <section className="mb-8 rounded-[2rem] border border-blue-200 bg-blue-50/80 p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                {omniBrand.tagline}
              </p>

              <h2 className="oso-heading mt-2 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                {omniBrand.closing}
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {omniGrowthLoop.slice(0, 6).map((step) => (
                  <span
                    key={step}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-blue-700"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <FooterAction href="/login" icon={<UsersRound className="h-4 w-4" />}>
                Register
              </FooterAction>
              <FooterAction href="/competition" icon={<Trophy className="h-4 w-4" />}>
                Compete
              </FooterAction>
              <FooterAction href="/worldskills" icon={<Network className="h-4 w-4" />}>
                WorldSkills
              </FooterAction>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr_0.85fr_0.9fr]">
          <section>
            <Link href="/" className="inline-flex items-center">
              <div className="relative flex h-[72px] w-[285px] items-center overflow-visible">
                <Image
                  src="/brand/omni-logo-h.png"
                  alt="Omni Skills Olympiad"
                  width={1191}
                  height={843}
                  priority
                  className="h-auto w-[265px] object-contain object-left brightness-0"
                />
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-slate-600">
              {omniBrand.secondaryTagline}.
            </p>

            <p className="mt-3 max-w-sm text-sm font-semibold leading-7 text-slate-500">
              Built to scale from institutional competitions to national
              recognition, skill passports and future WorldSkills pathways.
            </p>
          </section>

          {footerGroups.map((group) => (
            <FooterColumn key={group.title} title={group.title} links={group.links} />
          ))}

          <section>
            <FooterTitle>Admin Ops</FooterTitle>

            <nav className="mt-4 space-y-3" aria-label="Admin operations links">
              {adminOperations.map((link, index) => (
                <FooterTextLink key={link.href} href={link.href}>
                  <span className="inline-flex items-center gap-2">
                    {index === 0 ? (
                      <BookOpenCheck className="h-4 w-4 text-blue-700" />
                    ) : index === 1 ? (
                      <Trophy className="h-4 w-4 text-blue-700" />
                    ) : (
                      <Building2 className="h-4 w-4 text-blue-700" />
                    )}
                    {link.label}
                  </span>
                </FooterTextLink>
              ))}
            </nav>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <p>
              © {new Date().getFullYear()} Omni Skills Olympiad. All rights
              reserved.
            </p>

            <span className="hidden h-4 w-px bg-slate-300 sm:block" />

            <div className="flex flex-wrap items-center gap-2">
              <span>Powered by</span>
              <Image
                src="/sims-logo.png"
                alt="Silicon Microsystems"
                width={170}
                height={50}
                className="h-auto w-[138px] object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" className="transition hover:text-blue-700">
              Privacy Policy
            </Link>
            <Link href="/" className="transition hover:text-blue-700">
              Terms
            </Link>
            <Link href="/" className="transition hover:text-blue-700">
              Contact
            </Link>

            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-blue-700" />
              Help desk
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <section>
      <FooterTitle>{title}</FooterTitle>

      <nav className="mt-4 space-y-3" aria-label={`${title} footer links`}>
        {links.map((link) => (
          <FooterTextLink key={`${title}-${link.label}`} href={link.href}>
            {link.label}
          </FooterTextLink>
        ))}
      </nav>
    </section>
  );
}

function FooterTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="oso-heading text-lg font-black text-slate-950">{children}</h3>
  );
}

function FooterTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-2 text-[15px] font-semibold leading-7 text-slate-600 transition hover:translate-x-0.5 hover:text-blue-700"
    >
      <span>{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}

function FooterAction({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
    >
      {icon}
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition group-hover:opacity-100" />
    </Link>
  );
}