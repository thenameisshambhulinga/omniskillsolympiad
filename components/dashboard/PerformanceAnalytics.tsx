"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface AnalyticsData {
  day: string;
  accuracy: number;
}

export default function PerformanceAnalytics({
  data,
}: {
  data: AnalyticsData[];
}) {
  return (
    <section className="rounded-[40px] border border-white/10 bg-white/3 p-10 backdrop-blur-xl">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Performance Analytics
          </p>

          <h2 className="mt-4 text-4xl font-black">
            Accuracy Growth Tracking
          </h2>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-cyan-300">
          Live Backend Data
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />

            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,0.4)"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#22d3ee"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}