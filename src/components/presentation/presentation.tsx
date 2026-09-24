"use client";

import { DeckNavbar } from "@/components/presentation/deck-navbar";
import { DeckSections } from "@/components/presentation/deck-sections";
import { DeckStepButtons, PresentingBar } from "@/components/presentation/deck-controls";
import { HeroSection } from "@/components/presentation/hero-section";
import { useDeck } from "@/components/presentation/use-deck";

export function Presentation() {
  const { active, dark, presenting, goTo, step, setDarkMode, togglePresentation } = useDeck();
  const toggleTheme = () => setDarkMode(!dark);

  return (
    <>
      <DeckNavbar
        active={active}
        dark={dark}
        hidden={presenting}
        onNavigate={goTo}
        onToggleTheme={toggleTheme}
        onPresent={() => void togglePresentation()}
      />
      {presenting ? (
        <PresentingBar dark={dark} onToggleTheme={toggleTheme} onExit={() => void togglePresentation()} />
      ) : (
        <DeckStepButtons active={active} onStep={step} />
      )}
      <main>
        <HeroSection
          active={active}
          presenting={presenting}
          onPresent={() => void togglePresentation()}
          onExamples={() => goTo("criterios")}
          onNext={() => step(1)}
        />
        <DeckSections active={active} />
      </main>
    </>
  );
}
