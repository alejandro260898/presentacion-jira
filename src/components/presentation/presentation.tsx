"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroContent } from "@/lib/hero";
import { addDiapositiva, addPresentador, deleteDiapositiva, deletePresentador, selectPresentador, updateDiapositiva } from "@/app/actions/diapositivas";
import { withSlideText, type Diapositiva } from "@/lib/diapositiva";
import { DeckNavbar } from "@/components/presentation/deck-navbar";
import { DeckSections } from "@/components/presentation/deck-sections";
import { DeckStepButtons, PresentingBar } from "@/components/presentation/deck-controls";
import { HeroSection } from "@/components/presentation/hero-section";
import { ConfirmDialog, ContextMenu } from "@/components/presentation/confirm-dialog";
import { PresenterSwitch } from "@/components/presentation/presenter-switch";
import { useDeck } from "@/components/presentation/use-deck";

export function Presentation({
  initialPersonId,
  initialPeople,
  initialSlides,
  initialHero,
}: {
  initialPersonId: string;
  initialPeople: readonly { id: string; name: string }[];
  initialSlides: Diapositiva[];
  initialHero: HeroContent;
}) {
  const [personId, setPersonId] = useState(initialPersonId);
  const [people, setPeople] = useState(initialPeople);
  const [slides, setSlides] = useState(initialSlides);
  const [hero, setHero] = useState(initialHero);
  const [addError, setAddError] = useState("");
  const [menu, setMenu] = useState<{ x: number; y: number; kind: "slide" | "person"; id: string; label: string } | null>(null);
  const [confirming, setConfirming] = useState<{ kind: "slide" | "person"; id: string; label: string } | null>(null);
  const pendingId = useRef<string | null>(null);
  const { active, dark, presenting, leavingId, goTo, step, setDarkMode, togglePresentation } = useDeck(
    slides.map((slide) => slide.id),
  );
  const toggleTheme = () => setDarkMode(!dark);
  const lastId = slides.at(-1)?.id ?? null;

  useEffect(() => {
    if (!pendingId.current) return;
    const id = pendingId.current;
    pendingId.current = null;
    goTo(id);
  }, [slides, goTo]);

  async function addAfterCurrent() {
    setAddError("");
    const created = await addDiapositiva(personId, active);
    if (!created.ok) {
      setAddError(created.error);
      return;
    }
    pendingId.current = created.id;
    setSlides(created.slides);
  }

  function applyIndice(indice: { activeId: string; people: { id: string; name: string; hero: HeroContent; slides: Diapositiva[] }[] }) {
    const person = indice.people.find((item) => item.id === indice.activeId) ?? indice.people[0];
    setPersonId(person.id);
    setPeople(indice.people.map((item) => ({ id: item.id, name: item.name })));
    setHero(person.hero);
    setSlides(person.slides);
    pendingId.current = "inicio";
  }

  function askConfirm() {
    if (!menu) return;
    setConfirming({ kind: menu.kind, id: menu.id, label: menu.label });
    setMenu(null);
  }

  function confirmDelete() {
    if (!confirming) return;
    const target = confirming;
    setConfirming(null);
    if (target.kind === "slide") {
      const index = slides.findIndex((slide) => slide.id === target.id);
      const fallback = slides[index - 1]?.id ?? slides[index + 1]?.id ?? "inicio";
      if (active === target.id) pendingId.current = fallback;
      setSlides((current) => current.filter((slide) => slide.id !== target.id));
      void deleteDiapositiva(personId, target.id).then(setSlides);
      return;
    }
    void deletePresentador(target.id).then((result) => {
      if (result.ok) applyIndice(result.indice);
    });
  }

  return (
    <>
      <DeckNavbar
        items={slides.map((slide) => ({
          id: slide.id,
          label: slide.pending ? "Nueva" : slide.navLabel,
          pending: slide.pending,
        }))}
        active={active}
        dark={dark}
        hidden={presenting}
        onNavigate={goTo}
        onToggleTheme={toggleTheme}
        onPresent={() => void togglePresentation()}
        presenter={
          <PresenterSwitch
            people={people}
            activeId={personId}
            onSelect={(id) => {
              void selectPresentador(id).then(applyIndice);
            }}
            onAdd={async (name) => {
              const result = await addPresentador(name);
              if (!result.ok) return result.error;
              applyIndice(result.indice);
              return null;
            }}
            onPersonMenu={(person, x, y) => setMenu({ x, y, kind: "person", id: person.id, label: person.name })}
          />
        }
      />
      {presenting ? (
        <PresentingBar dark={dark} onToggleTheme={toggleTheme} onExit={() => void togglePresentation()} />
      ) : (
        <DeckStepButtons active={active} lastId={lastId} onStep={step} />
      )}
      {!presenting ? (
        <>
        <button
          type="button"
          onClick={() => void addAfterCurrent()}
          disabled={slides.length >= 9}
          title={slides.length >= 9 ? "Máximo 10 diapositivas, incluida la portada" : undefined}
          className="fixed right-5 bottom-5 z-40 rounded-full bg-[#0052CC] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0052CC]/30 transition-colors hover:bg-[#0747A6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Nueva sección
        </button>
        {addError ? (
          <p className="fixed right-5 bottom-16 z-40 max-w-56 rounded-xl bg-[var(--surface)] px-3 py-2 text-xs text-[var(--warn)] shadow-lg">
            {addError}
          </p>
        ) : null}
        </>
      ) : null}
      <main>
        <HeroSection
          hero={hero}
          personId={personId}
          active={active}
          leaving={leavingId === "inicio"}
          presenting={presenting}
          onPresent={() => void togglePresentation()}
          onNext={() => step(1)}
          onChange={setHero}
        />
        <DeckSections
          slides={slides}
          personId={personId}
          active={active}
          leavingId={leavingId}
          presenting={presenting}
          onSave={(id, patch) => {
            setSlides((current) => current.map((slide) => (slide.id === id ? withSlideText(slide, patch) : slide)));
            void updateDiapositiva(personId, id, patch).then(setSlides);
          }}
          onUploaded={setSlides}
          onSlideMenu={(slide, x, y) => setMenu({ x, y, kind: "slide", id: slide.id, label: slide.title })}
        />
      </main>
      {menu ? (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          label="Eliminar"
          onClose={() => setMenu(null)}
          onChoose={askConfirm}
        />
      ) : null}
      {confirming ? (
        <ConfirmDialog
          title={confirming.kind === "slide" ? "Eliminar diapositiva" : "Eliminar presentación"}
          message={
            confirming.kind === "slide"
              ? `Se quitará «${confirming.label}» de esta presentación.`
              : `Se quitará la presentación de ${confirming.label} y sus imágenes.`
          }
          confirmLabel="Eliminar"
          onCancel={() => setConfirming(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </>
  );
}
