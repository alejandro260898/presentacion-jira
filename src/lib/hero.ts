export const HERO_ICONS = [
  { id: "people", label: "Equipo" },
  { id: "check", label: "Listo" },
  { id: "chart", label: "Avance" },
  { id: "star", label: "Destacado" },
  { id: "shield", label: "Protección" },
  { id: "clock", label: "Tiempo" },
  { id: "bolt", label: "Rapidez" },
  { id: "target", label: "Objetivo" },
] as const;

export type HeroIconId = (typeof HERO_ICONS)[number]["id"];

export type HeroHighlight = {
  icon: HeroIconId;
  text: string;
};

export type HeroContent = {
  title: string;
  description: string;
  image: string | null;
  highlights: HeroHighlight[];
};

export const defaultHero: HeroContent = {
  title: "Definition of Done y documentación mínima",
  description:
    "Ponernos de acuerdo en cuándo algo está de verdad terminado, para entregar valor con calidad, claridad y sin sorpresas.",
  image: null,
  highlights: [
    { icon: "people", text: "Equipos más alineados" },
    { icon: "check", text: "Menos retrabajo" },
    { icon: "chart", text: "Mayor calidad" },
  ],
};

export function isHeroIconId(value: string): value is HeroIconId {
  return HERO_ICONS.some((icon) => icon.id === value);
}
