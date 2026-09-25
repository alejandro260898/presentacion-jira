"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { uploadImagen } from "@/app/actions/diapositivas";
import { IMAGE_TOO_LARGE, MAX_IMAGE_BYTES, type Diapositiva } from "@/lib/diapositiva";
import { CriteriaVisual } from "@/components/visuals/criteria-visual";
import { DifferencesVisual } from "@/components/visuals/differences-visual";
import { IncompleteVisual } from "@/components/visuals/incomplete-visual";
import { OwnersVisual } from "@/components/visuals/owners-visual";
import { WhatVisual } from "@/components/visuals/what-visual";

const builtInFigures: Record<string, ReactNode> = {
  "que-es": <WhatVisual />,
  diferencias: <DifferencesVisual />,
  criterios: <CriteriaVisual />,
  quien: <OwnersVisual />,
  incumple: <IncompleteVisual />,
};

type Field = "title" | "description" | "image";

export function EditableSlide({
  slide,
  personId,
  presenting,
  onSave,
  onUploaded,
}: {
  slide: Diapositiva;
  personId: string;
  presenting: boolean;
  onSave: (id: string, patch: { title?: string; description?: string }) => void;
  onUploaded: (slides: Diapositiva[]) => void;
}) {
  const [editing, setEditing] = useState<Field | null>(null);
  const [draft, setDraft] = useState("");
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const switching = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [trackedPresenting, setTrackedPresenting] = useState(presenting);

  if (presenting !== trackedPresenting) {
    setTrackedPresenting(presenting);
    if (presenting) {
      if (editing === "title") onSave(slide.id, { title: draft });
      if (editing === "description") onSave(slide.id, { description: draft });
      setEditing(null);
      setDragging(false);
    }
  }

  useEffect(() => {
    if (!presenting) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && rootRef.current?.contains(active)) active.blur();
  }, [presenting]);

  useEffect(() => {
    if (editing === "image") imageRef.current?.focus();
  }, [editing]);

  function saveCurrent() {
    if (editing === "title") onSave(slide.id, { title: draft });
    if (editing === "description") onSave(slide.id, { description: draft });
  }

  function selectField(field: Field) {
    if (presenting || editing === field) return;
    switching.current = true;
    saveCurrent();
    if (field === "image") {
      setEditing("image");
      return;
    }
    setDraft(field === "title" ? slide.title : slide.description);
    setEditing(field);
  }

  function commit() {
    if (switching.current) return;
    saveCurrent();
    setEditing(null);
  }

  async function onFile(file: File | undefined) {
    if (presenting) return;
    setImageError("");
    if (!file) return;
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
    formData.set("id", slide.id);
    formData.set("image", file);
    const result = await uploadImagen(formData);
    if (!result.ok) {
      setImageError(result.error);
      return;
    }
    onUploaded(result.slides);
  }

  const builtIn = slide.image ? null : (builtInFigures[slide.id] ?? null);

  return (
    <div ref={rootRef} className="deck-inner mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 lg:grid-cols-2 lg:gap-14">
      <div>
        {editing === "title" && !presenting ? (
          <input
            autoFocus
            value={draft}
            aria-label="Título"
            onFocus={() => {
              switching.current = false;
            }}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") setEditing(null);
            }}
            className="w-full rounded-xl border border-[#0052CC] bg-[var(--surface)] px-3 py-2 text-2xl font-semibold tracking-tight text-[var(--ink)] outline-none sm:text-3xl"
          />
        ) : (
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-[var(--ink)] sm:text-3xl">
            {presenting ? (
              slide.title
            ) : (
              <button
                type="button"
                className="text-left"
                onMouseDown={(event) => {
                  if (event.button !== 0) return;
                  event.preventDefault();
                  selectField("title");
                }}
              >
                {slide.title}
              </button>
            )}
          </h2>
        )}

        {editing === "description" && !presenting ? (
          <textarea
            autoFocus
            value={draft}
            aria-label="Descripción"
            rows={8}
            onFocus={() => {
              switching.current = false;
            }}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Escape") setEditing(null);
            }}
            className="mt-6 w-full resize-y rounded-xl border border-[#0052CC] bg-[var(--surface)] px-3 py-2 text-lg leading-snug text-[var(--ink)] outline-none"
          />
        ) : slide.description || !presenting ? (
          <div className="mt-6 text-lg leading-snug whitespace-pre-wrap text-[var(--ink)]">
            {presenting ? (
              slide.description
            ) : (
              <button
                type="button"
                className="text-left"
                onMouseDown={(event) => {
                  if (event.button !== 0) return;
                  event.preventDefault();
                  selectField("description");
                }}
              >
                {slide.description || <span className="text-[var(--muted)]">Agrega una descripción</span>}
              </button>
            )}
          </div>
        ) : null}
      </div>

      {presenting ? (
        slide.image ? (
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl">
            {/* Imagen subida por el usuario, con ruta local y tamaño variable. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ) : builtIn ? (
          <div>{builtIn}</div>
        ) : null
      ) : (
        <div className="grid gap-2">
          <div
            ref={imageRef}
            role="button"
            tabIndex={0}
            aria-label={slide.image || builtIn ? "Cambiar imagen" : "Agregar imagen"}
            onMouseDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              selectField("image");
            }}
            onFocus={() => {
              switching.current = false;
            }}
            onBlur={() => {
              if (switching.current) return;
              setEditing((current) => (current === "image" ? null : current));
            }}
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
              selectField("image");
              void onFile(event.dataTransfer.files?.[0]);
            }}
            className={`group relative aspect-[5/4] w-full overflow-hidden rounded-3xl border-2 border-dashed outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2684FF] ${
              dragging || editing === "image"
                ? "border-[#2684FF] bg-[#0052CC]/10"
                : "border-[#7aa2ff] bg-[var(--card)] hover:border-[#2684FF] hover:bg-[#0052CC]/5"
            }`}
          >
            {slide.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : builtIn ? (
              <div className="absolute inset-0 overflow-hidden [&_figure]:h-full [&_figure]:w-full [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:p-4 [&_figure]:shadow-none">
                {builtIn}
              </div>
            ) : null}
            {slide.image || builtIn ? (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#041028]/75 px-4 py-3 text-center text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                Clic o arrastra para cambiar
              </span>
            ) : null}
            {!slide.image && !builtIn ? (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <ImageDropIcon />
                <span className="text-base font-semibold text-[var(--ink)]">Agregar imagen</span>
                <span className="text-sm text-[var(--muted)]">Haz clic o arrastra un archivo</span>
                <span className="text-xs text-[var(--muted)]">PNG, JPG, WEBP o GIF · máximo 5 MB</span>
              </span>
            ) : null}
          </div>
          <p className="text-center text-xs text-[var(--muted)]">Recomendado: 1200 × 960 px</p>
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
          {imageError ? <p className="text-sm text-[var(--warn)]">{imageError}</p> : null}
        </div>
      )}
    </div>
  );
}

function ImageDropIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#2684FF]" aria-hidden="true">
      <rect x="6" y="10" width="36" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="18" cy="20" r="3" fill="currentColor" />
      <path d="M10 32l8-7 6 5 5-4 9 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
