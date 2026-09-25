"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { initialsFromName } from "@/lib/presentaciones";

export function PresenterSwitch({
  people,
  activeId,
  onSelect,
  onAdd,
  onPersonMenu,
}: {
  people: readonly { id: string; name: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => Promise<string | null>;
  onPersonMenu: (person: { id: string; name: string }, x: number, y: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const current = people.find((person) => person.id === activeId) ?? people[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const message = await onAdd(name);
    if (message) {
      setError(message);
      return;
    }
    setName("");
    setError("");
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={current ? `Presentación de ${current.name}` : "Elegir presentación"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid h-9 w-9 place-items-center rounded-full bg-[#0052CC] text-xs font-semibold text-white"
      >
        {current ? initialsFromName(current.name) : "?"}
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--ink)] shadow-xl">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Presentaciones</p>
          <ul className="grid gap-1">
            {people.map((person) => (
              <li key={person.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(person.id);
                    setOpen(false);
                  }}
                  onContextMenu={
                    people.length > 1
                      ? (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onPersonMenu(person, event.clientX, event.clientY);
                        }
                      : undefined
                  }
                  className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-[var(--hover)] ${
                    person.id === activeId ? "bg-[#0052CC]/10 font-semibold text-[#0052CC]" : ""
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0052CC] text-xs font-semibold text-white">
                    {initialsFromName(person.name)}
                  </span>
                  <span className="min-w-0 leading-snug">{person.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={(event) => void submit(event)} className="mt-3 grid gap-2 border-t border-[var(--line)] pt-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nombre completo"
              aria-label="Nombre de la nueva presentación"
              className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[#0052CC]"
            />
            <button type="submit" className="rounded-xl bg-[#0052CC] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0747A6]">
              Agregar
            </button>
            {error ? <p className="text-xs text-[var(--warn)]">{error}</p> : null}
          </form>
        </div>
      ) : null}
    </div>
  );
}
