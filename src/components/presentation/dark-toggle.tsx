import { MoonIcon, SunIcon } from "@/components/presentation/icons";

export function DarkToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={onToggle}
      className="relative flex h-8 w-[3.75rem] shrink-0 items-center rounded-full border border-[var(--line)] bg-[var(--card)] transition-colors duration-300"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 h-7 w-7 rounded-full ring-1 ring-black/5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          dark ? "translate-x-7 bg-[#334155]" : "translate-x-0 bg-white"
        }`}
      />
      <span
        className={`relative z-10 flex flex-1 items-center justify-center transition-colors duration-200 ${
          !dark ? "text-amber-500" : "text-[var(--muted)]"
        }`}
      >
        <SunIcon />
      </span>
      <span
        className={`relative z-10 flex flex-1 items-center justify-center transition-colors duration-200 ${
          dark ? "text-blue-300" : "text-[var(--muted)]"
        }`}
      >
        <MoonIcon />
      </span>
    </button>
  );
}
