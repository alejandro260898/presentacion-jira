import type { SectionId } from "@/content/presentation";
import { nav } from "@/content/presentation";
import { CngMark } from "@/components/marks/cng-mark";
import { DarkToggle } from "@/components/presentation/dark-toggle";
import { PresentIcon } from "@/components/presentation/icons";

export function DeckNavbar({
  active,
  dark,
  hidden,
  onNavigate,
  onToggleTheme,
  onPresent,
}: {
  active: SectionId;
  dark: boolean;
  hidden: boolean;
  onNavigate: (id: SectionId) => void;
  onToggleTheme: () => void;
  onPresent: () => void;
}) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--nav)] backdrop-blur-md ${
        hidden ? "hidden" : ""
      }`}
    >
      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2 xl:h-14 xl:flex-nowrap xl:px-6">
        <a
          href="#inicio"
          className="relative z-10 flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--ink)]"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("inicio");
          }}
        >
          <CngMark dark={dark} className="h-7 w-7" />
          Sistema CNG
        </a>

        <nav
          aria-label="Secciones"
          className="order-last basis-full xl:absolute xl:left-1/2 xl:top-1/2 xl:order-none xl:basis-auto xl:-translate-x-1/2 xl:-translate-y-1/2"
        >
          <ul className="flex flex-wrap justify-center gap-1">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex text-center text-xs leading-tight transition-all duration-200 ${
                      isActive
                        ? "rounded-t-md rounded-b-none border-b-[3px] border-[#0052CC] bg-[#0052CC]/[0.12] px-3 py-2 font-semibold text-[#0052CC]"
                        : "rounded-md px-2.5 py-1.5 text-[var(--ink)] hover:bg-[var(--hover)] hover:px-3.5 hover:py-2"
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2">
          <DarkToggle dark={dark} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={onPresent}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0747A6]"
          >
            Ver presentación <PresentIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
