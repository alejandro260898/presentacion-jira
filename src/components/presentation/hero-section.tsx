"use client";

import { useEffect, useRef, useState } from "react";
import { updateHero, uploadHeroImage } from "@/app/actions/diapositivas";
import { HERO_ICONS, type HeroContent, type HeroIconId } from "@/lib/hero";
import { IMAGE_TOO_LARGE, MAX_IMAGE_BYTES } from "@/lib/diapositiva";
import { JiraMark } from "@/components/marks/jira-mark";
import { HeroGlyph } from "@/components/presentation/hero-icons";
import { MouseIcon, PresentIcon } from "@/components/presentation/icons";

export function HeroSection({
  hero,
  personId,
  active,
  leaving,
  presenting,
  onPresent,
  onNext,
  onChange,
}: {
  hero: HeroContent;
  personId: string;
  active: string;
  leaving: boolean;
  presenting: boolean;
  onPresent: () => void;
  onNext: () => void;
  onChange: (hero: HeroContent) => void;
}) {
  const [editing, setEditing] = useState<"title" | "description" | number | null>(null);
  const [draft, setDraft] = useState("");
  const [iconMenu, setIconMenu] = useState<number | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const iconMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconMenu === null) return;
    const onPointerDown = (event: PointerEvent) => {
      if (iconMenuRef.current?.contains(event.target as Node)) return;
      setIconMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [iconMenu]);

  function begin(field: "title" | "description" | number) {
    if (presenting) return;
    setIconMenu(null);
    setDraft(field === "title" ? hero.title : field === "description" ? hero.description : hero.highlights[field].text);
    setEditing(field);
  }

  function commit() {
    let next = hero;
    if (editing === "title") next = { ...hero, title: draft.trim() || hero.title };
    if (editing === "description") next = { ...hero, description: draft };
    if (typeof editing === "number") {
      next = {
        ...hero,
        highlights: hero.highlights.map((item, index) => (index === editing ? { ...item, text: draft } : item)),
      };
    }
    setEditing(null);
    if (next !== hero) persist(next);
  }

  function chooseIcon(index: number, icon: HeroIconId) {
    const highlights = hero.highlights.map((item, itemIndex) =>
      itemIndex === index ? { ...item, icon } : item,
    );
    const next = { ...hero, highlights };
    onChange(next);
    setIconMenu(null);
    void updateHero(personId, next);
  }

  async function onFile(file: File | undefined) {
    if (presenting || !file) return;
    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("Usa una imagen PNG, JPG, WEBP o GIF.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(IMAGE_TOO_LARGE);
      return;
    }
    const formData = new FormData();
    formData.set("personId", personId);
    formData.set("image", file);
    const result = await uploadHeroImage(formData);
    if (!result.ok) {
      setImageError(result.error);
      return;
    }
    onChange(result.hero);
  }

  function persist(next: HeroContent) {
    onChange(next);
    void updateHero(personId, next);
  }

  return (
    <section
      id="inicio"
      data-deck
      data-current={active === "inicio"}
      data-leaving={leaving ? "true" : undefined}
      className="deck-section relative overflow-hidden bg-[#041028] text-white"
    >
      <div aria-hidden="true" className="hero-aurora pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,16,40,0.62)_0%,rgba(4,16,40,0.28)_46%,rgba(4,16,40,0.05)_100%)]" />
      </div>

      <div className="deck-inner relative mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          {editing === "title" && !presenting ? (
            <input
              autoFocus
              value={draft}
              aria-label="Título"
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") setEditing(null);
              }}
              className="w-full max-w-2xl rounded-xl border border-[#2684FF] bg-[#041028] px-3 py-2 text-4xl font-semibold tracking-tight text-white outline-none sm:text-5xl"
            />
          ) : (
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
              {presenting ? (
                hero.title
              ) : (
                <button
                  type="button"
                  className="text-left"
                  onMouseDown={(event) => {
                    if (event.button !== 0) return;
                    event.preventDefault();
                    begin("title");
                  }}
                >
                  {hero.title}
                </button>
              )}
            </h1>
          )}

          {editing === "description" && !presenting ? (
            <textarea
              autoFocus
              value={draft}
              aria-label="Descripción"
              rows={4}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === "Escape") setEditing(null);
              }}
              className="mt-5 w-full max-w-xl resize-y rounded-xl border border-[#2684FF] bg-[#041028] px-3 py-2 text-lg leading-relaxed text-white outline-none"
            />
          ) : (
            <div className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {presenting ? (
                hero.description
              ) : (
                <button
                  type="button"
                  className="text-left"
                  onMouseDown={(event) => {
                    if (event.button !== 0) return;
                    event.preventDefault();
                    begin("description");
                  }}
                >
                  {hero.description || "Agrega una descripción"}
                </button>
              )}
            </div>
          )}

          {!presenting ? (
            <div className="mt-8">
              <button
                type="button"
                onClick={onPresent}
                className="inline-flex items-center gap-2 rounded-full bg-[#0052CC] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0052CC]/25 transition-colors hover:bg-[#0747A6]"
              >
                Ver presentación <PresentIcon />
              </button>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {hero.highlights.map((item, index) => (
              <div key={index} className="relative flex items-center gap-3">
                {index > 0 ? <div className="h-8 w-px bg-white/15" /> : null}
                <div className="relative" ref={iconMenu === index ? iconMenuRef : undefined}>
                  {presenting ? (
                    <HeroGlyph id={item.icon} />
                  ) : (
                    <button
                      type="button"
                      aria-label="Cambiar icono"
                      onClick={() => setIconMenu(iconMenu === index ? null : index)}
                      className="grid h-10 w-10 place-items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#2684FF]"
                    >
                      <HeroGlyph id={item.icon} />
                    </button>
                  )}
                  {iconMenu === index && !presenting ? (
                    <div className="absolute top-12 left-1/2 z-30 w-64 -translate-x-1/2 rounded-2xl border border-[#d6e2f5] bg-[#f7f9fc] p-3 shadow-xl">
                      <div className="grid grid-cols-4 gap-2">
                        {HERO_ICONS.map((icon) => (
                          <button
                            key={icon.id}
                            type="button"
                            aria-label={icon.label}
                            onClick={() => chooseIcon(index, icon.id)}
                            className={`grid h-12 w-full place-items-center rounded-xl text-[#0052CC] transition-colors hover:bg-[#0052CC]/12 ${
                              item.icon === icon.id ? "bg-[#0052CC]/15 ring-2 ring-[#0052CC]" : ""
                            }`}
                          >
                            <HeroGlyph id={icon.id} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                {editing === index && !presenting ? (
                  <input
                    autoFocus
                    value={draft}
                    aria-label="Texto"
                    onChange={(event) => setDraft(event.target.value)}
                    onBlur={commit}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.currentTarget.blur();
                      if (event.key === "Escape") setEditing(null);
                    }}
                    className="w-36 rounded-lg border border-[#2684FF] bg-[#041028] px-2 py-1 text-sm text-white outline-none"
                  />
                ) : (
                  <div className="text-sm leading-tight text-white/65">
                    {presenting ? (
                      item.text
                    ) : (
                      <button
                        type="button"
                        className="text-left"
                        onMouseDown={(event) => {
                          if (event.button !== 0) return;
                          event.preventDefault();
                          begin(index);
                        }}
                      >
                        {item.text || "Texto"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${presenting ? "hidden lg:flex" : "flex"} relative z-10 w-full shrink-0 items-center justify-center lg:w-80 xl:w-[28rem]`}>
          {presenting ? (
            hero.image ? (
              <div className="relative aspect-square w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ) : (
              <JiraMark idPrefix="hero-deco" className="relative h-72 w-72 drop-shadow-[0_0_64px_rgba(38,132,255,0.4)] xl:h-96 xl:w-96" />
            )
          ) : (
            <div className="flex w-full flex-col items-center">
            <div
              role="button"
              tabIndex={0}
              aria-label={hero.image ? "Cambiar imagen" : "Agregar imagen"}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileRef.current?.click();
                }
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                setDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                void onFile(event.dataTransfer.files?.[0]);
              }}
              className={`group relative aspect-square w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed outline-none ${
                dragging ? "border-[#2684FF] bg-[#0052CC]/20" : "border-[#7aa2ff]/70"
              }`}
            >
              {hero.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center">
                  <JiraMark idPrefix="hero-edit" className="h-56 w-56 drop-shadow-[0_0_64px_rgba(38,132,255,0.4)] xl:h-72 xl:w-72" />
                </span>
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#041028]/75 px-4 py-3 text-center text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                Clic o arrastra para cambiar
              </span>
            </div>
            <p className="mt-2 text-center text-xs text-white/55">Recomendado: 1200 × 1200 px</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void onFile(file);
            }}
          />
        </div>

        {!presenting ? (
          <button
            type="button"
            onClick={onNext}
            className="group absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 text-white/35 transition-colors duration-300 hover:text-white"
          >
            <MouseIcon />
            <span className="text-[11px] tracking-wide">Explora la presentación</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>
      {imageError ? <p className="relative z-10 px-6 pb-4 text-sm text-red-300">{imageError}</p> : null}
    </section>
  );
}
