"use client";

import { MoveHorizontal, MoveVertical, RotateCcw, ZoomIn } from "lucide-react";

export default function CropRepositionPanel({
  zoom,
  positionX,
  positionY,
  onChange,
  onReset,
}: {
  zoom: number;
  positionX: number;
  positionY: number;
  onChange: (values: {
    zoom?: number;
    positionX?: number;
    positionY?: number;
  }) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Reposition
          </p>
          <p className="mt-1 text-sm text-white/45">
            Adjust preview framing before continuing.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/60 transition hover:border-cyan-400/30 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <Control
          icon={<ZoomIn className="h-4 w-4 text-cyan-200" />}
          label="Zoom"
          min={1}
          max={2}
          step={0.05}
          value={zoom}
          onChange={(value) => onChange({ zoom: value })}
        />

        <Control
          icon={<MoveHorizontal className="h-4 w-4 text-purple-200" />}
          label="Horizontal"
          min={0}
          max={100}
          step={1}
          value={positionX}
          onChange={(value) => onChange({ positionX: value })}
        />

        <Control
          icon={<MoveVertical className="h-4 w-4 text-emerald-200" />}
          label="Vertical"
          min={0}
          max={100}
          step={1}
          value={positionY}
          onChange={(value) => onChange({ positionY: value })}
        />
      </div>
    </div>
  );
}

function Control({
  icon,
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
            {label}
          </span>
        </div>

        <span className="text-xs font-bold text-white/55">
          {value.toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300"
      />
    </label>
  );
}
