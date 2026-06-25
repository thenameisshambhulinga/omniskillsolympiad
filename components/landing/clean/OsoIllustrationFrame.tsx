import type { ReactNode } from "react";

type OsoIllustrationFrameProps = {
  children: ReactNode;
  className?: string;
  variant?: "plain" | "glass" | "soft";
};

export default function OsoIllustrationFrame({
  children,
  className = "",
  variant = "glass",
}: OsoIllustrationFrameProps) {
  const variantClass =
    variant === "plain"
      ? "bg-transparent"
      : variant === "soft"
        ? "border border-slate-200 bg-slate-50/70 shadow-[0_18px_48px_rgba(15,23,42,0.055)]"
        : "oso-glass-card";

  return (
    <div
      className={`oso-safe-layer overflow-visible rounded-[2rem] p-4 sm:p-5 ${variantClass} ${className}`}
    >
      {children}
    </div>
  );
}