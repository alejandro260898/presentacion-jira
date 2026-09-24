export const slides = [
  { id: "inicio", label: "Inicio" },
  { id: "que-es", label: "Qué es" },
  { id: "diferencias", label: "Diferencias" },
  { id: "criterios", label: "Ejemplos" },
  { id: "quien", label: "Quién define" },
  { id: "incumple", label: "Si no cumple" },
  { id: "fuentes", label: "Fuentes" },
] as const;

export const nav = slides.filter((slide) => slide.id !== "inicio");

export type SectionId = (typeof slides)[number]["id"];

export const presentation = {
  hero: {
    title: "Definition of Done y documentación mínima",
    objective:
      "Ponernos de acuerdo en cuándo algo está de verdad terminado, para entregar valor con calidad, claridad y sin sorpresas.",
  },
  what: {
    title: "Qué es la Definition of Done",
    lines: [
      "Es la descripción de cuándo un incremento cumple la calidad del producto.",
      "Si un elemento la cumple, ya nace un incremento que se puede entregar.",
      "Si no la cumple, todavía no está terminado.",
      "No confundas «ya está hecho» con «ya dio el resultado que buscábamos».",
    ],
  },
  differences: {
    title:
      "Diferencia entre criterios de aceptación, Definition of Done y Definition of Ready",
    items: [
      {
        name: "Criterios de aceptación",
        text: "Son de un solo elemento. Ejemplo: el usuario puede filtrar por fecha.",
      },
      {
        name: "Definition of Done",
        text: "Es la misma calidad para todos los incrementos. Ejemplo: probado, revisado e integrado.",
      },
      {
        name: "Definition of Ready",
        text: "Acuerdo opcional para empezar. No es oficial y no debe ser una compuerta.",
      },
    ],
  },
  criteria: {
    title: "Ejemplos de criterios para la DoD",
    lines: [
      "La guía no trae una lista. Esta es la nuestra.",
      "Requerimientos cumplidos, pruebas hechas y evidencia de que funciona.",
      "Buenas prácticas de código y visto bueno del Product Owner.",
      "Documentación mínima: nota técnica, captura o video, descripción del cambio y changelog.",
      "El ticket de Jira se arma con esta lista, no al revés.",
    ],
  },
  owners: {
    title: "Quién define y mantiene la DoD",
    lines: [
      "Si la organización ya tiene una, esa es el mínimo para todos.",
      "Si no, la crea el equipo Scrum.",
      "Quienes construyen se comprometen a cumplirla.",
      "Se revisa en la retrospectiva.",
      "En nuestro estatuto ya está consensuada y se revisa cada cierto tiempo.",
    ],
  },
  incomplete: {
    title: "Qué hacer con trabajo que no cumple la DoD",
    lines: [
      "No se presenta como terminado en la revisión del sprint.",
      "No se publica.",
      "Vuelve al Product Backlog para retomarlo después.",
      "No forma parte de lo entregado.",
    ],
  },
  sources: {
    title: "Fuentes",
    consulted: "Consultado el 22 de septiembre de 2026.",
    items: [
      {
        label: "Guía de Scrum, noviembre 2020",
        href: "https://scrumguides.org/scrum-guide.html",
      },
      {
        label: "Scrum Guide Expansion Pack, enero 2026",
        href: "https://scrumexpansion.org/scrum-guide-expanded/2026.1/",
      },
      {
        label: "Estatuto de Scrum",
      },
    ],
  },
};
