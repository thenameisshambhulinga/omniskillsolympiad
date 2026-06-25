"use client";

import { motion } from "framer-motion";
import { Gavel, Star } from "lucide-react";

import type { JudgeVerification } from "@/lib/competition/verification-engine";

export default function JudgeVerificationCard({
  verification,
}: {
  verification: JudgeVerification;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[3rem] border border-purple-400/20 bg-purple-400/10 p-6 shadow-[0_30px_130px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Gavel className="h-5 w-5 text-purple-200" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">
            Judge Verification
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Info label="Judge Name" value={verification.judgeName} />
          <Info
            label="Evaluation Score"
            value={`${verification.evaluationScore}%`}
          />
          <Info label="Status" value={verification.status} />
        </div>

        <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/25 p-5">
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-purple-200" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Comments
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold leading-7 text-white/62">
            {verification.comments}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
