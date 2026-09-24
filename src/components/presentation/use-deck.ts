"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { slides, type SectionId } from "@/content/presentation";

function deckSections() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-deck]"));
}

function visibleArea(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const top = Math.max(rect.top, 0);
  const bottom = Math.min(rect.bottom, window.innerHeight);
  return Math.max(0, bottom - top);
}

export function useDeck() {
  const [active, setActive] = useState<SectionId>("inicio");
  const [dark, setDark] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const activeRef = useRef<SectionId>("inicio");
  const presentingRef = useRef(false);
  const scrollingRef = useRef(false);

  activeRef.current = active;
  presentingRef.current = presenting;

  const goTo = useCallback((id: SectionId) => {
    setActive(id);
    activeRef.current = id;
    if (presentingRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollingRef.current = true;
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      scrollingRef.current = false;
    }, 700);
  }, []);

  const step = useCallback(
    (delta: number) => {
      const index = slides.findIndex((slide) => slide.id === activeRef.current);
      const next = slides[index + delta];
      if (next) goTo(next.id);
    },
    [goTo],
  );

  const setDarkMode = useCallback((value: boolean) => {
    if (!document.getElementById("__ct__")) {
      const style = document.createElement("style");
      style.id = "__ct__";
      style.textContent =
        "*,*::before,*::after{transition:color .35s ease,background-color .35s ease,border-color .35s ease !important}";
      document.head.appendChild(style);
    }
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
    setDark(value);
    window.setTimeout(() => document.getElementById("__ct__")?.remove(), 450);
  }, []);

  const togglePresentation = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      document.documentElement.classList.add("presenting");
      presentingRef.current = true;
      setPresenting(true);
      await document.documentElement.requestFullscreen();
    } catch {
      presentingRef.current = false;
      setPresenting(false);
      document.documentElement.classList.remove("presenting");
    }
  }, []);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));

    const header = document.querySelector("header");
    const setNavHeight = () => {
      const height = header?.getBoundingClientRect().height ?? 64;
      document.documentElement.style.setProperty("--nav-h", `${height}px`);
    };
    setNavHeight();
    const resizeObserver = new ResizeObserver(setNavHeight);
    if (header) resizeObserver.observe(header);

    const updateActive = () => {
      if (presentingRef.current || scrollingRef.current) return;
      let best: HTMLElement | null = null;
      let bestArea = 0;
      for (const section of deckSections()) {
        const area = visibleArea(section);
        if (area > bestArea) {
          bestArea = area;
          best = section;
        }
      }
      if (best) setActive(best.id as SectionId);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "F5" && event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        if (!presentingRef.current) void togglePresentation();
        return;
      }
      if (!presentingRef.current) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };

    const onFullscreen = () => {
      const on = document.fullscreenElement != null;
      presentingRef.current = on;
      setPresenting(on);
      document.documentElement.classList.toggle("presenting", on);
      if (!on) {
        const id = activeRef.current;
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" }),
        );
      }
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", setNavHeight);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", setNavHeight);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [step, togglePresentation]);

  return { active, dark, presenting, goTo, step, setDarkMode, togglePresentation };
}
