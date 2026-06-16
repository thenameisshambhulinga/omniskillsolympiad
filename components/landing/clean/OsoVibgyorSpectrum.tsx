import {
  ArrowRight,
  Crown,
  Layers3,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";

import OsoColorCard from "@/components/oso/OsoColorCard";
import OsoColorRail from "@/components/oso/OsoColorRail";
import { vibgyorLevels } from "@/data/omni-ecosystem";
import { getOmniToneStyle, getVibgyorTone } from "@/data/omni-theme";

const spectrumSummary = [
  { label: "Foundation", tone: "violet" as const },
  { label: "Core Skills", tone: "indigo" as const },
  { label: "Application", tone: "blue" as const },
  { label: "Solutions", tone: "emerald" as const },
  { label: "Integration", tone: "yellow" as const },
  { label: "Specialization", tone: "orange" as const },
  { label: "Leadership", tone: "red" as const },
];

export default function OsoVibgyorSpectrum() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] py-16 sm:py-20">
      <div className="oso-container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/82 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.075)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(124,58,237,0.10),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(250,204,21,0.14),transparent_32%)]"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                <Layers3 className="h-4 w-4" />
                VIBGYOR Skill Framework
              </div>

              <h2 className="oso-heading mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                A colorful but controlled path from explorer to champion.
              </h2>

              <p className="mt-5 text-lg font-medium leading-9 text-slate-600">
                VIBGYOR gives students a visible skill identity. Each stage has
                its own color, role and growth meaning while staying inside the
                clean OMNI glass design system.
              </p>

              <div className="mt-7">
                <OsoColorRail items={spectrumSummary} />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MiniSpectrumSignal
                  icon={<Rocket className="h-4 w-4" />}
                  label="Start"
                  value="Explorer"
                  tone="violet"
                />

                <MiniSpectrumSignal
                  icon={<Target className="h-4 w-4" />}
                  label="Build"
                  value="Developer"
                  tone="emerald"
                />

                <MiniSpectrumSignal
                  icon={<Crown className="h-4 w-4" />}
                  label="Lead"
                  value="Champion"
                  tone="red"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vibgyorLevels.map((level, index) => {
                const tone = getVibgyorTone(level.color);

                return (
                  <OsoColorCard
                    key={level.color}
                    tone={tone}
                    eyebrow={`Level ${index + 1}`}
                    title={`${level.color} · ${level.role}`}
                    description={level.focus}
                    icon={<Sparkles className="h-5 w-5" />}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniSpectrumSignal({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "violet" | "emerald" | "red";
}) {
  const style = getOmniToneStyle(tone);

  return (
    <div
      className={`rounded-[1.25rem] border ${style.border} ${style.softBg} p-4`}
    >
      <div className={`flex items-center gap-2 ${style.text}`}>
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}