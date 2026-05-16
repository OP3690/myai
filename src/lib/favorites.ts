"use client";

const KEY = "fixaiprompt.favorites";

type FavoritesState = {
  templates: string[];
  glossary: string[];
};

function read(): FavoritesState {
  if (typeof window === "undefined") return { templates: [], glossary: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { templates: [], glossary: [] };
    const p = JSON.parse(raw);
    return {
      templates: Array.isArray(p.templates) ? p.templates : [],
      glossary: Array.isArray(p.glossary) ? p.glossary : [],
    };
  } catch {
    return { templates: [], glossary: [] };
  }
}

function write(state: FavoritesState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    // Notify same-tab subscribers (storage event only fires cross-tab).
    window.dispatchEvent(new CustomEvent("fixaiprompt:favorites-changed"));
  } catch {}
}

export function readFavorites(): FavoritesState {
  return read();
}

export function toggleFavorite(kind: "templates" | "glossary", slug: string): FavoritesState {
  const cur = read();
  const list = cur[kind];
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  const out = { ...cur, [kind]: next };
  write(out);
  return out;
}

export function isFavorite(kind: "templates" | "glossary", slug: string): boolean {
  return read()[kind].includes(slug);
}

export type { FavoritesState };
