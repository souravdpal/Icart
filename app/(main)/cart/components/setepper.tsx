"use client";

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

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button type="button" onClick={() => onChange(clamp(value - step))}>
        −
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        style={{ width: 60, textAlign: "center" }}
      />

      <button type="button" onClick={() => onChange(clamp(value + step))}>
        +
      </button>
    </div>
  );
}