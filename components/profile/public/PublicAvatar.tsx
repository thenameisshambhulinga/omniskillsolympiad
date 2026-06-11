"use client";

import Image from "next/image";
import { useState } from "react";
import { UserRound } from "lucide-react";

export default function PublicAvatar({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-cyan-400/10 ${className ?? ""}`}
        aria-label={alt}
      >
        <UserRound className="h-16 w-16 text-cyan-200" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="160px"
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}
