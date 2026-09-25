import type { Diapositiva } from "@/lib/diapositiva";
import { EditableSlide } from "@/components/presentation/editable-slide";

export function DeckSections({
  slides,
  personId,
  active,
  leavingId,
  presenting,
  onSave,
  onUploaded,
  onSlideMenu,
}: {
  slides: Diapositiva[];
  personId: string;
  active: string;
  leavingId: string | null;
  presenting: boolean;
  onSave: (id: string, patch: { title?: string; description?: string }) => void;
  onUploaded: (slides: Diapositiva[]) => void;
  onSlideMenu: (slide: Diapositiva, x: number, y: number) => void;
}) {
  return slides.map((slide, index) => (
    <section
      key={slide.id}
      id={slide.id}
      data-deck
      data-current={active === slide.id}
      data-leaving={leavingId === slide.id ? "true" : undefined}
      className={`deck-section relative ${sectionBackground(slide.id, index)}`}
      onContextMenu={
        presenting
          ? undefined
          : (event) => {
              event.preventDefault();
              onSlideMenu(slide, event.clientX, event.clientY);
            }
      }
    >
      <EditableSlide slide={slide} personId={personId} presenting={presenting} onSave={onSave} onUploaded={onUploaded} />
    </section>
  ));
}

function sectionBackground(id: string, index: number) {
  if (id === "incumple") return "bg-[var(--warn-bg)]";
  return index % 2 === 0 ? "bg-[var(--surface)]" : "bg-[var(--page)]";
}
