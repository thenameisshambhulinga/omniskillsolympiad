import type { ReactNode } from "react";

type KaggleInspiredWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function KaggleInspiredWrapper({
  children,
  className = "",
}: KaggleInspiredWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-visible"
      >
        <div className="absolute -left-10 top-8 h-40 w-40 rounded-[42%_58%_62%_38%] bg-blue-100/70" />
        <div className="absolute right-10 top-2 h-32 w-32 rounded-[58%_42%_38%_62%] bg-emerald-100/70" />
        <div className="absolute bottom-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-[50%_40%_60%_45%] bg-yellow-100/80" />

        <svg
          viewBox="0 0 900 260"
          className="absolute left-1/2 top-1/2 h-[260px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
          fill="none"
        >
          <path
            d="M42 172C111 72 190 122 246 84C311 40 355 87 402 131C463 188 522 137 576 86C634 32 710 64 763 134C804 188 842 170 874 132"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M92 200C190 172 260 190 332 210C417 234 488 202 561 188C660 169 739 196 832 160"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 16"
          />
        </svg>
      </div>

      {children}
    </div>
  );
}