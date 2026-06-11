"use client";

import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";
import { motion } from "framer-motion";

import type { ProfileSocialLink } from "@/types/profile";

const socialIcons: Record<
  ProfileSocialLink["label"],
  React.ComponentType<{ className?: string }>
> = {
  LinkedIn: Globe,
  GitHub: Globe,
  Portfolio: Globe,
};

const socialStyles: Record<
  ProfileSocialLink["label"],
  {
    accent: string;
    glow: string;
    label: string;
  }
> = {
  LinkedIn: {
    accent: "text-sky-200",
    glow: "bg-sky-400/12",
    label: "Professional Network",
  },
  GitHub: {
    accent: "text-white",
    glow: "bg-white/10",
    label: "Code Repository",
  },
  Portfolio: {
    accent: "text-cyan-200",
    glow: "bg-cyan-400/12",
    label: "Personal Website",
  },
};

export default function ProfileSocials({
  socials,
}: {
  socials: ProfileSocialLink[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_34%)]"
      />

      <div className="relative z-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Social Links
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Engineering Presence
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/45">
            Connect your public engineering identity across professional,
            portfolio, and code platforms.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {socials.map((social, index) => {
            const Icon = socialIcons[social.label];
            const style = socialStyles[social.label];

            return (
              <motion.div
                key={social.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                whileHover={{ y: -5, scale: 1.015 }}
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block h-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 p-5 shadow-[0_20px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.055]"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition duration-500 group-hover:scale-125 ${style.glow}`}
                  />

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] ${style.accent}`}
                    >
                      <Icon className="h-7 w-7 transition group-hover:scale-110" />
                    </div>

                    <ExternalLink className="h-4 w-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-200" />
                  </div>

                  <div className="relative z-10 mt-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                      {style.label}
                    </p>

                    <h3 className="mt-2 text-xl font-black text-white">
                      {social.label}
                    </h3>

                    <p className="mt-3 truncate text-sm font-semibold text-white/52">
                      {social.href}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
