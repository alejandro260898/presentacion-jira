import type { SectionId } from "@/content/presentation";
import { presentation } from "@/content/presentation";
import { JiraMark } from "@/components/marks/jira-mark";
import { ChartIcon, CheckCircleIcon, MouseIcon, PeopleIcon, PresentIcon } from "@/components/presentation/icons";

const stats = [
  { Icon: PeopleIcon, label: ["Equipos", "más alineados"] },
  { Icon: CheckCircleIcon, label: ["Menos", "retrabajo"] },
  { Icon: ChartIcon, label: ["Mayor", "calidad"] },
] as const;

export function HeroSection({
  active,
  presenting,
  onPresent,
  onExamples,
  onNext,
}: {
  active: SectionId;
  presenting: boolean;
  onPresent: () => void;
  onExamples: () => void;
  onNext: () => void;
}) {
  return (
    <section
      id="inicio"
      data-deck
      data-current={active === "inicio"}
      className="deck-section relative overflow-hidden bg-[#041028] text-white"
    >
      <div aria-hidden="true" className="hero-aurora pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,16,40,0.62)_0%,rgba(4,16,40,0.28)_46%,rgba(4,16,40,0.05)_100%)]" />
      </div>

      <div className="deck-inner relative mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
            {presentation.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            {presentation.hero.objective}
          </p>

          {!presenting ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onPresent}
                className="inline-flex items-center gap-2 rounded-full bg-[#0052CC] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0052CC]/25 transition-colors hover:bg-[#0747A6]"
              >
                Ver presentación <PresentIcon />
              </button>
              <button
                type="button"
                onClick={onExamples}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Ir a ejemplos
              </button>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {stats.map(({ Icon, label }, index) => (
              <div key={label[0]} className="flex items-center gap-3">
                {index > 0 ? <div className="h-8 w-px bg-white/15" /> : null}
                <Icon />
                <div className="text-sm leading-tight text-white/65">
                  <div>{label[0]}</div>
                  <div>{label[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 hidden shrink-0 items-center justify-center lg:flex lg:w-80 xl:w-[28rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(38,132,255,0.22),transparent_72%)]"
          />
          <JiraMark
            idPrefix="hero-deco"
            className="relative h-72 w-72 drop-shadow-[0_0_64px_rgba(38,132,255,0.4)] xl:h-96 xl:w-96"
          />
        </div>

        {!presenting ? (
          <button
            type="button"
            onClick={onNext}
            className="group absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 text-white/35 transition-colors duration-300 hover:text-white"
          >
            <MouseIcon />
            <p className="text-[11px] tracking-wide">Explora la presentación</p>
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
