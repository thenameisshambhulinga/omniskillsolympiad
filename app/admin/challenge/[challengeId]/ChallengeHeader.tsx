type Props = {
  challenge: any;
};

export default function ChallengeHeader({ challenge }: Props) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
        Day {challenge.dayNumber}
      </p>

      <h1 className="mt-4 text-5xl font-bold">{challenge.title}</h1>

      <p className="mt-6 max-w-3xl text-lg text-white/60">
        {challenge.description}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            challenge.isPublished
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {challenge.isPublished ? "Published" : "Draft"}
        </div>

        <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/70">
          {challenge.questions.length} Questions
        </div>
      </div>
    </div>
  );
}
