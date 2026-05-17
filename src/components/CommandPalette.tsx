"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Command,
  CornerDownLeft,
  GitCompareArrows,
  Layers,
  Scissors,
  Search,
  Shield,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { GLOSSARY } from "@/lib/glossary";
import { events } from "@/lib/analytics";

type Item = {
  id: string;
  kind: "tool" | "template" | "glossary" | "page";
  title: string;
  subtitle?: string;
  href: string;
  keywords: string[];
  icon: React.ReactNode;
};

const TOOLS: Item[] = [
  {
    id: "tool-fix",
    kind: "tool",
    title: "Prompt Fixer",
    subtitle: "Lint, score, and rewrite any AI prompt",
    href: "/fix",
    keywords: ["fix", "lint", "score", "rewrite", "improve"],
    icon: <Sparkles className="h-4 w-4 text-violet-300" />,
  },
  {
    id: "tool-safe-paste",
    kind: "tool",
    title: "Safe Paste",
    subtitle: "Detect secrets and PII before pasting into AI",
    href: "/safe-paste",
    keywords: ["safe paste", "redact", "secrets", "api keys", "pii", "mask"],
    icon: <Shield className="h-4 w-4 text-rose-300" />,
  },
  {
    id: "tool-chunker",
    kind: "tool",
    title: "Chunker",
    subtitle: "Split text + decompose tasks for any LLM",
    href: "/chunker",
    keywords: ["chunk", "split", "decompose", "tokens", "context", "long text"],
    icon: <Scissors className="h-4 w-4 text-cyan-300" />,
  },
  {
    id: "tool-data-cleaner",
    kind: "tool",
    title: "CSV / JSON Cleaner",
    subtitle: "Strip PII from datasets, column-aware",
    href: "/data-cleaner",
    keywords: ["csv", "json", "data", "dataset", "redact", "pii", "scrub"],
    icon: <Wand2 className="h-4 w-4 text-emerald-300" />,
  },
  {
    id: "tool-prompt-diff",
    kind: "tool",
    title: "Prompt Diff",
    subtitle: "Compare two AI prompts side-by-side",
    href: "/prompt-diff",
    keywords: ["compare", "diff", "versus", "ab test", "rank prompts"],
    icon: <GitCompareArrows className="h-4 w-4 text-amber-300" />,
  },
  {
    id: "tool-templates",
    kind: "tool",
    title: "Templates",
    subtitle: "Browse advanced prompt-engineering templates",
    href: "/templates",
    keywords: ["templates", "library", "examples", "patterns"],
    icon: <BookOpen className="h-4 w-4 text-violet-300" />,
  },
  {
    id: "tool-glossary",
    kind: "tool",
    title: "Glossary",
    subtitle: "Prompt-engineering techniques in plain English",
    href: "/glossary",
    keywords: ["glossary", "techniques", "what is", "definitions"],
    icon: <Layers className="h-4 w-4 text-sky-300" />,
  },
];

const PAGES: Item[] = [
  { id: "page-tools", kind: "page", title: "All tools", subtitle: "Every tool in one place", href: "/tools", keywords: ["tools", "directory", "all"], icon: <Zap className="h-4 w-4 text-accent-glow" /> },
  { id: "page-about", kind: "page", title: "About FixAIPrompt", subtitle: "Story, mission, and the privacy stance", href: "/about", keywords: ["about", "mission", "story", "team"], icon: <Zap className="h-4 w-4 text-accent-glow" /> },
  { id: "page-changelog", kind: "page", title: "Changelog", subtitle: "What's new and what shipped recently", href: "/changelog", keywords: ["changelog", "whats new", "releases", "updates"], icon: <Zap className="h-4 w-4 text-accent-glow" /> },
];

function buildItems(): Item[] {
  const templateItems: Item[] = TEMPLATES.map((t) => ({
    id: `template-${t.slug}`,
    kind: "template",
    title: t.title,
    subtitle: t.technique ? `Technique · ${t.technique}` : t.tagline,
    href: `/templates/${t.slug}`,
    keywords: [t.title, ...(t.tags || []), t.technique || "", t.category],
    icon: <Sparkles className="h-4 w-4 text-violet-300" />,
  }));
  const glossaryItems: Item[] = GLOSSARY.map((g) => ({
    id: `glossary-${g.slug}`,
    kind: "glossary",
    title: g.term,
    subtitle: g.short.slice(0, 110),
    href: `/glossary/${g.slug}`,
    keywords: [g.term, ...(g.alsoKnownAs || []), "glossary", "technique", "what is"],
    icon: <BookOpen className="h-4 w-4 text-sky-300" />,
  }));
  return [...TOOLS, ...PAGES, ...templateItems, ...glossaryItems];
}

function score(item: Item, q: string): number {
  if (!q) return 0;
  const Q = q.toLowerCase().trim();
  if (!Q) return 0;
  const title = item.title.toLowerCase();
  const sub = (item.subtitle || "").toLowerCase();
  const keys = item.keywords.map((k) => k.toLowerCase());
  if (title.startsWith(Q)) return 100;
  if (title.includes(Q)) return 75;
  if (keys.some((k) => k.startsWith(Q))) return 60;
  if (keys.some((k) => k.includes(Q))) return 45;
  if (sub.includes(Q)) return 30;
  // last-resort: subsequence
  let i = 0;
  for (const ch of title) {
    if (ch === Q[i]) i++;
    if (i === Q.length) return 15;
  }
  return 0;
}

const KIND_LABEL: Record<Item["kind"], string> = {
  tool: "Tool",
  template: "Template",
  glossary: "Glossary",
  page: "Page",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => buildItems(), []);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Default: show all tools + 5 most-recent / featured items
      return [...TOOLS, ...PAGES].slice(0, 12);
    }
    return items
      .map((it) => ({ it, s: score(it, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.it);
  }, [items, query]);

  // Reset active on query change
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const slash =
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement);
      if (isModK || slash) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when opened + fire analytics open event
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      events.cmdkOpened();
    } else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  // Scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${active}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (item: Item) => {
      setOpen(false);
      // Extract the slug from item.id which encodes "<kind>-<slug>" for templates/glossary
      const slug =
        item.kind === "template" || item.kind === "glossary"
          ? item.id.replace(/^(template|glossary)-/, "")
          : undefined;
      events.cmdkPick({ kind: item.kind, slug });
      router.push(item.href);
    },
    [router]
  );

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      onKeyDown={onListKey}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <Search className="h-4 w-4 text-ink-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, templates, techniques…"
            className="flex-1 bg-transparent text-base text-ink placeholder:text-ink-fade focus:outline-none"
            spellCheck={false}
            data-testid="command-input"
          />
          <span className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-fade sm:flex">
            <Command className="h-3 w-3" /> K
          </span>
        </div>

        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-ink-fade">
              No matches. Try a different keyword.
            </div>
          ) : (
            <ul>
              {results.map((it, i) => (
                <li key={it.id}>
                  <button
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(it)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                      active === i ? "bg-accent/15" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-md bg-white/5 ring-1 ring-white/10">
                      {it.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-ink">{it.title}</span>
                        <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-ink-fade">
                          {KIND_LABEL[it.kind]}
                        </span>
                      </div>
                      {it.subtitle && (
                        <div className="truncate text-xs text-ink-dim">{it.subtitle}</div>
                      )}
                    </div>
                    {active === i && (
                      <CornerDownLeft className="h-3.5 w-3.5 flex-none text-accent-glow" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 bg-bg-soft/40 px-4 py-2 text-[10px] text-ink-fade">
          <span className="hidden sm:inline">
            ↑↓ navigate · ⏎ open · Esc close
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowRight className="h-3 w-3 text-accent-glow" /> fixaiprompt.com
          </span>
        </div>
      </div>
    </div>
  );
}

// Tiny inline trigger for the SiteNav. Shows the Cmd+K hint.
export function CommandPaletteTrigger() {
  const [supportsMeta, setSupportsMeta] = useState(false);
  useEffect(() => {
    setSupportsMeta(typeof navigator !== "undefined" && /Mac/i.test(navigator.platform));
  }, []);
  const dispatch = () => {
    // Just trigger the keyboard shortcut so the palette opens.
    const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: !supportsMeta });
    window.dispatchEvent(ev);
  };
  return (
    <button
      type="button"
      onClick={dispatch}
      title="Search · Cmd/Ctrl + K"
      className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink sm:inline-flex"
    >
      <Search className="h-3.5 w-3.5" />
      <span>Search</span>
      <span className="ml-1 inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1 text-[9px]">
        {supportsMeta ? "⌘" : "Ctrl"} K
      </span>
    </button>
  );
}
