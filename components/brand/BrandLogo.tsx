import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-cyan-400/25 bg-white/[0.06] shadow-[0_0_28px_rgba(34,211,238,0.16)]">
        <Image
          src="/brand/omni-logo-new.jpeg"
          alt="SIMS Skillathon logo"
          width={40}
          height={40}
          priority
          className="h-9 w-9 object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      {!compact && (
        <div>
          <p className="text-base font-black leading-none tracking-tight text-white">
            SIMS Skillathon
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300/80">
            Omni Skills Olympiad
          </p>
        </div>
      )}
    </Link>
  );
}