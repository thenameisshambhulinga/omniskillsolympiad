// export default function Loading() {
//   return (
//     <main className="grid min-h-screen place-items-center bg-[#f8f9fa] px-6">
//       <section className="text-center">
//         <div className="mx-auto flex justify-center">
//           <div className="oso-infinity-loader" aria-hidden="true" />
//         </div>

//         <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-blue-700">
//           Omni Skills Olympiad
//         </p>

//         <h1 className="oso-heading mt-3 text-3xl font-black">
//           Preparing your engineering arena
//         </h1>

//         <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-slate-500">
//           Loading challenges, rankings and skill signals.
//         </p>
//       </section>
//     </main>
//   );
// }
export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#f8f9fa] px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_78%_20%,rgba(124,58,237,0.10),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(250,204,21,0.16),transparent_34%)]"
      />

      <section className="relative z-10 text-center">
        <div className="mx-auto flex justify-center">
          <div className="oso-infinity-loader" aria-hidden="true">
            <span className="oso-loader-spark" />
          </div>
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-blue-700">
          Omni Skills Olympiad
        </p>

        <h1 className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
          Preparing your engineering arena
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-slate-500">
          Loading challenges, rankings, skill missions and OMNI growth signals.
        </p>
      </section>
    </main>
  );
}