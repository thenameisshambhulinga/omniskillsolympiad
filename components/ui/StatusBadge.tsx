type StatusType = "LIVE" | "UPCOMING" | "CLOSED";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  LIVE: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/50",
    text: "text-emerald-300",
    label: "LIVE",
    pulse: "animate-pulse",
  },
  UPCOMING: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/50",
    text: "text-blue-300",
    label: "UPCOMING",
    pulse: "",
  },
  CLOSED: {
    bg: "bg-slate-500/20",
    border: "border-slate-500/50",
    text: "text-slate-300",
    label: "CLOSED",
    pulse: "",
  },
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.border} ${config.text} ${config.pulse} ${className}`}
    >
      {status === "LIVE" && (
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
      )}
      {config.label}
    </span>
  );
}
