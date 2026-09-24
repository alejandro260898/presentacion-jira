import type { ReactNode } from "react";

export function SlideBody({
  title,
  lines,
  points,
  figure,
}: {
  title: string;
  lines?: readonly string[];
  points?: readonly { name: string; text: string }[];
  figure: ReactNode;
}) {
  return (
    <div className="deck-inner mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-balance text-[var(--ink)] sm:text-3xl">
          {title}
        </h2>
        {points ? (
          <ul className="mt-6 grid gap-4">
            {points.map((point) => (
              <li key={point.name}>
                <p className="text-lg font-semibold leading-snug text-[var(--ink)]">{point.name}</p>
                <p className="text-base leading-snug text-[var(--muted)]">{point.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-6 grid gap-3">
            {lines?.map((line) => (
              <li key={line} className="text-lg leading-snug text-[var(--ink)]">
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
      {figure}
    </div>
  );
}
