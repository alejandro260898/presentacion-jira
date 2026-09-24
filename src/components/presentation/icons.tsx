export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06"
      />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}

export function ExitIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M8 8 4.5 4.5M4.5 8V4.5H8M16 8l3.5-3.5M16 4.5h3.5V8M8 16l-3.5 3.5M4.5 16v3.5H8M16 16l3.5 3.5M16 19.5h3.5V16"
      />
    </svg>
  );
}

export function PresentIcon() {
  return (
    <svg viewBox="2 3 20 15" className="block h-[1em] w-auto shrink-0" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.2 8.4v5.2l4.6-2.6z" fill="currentColor" />
    </svg>
  );
}

export function Chevron({
  direction,
  className = "",
}: {
  direction: "up" | "down";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} aria-hidden="true">
      <path
        d={direction === "up" ? "M6 14.5 12 8.5l6 6" : "M6 9.5 12 15.5l6-6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0 text-[#2684FF]" aria-hidden="true">
      <circle cx="11" cy="9" r="4" fill="currentColor" fillOpacity="0.25" />
      <path d="M3 24c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="22" cy="10" r="3" fill="currentColor" fillOpacity="0.25" />
      <path d="M20 24c0-3.314 1.791-6 4-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0 text-[#2684FF]" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="currentColor" fillOpacity="0.18" />
      <path d="M10 16l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0 text-[#2684FF]" aria-hidden="true">
      <rect x="4" y="18" width="6" height="10" rx="1.5" fill="currentColor" fillOpacity="0.25" />
      <rect x="13" y="12" width="6" height="16" rx="1.5" fill="currentColor" fillOpacity="0.35" />
      <rect x="22" y="5" width="6" height="23" rx="1.5" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

export function MouseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <rect x="7" y="2" width="10" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="6" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
