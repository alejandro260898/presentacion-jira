import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import seed from "../../data/presentaciones.json";
import { defaultHero, type HeroContent } from "@/lib/hero";
import type { Diapositiva } from "@/lib/diapositiva";
import { MAX_PEOPLE, slugFromName } from "@/lib/presentaciones";

export const MAX_CONTENT_SLIDES = 9;

const dataPath = path.join(process.cwd(), "data", "presentaciones.json");
const publicRoot = path.join(process.cwd(), "public");
const onVercel = process.env.VERCEL === "1";
let liveOnVercel: Indice | null = null;

export type Presentador = {
  id: string;
  name: string;
  hero: HeroContent;
  slides: Diapositiva[];
};

export type Indice = {
  activeId: string;
  people: Presentador[];
};

const firstPerson = {
  id: "francisco-alejandro-galvan-ontiveros",
  name: "Francisco Alejandro Galván Ontiverós",
};

export async function readIndice(): Promise<Indice> {
  if (onVercel && liveOnVercel) return copyIndice(liveOnVercel);
  try {
    const raw = await readFile(dataPath, "utf8");
    const indice = normalizeIndice(JSON.parse(raw));
    if (indice.people.length > 0) return remember(indice);
  } catch {
    // En Vercel el archivo del repo no está en el disco de la función.
  }
  const seeded = normalizeIndice(seed);
  if (seeded.people.length > 0) return remember(seeded);
  const indice: Indice = {
    activeId: firstPerson.id,
    people: [blankPerson(firstPerson.id, firstPerson.name)],
  };
  await writeIndice(indice);
  return copyIndice(indice);
}

export async function writeIndice(indice: Indice) {
  const copy = copyIndice(indice);
  if (onVercel) liveOnVercel = copy;
  try {
    await mkdir(path.dirname(dataPath), { recursive: true });
    await writeFile(dataPath, `${JSON.stringify(copy, null, 2)}\n`, "utf8");
  } catch (error) {
    if (!onVercel) throw error;
  }
}

export async function updatePerson(
  personId: string,
  change: (person: Presentador) => Presentador | Promise<Presentador>,
) {
  const indice = await readIndice();
  const people = await Promise.all(
    indice.people.map(async (person) => (person.id === personId ? await change(person) : person)),
  );
  const next = { ...indice, people };
  await writeIndice(next);
  return next;
}

export function personImagesDir(personId: string) {
  return path.join(publicRoot, "presentaciones", personId);
}

export async function replacePersonImage(personId: string, previous: string | null, filename: string, bytes: Buffer) {
  if (onVercel) {
    throw new Error("En el sitio publicado no se pueden guardar imágenes nuevas. Hazlo en local y vuelve a desplegar.");
  }
  const dir = personImagesDir(personId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  await removePublicImage(previous);
  return `/presentaciones/${personId}/${filename}`;
}

export async function removePublicImage(image: string | null) {
  if (!image?.startsWith("/presentaciones/") && !image?.startsWith("/diapositivas/")) return;
  const target = path.resolve(publicRoot, image.replace(/^\//, ""));
  const relative = path.relative(publicRoot, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;
  await unlink(target).catch(() => undefined);
}

export function uniquePersonId(name: string, people: Presentador[]) {
  const base = slugFromName(name);
  if (!people.some((person) => person.id === base)) return base;
  let n = 2;
  while (people.some((person) => person.id === `${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function blankPerson(id: string, name: string): Presentador {
  return {
    id,
    name,
    hero: {
      ...defaultHero,
      title: "Nueva presentación",
      description: "",
      image: null,
    },
    slides: [],
  };
}

export { MAX_PEOPLE };

function remember(indice: Indice) {
  const copy = copyIndice(indice);
  if (onVercel) liveOnVercel = copy;
  return copyIndice(copy);
}

function copyIndice(indice: Indice): Indice {
  return structuredClone(indice);
}

function normalizeIndice(value: unknown): Indice {
  if (!value || typeof value !== "object") {
    return { activeId: firstPerson.id, people: [] };
  }
  const indice = value as Partial<Indice>;
  const people = Array.isArray(indice.people) ? indice.people.filter(isPresentador) : [];
  const activeId = people.some((person) => person.id === indice.activeId) ? String(indice.activeId) : people[0]?.id ?? "";
  return { activeId, people };
}

function isPresentador(value: unknown): value is Presentador {
  if (!value || typeof value !== "object") return false;
  const person = value as Partial<Presentador>;
  return typeof person.id === "string" && typeof person.name === "string" && Array.isArray(person.slides) && !!person.hero;
}
