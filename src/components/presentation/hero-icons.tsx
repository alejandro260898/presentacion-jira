import type { HeroIconId } from "@/lib/hero";
import { ChartIcon, CheckCircleIcon, PeopleIcon } from "@/components/presentation/icons";

export function HeroGlyph({ id }: { id: HeroIconId }) {
  if (id === "people") return <PeopleIcon />;
  if (id === "check") return <CheckCircleIcon />;
  if (id === "chart") return <ChartIcon />;
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0 text-[#2684FF]" aria-hidden="true">
      {id === "star" ? (
        <path d="M16 5l2.8 6.4 7 .7-5.3 4.6 1.6 6.8L16 20.2 9.9 23.5l1.6-6.8L6.2 12.1l7-.7Z" fill="currentColor" fillOpacity="0.85" />
      ) : null}
      {id === "shield" ? (
        <path d="M16 4l10 4v8c0 6.2-4.2 10.2-10 12-5.8-1.8-10-5.8-10-12V8Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
      ) : null}
      {id === "clock" ? (
        <>
          <circle cx="16" cy="16" r="11" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 10v7l4 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : null}
      {id === "bolt" ? <path d="M18 4L8 18h7l-1 10 10-14h-7Z" fill="currentColor" /> : null}
      {id === "target" ? (
        <>
          <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </>
      ) : null}
    </svg>
  );
}
