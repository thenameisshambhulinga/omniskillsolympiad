import type { ReactNode } from "react";

type OsoFloatingIllustrationStageProps = {
  children: ReactNode;
  className?: string;
  glow?: "blue" | "yellow" | "mixed" | "none";
};

export default function OsoFloatingIllustrationStage({
  children,
  className = "",
  glow = "mixed",
}: OsoFloatingIllustrationStageProps) {
  const glowClass =
    glow === "blue"
      ? "before:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.10),transparent_58%)]"
      : glow === "yellow"
        ? "before:bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.14),transparent_58%)]"
        : glow === "mixed"
          ? "before:bg-[radial-gradient(circle_at_34%_42%,rgba(37,99,235,0.09),transparent_42%),radial-gradient(circle_at_72%_62%,rgba(250,204,21,0.12),transparent_38%)]"
          : "before:bg-transparent";

  return (
    <div
      className={`relative isolate flex min-w-0 items-center justify-center overflow-visible before:pointer-events-none before:absolute before:inset-[8%] before:-z-10 before:rounded-full before:blur-3xl ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}