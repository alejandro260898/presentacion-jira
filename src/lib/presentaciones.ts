export const MAX_PEOPLE = 6;
export const MAX_SLIDES = 10;

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const surname = parts.length >= 4 ? parts[parts.length - 2] : parts[parts.length - 1];
  return `${parts[0][0] ?? ""}${surname[0] ?? ""}`.toUpperCase();
}

export function slugFromName(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base || "persona";
}
