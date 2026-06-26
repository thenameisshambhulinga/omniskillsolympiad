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
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-600">
            Reposition
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Fine-tune the framing so your passport image looks centered and clean.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="grid gap-4">
        <Control icon={<ZoomIn className="h-4 w-4 text-sky-600" />} label="Zoom" min={1} max={2} step={0.05} value={zoom} onChange={(value) => onChange({ zoom: value })} />
        <Control icon={<MoveHorizontal className="h-4 w-4 text-violet-600" />} label="Horizontal" min={0} max={100} step={1} value={positionX} onChange={(value) => onChange({ positionX: value })} />
        <Control icon={<MoveVertical className="h-4 w-4 text-emerald-600" />} label="Vertical" min={0} max={100} step={1} value={positionY} onChange={(value) => onChange({ positionY: value })} />
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
    <label className="block rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-700">
            {label}
          </span>
        </div>

        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
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
      />
    </label>
  );
}
