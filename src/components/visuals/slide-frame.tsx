import type { ReactNode } from "react";

export function SlideImage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure
      aria-label={label}
      className="flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] p-3 shadow-sm"
    >
      {children}
    </figure>
  );
}

export function VisualSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full text-[var(--ink)]" aria-hidden="true">
      {children}
    </svg>
  );
}
