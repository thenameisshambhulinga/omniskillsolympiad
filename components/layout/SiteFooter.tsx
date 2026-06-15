import type { ComponentType, ReactNode, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Building2, Mail, UsersRound } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const productLinks: FooterLink[] = [
  { label: "Daily Challenges", href: "/daily-challenges" },
  { label: "Leaderboard", href: "/daily-leaderboard" },
  { label: "Competition Arena", href: "/competition" },
  { label: "Skill Passport", href: "/profile" },
];

const participateLinks: FooterLink[] = [
  { label: "Register as Student", href: "/login" },
  { label: "Complete Onboarding", href: "/onboarding" },
  { label: "Explore Competitions", href: "/competition" },
  { label: "Launch Dashboard", href: "/dashboard" },
];

const ecosystemLinks: FooterLink[] = [
  { label: "Admin Command Center", href: "/admin" },
  { label: "Challenge Control", href: "/admin/manage-challenges" },
  { label: "Poster Publisher", href: "/admin/announcements" },
  { label: "Competition Control", href: "/admin/competition" },
];

const quickActions: FooterLink[] = [
  { label: "Launch Dashboard", href: "/dashboard" },
  { label: "Explore Competitions", href: "/competition" },
  { label: "Admin Command Center", href: "/admin" },
];

const legalLinks: FooterLink[] = [
  { label: "Corporate information", href: "/" },
  { label: "Privacy notice", href: "/" },
  { label: "Terms of use", href: "/" },
  { label: "Support", href: "/" },
];

const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "YouTube", href: "#", icon: YouTubeIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
];

export default function SiteFooter() {
  return (
    <footer
      className="border-t border-slate-200 bg-white text-slate-950"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-9 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr_0.9fr_0.85fr]">
          <section>
            <Link href="/" className="inline-flex items-center">
              <div className="relative h-[60px] w-[230px] overflow-hidden">
                <Image
                  src="/brand/omni-logo-h.png"
                  alt="Omni Skills Olympiad"
                  width={1191}
                  height={843}
                  priority
                  className="absolute left-1/2 top-1/2 w-[250px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain brightness-0"
                />
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-slate-600">
              India&apos;s engineering skills competition ecosystem for students,
              colleges and industry-ready innovation.
            </p>
          </section>

          <FooterColumn title="Products" links={productLinks} />
          <FooterColumn title="Participate" links={participateLinks} />
          <FooterColumn title="Ecosystem" links={ecosystemLinks} />

          <section>
            <FooterTitle>Quick Actions</FooterTitle>

            <nav className="mt-4 space-y-3" aria-label="Footer quick actions">
              {quickActions.map((action, index) => (
                <FooterAction
                  key={action.href}
                  href={action.href}
                  icon={
                    index === 0 ? (
                      <BookOpenCheck className="h-4 w-4" />
                    ) : index === 1 ? (
                      <UsersRound className="h-4 w-4" />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )
                  }
                >
                  {action.label}
                </FooterAction>
              ))}
            </nav>
          </section>

          <section>
            <FooterTitle>Social</FooterTitle>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:-translate-y-0.5 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-5 text-sm font-semibold text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <p>© {new Date().getFullYear()} Omni Skills Olympiad. All rights reserved.</p>

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
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}

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

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <section>
      <FooterTitle>{title}</FooterTitle>

      <nav className="mt-4 space-y-3" aria-label={`${title} footer links`}>
        {links.map((link) => (
          <FooterTextLink key={link.href} href={link.href}>
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
      className="group flex w-fit items-center gap-2 text-sm font-semibold leading-6 text-slate-600 transition hover:translate-x-0.5 hover:text-blue-700"
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
      className="group inline-flex w-fit items-center gap-2 text-sm font-black text-slate-700 transition hover:translate-x-0.5 hover:text-blue-700"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        {icon}
      </span>
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
    </Link>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M6.94 8.96H3.75V20h3.19V8.96ZM5.35 4A1.85 1.85 0 1 0 5.34 7.7 1.85 1.85 0 0 0 5.35 4Zm14.9 9.67c0-3.33-1.78-4.88-4.16-4.88a3.58 3.58 0 0 0-3.22 1.77v-1.6H9.82V20h3.18v-5.47c0-1.44.27-2.84 2.06-2.84 1.76 0 1.79 1.65 1.79 2.93V20h3.18v-6.33h.22Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.15" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M14.2 8.1h2.15V4.35A28.9 28.9 0 0 0 13.21 4c-3.1 0-5.22 1.95-5.22 5.53v3.3H4.57V17h3.42v7h4.2v-7h3.28l.52-4.17h-3.8V9.94c0-1.2.33-1.84 2.01-1.84Z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M21 12s0-3.18-.4-4.68a2.36 2.36 0 0 0-1.65-1.66C17.48 5.25 12 5.25 12 5.25s-5.48 0-6.95.41A2.36 2.36 0 0 0 3.4 7.32C3 8.82 3 12 3 12s0 3.18.4 4.68a2.36 2.36 0 0 0 1.65 1.66c1.47.41 6.95.41 6.95.41s5.48 0 6.95-.41a2.36 2.36 0 0 0 1.65-1.66c.4-1.5.4-4.68.4-4.68Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m10.4 9.45 4.35 2.55-4.35 2.55v-5.1Z" fill="currentColor" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M13.72 10.62 20.44 3h-1.59l-5.84 6.62L8.35 3H3l7.05 10.01L3 21h1.59l6.17-6.99L15.69 21H21l-7.28-10.38Zm-2.18 2.47-.72-1L5.14 4.17h2.45l4.59 6.39.72 1 5.96 8.31h-2.45l-4.87-6.78Z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M21.55 6.04c-.72.32-1.49.54-2.3.63a4.02 4.02 0 0 0 1.76-2.22 8.05 8.05 0 0 1-2.55.98A4.01 4.01 0 0 0 11.53 8.17c0 .31.04.62.1.91A11.38 11.38 0 0 1 3.36 4.9a4.02 4.02 0 0 0 1.24 5.35 3.99 3.99 0 0 1-1.82-.5v.05a4.02 4.02 0 0 0 3.22 3.94c-.33.09-.69.14-1.06.14-.26 0-.51-.03-.75-.07a4.02 4.02 0 0 0 3.75 2.79A8.05 8.05 0 0 1 2.95 18.3c-.32 0-.64-.02-.95-.06a11.35 11.35 0 0 0 6.16 1.81c7.39 0 11.43-6.12 11.43-11.43v-.52a8.17 8.17 0 0 0 2.01-2.08l-.05.02Z" />
    </svg>
  );
}