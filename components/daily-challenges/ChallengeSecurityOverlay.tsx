"use client";

import { AlertTriangle, ShieldAlert, MonitorSmartphone } from "lucide-react";

type Props = {
  violations: number;
};

export default function ChallengeSecurityOverlay({ violations }: Props) {
  return (
    <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/5 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              Secure Competition Environment
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/60">
              Fullscreen mode, tab monitoring, refresh detection, anti-copy
              protection, and violation tracking are active during this
              engineering challenge.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Violations
            </p>

            <p className="mt-1 text-2xl font-black text-red-400">
              {violations}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />

              <p className="text-sm font-semibold text-green-400">Protected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <MonitorSmartphone className="mb-3 h-5 w-5 text-cyan-400" />

          <p className="text-sm font-semibold text-white">
            Fullscreen Enforcement
          </p>

          <p className="mt-1 text-xs leading-5 text-white/50">
            Exiting fullscreen can trigger automatic submission.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <AlertTriangle className="mb-3 h-5 w-5 text-yellow-400" />

          <p className="text-sm font-semibold text-white">
            Tab Switching Detection
          </p>

          <p className="mt-1 text-xs leading-5 text-white/50">
            Browser visibility changes are monitored in real-time.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <ShieldAlert className="mb-3 h-5 w-5 text-purple-400" />

          <p className="text-sm font-semibold text-white">
            Anti-Cheating Layer
          </p>

          <p className="mt-1 text-xs leading-5 text-white/50">
            Clipboard actions and suspicious behavior are tracked.
          </p>
        </div>
      </div>
    </div>
  );
}
