"use client";

import { useEffect, useRef } from "react";

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#041028]/40 p-4 backdrop-blur-[2px]" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-[var(--ink)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--hover)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#de350b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#bf2600]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContextMenu({
  x,
  y,
  label,
  onClose,
  onChoose,
}: {
  x: number;
  y: number;
  label: string;
  onClose: () => void;
  onChoose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openedAt = performance.now();
    const onPointerDown = (event: Event) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      onClose();
    };
    const onScroll = () => {
      if (performance.now() - openedAt < 400) return;
      onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("scroll", onScroll, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const left = Math.min(x, window.innerWidth - 168);
  const top = Math.min(y, window.innerHeight - 52);

  return (
    <div
      ref={rootRef}
      className="fixed z-[70] min-w-36 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1 text-[var(--ink)] shadow-xl"
      style={{ left, top }}
    >
      <button
        type="button"
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onChoose();
        }}
        className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#de350b] hover:bg-[var(--warn-bg)]"
      >
        {label}
      </button>
    </div>
  );
}
