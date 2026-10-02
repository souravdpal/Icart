import React from "react";

type Size = "sm" | "md" | "lg";
type Variant = "spinner" | "dots" | "pulse";

interface SizeConfig {
  spinner: string;
  dot: string;
  gap: string;
}

const SIZES: Record<Size, SizeConfig> = {
  sm: { spinner: "h-4 w-4 border-2", dot: "h-1.5 w-1.5", gap: "gap-1" },
  md: { spinner: "h-8 w-8 border-[3px]", dot: "h-2.5 w-2.5", gap: "gap-1.5" },
  lg: { spinner: "h-12 w-12 border-4", dot: "h-3.5 w-3.5", gap: "gap-2" },
};

export interface LoadingProps {
  /** Caption under the indicator. Pass "" to hide. */
  text?: string;
  /** Indicator size. */
  size?: Size;
  /** Visual style. */
  variant?: Variant;
  /** Overlay the whole viewport. */
  fullScreen?: boolean;
  /** Extra classes for the wrapper. */
  className?: string;
}

export default function Loading({
  text = "Loading…",
  size = "md",
  variant = "spinner",
  fullScreen = false,
  className = "",
}: LoadingProps) {
  const s = SIZES[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex flex-col items-center justify-center gap-3",
        fullScreen
          ? "fixed inset-0 z-50 bg-white/70 backdrop-blur-sm dark:bg-gray-900/70"
          : "py-8",
        className,
      ].join(" ")}
    >
      {variant === "spinner" && (
        <div
          className={`animate-spin rounded-full border-solid border-current border-r-transparent text-blue-600 dark:text-blue-400 ${s.spinner}`}
        />
      )}

      {variant === "dots" && (
        <div className={`flex items-center ${s.gap}`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`animate-bounce rounded-full bg-blue-600 dark:bg-blue-400 ${s.dot}`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <span className={`relative flex ${s.dot}`}>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
          <span className="relative inline-flex h-full w-full rounded-full bg-blue-600 dark:bg-blue-400" />
        </span>
      )}

      {text ? (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{text}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}