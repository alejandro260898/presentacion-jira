"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CngMark } from "@/components/marks/cng-mark";
import { DarkToggle } from "@/components/presentation/dark-toggle";
import { CloseIcon, MenuIcon, PresentIcon } from "@/components/presentation/icons";

export function DeckNavbar({
  items,
  active,
  dark,
  hidden,
  onNavigate,
  onToggleTheme,
  onPresent,
  presenter,
}: {
  items: readonly { id: string; label: string; pending?: boolean }[];
  active: string;
  dark: boolean;
  hidden: boolean;
  onNavigate: (id: string) => void;
  onToggleTheme: () => void;
  onPresent: () => void;
  presenter: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const open = menuOpen && !hidden;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--nav)] backdrop-blur-md ${
          hidden ? "hidden" : ""
        }`}
      >
        <div className="flex h-14 items-center gap-3 px-4 xl:px-6">
          <button
            type="button"
            aria-label="Abrir secciones"
            aria-expanded={open}
            aria-controls="deck-sections-menu"
            onClick={() => setMenuOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--hover)]"
          >
            <MenuIcon />
          </button>
          <a
            href="#inicio"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--ink)]"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("inicio");
            }}
          >
            <CngMark dark={dark} className="h-7 w-7" />
            Sistema CNG
          </a>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <DarkToggle dark={dark} onToggle={onToggleTheme} />
            <button
              type="button"
              onClick={onPresent}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0747A6]"
            >
              Ver presentación <PresentIcon />
            </button>
            {presenter}
          </div>
        </div>
      </header>

      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-[#041028]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="deck-sections-menu"
        aria-label="Secciones"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-[61] flex w-72 max-w-[85vw] flex-col border-r border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Secciones</p>
          <button
            type="button"
            aria-label="Cerrar secciones"
            onClick={() => setMenuOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-[var(--hover)]"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto p-2">
          <ul className="grid gap-1">
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center gap-2 rounded-xl border-l-[3px] px-3 py-2.5 text-sm leading-snug transition-colors ${
                      isActive
                        ? "border-[#0052CC] bg-[#0052CC]/[0.12] font-semibold text-[#0052CC]"
                        : "border-transparent hover:bg-[var(--hover)]"
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      setMenuOpen(false);
                      onNavigate(item.id);
                    }}
                  >
                    <span className="min-w-0 flex-1">{item.label}</span>
                    {item.pending ? (
                      <span aria-label="Le falta contenido" className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
