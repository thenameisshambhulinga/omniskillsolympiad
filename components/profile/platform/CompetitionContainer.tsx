  import { ReactNode } from "react";

  export default function CompetitionContainer({
    children,
  }: {
    children: ReactNode;
  }) {
    return (
      <main className="relative z-10 min-h-screen px-6 pb-16 pt-36 text-white">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    );
  }
