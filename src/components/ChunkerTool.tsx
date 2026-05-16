"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Layers,
  ListOrdered,
  Network,
  Scissors,
  Sparkles,
} from "lucide-react";
import {
  CONTEXT_MODELS,
  chunkText,
  decomposeTask,
  estimateTokens,
  type Chunk,
  type ChunkPrefixMode,
  type Decomposition,
} from "@/lib/chunker";

type Mode = "split" | "decompose";

const SAMPLE_TEXT = `Quarterly review transcript — Q1 2026

The product team kicked off with a recap of OKR completion: 7 of 10 objectives shipped on time, two slipped one sprint, and one was de-scoped to next quarter. Eng leadership flagged that on-call burnout drove most of the slippage; the proposed fix is rotating ownership of pager-duty across three engineers per quarter.

Marketing presented the new positioning test results. The "privacy layer for AI" framing outperformed "AI prompt optimizer" by 38% on landing-page conversion. The team voted to make it the homepage hero by end of next sprint.

Customer success raised three recurring themes from support tickets: (1) users want a way to share their AI Leak Score, (2) enterprise prospects asked for SSO, (3) browser-extension demand is climbing fast. Sales noted that 4 of the last 12 closed-won deals cited "no data leaves the browser" as the decisive feature.

Finance walked through burn vs. plan. The team is on track for 18 months of runway at current spend. The biggest variable is whether we hire the second growth engineer this quarter or next.

Action items:
1. Eng: implement on-call rotation by 2026-05-30.
2. Marketing: ship new hero by 2026-05-20.
3. Product: scope "share my leak score" feature for next sprint.
4. CS: draft SSO discovery doc, send to design.
5. Finance: model the cost delta of moving the growth-eng hire.`;

const SAMPLE_DECOMP =
  "Help me write a viral linkedin post about how we ship a feature every week at a startup, plus the metrics it improved, and also write a follow-up tweet thread that condenses the same story for twitter audiences, and then suggest 5 image ideas to go with both";

const STORAGE_KEY_MODEL = "fixaiprompt.chunker.model";
const STORAGE_KEY_MODE = "fixaiprompt.chunker.mode";

export function ChunkerTool() {
  const [mode, setMode] = useState<Mode>("split");
  const [handoff, setHandoff] = useState<{ text: string; modelId: string } | null>(null);
  useEffect(() => {
    // Pick up the homepage hand-off first — overrides any saved mode preference.
    try {
      const raw = sessionStorage.getItem("fixaiprompt.chunker.handoff");
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p.text === "string") {
          setHandoff({ text: p.text, modelId: typeof p.modelId === "string" ? p.modelId : "claude-sonnet" });
          if (p.mode === "split" || p.mode === "decompose") setMode(p.mode);
          sessionStorage.removeItem("fixaiprompt.chunker.handoff");
          return;
        }
      }
    } catch {}
    try {
      const m = localStorage.getItem(STORAGE_KEY_MODE) as Mode | null;
      if (m === "split" || m === "decompose") setMode(m);
    } catch {}
  }, []);
  function pickMode(m: Mode) {
    setMode(m);
    try { localStorage.setItem(STORAGE_KEY_MODE, m); } catch {}
  }

  return (
    <div className="space-y-6">
      <ModeTabs mode={mode} onChange={pickMode} />
      {mode === "split" ? (
        <TextChunker initialText={handoff?.text} initialModelId={handoff?.modelId} />
      ) : (
        <TaskDecomposer initialText={handoff?.text} />
      )}
    </div>
  );
}

function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const tabs: { value: Mode; label: string; blurb: string; icon: any }[] = [
    { value: "split", label: "Text Chunker", blurb: "Split a long document into model-ready chunks.", icon: Scissors },
    { value: "decompose", label: "Task Decomposer", blurb: "Break a complex task into a chain of focused prompts.", icon: Network },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tabs.map((t) => {
        const active = mode === t.value;
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`card group flex items-start gap-3 p-4 text-left transition ${
              active
                ? "border-accent/40 bg-accent/5 ring-1 ring-accent/30"
                : "hover:border-white/15"
            }`}
          >
            <div className={`grid h-9 w-9 flex-none place-items-center rounded-lg ring-1 ${active ? "bg-accent/20 ring-accent/40 text-accent-glow" : "bg-white/5 ring-white/10 text-ink-dim group-hover:text-ink"}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold ${active ? "text-accent-glow" : "text-ink"}`}>{t.label}</div>
              <p className="mt-0.5 text-xs text-ink-dim">{t.blurb}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Text chunker ──────────────────────────────────────────────────────────

function TextChunker({
  initialText,
  initialModelId,
}: {
  initialText?: string;
  initialModelId?: string;
}) {
  const [text, setText] = useState<string>(initialText ?? "");
  const [modelId, setModelId] = useState<string>(() => {
    if (initialModelId) return initialModelId;
    if (typeof window === "undefined") return "claude-sonnet";
    return localStorage.getItem(STORAGE_KEY_MODEL) || "claude-sonnet";
  });
  const [chunkTokens, setChunkTokens] = useState<number>(12_000);
  const [overlapTokens, setOverlapTokens] = useState<number>(200);
  const [prefix, setPrefix] = useState<ChunkPrefixMode>("header");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const model = CONTEXT_MODELS.find((m) => m.id === modelId) || CONTEXT_MODELS[0];

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_MODEL, modelId); } catch {}
    setChunkTokens(model.recommendedChunkTokens);
  }, [modelId, model.recommendedChunkTokens]);

  const totalTokens = useMemo(() => estimateTokens(text), [text]);
  const chunks: Chunk[] = useMemo(() => {
    if (!text.trim()) return [];
    return chunkText(text, { chunkTokens, overlapTokens, prefix });
  }, [text, chunkTokens, overlapTokens, prefix]);

  const fitsInContext = totalTokens > 0 && totalTokens <= model.contextTokens;
  const tooManyChunks = chunks.length > 50;

  async function copy(value: string, idx: number | "all") {
    try {
      await navigator.clipboard.writeText(value);
      if (idx === "all") {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 1500);
      } else {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
            Paste your long text
          </h3>
          <button
            type="button"
            onClick={() => setText(SAMPLE_TEXT)}
            className="text-xs text-accent-glow transition hover:text-accent"
          >
            Try a sample transcript
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a transcript, contract, log file, document, or any long text. We'll split it into chunks that fit your target model's context window."
          className="input-base min-h-[200px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="chunker-input"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-dim">Target model</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="input-base"
              data-testid="model-select"
            >
              {CONTEXT_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-bg-soft">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-dim">Chunk size (tokens)</label>
            <input
              type="number"
              min={100}
              max={Math.max(1000, model.contextTokens)}
              step={100}
              value={chunkTokens}
              onChange={(e) => setChunkTokens(Math.max(100, Number(e.target.value) || 0))}
              className="input-base font-mono"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-dim">Overlap (tokens)</label>
            <input
              type="number"
              min={0}
              max={Math.floor(chunkTokens / 2)}
              step={50}
              value={overlapTokens}
              onChange={(e) => setOverlapTokens(Math.max(0, Number(e.target.value) || 0))}
              className="input-base font-mono"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-dim">Chunk prefix</label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value as ChunkPrefixMode)}
              className="input-base"
            >
              <option value="header" className="bg-bg-soft">--- Chunk N of M ---</option>
              <option value="xml" className="bg-bg-soft">&lt;chunk index=&quot;N&quot;&gt;…&lt;/chunk&gt;</option>
              <option value="none" className="bg-bg-soft">Bare (no prefix)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {text.trim() && (
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="Input tokens" value={totalTokens.toLocaleString()} tone={fitsInContext ? "ok" : "warn"} hint={fitsInContext ? `Fits ${model.label}` : `Exceeds ${model.label}`} />
          <Stat label="Chunks produced" value={chunks.length.toString()} tone={tooManyChunks ? "warn" : "ok"} hint={tooManyChunks ? "Consider a larger chunk size" : `Each ~${chunkTokens.toLocaleString()} tokens`} />
          <Stat label="Avg tokens / chunk" value={chunks.length ? Math.round(chunks.reduce((a, c) => a + c.tokenEstimate, 0) / chunks.length).toLocaleString() : "—"} hint="Estimate (chars/4)" />
          <Stat label="Overlap" value={`${overlapTokens.toLocaleString()} tok`} hint="Between adjacent chunks" />
        </div>
      )}

      {!fitsInContext && totalTokens > 0 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-300">
          <AlertTriangle className="mr-2 inline h-4 w-4 align-text-bottom" />
          Your text is <strong>{totalTokens.toLocaleString()} tokens</strong> — larger than {model.label}&apos;s {model.contextTokens.toLocaleString()}-token context. Chunking lets you process it in passes.
        </div>
      )}

      {/* Output: chunk list + copy all */}
      {chunks.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-dim">
              <Layers className="h-4 w-4 text-accent-glow" />
              Chunks
            </h3>
            <button
              type="button"
              onClick={() => copy(chunks.map((c) => c.decoratedContent).join("\n\n"), "all")}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
            >
              {copiedAll ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied all
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy all chunks
                </>
              )}
            </button>
          </div>
          <ul className="space-y-3">
            {chunks.map((c) => (
              <ChunkCard key={c.index} chunk={c} copied={copiedIdx === c.index} onCopy={(v) => copy(v, c.index)} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChunkCard({
  chunk,
  copied,
  onCopy,
}: {
  chunk: Chunk;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  const [open, setOpen] = useState(chunk.index <= 3);
  return (
    <li className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-dim">
          <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-accent-glow font-semibold">
            #{chunk.index} / {chunk.total}
          </span>
          <span className="tabular-nums">{chunk.tokenEstimate.toLocaleString()} tokens</span>
          <span className="text-ink-fade">·</span>
          <span className="tabular-nums">chars {chunk.charRange[0].toLocaleString()}–{chunk.charRange[1].toLocaleString()}</span>
          <span className="text-ink-fade">·</span>
          <span className={
            chunk.startsAt === "paragraph" ? "text-emerald-300"
            : chunk.startsAt === "sentence" ? "text-sky-300"
            : chunk.startsAt === "word" ? "text-amber-300"
            : "text-rose-300"
          }>
            cut at {chunk.startsAt}
          </span>
          {chunk.hasOverlap && (
            <>
              <span className="text-ink-fade">·</span>
              <span className="text-ink-dim">with overlap</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(chunk.decoratedContent);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
          <ChevronDown className={`h-4 w-4 text-ink-dim transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <pre className="max-h-[360px] overflow-auto border-t border-white/5 bg-bg-soft/40 p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {chunk.decoratedContent}
        </pre>
      )}
    </li>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "ok",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "ok" | "warn";
}) {
  return (
    <div className="card p-3">
      <div className="text-xs text-ink-fade">{label}</div>
      <div className={`mt-0.5 text-lg font-semibold tabular-nums ${tone === "warn" ? "text-amber-300" : "text-ink"}`}>
        {value}
      </div>
      {hint && <div className="mt-0.5 text-xs text-ink-fade">{hint}</div>}
    </div>
  );
}

// ─── Task decomposer ───────────────────────────────────────────────────────

function TaskDecomposer({ initialText }: { initialText?: string }) {
  const [prompt, setPrompt] = useState<string>(initialText ?? "");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const result: Decomposition = useMemo(() => decomposeTask(prompt), [prompt]);

  async function copy(value: string, idx: number | "all") {
    try {
      await navigator.clipboard.writeText(value);
      if (idx === "all") {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 1500);
      } else {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
            Paste a complex task
          </h3>
          <button
            type="button"
            onClick={() => setPrompt(SAMPLE_DECOMP)}
            className="text-xs text-accent-glow transition hover:text-accent"
          >
            Try a sample
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Paste an ambitious, multi-step task. e.g. "Build a landing page, write the copy, design 3 hero images, and write a launch email"'
          className="input-base min-h-[140px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="decomposer-input"
        />
      </div>

      {prompt.trim() && (
        <>
          <div className="card p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 flex-none text-accent-glow" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${result.isComplex ? "bg-amber-400/15 text-amber-300 border-amber-400/30" : "bg-emerald-400/15 text-emerald-300 border-emerald-400/30"}`}>
                    {result.isComplex ? "Complex — chain recommended" : "Simple — one shot is fine"}
                  </span>
                  <span className="text-sm font-medium text-ink">{result.summary}</span>
                </div>
                <ul className="mt-2 flex flex-wrap gap-1.5 text-xs text-ink-dim">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-dim">
              <ListOrdered className="h-4 w-4 text-accent-glow" />
              Prompt chain — {result.steps.length} steps
            </h3>
            <button
              type="button"
              onClick={() =>
                copy(
                  result.steps
                    .map((s) => `### Step ${s.number}: ${s.title}\n${s.prompt}`)
                    .join("\n\n---\n\n"),
                  "all"
                )
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
            >
              {copiedAll ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied chain
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy full chain
                </>
              )}
            </button>
          </div>

          <ol className="space-y-3">
            {result.steps.map((step) => (
              <li key={step.number} className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-sm font-semibold text-accent-glow ring-1 ring-accent/30">
                      {step.number}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-ink">{step.title}</div>
                      <div className="text-xs text-ink-dim">{step.goal}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(step.prompt, step.number)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
                  >
                    {copiedIdx === step.number ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy step
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-[360px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
                  {step.prompt}
                </pre>
                {step.dependsOnPrior && (
                  <div className="border-t border-white/5 bg-bg-soft/40 px-4 py-2 text-xs text-ink-fade">
                    ↑ Paste the output of step {step.number - 1} below this prompt.
                  </div>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
