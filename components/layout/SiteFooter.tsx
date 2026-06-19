"use client";

import { useState, type ReactNode } from "react";
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

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: <InstagramIcon className="h-5 w-5" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <LinkedInIcon className="h-5 w-5" />,
  },
  {
    label: "X",
    href: "#",
    icon: <XSocialIcon className="h-5 w-5" />,
  },
  {
    label: "YouTube",
    href: "#",
    icon: <YouTubeIcon className="h-5 w-5" />,
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: <WhatsAppIcon className="h-5 w-5" />,
  },
];

export default function SiteFooter() {
  return (
    <footer
      className="relative z-30 isolate border-t border-slate-200 bg-white/95 text-slate-950 shadow-[0_-24px_70px_rgba(15,23,42,0.045)] backdrop-blur-xl"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
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
              <FooterAction
                href="/login"
                icon={<UsersRound className="h-4 w-4" />}
              >
                Register
              </FooterAction>

              <FooterAction
                href="/competition"
                icon={<Trophy className="h-4 w-4" />}
              >
                Compete
              </FooterAction>

              <FooterAction
                href="/worldskills"
                icon={<Network className="h-4 w-4" />}
              >
                WorldSkills
              </FooterAction>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.78fr_0.78fr_0.78fr_0.82fr_0.96fr]">
          <section className="flex flex-col">
            <Link
  href="/"
  aria-label="Omni Skills Olympiad Home"
  className="flex shrink-0 items-center overflow-visible"
>
  <Image
    src="/brand/omni-logo-new.jpeg"
    alt="Omni Skills Olympiad"
    width={2048}
    height={397}
    priority
    className="h-12 w-auto object-contain sm:h-14 lg:h-16"
  />
</Link>

            <div className="mt-3 max-w-sm space-y-3">
              <p className="text-sm font-bold leading-7 text-slate-600">
                {omniBrand.secondaryTagline}.
              </p>

              <p className="text-sm font-semibold leading-7 text-slate-500">
                Built to scale from institutional competitions to national
                recognition, skill passports and future WorldSkills pathways.
              </p>
            </div>
          </section>

          {footerGroups.map((group) => (
            <FooterColumn
              key={group.title}
              title={group.title}
              links={group.links}
            />
          ))}

          <section className="flex flex-col">
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

        <section className="mt-8 flex justify-center">
          <div className="relative isolate w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-5 py-5 shadow-[0_22px_80px_rgba(15,23,42,0.22)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_82%_30%,rgba(37,99,235,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]"
            />

            <div className="relative z-10 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-cyan-200">
                Connect & Share
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {socialLinks.map((social) => (
                  <SocialGlowIcon
                    key={social.label}
                    href={social.href}
                    label={social.label}
                  >
                    {social.icon}
                  </SocialGlowIcon>
                ))}

                <ShareWebsiteButton />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-5 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600 xl:flex-row xl:items-center xl:justify-between">
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
                className="h-auto w-[150px] object-contain"
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
    <h3 className="oso-heading text-lg font-black text-slate-950">
      {children}
    </h3>
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

function SocialGlowIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/35 bg-white/10 text-white shadow-[0_0_18px_rgba(34,211,238,0.28),inset_0_0_16px_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-400/15 hover:text-cyan-50 hover:shadow-[0_0_26px_rgba(34,211,238,0.58),0_0_48px_rgba(37,99,235,0.30),inset_0_0_18px_rgba(255,255,255,0.10)]"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 to-transparent opacity-0 transition group-hover:opacity-100" />
      <span className="relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]">
        {children}
      </span>
    </Link>
  );
}

function ShareWebsiteButton() {
  const [copied, setCopied] = useState(false);

  const shareWebsite = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://omni-skills-olympiad.com";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "OMNI Skills Olympiad",
          text: "India's Engineering Skills Competition & Career Development Ecosystem",
          url,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={shareWebsite}
      aria-label="Share website"
      className="group relative inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-cyan-300/35 bg-white/10 px-4 text-white shadow-[0_0_18px_rgba(34,211,238,0.28),inset_0_0_16px_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-400/15 hover:shadow-[0_0_26px_rgba(34,211,238,0.58),0_0_48px_rgba(37,99,235,0.30),inset_0_0_18px_rgba(255,255,255,0.10)]"
    >
      <span className="relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]">
        <ShareBoxArrowIcon className="h-5 w-5" />
      </span>
      <span className="relative z-10 hidden text-xs font-black uppercase tracking-[0.14em] sm:inline">
        {copied ? "Copied" : "Share"}
      </span>
    </button>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6.5 9.5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 19V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 13.5C10.5 11.8 11.8 9.5 14.5 9.5C17.2 9.5 18.5 11.3 18.5 14.5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6.5" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

function XSocialIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6 5L18 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 5L6 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3.5" y="6.5" width="17" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5.5 20L6.6 16.7C5.8 15.4 5.4 14 5.4 12.5C5.4 8.4 8.7 5.1 12.8 5.1C16.9 5.1 20.2 8.4 20.2 12.5C20.2 16.6 16.9 19.9 12.8 19.9C11.4 19.9 10.1 19.5 8.9 18.8L5.5 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.1 9.4C10.3 9 10.5 9 10.8 9H11.2C11.4 9 11.6 9.1 11.7 9.4L12.1 10.4C12.2 10.7 12.2 10.9 12 11.1L11.7 11.5C12.2 12.5 13 13.3 14 13.8L14.5 13.4C14.7 13.2 14.9 13.2 15.2 13.3L16.2 13.8C16.5 13.9 16.6 14.1 16.6 14.4V14.7C16.6 15.1 16.4 15.4 16 15.6C15.4 15.9 14.4 16 13.1 15.4C11.5 14.8 10.2 13.5 9.6 11.9C9 10.6 9.8 9.9 10.1 9.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShareBoxArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 7H7.5C6.4 7 5.5 7.9 5.5 9V16.5C5.5 17.6 6.4 18.5 7.5 18.5H15C16.1 18.5 17 17.6 17 16.5V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M13 5.5H18.5V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 5.5L11.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}