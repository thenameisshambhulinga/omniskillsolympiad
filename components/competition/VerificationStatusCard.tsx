"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import type { VerificationStatus } from "@/lib/competition/verification-engine";

function getStatusStyle(status: VerificationStatus) {
  if (status === "Verified" || status === "Approved") {
    return {
      icon: BadgeCheck,
      label: status,
      className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    };
  }

  if (status === "Rejected") {
    return {
      icon: XCircle,
      label: status,
      className: "border-rose-400/25 bg-rose-400/10 text-rose-200",
    };
  }

  if (status === "Under Review") {
    return {
      icon: Clock,
      label: status,
      className: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    };
  }

  if (status === "Submitted") {
    return {
      icon: ShieldCheck,
      label: status,
      className: "border-purple-400/25 bg-purple-400/10 text-purple-200",
    };
  }

  return {
    icon: AlertTriangle,
    label: status,
    className: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  };
}

export default function VerificationStatusCard({
  status,
  title = "Verification Status",
  description = "Official review workflow status for competition operations.",
}: {
  status: VerificationStatus;
  title?: string;
  description?: string;
}) {
  const style = getStatusStyle(status);
  const Icon = style.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45 }}
      className={`relative overflow-hidden rounded-[3rem] border p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${style.className}`}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Icon className="h-6 w-6" />

        <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-white/45">
          {title}
        </p>

        <h3 className="mt-3 text-4xl font-black text-white">{style.label}</h3>

        <p className="mt-4 text-sm font-semibold leading-7 text-white/62">
          {description}
        </p>
      </div>
    </motion.article>
  );
}
