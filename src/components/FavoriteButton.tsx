"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { events } from "@/lib/analytics";

export function FavoriteButton({
  kind,
  slug,
  variant = "icon",
}: {
  kind: "templates" | "glossary";
  slug: string;
  variant?: "icon" | "chip";
}) {
  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(isFavorite(kind, slug));
    function onChange() {
      setFav(isFavorite(kind, slug));
    }
    window.addEventListener("fixaiprompt:favorites-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("fixaiprompt:favorites-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [kind, slug]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(kind, slug);
    if (kind === "templates") {
      events.templateFavorited({ slug, on: !fav });
    } else {
      events.glossaryFavorited({ slug, on: !fav });
    }
  }

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={fav ? "Remove from favorites" : "Save to favorites"}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
          fav
            ? "border-amber-400/40 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
            : "border-white/10 bg-white/5 text-ink-dim hover:bg-white/10 hover:text-ink"
        }`}
      >
        <Star className={`h-3 w-3 ${fav ? "fill-amber-300 text-amber-300" : ""}`} />
        {fav ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={fav ? "Remove from favorites" : "Save to favorites"}
      className={`grid h-7 w-7 place-items-center rounded-md border transition ${
        fav
          ? "border-amber-400/40 bg-amber-400/15 text-amber-300"
          : "border-white/10 bg-white/5 text-ink-fade hover:bg-white/10 hover:text-ink"
      }`}
    >
      <Star className={`h-3.5 w-3.5 ${fav ? "fill-amber-300" : ""}`} />
    </button>
  );
}
