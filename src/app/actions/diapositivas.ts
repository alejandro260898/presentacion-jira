"use server";

import {
  IMAGE_TOO_LARGE,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  NEW_SLIDE_LABEL,
  NEW_SLIDE_TITLE,
  isSafeSlideId,
  withSlideImage,
  type Diapositiva,
  type ImageMime,
} from "@/lib/diapositiva";
import type { HeroContent, HeroIconId } from "@/lib/hero";
import { isHeroIconId } from "@/lib/hero";
import { insertAfter, withText } from "@/lib/diapositiva";
import {
  MAX_CONTENT_SLIDES,
  MAX_PEOPLE,
  blankPerson,
  readIndice,
  removePublicImage,
  replacePersonImage,
  uniquePersonId,
  updatePerson,
  writeIndice,
  type Indice,
} from "@/lib/presentaciones-store";

export async function updateDiapositiva(
  personId: string,
  id: string,
  patch: { title?: string; description?: string },
): Promise<Diapositiva[]> {
  if (!isSafeSlideId(id)) return slidesOf(personId);
  const indice = await updatePerson(personId, (person) => ({
    ...person,
    slides: withText(person.slides, id, patch),
  }));
  return findPerson(indice, personId).slides;
}

export async function addDiapositiva(
  personId: string,
  afterId: string,
): Promise<{ ok: true; slides: Diapositiva[]; id: string } | { ok: false; error: string }> {
  const current = findPerson(await readIndice(), personId);
  if (current.slides.length >= MAX_CONTENT_SLIDES) {
    return { ok: false, error: "Cada presentación puede tener hasta 10 diapositivas." };
  }
  const created: Diapositiva = {
    id: crypto.randomUUID(),
    navLabel: NEW_SLIDE_LABEL,
    title: NEW_SLIDE_TITLE,
    description: "",
    image: null,
    pending: true,
  };
  const indice = await updatePerson(personId, (person) => ({
    ...person,
    slides: insertAfter(person.slides, afterId, created),
  }));
  return { ok: true, slides: findPerson(indice, personId).slides, id: created.id };
}

export async function deleteDiapositiva(personId: string, id: string): Promise<Diapositiva[]> {
  if (!isSafeSlideId(id)) return slidesOf(personId);
  let removed: string | null = null;
  const indice = await updatePerson(personId, async (person) => {
    removed = person.slides.find((slide) => slide.id === id)?.image ?? null;
    return { ...person, slides: person.slides.filter((slide) => slide.id !== id) };
  });
  await removePublicImage(removed);
  return findPerson(indice, personId).slides;
}

export async function uploadImagen(
  formData: FormData,
): Promise<{ ok: true; slides: Diapositiva[] } | { ok: false; error: string }> {
  const personId = String(formData.get("personId") ?? "");
  const id = String(formData.get("id") ?? "");
  const file = await readImage(formData);
  if (!file.ok) return file;
  if (!isSafeSlideId(id)) return { ok: false, error: "No se encontró la diapositiva." };

  const person = findPerson(await readIndice(), personId);
  const slide = person.slides.find((item) => item.id === id);
  if (!slide) return { ok: false, error: "No se encontró la diapositiva." };

  const image = await replacePersonImage(personId, slide.image, `${id}-${Date.now()}.${file.extension}`, file.bytes);
  const indice = await updatePerson(personId, (current) => ({
    ...current,
    slides: current.slides.map((item) => (item.id === id ? withSlideImage(item, image) : item)),
  }));
  return { ok: true, slides: findPerson(indice, personId).slides };
}

export async function updateHero(personId: string, hero: HeroContent): Promise<HeroContent> {
  const highlights = hero.highlights.slice(0, 3).map((item) => ({
    icon: (isHeroIconId(item.icon) ? item.icon : "check") as HeroIconId,
    text: item.text,
  }));
  while (highlights.length < 3) highlights.push({ icon: "check", text: "" });
  const next: HeroContent = {
    title: hero.title.trim() || hero.title,
    description: hero.description,
    image: hero.image,
    highlights,
  };
  const indice = await updatePerson(personId, (person) => ({ ...person, hero: next }));
  return findPerson(indice, personId).hero;
}

export async function uploadHeroImage(
  formData: FormData,
): Promise<{ ok: true; hero: HeroContent } | { ok: false; error: string }> {
  const personId = String(formData.get("personId") ?? "");
  const file = await readImage(formData);
  if (!file.ok) return file;
  const person = findPerson(await readIndice(), personId);
  const image = await replacePersonImage(personId, person.hero.image, `hero-${Date.now()}.${file.extension}`, file.bytes);
  const indice = await updatePerson(personId, (current) => ({ ...current, hero: { ...current.hero, image } }));
  return { ok: true, hero: findPerson(indice, personId).hero };
}

export async function deletePresentador(
  personId: string,
): Promise<{ ok: true; indice: Indice } | { ok: false; error: string }> {
  const indice = await readIndice();
  if (indice.people.length <= 1) return { ok: false, error: "Debe quedar al menos una presentación." };
  const person = indice.people.find((item) => item.id === personId);
  if (!person) return { ok: false, error: "No se encontró la presentación." };
  const images = [person.hero.image, ...person.slides.map((slide) => slide.image)];
  await Promise.all(images.map((image) => removePublicImage(image)));
  const people = indice.people.filter((item) => item.id !== personId);
  const next = {
    activeId: indice.activeId === personId ? people[0].id : indice.activeId,
    people,
  };
  await writeIndice(next);
  return { ok: true, indice: next };
}

export async function selectPresentador(personId: string): Promise<Indice> {
  const indice = await readIndice();
  if (!indice.people.some((person) => person.id === personId)) return indice;
  const next = { ...indice, activeId: personId };
  await writeIndice(next);
  return next;
}

export async function addPresentador(name: string): Promise<{ ok: true; indice: Indice } | { ok: false; error: string }> {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (trimmed.length < 3) return { ok: false, error: "Escribe el nombre completo." };
  const indice = await readIndice();
  if (indice.people.length >= MAX_PEOPLE) {
    return { ok: false, error: "Solo caben 6 presentaciones." };
  }
  const created = blankPerson(uniquePersonId(trimmed, indice.people), trimmed);
  const next = { activeId: created.id, people: [...indice.people, created] };
  await writeIndice(next);
  return { ok: true, indice: next };
}

async function readImage(formData: FormData): Promise<{ ok: true; bytes: Buffer; extension: string } | { ok: false; error: string }> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Elige una imagen." };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: IMAGE_TOO_LARGE };
  const extension = IMAGE_TYPES[file.type as ImageMime];
  if (!extension) return { ok: false, error: "Usa una imagen PNG, JPG, WEBP o GIF." };
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) return { ok: false, error: IMAGE_TOO_LARGE };
  return { ok: true, bytes, extension };
}

function findPerson(indice: Indice, personId: string) {
  const person = indice.people.find((item) => item.id === personId) ?? indice.people[0];
  if (!person) throw new Error("No hay presentaciones.");
  return person;
}

async function slidesOf(personId: string) {
  return findPerson(await readIndice(), personId).slides;
}
