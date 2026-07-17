"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  ClipboardCheck,
  Mail,
  Share2,
  ShieldCheck,
} from "lucide-react";

type FooterContext = {
  status: "loading" | "authenticated" | "unauthenticated";
  role: string | null;
};

type FooterLink = {
  label: string;
  href: string;
};

const supportEmail = "omniskillsolympiad@gmail.com";

const publicLinks: readonly FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About OSO", href: "/#who-we-are" },
  { label: "Why OSO", href: "/#why-oso" },
  { label: "How OSO Works", href: "/#how-oso-works" },
  { label: "Associations", href: "/#associations" },
  { label: "Skill Championships", href: "/skill-championships" },
  { label: "Contact", href: "/#contact" },
];

const platformLinks: readonly FooterLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Daily Challenges", href: "/daily-challenges" },
  { label: "Competitions", href: "/competition" },
  { label: "Leaderboard", href: "/daily-leaderboard" },
  { label: "Skill Passport", href: "/profile" },
  { label: "WorldSkills Pathway", href: "/worldskills" },
];

const ecosystemLinks: readonly FooterLink[] = [
  { label: "Skill Schools", href: "/#skill-schools" },
  { label: "OMNI Levels", href: "/#omni-levels" },
  { label: "Career Hub", href: "/#career-hub" },
  { label: "Awards", href: "/#awards" },
  { label: "Community", href: "/#community" },
];

const adminLinks: readonly FooterLink[] = [
  { label: "Admin Command Center", href: "/admin" },
  { label: "Challenge Control", href: "/admin/manage-challenges" },
  { label: "Poster Publisher", href: "/admin/announcements" },
  { label: "Competition Control", href: "/admin/competition" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/omniskillsolympiad?igsh=MW9lMmtqeGtoaTZ3Yg==",
    icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/omni-skills-olympiad/",
    icon: LinkedInIcon,
  },
] as const;

export default function SiteFooter() {
  const [context, setContext] = useState<FooterContext>({
    status: "loading",
    role: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadFooterContext() {
      try {
        const response = await fetch("/api/account/footer-context", {
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          setContext({ status: "unauthenticated", role: null });
          return;
        }

        const payload = (await response.json()) as {
          authenticated?: boolean;
          role?: string | null;
        };

        if (!payload.authenticated) {
          setContext({ status: "unauthenticated", role: null });
          return;
        }

        setContext({
          status: "authenticated",
          role:
            typeof payload.role === "string"
              ? payload.role.trim().toUpperCase()
              : "STUDENT",
        });
      } catch {
        if (!controller.signal.aborted) {
          setContext({ status: "unauthenticated", role: null });
        }
      }
    }

    void loadFooterContext();
    return () => controller.abort();
  }, []);

  const isAuthenticated = context.status === "authenticated";
  const isAdmin = isAuthenticated && context.role === "ADMIN";

  return (
    <footer
      id="contact"
      className="relative z-30 border-t border-slate-200 bg-white text-slate-900"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-9 sm:px-8 lg:px-10 lg:py-11">
        <div className="grid items-start gap-x-9 gap-y-9 border-b border-slate-200 pb-9 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.2fr_0.82fr_0.82fr_1fr] xl:gap-x-12">
          <section className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Omni Skills Olympiad home"
              className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-4"
            >
              <Image
                src="/brand/omni-logo-new.jpeg"
                alt="Omni Skills Olympiad"
                width={2048}
                height={397}
                className="h-auto w-[210px] object-contain sm:w-[230px]"
                sizes="(max-width: 640px) 210px, 230px"
              />
            </Link>

            <p className="mt-4 max-w-[40ch] text-[15px] font-medium leading-7 text-slate-600">
              India&apos;s multidisciplinary skills ecosystem for practical learning,
              protected assessment, meaningful competition and career-ready recognition.
            </p>

            <a
              href={`mailto:${supportEmail}`}
              className="mt-5 inline-flex max-w-full items-center gap-2.5 rounded-lg text-[14px] font-bold text-slate-700 outline-none transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-3"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="break-all">{supportEmail}</span>
            </a>

            <div className="mt-4 flex items-center gap-2" aria-label="Social and sharing links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <SocialLink key={label} label={label} href={href} icon={Icon} />
              ))}
              <ShareWebsiteButton />
            </div>
          </section>

          <FooterSection title="Public site" links={publicLinks} />
          <FooterSection title="Platform" links={platformLinks} />

          <section>
            <FooterHeading>Ecosystem & account</FooterHeading>
            <nav className="mt-4 grid gap-2.5" aria-label="Ecosystem and account footer navigation">
              {ecosystemLinks.map((link) => (
                <FooterTextLink key={`${link.label}-${link.href}`} {...link} />
              ))}

              <div className="my-1 h-px w-full max-w-[190px] bg-slate-200" aria-hidden="true" />

              {context.status === "loading" ? (
                <span className="text-[14px] font-semibold text-slate-400">Checking account…</span>
              ) : null}

              {context.status === "unauthenticated" ? (
                <FooterTextLink label="Sign in or register" href="/login" />
              ) : null}

              {isAuthenticated ? (
                <FooterTextLink label="My profile" href="/profile" />
              ) : null}

              {isAdmin ? (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
                  <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.1em] text-blue-800">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Admin controls
                  </div>
                  <div className="mt-3 grid gap-2.5">
                    {adminLinks.map((link) => (
                      <FooterTextLink key={`${link.label}-${link.href}`} {...link} />
                    ))}
                  </div>
                </div>
              ) : null}
            </nav>
          </section>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-[13px] font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Omni Skills Olympiad. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/#contact" className="transition hover:text-blue-800">
              Contact
            </Link>
            <a href={`mailto:${supportEmail}`} className="transition hover:text-blue-800">
              Help desk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <section>
      <FooterHeading>{title}</FooterHeading>
      <nav className="mt-4 grid gap-2.5" aria-label={`${title} footer navigation`}>
        {links.map((link) => (
          <FooterTextLink key={`${link.label}-${link.href}`} {...link} />
        ))}
      </nav>
    </section>
  );
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[13px] font-black uppercase tracking-[0.1em] text-slate-500">
      {children}
    </h2>
  );
}

function FooterTextLink({ label, href }: FooterLink) {
  return (
    <Link
      href={href}
      className="w-fit text-[14px] font-semibold leading-6 text-slate-600 outline-none transition hover:text-blue-800 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
    >
      {label}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function ShareWebsiteButton() {
  const [copied, setCopied] = useState(false);

  async function shareWebsite() {
    const url = typeof window === "undefined" ? "" : window.location.origin;
    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Omni Skills Olympiad",
          text: "Explore the Omni Skills Olympiad ecosystem.",
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={shareWebsite}
      aria-label={copied ? "Website link copied" : "Share website"}
      title={copied ? "Copied" : "Share website"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
    >
      {copied ? (
        <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.2 8.1H3.4V21h2.8V8.1ZM4.8 3A1.8 1.8 0 1 0 4.8 6.6 1.8 1.8 0 0 0 4.8 3ZM20.6 13.6c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.8 2.1V8.1H9.1V21h2.8v-6.4c0-1.7.3-3.4 2.5-3.4 2.1 0 2.2 2 2.2 3.5V21h2.8v-7.4h1.2Z" />
    </svg>
  );
}
