import type { SectionId } from "@/content/presentation";
import { DarkToggle } from "@/components/presentation/dark-toggle";
import { Chevron, ExitIcon } from "@/components/presentation/icons";

export function PresentingBar({
  dark,
  onToggleTheme,
  onExit,
}: {
  dark: boolean;
  onToggleTheme: () => void;
  onExit: () => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-xl">
      <DarkToggle dark={dark} onToggle={onToggleTheme} />
      <button
        type="button"
        aria-label="Salir del modo presentación"
        onClick={onExit}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--hover)]"
      >
        <ExitIcon />
      </button>
    </div>
  );
}

export function SectionStepButton({
  direction,
  label,
  placement,
  onClick,
}: {
  direction: "up" | "down";
  label: string;
  placement: "top" | "bottom";
  onClick: () => void;
}) {
  const labelSpan = (
    <span className="min-w-0 max-w-0 overflow-hidden text-xs font-medium whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-28 group-hover:opacity-100">
      {label}
    </span>
  );

  return (
    <div
      className={
        placement === "top"
          ? "fixed left-1/2 z-40 -translate-x-1/2"
          : "fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
      }
      style={placement === "top" ? { top: "calc(var(--nav-h) + 0.65rem)" } : undefined}
    >
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="group flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-[#172B4D]/80 p-0 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:w-36 hover:gap-2 hover:border-[#2684FF] hover:bg-[#0052CC] hover:px-4 hover:shadow-[0_8px_28px_rgba(0,82,204,0.45)]"
      >
        {direction === "down" ? labelSpan : null}
        <Chevron
          direction={direction}
          className={`shrink-0 transition-transform duration-300 ${direction === "up" ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
        />
        {direction === "up" ? labelSpan : null}
      </button>
    </div>
  );
}

export function DeckStepButtons({
  active,
  onStep,
}: {
  active: SectionId;
  onStep: (delta: number) => void;
}) {
  return (
    <>
      {active !== "inicio" ? (
        <SectionStepButton direction="up" label="Anterior" placement="top" onClick={() => onStep(-1)} />
      ) : null}
      {active !== "inicio" && active !== "fuentes" ? (
        <SectionStepButton direction="down" label="Siguiente" placement="bottom" onClick={() => onStep(1)} />
      ) : null}
    </>
  );
}
