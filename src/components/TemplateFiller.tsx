"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  Copy,
  Eye,
  Maximize2,
  Minimize2,
  Pencil,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { estimateTokens } from "@/lib/chunker";
import type { Template } from "@/lib/templates";

type Placeholder = {
  raw: string;
  key: string;
  label: string;
  multiline: boolean;
  hint?: string;
  occurrences: number;
  order: number; // order of first appearance in the template
};

const PLACEHOLDER_RE = /<[^>\n]{1,200}>/g;

function looksLikePlaceholder(inner: string): boolean {
  if (
    /^\/?(?:role|task|context|output_format|constraints|example|safeguard|chunk)\b/i.test(
      inner
    )
  )
    return false;
  if (/^[a-z]+(?:\s*[/=])/.test(inner) && !/[A-Z]/.test(inner)) return false;
  return true;
}

export function parsePlaceholders(text: string): Placeholder[] {
  const matches = Array.from(text.matchAll(PLACEHOLDER_RE));
  const map = new Map<string, Placeholder>();
  let order = 0;
  for (const m of matches) {
    const inner = m[0].slice(1, -1).trim();
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
      raw: m[0],
      key,
      label: prettyLabel(inner),
      multiline,
      hint: extractHint(inner),
      occurrences: 1,
      order: ++order,
    });
  }
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

function prettyLabel(inner: string): string {
  if (/^[A-Z0-9\s,/().'\-+:]+$/.test(inner) && inner.length > 1) {
    return inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase();
  }
  return inner;
}

function extractHint(inner: string): string | undefined {
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

/**
 * Generate fallback sample values for templates that don't ship explicit sampleValues.
 * Uses keyword matching to produce something plausible.
 */
function inferSampleValue(placeholderLabel: string): string {
  const t = placeholderLabel.toLowerCase();
  if (/\b(decide|decision|should\s+i)\b/.test(t))
    return "Should I switch our infra from AWS to Cloudflare to cut hosting costs by 60%?";
  if (/\b(topic|subject)\b/.test(t)) return "Negotiating a salary raise as a senior IC";
  if (/\b(problem|issue|bug)\b/.test(t))
    return "Our checkout funnel drops off at the payment-method-select step.";
  if (/\b(time.*budget|constraint|deadline)\b/.test(t))
    return "$5k budget, 4 weeks runway, 2 people on the team";
  if (/\b(goal|outcome|success)\b/.test(t)) return "Reach $5k MRR within 6 months";
  if (/\b(role|persona|act\s+as)\b/.test(t))
    return "Senior product manager at a B2B SaaS company";
  if (/\b(audience|reader|user)\b/.test(t))
    return "Engineers evaluating tools, not buying anything yet";
  if (/\b(target|platform)\b/.test(t)) return "TWITTER-X";
  if (/\b(language|framework|tech)\b/.test(t)) return "TypeScript / Next.js / Tailwind";
  if (/\b(company|startup|product)\b/.test(t))
    return "An indie SaaS shipping AI-prompt tools";
  if (/\bdate\b/.test(t)) return "March 1, 2026";
  if (/\bnumber\b/.test(t)) return "5";
  if (/\b(a or b|option a|option b)\b/.test(t)) return "Option A";
  if (/\bdescribe|paste|context|brief\b/.test(t))
    return "[A short, realistic description of your situation goes here — replace this with your actual context.]";
  return "[your input here]";
}

function getSampleValues(
  template: Pick<Template, "sampleValues">,
  placeholders: Placeholder[]
): Record<string, string> {
  const explicit = template.sampleValues || {};
  const out: Record<string, string> = {};
  for (const p of placeholders) {
    if (explicit[p.key]) {
      out[p.key] = explicit[p.key];
    } else {
      out[p.key] = inferSampleValue(p.label);
    }
  }
  return out;
}

function renderHighlighted(
  text: string,
  values: Record<string, string>,
  placeholders: Placeholder[],
  focusKey: string | undefined,
  onPillClick: (key: string) => void
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const orderByKey = new Map(placeholders.map((p) => [p.key, p.order]));
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
      const filled = val && val.trim();
      const isFocused = focusKey === key;
      const num = orderByKey.get(key);
      parts.push(
        <button
          key={i++}
          type="button"
          onClick={() => onPillClick(key)}
          title={`Field #${num} — ${inner}`}
          className={`mx-0.5 inline-flex items-baseline gap-1 rounded px-1.5 py-0.5 align-baseline text-left font-mono text-[13px] leading-tight transition ${
            filled
              ? isFocused
                ? "bg-accent/30 text-accent-glow ring-1 ring-accent/60"
                : "bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25"
              : isFocused
              ? "bg-amber-400/25 text-amber-100 ring-1 ring-amber-400/60"
              : "bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
          }`}
        >
          {num !== undefined && (
            <span className={`text-[9px] font-bold ${filled ? "text-emerald-300/80" : "text-amber-300/80"}`}>
              #{num}
            </span>
          )}
          <span>{filled ? val : m[0]}</span>
        </button>
      );
    }
    lastIdx = idx + m[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

export function TemplateFiller({
  slug,
  betterPrompt,
  sampleValues,
}: {
  slug: string;
  betterPrompt: string;
  sampleValues?: Record<string, string>;
}) {
  const placeholders = useMemo(
    () => parsePlaceholders(betterPrompt),
    [betterPrompt]
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLTextAreaElement | HTMLInputElement | null>>({});

  const storageKey = `fixaiprompt.template.${slug}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setValues(JSON.parse(raw));
    } catch {}
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

  const filled = useMemo(
    () => buildFilled(betterPrompt, values),
    [betterPrompt, values]
  );
  const filledCount = placeholders.filter((p) => values[p.key]?.trim()).length;
  const total = placeholders.length;
  const allFilled = total > 0 && filledCount === total;
  const tokenCount = useMemo(() => estimateTokens(filled), [filled]);

  const focusField = useCallback((key: string) => {
    setFocusKey(key);
    const el = fieldRefs.current[key];
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.focus();
    }
  }, []);

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

  function showSample() {
    const samples = getSampleValues({ sampleValues }, placeholders);
    setValues(samples);
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

  const tokenTone =
    tokenCount > 4000 ? "text-amber-300" : tokenCount > 8000 ? "text-rose-300" : "text-ink-dim";

  return (
    <div className="space-y-4">
      {/* Header strip */}
      <div className="card flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <ProgressRing filled={filledCount} total={total} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink">
              Fill the template
            </div>
            <div className="text-xs text-ink-fade">
              {allFilled
                ? "All fields filled — ready to ship."
                : `${total - filledCount} placeholder${total - filledCount === 1 ? "" : "s"} left.`}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`hidden rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs ${tokenTone} sm:inline-flex`}>
            <span className="font-mono">~{tokenCount.toLocaleString()}</span>
            <span className="ml-1 text-ink-fade">tokens</span>
          </div>
          <button
            type="button"
            onClick={showSample}
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-400/20"
            data-testid="fill-sample"
          >
            <Wand2 className="h-3.5 w-3.5" /> Try with sample values
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={filledCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-dim transition hover:bg-white/10 hover:text-ink disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={copyFilled}
            disabled={filledCount === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              allFilled
                ? "bg-accent text-white hover:bg-accent-glow shadow-glow"
                : "border border-white/10 bg-white/5 text-ink hover:bg-white/10"
            }`}
            data-testid="copy-filled"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {allFilled ? "Copy filled prompt" : "Copy (some empty)"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={`grid gap-4 ${fullPreview ? "" : "lg:grid-cols-5"}`}>
        {/* Preview */}
        <div className={`card overflow-hidden ${fullPreview ? "" : "lg:col-span-3"}`}>
          <div className="flex items-center justify-between border-b border-accent/20 bg-accent/10 px-4 py-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-glow">
              <Eye className="h-3.5 w-3.5" />
              Live preview
              <span className="hidden font-normal normal-case text-ink-fade sm:inline">
                · click any pill to jump to its field
              </span>
            </span>
            <button
              type="button"
              onClick={() => setFullPreview((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
              title={fullPreview ? "Show fields side-by-side" : "Focus on preview"}
            >
              {fullPreview ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Exit focus</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Focus mode</span>
                </>
              )}
            </button>
          </div>
          <pre className="max-h-[600px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {renderHighlighted(betterPrompt, values, placeholders, focusKey, focusField)}
          </pre>
        </div>

        {/* Fields */}
        {!fullPreview && (
          <div className="card overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
                <Pencil className="h-3.5 w-3.5 text-accent-glow" />
                Inputs
              </span>
              <span className="text-xs text-ink-fade">
                {filledCount} of {total}
              </span>
            </div>
            <div className="max-h-[600px] space-y-4 overflow-auto p-4">
              {placeholders.map((p) => (
                <Field
                  key={p.key}
                  ph={p}
                  value={values[p.key] || ""}
                  isFocused={focusKey === p.key}
                  registerRef={(el) => (fieldRefs.current[p.key] = el)}
                  onChange={(v) => setVal(p.key, v)}
                  onFocus={() => setFocusKey(p.key)}
                  onBlur={() => setFocusKey(undefined)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  ph,
  value,
  isFocused,
  registerRef,
  onChange,
  onFocus,
  onBlur,
}: {
  ph: Placeholder;
  value: string;
  isFocused: boolean;
  registerRef: (el: HTMLTextAreaElement | HTMLInputElement | null) => void;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const filled = !!value.trim();
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea to fit content
  useLayoutEffect(() => {
    if (!ph.multiline) return;
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 320);
    el.style.height = `${Math.max(72, next)}px`;
  }, [value, ph.multiline]);

  const baseClasses =
    "input-base w-full font-mono text-sm transition" +
    (isFocused ? " ring-2 ring-accent/40 border-accent/40" : "");

  return (
    <div className={`rounded-lg border p-2.5 transition ${filled ? "border-emerald-400/20 bg-emerald-400/[0.04]" : "border-white/5 bg-white/[0.02]"}`}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label className="flex min-w-0 items-baseline gap-1.5 text-xs">
          <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold ${filled ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}>
            {filled ? "✓" : ph.order}
          </span>
          <span className="font-medium text-ink">{ph.label}</span>
          {ph.occurrences > 1 && (
            <span className="text-ink-fade">({ph.occurrences}×)</span>
          )}
        </label>
        {ph.hint && (
          <span className="truncate text-[10px] italic text-ink-fade">{ph.hint}</span>
        )}
      </div>
      {ph.multiline ? (
        <textarea
          ref={(el) => {
            taRef.current = el;
            registerRef(el);
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`Fill in: ${ph.label}`}
          className={baseClasses}
          style={{ minHeight: 72, resize: "none" }}
          spellCheck={false}
        />
      ) : (
        <input
          ref={registerRef as any}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`Fill in: ${ph.label}`}
          className={baseClasses}
          spellCheck={false}
        />
      )}
    </div>
  );
}

function ProgressRing({ filled, total }: { filled: number; total: number }) {
  const pct = total === 0 ? 100 : Math.round((filled / total) * 100);
  const allDone = filled === total && total > 0;
  const circumference = 2 * Math.PI * 14;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative h-9 w-9 flex-none">
      <svg viewBox="0 0 32 32" className="h-9 w-9 -rotate-90">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke={allDone ? "#34d399" : pct > 50 ? "#fbbf24" : "#fb7185"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[10px] font-bold tabular-nums text-ink">
        {filled}/{total}
      </div>
    </div>
  );
}
