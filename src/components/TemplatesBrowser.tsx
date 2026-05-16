"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Search,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  TEMPLATES,
  type Template,
  type TemplateCategory,
} from "@/lib/templates";
import { readFavorites } from "@/lib/favorites";
import { FavoriteButton } from "./FavoriteButton";

// Filter chips (multi-select)
type Filter =
  | { kind: "all" }
  | { kind: "advanced" }
  | { kind: "viral" }
  | { kind: "saved" }
  | { kind: "category"; category: TemplateCategory };

export function TemplatesBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>({ kind: "all" });
  const [favTick, setFavTick] = useState(0);

  useEffect(() => {
    function bump() {
      setFavTick((t) => t + 1);
    }
    window.addEventListener("fixaiprompt:favorites-changed", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("fixaiprompt:favorites-changed", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  // Re-reads when favTick changes — the dependency is intentional even though
  // readFavorites doesn't take it as a parameter.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const savedSlugs = useMemo(() => new Set(readFavorites().templates), [favTick]);

  const categories = useMemo(() => {
    const set = new Set<TemplateCategory>();
    for (const t of TEMPLATES) set.add(t.category);
    return Array.from(set);
  }, []);

  const counts = useMemo(() => {
    return {
      all: TEMPLATES.length,
      advanced: TEMPLATES.filter((t) => t.advanced).length,
      viral: TEMPLATES.filter((t) => t.viral).length,
      saved: savedSlugs.size,
    };
  }, [savedSlugs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = TEMPLATES.slice();
    if (filter.kind === "advanced") list = list.filter((t) => t.advanced);
    else if (filter.kind === "viral") list = list.filter((t) => t.viral);
    else if (filter.kind === "saved") list = list.filter((t) => savedSlugs.has(t.slug));
    else if (filter.kind === "category") list = list.filter((t) => t.category === filter.category);
    if (!q) return list;
    return list.filter((t) => {
      const hay = (
        t.title +
        " " +
        t.tagline +
        " " +
        (t.technique || "") +
        " " +
        (t.tags || []).join(" ")
      ).toLowerCase();
      return hay.includes(q);
    });
  }, [query, filter, savedSlugs]);

  // Group filtered by category for display.
  const grouped = useMemo(() => {
    const m = new Map<TemplateCategory, Template[]>();
    for (const t of filtered) {
      const arr = m.get(t.category) || [];
      arr.push(t);
      m.set(t.category, arr);
    }
    return m;
  }, [filtered]);

  const orderedCategories = useMemo(() => {
    // techniques first, then by count desc
    const cats = Array.from(grouped.keys());
    cats.sort((a, b) => {
      if (a === "techniques") return -1;
      if (b === "techniques") return 1;
      const ca = grouped.get(a)!.length;
      const cb = grouped.get(b)!.length;
      return cb - ca;
    });
    return cats;
  }, [grouped]);

  function chipClasses(active: boolean, tone?: "violet" | "rose" | "amber") {
    const base = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer";
    if (active) {
      if (tone === "violet") return `${base} border-violet-400/50 bg-violet-400/20 text-violet-200`;
      if (tone === "rose") return `${base} border-rose-400/50 bg-rose-400/20 text-rose-200`;
      if (tone === "amber") return `${base} border-amber-400/50 bg-amber-400/20 text-amber-200`;
      return `${base} border-accent/50 bg-accent/20 text-accent-glow`;
    }
    return `${base} border-white/10 bg-white/5 text-ink-dim hover:bg-white/10 hover:text-ink`;
  }

  return (
    <div className="space-y-6">
      {/* Search + filter strip */}
      <div className="card sticky top-[68px] z-10 space-y-3 p-4 backdrop-blur sm:p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-fade" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${TEMPLATES.length} templates — by title, technique, tag, or keyword…`}
            className="input-base pl-9 pr-9"
            autoComplete="off"
            spellCheck={false}
            data-testid="templates-search"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-fade transition hover:bg-white/5 hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setFilter({ kind: "all" })} className={chipClasses(filter.kind === "all")}>
            All <span className="opacity-60">{counts.all}</span>
          </button>
          <button onClick={() => setFilter({ kind: "advanced" })} className={chipClasses(filter.kind === "advanced", "violet")}>
            <Zap className="h-3 w-3" /> Advanced <span className="opacity-60">{counts.advanced}</span>
          </button>
          <button onClick={() => setFilter({ kind: "viral" })} className={chipClasses(filter.kind === "viral", "rose")}>
            <Flame className="h-3 w-3" /> Viral <span className="opacity-60">{counts.viral}</span>
          </button>
          <button
            onClick={() => setFilter({ kind: "saved" })}
            className={chipClasses(filter.kind === "saved", "amber")}
            title="Templates you've saved (★)"
          >
            <Star className={`h-3 w-3 ${filter.kind === "saved" ? "fill-amber-300" : ""}`} /> Saved <span className="opacity-60">{counts.saved}</span>
          </button>
          <div className="mx-2 hidden h-4 w-px bg-white/10 sm:block" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter({ kind: "category", category: c })}
              className={chipClasses(filter.kind === "category" && filter.category === c)}
            >
              <span>{CATEGORY_EMOJI[c]}</span>
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-dim">
          <Search className="mx-auto mb-3 h-5 w-5 text-ink-fade" />
          {filter.kind === "saved" && counts.saved === 0
            ? "Nothing saved yet. Click the ★ on any template to save it here."
            : "No templates match. Try a different search or filter."}
        </div>
      ) : (
        orderedCategories.map((cat) => {
          const list = grouped.get(cat) || [];
          return (
            <div key={cat}>
              <div className="mb-3 flex items-baseline gap-3">
                <span className="text-xl">{CATEGORY_EMOJI[cat]}</span>
                <h2 className="text-lg font-bold tracking-tight sm:text-xl">{CATEGORY_LABEL[cat]}</h2>
                <span className="text-sm text-ink-fade">{list.length}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => (
                  <TemplateCard key={t.slug} t={t} />
                ))}
              </div>
            </div>
          );
        })
      )}

      <div className="card mt-2 flex flex-col items-center gap-3 p-8 text-center">
        <Sparkles className="h-8 w-8 text-accent-glow" />
        <h3 className="text-lg font-semibold">Want to upgrade your own prompt?</h3>
        <p className="max-w-md text-sm text-ink-dim">
          Paste your prompt into the Prompt Fixer — get a multi-metric score,
          a task-aware rewrite, and per-model output (Claude / ChatGPT / Gemini).
        </p>
        <Link href="/fix" className="btn-primary">
          Open Prompt Fixer <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function TemplateCard({ t }: { t: Template }) {
  return (
    <Link
      href={`/templates/${t.slug}`}
      className={`card group relative flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-accent/30 hover:bg-bg-card ${
        t.advanced ? "ring-1 ring-violet-400/20" : ""
      } ${t.viral ? "ring-1 ring-rose-400/20" : ""}`}
    >
      <div className="absolute right-3 top-3" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton kind="templates" slug={t.slug} variant="icon" />
      </div>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2 pr-9">
        <h3 className="text-base font-semibold text-ink group-hover:text-accent-glow">{t.title}</h3>
        <div className="flex flex-wrap gap-1">
          {t.advanced && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
              <Zap className="h-2.5 w-2.5" /> Advanced
            </span>
          )}
          {t.viral && (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
              <Flame className="h-2.5 w-2.5" /> Viral
            </span>
          )}
        </div>
      </div>
      {t.technique && (
        <div className="mb-2 text-xs font-medium text-accent-glow">{t.technique}</div>
      )}
      <p className="flex-1 text-sm text-ink-dim">{t.tagline}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-ink-fade">
        <span className="flex flex-wrap gap-1.5">
          {(t.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-accent-glow" />
      </div>
    </Link>
  );
}
