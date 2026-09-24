import type { SectionId } from "@/content/presentation";
import { presentation } from "@/content/presentation";
import { SlideBody } from "@/components/presentation/slide-body";
import { CriteriaVisual } from "@/components/visuals/criteria-visual";
import { DifferencesVisual } from "@/components/visuals/differences-visual";
import { IncompleteVisual } from "@/components/visuals/incomplete-visual";
import { OwnersVisual } from "@/components/visuals/owners-visual";
import { WhatVisual } from "@/components/visuals/what-visual";

export function DeckSections({ active }: { active: SectionId }) {
  return (
    <>
      <section id="que-es" data-deck data-current={active === "que-es"} className="deck-section bg-[var(--surface)]">
        <SlideBody title={presentation.what.title} lines={presentation.what.lines} figure={<WhatVisual />} />
      </section>

      <section id="diferencias" data-deck data-current={active === "diferencias"} className="deck-section bg-[var(--page)]">
        <SlideBody
          title={presentation.differences.title}
          points={presentation.differences.items}
          figure={<DifferencesVisual />}
        />
      </section>

      <section id="criterios" data-deck data-current={active === "criterios"} className="deck-section bg-[var(--surface)]">
        <SlideBody title={presentation.criteria.title} lines={presentation.criteria.lines} figure={<CriteriaVisual />} />
      </section>

      <section id="quien" data-deck data-current={active === "quien"} className="deck-section bg-[var(--page)]">
        <SlideBody title={presentation.owners.title} lines={presentation.owners.lines} figure={<OwnersVisual />} />
      </section>

      <section id="incumple" data-deck data-current={active === "incumple"} className="deck-section bg-[var(--warn-bg)]">
        <SlideBody
          title={presentation.incomplete.title}
          lines={presentation.incomplete.lines}
          figure={<IncompleteVisual />}
        />
      </section>

      <section id="fuentes" data-deck data-current={active === "fuentes"} className="deck-section bg-[var(--surface)]">
        <div className="deck-inner mx-auto flex w-full max-w-3xl flex-col justify-center px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-[var(--ink)] sm:text-3xl">
            {presentation.sources.title}
          </h2>
          <ul className="mt-8 grid gap-4">
            {presentation.sources.items.map((item) => (
              <li key={item.label} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-5 py-4">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-[#0052CC] underline decoration-[#0052CC]/30 underline-offset-4 hover:decoration-[#0052CC]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-[var(--ink)]">{item.label}</p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[var(--muted)]">{presentation.sources.consulted}</p>
        </div>
      </section>
    </>
  );
}
