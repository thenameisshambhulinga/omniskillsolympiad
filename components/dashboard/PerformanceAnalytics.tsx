"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import MotionWrapper from "@/components/motion/MotionWrapper";

type PerformanceAnalyticsProps = {
  data: {
    day: string;
    accuracy: number;
  }[];
};

type SanitizedAnalyticsPoint = {
  day: string;
  accuracy: number;
};

type TooltipPayloadItem = {
  value?: number | string;
  payload?: SanitizedAnalyticsPoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

export default function PerformanceAnalytics({
  data,
}: PerformanceAnalyticsProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(mountTimer);
  }, []);

  const sanitizedData = useMemo<SanitizedAnalyticsPoint[]>(() => {
    return data.map((item, index) => {
      const safeAccuracy =
        typeof item?.accuracy === "number" && Number.isFinite(item.accuracy)
          ? Math.max(0, Math.min(100, Number(item.accuracy.toFixed(2))))
          : 0;

      return {
        day:
          typeof item?.day === "string" && item.day.trim().length > 0
            ? item.day
            : `Day ${index + 1}`,
        accuracy: safeAccuracy,
      };
    });
  }, [data]);

  const hasChartData = sanitizedData.length > 0;

  return (
    <MotionWrapper>
      <section
        aria-labelledby="performance-analytics-title"
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-6 md:rounded-[2.5rem] md:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_36%,rgba(34,211,238,0.04))]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"
        />

        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300 sm:text-sm">
                Performance Analytics
              </p>

              <h2
                id="performance-analytics-title"
                className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl"
              >
                Accuracy Trend
              </h2>
            </div>

            <div className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Realtime Dashboard View
            </div>
          </div>

          {!hasChartData ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <div>
                <div className="mx-auto mb-5 h-14 w-14 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_32px_rgba(34,211,238,0.12)]" />

                <h3 className="text-lg font-bold text-white">
                  No analytics data yet
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/50">
                  Complete daily engineering challenges to unlock accuracy
                  trends and performance visualization.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[320px] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(34,211,238,0.06),transparent_45%,rgba(168,85,247,0.05))]"
              />

              <div className="relative h-[320px] min-h-[320px] w-full min-w-0">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={sanitizedData}
                      margin={{
                        top: 18,
                        right: 18,
                        left: -18,
                        bottom: 8,
                      }}
                    >
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="4 8"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                        }}
                        interval="preserveStartEnd"
                      />

                      <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                        }}
                        width={42}
                      />

                      <Tooltip
                        content={<PremiumTooltip />}
                        cursor={{
                          stroke: "rgba(34,211,238,0.32)",
                          strokeWidth: 1,
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="rgb(34,211,238)"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          strokeWidth: 2,
                          stroke: "rgb(34,211,238)",
                          fill: "rgb(2,6,23)",
                        }}
                        activeDot={{
                          r: 7,
                          strokeWidth: 2,
                          stroke: "rgb(255,255,255)",
                          fill: "rgb(34,211,238)",
                        }}
                        isAnimationActive={isMounted}
                        animationDuration={900}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </MotionWrapper>
  );
}

function PremiumTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0]?.value;
  const safeValue =
    typeof value === "number" && Number.isFinite(value)
      ? `${value.toFixed(2)}%`
      : `${value ?? 0}%`;

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/95 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        Accuracy: <span className="text-cyan-200">{safeValue}</span>
      </p>
    </div>
  );
}

