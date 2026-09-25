export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_TOO_LARGE = "La imagen debe pesar 5 MB o menos.";

export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

export type ImageMime = keyof typeof IMAGE_TYPES;

export const NEW_SLIDE_TITLE = "Nueva diapositiva";
export const NEW_SLIDE_LABEL = "Nueva";

export type Diapositiva = {
  id: string;
  navLabel: string;
  title: string;
  description: string;
  image: string | null;
  pending?: boolean;
};

export function slideStillMissing(slide: Pick<Diapositiva, "title" | "description" | "image">) {
  return slide.title.trim() === NEW_SLIDE_TITLE || !slide.description.trim() || !slide.image;
}

export function withSlideText(
  slide: Diapositiva,
  patch: { title?: string; description?: string },
): Diapositiva {
  const title = patch.title === undefined ? slide.title : patch.title.trim() || slide.title;
  const description = patch.description === undefined ? slide.description : patch.description;
  const next = { ...slide, title, description };
  const pending = slide.pending ? slideStillMissing(next) : false;
  return {
    ...next,
    pending,
    navLabel: pending
      ? NEW_SLIDE_LABEL
      : slide.pending || patch.title !== undefined
        ? navLabelFromTitle(title)
        : slide.navLabel,
  };
}

export function withSlideImage(slide: Diapositiva, image: string): Diapositiva {
  const next = { ...slide, image };
  const pending = slide.pending ? slideStillMissing(next) : false;
  return {
    ...next,
    pending,
    navLabel: pending ? NEW_SLIDE_LABEL : slide.pending ? navLabelFromTitle(next.title) : slide.navLabel,
  };
}

export function navLabelFromTitle(title: string) {
  const trimmed = title.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Nueva";
  const words = trimmed.split(" ").slice(0, 3).join(" ");
  if (words.length <= 18) return words;
  return `${words.slice(0, 17).trimEnd()}…`;
}

export function isSafeSlideId(id: string) {
  return /^[a-zA-Z0-9-]+$/.test(id);
}

export function insertAfter(slides: Diapositiva[], afterId: string, created: Diapositiva) {
  if (afterId === "inicio") return [created, ...slides];
  const index = slides.findIndex((slide) => slide.id === afterId);
  const at = index >= 0 ? index + 1 : slides.length;
  return [...slides.slice(0, at), created, ...slides.slice(at)];
}

export function withText(slides: Diapositiva[], id: string, patch: { title?: string; description?: string }) {
  return slides.map((slide) => (slide.id === id ? withSlideText(slide, patch) : slide));
}
