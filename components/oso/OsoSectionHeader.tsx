import type { ReactNode } from "react";

type OsoSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
};

export default function OsoSectionHeader({
  eyebrow,
  title,
  description,
  icon,
  align = "left",
  action,
}: OsoSectionHeaderProps) {
  const center = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 ${
        center ? "items-center text-center" : "items-start"
      } lg:flex-row lg:justify-between`}
    >
      <div className={center ? "mx-auto max-w-4xl" : "max-w-4xl"}>
        <div
          className={`flex items-center gap-3 ${
            center ? "justify-center" : "justify-start"
          }`}
        >
          {icon ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
              {icon}
            </div>
          ) : null}

          <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-700">
            {eyebrow}
          </p>
        </div>

        <h2 className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 text-base font-medium leading-8 text-slate-600 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}