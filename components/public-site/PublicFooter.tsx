import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { contactInformation, publicNavigation } from "@/data/public-site";

export default function PublicFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-slate-200 bg-[#f6f8fb] text-slate-950">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.72fr_0.9fr]">
          <section>
            <a
              href="#home"
              aria-label="OMNI Skills Olympiad public website home"
              className="inline-flex rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              <Image
      loading="eager"
                src="/brand/omni-logo-new.jpeg"
                alt="OMNI Skills Olympiad"
                width={2635}
                height={512}
                className="h-auto w-[230px] object-contain sm:w-[280px]"
              />
            </a>

            <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-600">
              A national multidisciplinary skills ecosystem for practical learning, competition, innovation, progression, and recognition across diverse domains.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1959d1] px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(25,89,209,0.18)] outline-none transition hover:-translate-y-0.5 hover:bg-[#1248b3] focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                Enter OSO platform
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <a
                href={contactInformation.emailHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-800 outline-none transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                Contact the organising committee
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
              Explore
            </h2>
            <nav aria-label="Public footer navigation" className="mt-5 grid gap-3">
              {publicNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="w-fit text-base font-semibold text-slate-700 outline-none transition hover:translate-x-0.5 hover:text-blue-800 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
              Official contact
            </h2>

            <div className="mt-5 space-y-5">
              <a
                href={contactInformation.phoneHref}
                className="group flex items-start gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                  <Phone className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Phone
                  </span>
                  <span className="mt-1 block text-base font-bold text-slate-800 transition group-hover:text-blue-800">
                    {contactInformation.phoneDisplay}
                  </span>
                </span>
              </a>

              <a
                href={contactInformation.emailHref}
                className="group flex items-start gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              >
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Email
                  </span>
                  <span className="mt-1 block break-all text-base font-bold text-slate-800 transition group-hover:text-blue-800">
                    {contactInformation.email}
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-800">
                  <MapPin className="h-4 w-4" />
                </span>
                <address className="not-italic">
                  <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Address
                  </span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-slate-700">
                    {contactInformation.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </address>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-slate-200 pt-7 text-sm font-semibold text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p>© {new Date().getFullYear()} OMNI Skills Olympiad. All rights reserved.</p>
            <p className="mt-1">{contactInformation.poweredBy}</p>
          </div>

          <a
            href={contactInformation.websiteHref}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-lg text-slate-700 outline-none transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            {contactInformation.websiteDisplay}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

