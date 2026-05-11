"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Eye,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type Placeholder = {
  raw: string; // exact text including <>
  key: string; // normalized key (inner trimmed, lowercased)
  label: string; // human-friendly label
  multiline: boolean;
  hint?: string;
  occurrences: number;
};

const PLACEHOLDER_RE = /<[^>\n]{1,200}>/g;

function looksLikePlaceholder(inner: string): boolean {
  // Filter out things that look like XML tags or HTML, not user placeholders.
  if (/^\/?(?:role|task|context|output_format|constraints|example|safeguard|chunk)\b/i.test(inner)) return false;
  if (/^[a-z]+(?:\s*[/=])/.test(inner) && !/[A-Z]/.test(inner)) return false; // looks like <lang>= or <foo/bar>
  // Skip super short pure-lower placeholders like <br>, <lang>, but allow short e.g. <X>
  return true;
}

export function parsePlaceholders(text: string): Placeholder[] {
  const matches = text.match(PLACEHOLDER_RE) || [];
  const map = new Map<string, Placeholder>();
  for (const m of matches) {
    const inner = m.slice(1, -1).trim();
    if (!inner) continue;
    if (!looksLikePlaceholder(inner)) continue;
    const key = inner.toLowerCase();
    if (map.has(key)) {
      map.get(key)!.occurrences += 1;
      continue;
    }
    const multiline =
      inner.length > 30 ||
      /\b(paste|describe|describe(?:\s+\w+)?|problem|reason|context|transcript|content|brief|background|samples?|outline|scene|story|reply|email|prompt|article|input|output|note|history|specification)\b/i.test(
        inner
      );
    map.set(key, {
      raw: m,
      key,
      label: prettyLabel(inner),
      multiline,
      hint: extractHint(inner),
      occurrences: 1,
    });
  }
  return Array.from(map.values());
}

function prettyLabel(inner: string): string {
  // If it's an ALL CAPS placeholder, lowercase and title-case it nicely.
  let l = inner;
  if (/^[A-Z0-9\s,/().'\-+:]+$/.test(inner) && inner.length > 1) {
    l = inner.toLowerCase();
    l = l.charAt(0).toUpperCase() + l.slice(1);
  }
  return l;
}

function extractHint(inner: string): string | undefined {
  // "e.g. ..." or "- ..." style hints inside placeholders.
  const m = inner.match(/\be\.g\.?\s+(.+)/i);
  if (m) return "e.g. " + m[1];
  return undefined;
}

function buildFilled(text: string, values: Record<string, string>): string {
  return text.replace(PLACEHOLDER_RE, (m) => {
    const inner = m.slice(1, -1).trim();
    if (!looksLikePlaceholder(inner)) return m;
    const v = values[inner.toLowerCase()];
    return v && v.trim() ? v : m;
  });
}

function renderHighlighted(
  text: string,
  values: Record<string, string>,
  focusKey?: string
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let i = 0;
  for (const m of text.matchAll(PLACEHOLDER_RE)) {
    const idx = m.index ?? 0;
    if (idx > lastIdx) parts.push(text.slice(lastIdx, idx));
    const inner = m[0].slice(1, -1).trim();
    if (!looksLikePlaceholder(inner)) {
      parts.push(m[0]);
    } else {
      const key = inner.toLowerCase();
      const val = values[key];
      const isFocused = focusKey === key;
      if (val && val.trim()) {
        parts.push(
          <span
            key={i++}
            className={`rounded px-1 transition ${
              isFocused
                ? "bg-accent/30 text-accent-glow ring-1 ring-accent/50"
                : "bg-emerald-400/15 text-emerald-200"
            }`}
          >
            {val}
          </span>
        );
      } else {
        parts.push(
          <span
            key={i++}
            className={`rounded px-1 transition ${
              isFocused
                ? "bg-accent/30 text-accent-glow ring-1 ring-accent/50"
                : "bg-amber-400/15 text-amber-200"
            }`}
          >
            {m[0]}
          </span>
        );
      }
    }
    lastIdx = idx + m[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

export function TemplateFiller({
  slug,
  betterPrompt,
}: {
  slug: string;
  betterPrompt: string;
}) {
  const placeholders = useMemo(() => parsePlaceholders(betterPrompt), [betterPrompt]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const storageKey = `fixaiprompt.template.${slug}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setValues(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    try {
      if (Object.keys(values).length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(values));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {}
  }, [values, storageKey]);

  const filled = useMemo(() => buildFilled(betterPrompt, values), [betterPrompt, values]);
  const filledCount = placeholders.filter((p) => values[p.key]?.trim()).length;
  const total = placeholders.length;
  const allFilled = total > 0 && filledCount === total;

  async function copyFilled() {
    try {
      await navigator.clipboard.writeText(filled);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setValues({});
    setFocusKey(undefined);
  }

  function setVal(key: string, v: string) {
    setValues((cur) => ({ ...cur, [key]: v }));
  }

  if (total === 0) {
    return (
      <div className="card p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-dim">
          <Sparkles className="h-4 w-4 text-accent-glow" />
          Copy this prompt
        </h2>
        <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-bg-soft p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {betterPrompt}
        </pre>
        <button
          type="button"
          onClick={copyFilled}
          className="btn-primary mt-4"
          data-testid="copy-template"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy prompt
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* LEFT: Live preview */}
      <div className="card overflow-hidden lg:col-span-3">
        <div className="flex items-center justify-between border-b border-accent/20 bg-accent/10 px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-glow">
            <Eye className="h-3.5 w-3.5" />
            Live preview — your filled prompt
          </span>
          <div className="flex items-center gap-2">
            <ProgressPill filled={filledCount} total={total} />
            <button
              type="button"
              onClick={copyFilled}
              disabled={!allFilled && filledCount === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="copy-filled"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy{allFilled ? "" : " (some fields empty)"}
                </>
              )}
            </button>
          </div>
        </div>
        <pre className="max-h-[520px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {renderHighlighted(betterPrompt, values, focusKey)}
        </pre>
      </div>

      {/* RIGHT: Fields */}
      <div className="card overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
            <Pencil className="h-3.5 w-3.5 text-accent-glow" />
            Fill in the placeholders
          </span>
          <button
            type="button"
            onClick={reset}
            disabled={filledCount === 0}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="max-h-[520px] space-y-3 overflow-auto p-4">
          {placeholders.map((p) => (
            <Field
              key={p.key}
              ph={p}
              value={values[p.key] || ""}
              onChange={(v) => setVal(p.key, v)}
              onFocus={() => setFocusKey(p.key)}
              onBlur={() => setFocusKey(undefined)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  ph,
  value,
  onChange,
  onFocus,
  onBlur,
}: {
  ph: Placeholder;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const filled = !!value.trim();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="block min-w-0 text-xs">
          <span className={`mr-1 ${filled ? "text-emerald-300" : "text-amber-300"}`}>
            {filled ? "●" : "○"}
          </span>
          <span className="font-medium text-ink-dim">{ph.label}</span>
          {ph.occurrences > 1 && (
            <span className="ml-1 text-ink-fade">({ph.occurrences}×)</span>
          )}
        </label>
        {ph.hint && (
          <span className="text-[10px] italic text-ink-fade">{ph.hint}</span>
        )}
      </div>
      {ph.multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`Fill in: ${ph.label}`}
          className="input-base min-h-[70px] font-mono text-sm"
          spellCheck={false}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`Fill in: ${ph.label}`}
          className="input-base font-mono text-sm"
          spellCheck={false}
        />
      )}
    </div>
  );
}

function ProgressPill({ filled, total }: { filled: number; total: number }) {
  const pct = total === 0 ? 100 : Math.round((filled / total) * 100);
  const allDone = filled === total && total > 0;
  return (
    <div className="flex items-center gap-2">
      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/10 sm:block">
        <div
          className={`h-full rounded-full transition-all ${
            allDone ? "bg-emerald-400" : pct > 50 ? "bg-amber-400" : "bg-rose-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs tabular-nums ${allDone ? "text-emerald-300" : "text-ink-dim"}`}>
        {filled} / {total} filled
      </span>
    </div>
  );
}
