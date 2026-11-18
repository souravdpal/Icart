"use client";
import { Minus, Plus } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: NumberInputProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const btn =
    "flex size-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm transition hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={btn}
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
      >
        <Minus className="size-4" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-10 bg-transparent text-center font-bold text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        aria-label="Increase quantity"
        className={btn}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}