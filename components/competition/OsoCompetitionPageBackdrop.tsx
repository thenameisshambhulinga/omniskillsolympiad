export default function OsoCompetitionPageBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[#f8f9fa]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(37,99,235,0.10),transparent_32%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_50%_94%,rgba(250,204,21,0.12),transparent_34%)]" />

      <div className="absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]">
        <div className="h-full w-full bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="absolute -left-52 top-20 h-[34rem] w-[34rem] rounded-full bg-blue-200/35 blur-3xl" />
      <div className="absolute -right-52 top-60 h-[36rem] w-[36rem] rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="absolute bottom-[-18rem] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-yellow-100/60 blur-3xl" />
    </div>
  );
}