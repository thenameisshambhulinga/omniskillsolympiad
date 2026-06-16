export type OmniColorTone =
  | "blue"
  | "cyan"
  | "emerald"
  | "yellow"
  | "violet"
  | "indigo"
  | "orange"
  | "red"
  | "slate";

export type OmniToneStyle = {
  border: string;
  bg: string;
  softBg: string;
  text: string;
  strongText: string;
  iconBg: string;
  gradient: string;
  glow: string;
  progress: string;
};

export const omniToneStyles: Record<OmniColorTone, OmniToneStyle> = {
  blue: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    softBg: "bg-blue-50/70",
    text: "text-blue-700",
    strongText: "text-blue-900",
    iconBg: "border-blue-200 bg-blue-50 text-blue-700",
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    glow: "bg-blue-200/35",
    progress: "bg-blue-600",
  },
  cyan: {
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    softBg: "bg-cyan-50/70",
    text: "text-cyan-700",
    strongText: "text-cyan-900",
    iconBg: "border-cyan-200 bg-cyan-50 text-cyan-700",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    glow: "bg-cyan-200/35",
    progress: "bg-cyan-600",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    softBg: "bg-emerald-50/70",
    text: "text-emerald-700",
    strongText: "text-emerald-900",
    iconBg: "border-emerald-200 bg-emerald-50 text-emerald-700",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "bg-emerald-200/35",
    progress: "bg-emerald-600",
  },
  yellow: {
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    softBg: "bg-yellow-50/75",
    text: "text-yellow-700",
    strongText: "text-yellow-900",
    iconBg: "border-yellow-200 bg-yellow-50 text-yellow-700",
    gradient: "from-yellow-400 via-amber-400 to-orange-400",
    glow: "bg-yellow-200/45",
    progress: "bg-yellow-500",
  },
  violet: {
    border: "border-violet-200",
    bg: "bg-violet-50",
    softBg: "bg-violet-50/70",
    text: "text-violet-700",
    strongText: "text-violet-900",
    iconBg: "border-violet-200 bg-violet-50 text-violet-700",
    gradient: "from-violet-600 via-purple-500 to-indigo-500",
    glow: "bg-violet-200/35",
    progress: "bg-violet-600",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    softBg: "bg-indigo-50/70",
    text: "text-indigo-700",
    strongText: "text-indigo-900",
    iconBg: "border-indigo-200 bg-indigo-50 text-indigo-700",
    gradient: "from-indigo-600 via-blue-600 to-sky-500",
    glow: "bg-indigo-200/35",
    progress: "bg-indigo-600",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    softBg: "bg-orange-50/75",
    text: "text-orange-700",
    strongText: "text-orange-900",
    iconBg: "border-orange-200 bg-orange-50 text-orange-700",
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    glow: "bg-orange-200/35",
    progress: "bg-orange-500",
  },
  red: {
    border: "border-red-200",
    bg: "bg-red-50",
    softBg: "bg-red-50/70",
    text: "text-red-700",
    strongText: "text-red-900",
    iconBg: "border-red-200 bg-red-50 text-red-700",
    gradient: "from-red-500 via-rose-500 to-orange-400",
    glow: "bg-red-200/35",
    progress: "bg-red-600",
  },
  slate: {
    border: "border-slate-200",
    bg: "bg-slate-50",
    softBg: "bg-slate-50/80",
    text: "text-slate-700",
    strongText: "text-slate-950",
    iconBg: "border-slate-200 bg-slate-50 text-slate-700",
    gradient: "from-slate-800 via-slate-700 to-slate-600",
    glow: "bg-slate-200/35",
    progress: "bg-slate-800",
  },
};

export const vibgyorToneMap = {
  Violet: "violet",
  Indigo: "indigo",
  Blue: "blue",
  Green: "emerald",
  Yellow: "yellow",
  Orange: "orange",
  Red: "red",
} as const;

export function getOmniToneStyle(tone: OmniColorTone) {
  return omniToneStyles[tone] ?? omniToneStyles.blue;
}

export function getVibgyorTone(color: string): OmniColorTone {
  return (
    vibgyorToneMap[color as keyof typeof vibgyorToneMap] ?? "blue"
  );
}