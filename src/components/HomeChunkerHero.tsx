"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Layers,
  Network,
  Scissors,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  CONTEXT_MODELS,
  chunkText,
  detectComplexityHint,
  estimateTokens,
} from "@/lib/chunker";
import { events } from "@/lib/analytics";

type Sample = { key: string; label: string; text: string };

const SAMPLES: Sample[] = [
  {
    key: "transcript",
    label: "Meeting transcript",
    text: `Q1 review transcript — 2026.

The product team kicked off with a recap of OKR completion: 7 of 10 objectives shipped on time, two slipped one sprint, and one was de-scoped to next quarter. Eng leadership flagged that on-call burnout drove most of the slippage; the proposed fix is rotating ownership of pager-duty across three engineers per quarter.

Marketing presented the new positioning test results. The "privacy layer for AI" framing outperformed "AI prompt optimizer" by 38% on landing-page conversion. The team voted to make it the homepage hero by end of next sprint.

Customer success raised three recurring themes from support tickets: (1) users want a way to share their AI Leak Score, (2) enterprise prospects asked for SSO, (3) browser-extension demand is climbing fast. Sales noted that 4 of the last 12 closed-won deals cited "no data leaves the browser" as the decisive feature.

Finance walked through burn vs. plan. The team is on track for 18 months of runway at current spend. The biggest variable is whether we hire the second growth engineer this quarter or next.

Action items:
1. Eng: implement on-call rotation by 2026-05-30.
2. Marketing: ship new hero by 2026-05-20.
3. Product: scope "share my leak score" feature for next sprint.
4. CS: draft SSO discovery doc, send to design.
5. Finance: model the cost delta of moving the growth-eng hire.`,
  },
  {
    key: "decompose",
    label: "Complex task",
    text:
      "Help me build a launch plan for our enterprise tier: design the pricing page, write the launch email sequence, set up the SSO discovery doc with engineering, and also produce 3 LinkedIn posts plus a press-release draft, and decide whether to time it with KubeCon or our own webinar.",
  },
  {
    key: "code",
    label: "Code file",
    text:
      "// users.ts — auth + session helpers\nimport { cookies } from \"next/headers\";\nimport { verifyJWT } from \"./crypto\";\n\nexport async function getCurrentUser() {\n  const t = cookies().get(\"session\")?.value;\n  if (!t) return null;\n  try {\n    const payload = await verifyJWT(t);\n    return { id: payload.sub, email: payload.email, role: payload.role };\n  } catch {\n    return null;\n  }\n}\n\nexport async function requireUser() {\n  const u = await getCurrentUser();\n  if (!u) throw new Error(\"Unauthorized\");\n  return u;\n}\n\nexport function isAdmin(u: { role?: string }) {\n  return u.role === \"admin\";\n}",
  },
];

// ─── Content-type detection ─────────────────────────────────────────────────

type DetectedType =
  | "transcript"
  | "log"
  | "code"
  | "json"
  | "contract"
  | "prompt-task"
  | "long-text";

function detectContentType(text: string): DetectedType | null {
  const t = text.trim();
  if (t.length < 40) return null;

  // JSON: starts with { or [, and at least one quote-key colon
  if ((t.startsWith("{") || t.startsWith("[")) && /"\s*:\s*/.test(t)) return "json";

  // Code: balance of code markers
  const codeMarkers =
    (t.match(/\b(function|class|const|let|var|def|import|return|public|private)\b/g) || []).length;
  if (codeMarkers >= 4 && /[{};]/.test(t)) return "code";

  // Log: structured timestamp + level
  const logHits = (t.match(/\b(INFO|WARN|ERROR|DEBUG|TRACE)\b/g) || []).length;
  const ts = (t.match(/\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/g) || []).length;
  if (logHits + ts >= 3) return "log";

  // Contract / legal
  if (/\b(WHEREAS|hereinafter|party of the (?:first|second)|in witness whereof|agreement|hereby)\b/i.test(t))
    return "contract";

  // Transcript: speaker turns or timestamped lines
  if (
    /\b(transcript|recap|action items?|attendees?)\b/i.test(t) ||
    /^[A-Z][a-z]+\s*[:>]/m.test(t) ||
    /\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(t)
  )
    return "transcript";

  // Decomposable task (a complex multi-deliverable prompt)
  const verbs = (t.match(/\b(write|build|design|generate|create|draft|launch|plan|set\s+up|produce)\b/gi) || []).length;
  const ands = (t.match(/\b(and|also|then|finally|after\s+that)\b/gi) || []).length;
  if (verbs >= 3 && ands >= 2 && t.length < 800) return "prompt-task";

  return "long-text";
}

const TYPE_LABEL: Record<DetectedType, string> = {
  transcript: "Transcript",
  log: "Log file",
  code: "Code",
  json: "JSON",
  contract: "Contract / legal",
  "prompt-task": "Complex task — decompose",
  "long-text": "Long text",
};

const TYPE_EMOJI: Record<DetectedType, string> = {
  transcript: "🗣️",
  log: "📜",
  code: "💻",
  json: "{ }",
  contract: "📑",
  "prompt-task": "🧩",
  "long-text": "📝",
};

// ─── Model fit summary ──────────────────────────────────────────────────────

const HIGHLIGHT_MODELS = ["gpt-4", "gpt-4-turbo", "claude-sonnet", "gemini-1.5-pro"];

function modelFit(tokens: number): { id: string; label: string; ok: boolean; ctx: number }[] {
  return CONTEXT_MODELS.filter((m) => HIGHLIGHT_MODELS.includes(m.id)).map((m) => ({
    id: m.id,
    label: shortModelLabel(m.label),
    ok: tokens <= m.contextTokens,
    ctx: m.contextTokens,
  }));
}

function shortModelLabel(l: string): string {
  // "GPT-4 classic (8k)" -> "GPT-4 8k"
  return l.replace(/\s*\((\d+k|\d+M)\)/, " $1").replace(" / GPT-4o", "");
}

// ─── Component ──────────────────────────────────────────────────────────────

export function HomeChunkerHero() {
  const [text, setText] = useState<string>("");
  const [modelId, setModelId] = useState<string>("claude-sonnet");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const model = CONTEXT_MODELS.find((m) => m.id === modelId) || CONTEXT_MODELS[0];
  const tokens = useMemo(() => estimateTokens(text), [text]);
  const detected = useMemo(() => detectContentType(text), [text]);
  const fit = useMemo(() => modelFit(tokens), [tokens]);
  const chunks = useMemo(() => {
    if (!text.trim() || tokens < 100) return [];
    // For the homepage demo we use a small chunk size so users see multiple
    // chunks on realistic input. The full /chunker uses the model's
    // recommended chunk size (much larger).
    const previewChunkTokens = Math.min(model.recommendedChunkTokens, Math.max(150, Math.floor(tokens / 3)));
    return chunkText(text, {
      chunkTokens: previewChunkTokens,
      overlapTokens: Math.min(50, Math.floor(previewChunkTokens / 4)),
      prefix: "header",
    });
  }, [text, tokens, model.recommendedChunkTokens]);
  const decomposeHint = useMemo(() => detectComplexityHint(text), [text]);

  const recommendDecomposer = detected === "prompt-task" || (decomposeHint.isComplex && text.length < 1200);

  // Debounced chunker_input event so we capture content-type + tokens + model
  // without firing on every keystroke.
  const inputTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInputRef = useRef<string>("");
  useEffect(() => {
    if (!text.trim() || tokens < 40) return;
    const key = text + "|" + modelId;
    if (lastInputRef.current === key) return;
    if (inputTimer.current) clearTimeout(inputTimer.current);
    inputTimer.current = setTimeout(() => {
      lastInputRef.current = key;
      events.chunkerInput({
        surface: "home",
        chars: text.length,
        tokens,
        detected_type: detected ?? undefined,
        model: modelId,
      });
    }, 1200);
    return () => {
      if (inputTimer.current) clearTimeout(inputTimer.current);
    };
  }, [text, modelId, tokens, detected]);

  // Hand off to /chunker via sessionStorage so the full tool picks it up.
  function handoffHref(mode: "split" | "decompose"): string {
    return mode === "decompose" ? "/chunker?from=home&mode=decompose" : "/chunker?from=home";
  }

  function onHandoffClick(mode: "split" | "decompose") {
    if (typeof window !== "undefined" && text.trim()) {
      try {
        sessionStorage.setItem("fixaiprompt.chunker.handoff", JSON.stringify({ mode, text, modelId }));
      } catch {}
    }
    events.chunkerHandoff({ mode, tokens });
  }

  async function copy(value: string, idx: number) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
      events.chunkerCopyChunk({ surface: "home", index: idx, total: chunks.length });
    } catch {}
  }

  function loadSample(s: Sample) {
    setText(s.text);
    events.chunkerSampleLoaded({ surface: "home", sample: s.key });
  }

  const hasMeaningful = text.trim().length > 10;

  return (
    <div className="mx-auto mt-10 max-w-5xl">
      <div className="card relative overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" aria-hidden />

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-dim">
            <Scissors className="h-4 w-4 text-cyan-300" />
            Smart Chunker
            <span className="ml-1 rounded-full border border-cyan-400/30 bg-cyan-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-200">
              live
            </span>
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {SAMPLES.map((s) => (
              <button
                key={s.key}
                onClick={() => loadSample(s)}
                className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-dim transition hover:bg-white/5 hover:text-ink"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a long transcript, contract, log, doc, or a complex task — the chunker will detect the right approach automatically."
          className="input-base min-h-[120px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="home-chunker-input"
        />

        {/* Stats / detection row */}
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Tokens"
            value={tokens > 0 ? `~${tokens.toLocaleString()}` : "—"}
            hint={tokens > 0 ? `${text.length.toLocaleString()} chars` : "Paste text above"}
            tone={tokens > 100_000 ? "warn" : tokens > 0 ? "ok" : "muted"}
          />
          <Stat
            label="Detected"
            value={detected ? `${TYPE_EMOJI[detected]} ${TYPE_LABEL[detected]}` : "—"}
            hint={
              detected === "prompt-task"
                ? "Multi-step ask — decomposer recommended"
                : detected
                ? "Detected by heuristic"
                : "Awaiting input"
            }
            tone={detected === "prompt-task" ? "violet" : detected ? "ok" : "muted"}
          />
          <Stat
            label="Target model"
            value={
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="-ml-1 w-full max-w-[180px] truncate rounded-md border border-white/10 bg-bg-soft/70 px-2 py-1 text-sm focus:border-accent/60 focus:outline-none"
              >
                {CONTEXT_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-bg-soft">
                    {m.label}
                  </option>
                ))}
              </select>
            }
            hint={`Chunk size ${model.recommendedChunkTokens.toLocaleString()} tokens`}
            tone="muted"
          />
          <Stat
            label={chunks.length ? `${chunks.length} chunk${chunks.length === 1 ? "" : "s"}` : "Chunks"}
            value={
              chunks.length
                ? `~${Math.round(chunks.reduce((a, c) => a + c.tokenEstimate, 0) / chunks.length).toLocaleString()} avg`
                : "—"
            }
            hint={chunks.length ? "200-token overlap between adjacent chunks" : "Will compute when text is big enough"}
            tone={chunks.length ? "ok" : "muted"}
          />
        </div>

        {/* Model fit row */}
        {tokens > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink-fade">Fits in:</span>
            {fit.map((f) => (
              <span
                key={f.id}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${
                  f.ok
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-300"
                }`}
                title={`${f.ctx.toLocaleString()} token context`}
              >
                {f.ok ? <CheckCircle2 className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                {f.label}
              </span>
            ))}
          </div>
        )}

        {/* Decompose recommendation */}
        {recommendDecomposer && hasMeaningful && (
          <div className="mt-4 rounded-xl border border-violet-400/30 bg-violet-400/5 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-2 text-violet-200">
                <Network className="mt-0.5 h-4 w-4 flex-none text-violet-300" />
                <div>
                  <div className="font-semibold">This looks like a complex task, not just long text.</div>
                  <p className="mt-0.5 text-xs text-ink-dim">
                    The Task Decomposer breaks it into a chain of focused sub-prompts (research → plan → draft → critique → polish), which beats one-shot answers on multi-step asks.
                  </p>
                </div>
              </div>
              <Link
                href={handoffHref("decompose")}
                onClick={() => onHandoffClick("decompose")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/40 bg-violet-400/15 px-3 py-1.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-400/25"
              >
                Decompose this <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Chunk preview */}
        {chunks.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
                <Layers className="h-3.5 w-3.5 text-cyan-300" />
                Preview · first {Math.min(chunks.length, 2)} chunk{chunks.length === 1 ? "" : "s"} of {chunks.length}
              </h3>
              <Link
                href={handoffHref("split")}
                onClick={() => onHandoffClick("split")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-glow transition hover:bg-accent-glow"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Open all in full Chunker
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {chunks.slice(0, 2).map((c) => (
                <div key={c.index} className="card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-ink-dim">
                      <span className="rounded-full border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent-glow">
                        #{c.index}/{c.total}
                      </span>
                      <span className="tabular-nums">{c.tokenEstimate.toLocaleString()} tokens</span>
                      <span className="text-ink-fade">·</span>
                      <span
                        className={
                          c.startsAt === "paragraph"
                            ? "text-emerald-300"
                            : c.startsAt === "sentence"
                            ? "text-sky-300"
                            : c.startsAt === "word"
                            ? "text-amber-300"
                            : "text-rose-300"
                        }
                      >
                        cut at {c.startsAt}
                      </span>
                    </span>
                    <button
                      onClick={() => copy(c.decoratedContent, c.index)}
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-dim transition hover:bg-white/10 hover:text-ink"
                    >
                      {copiedIdx === c.index ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="max-h-[140px] overflow-auto p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-ink">
                    {c.content.length > 600 ? c.content.slice(0, 600) + "…" : c.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty / small-input hint */}
        {!hasMeaningful && (
          <p className="mt-3 text-xs text-ink-fade">
            Tip: pick a sample on the right, or paste a transcript / doc / complex task. Detection + chunking runs entirely in your browser.
          </p>
        )}
        {hasMeaningful && tokens < 100 && !recommendDecomposer && (
          <p className="mt-3 text-xs text-ink-fade">
            Input is small — paste something longer to see chunking in action. Try the &quot;Meeting transcript&quot; sample for a realistic demo.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "ok",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "ok" | "warn" | "violet" | "muted";
}) {
  const valueClass =
    tone === "warn"
      ? "text-amber-300"
      : tone === "violet"
      ? "text-violet-300"
      : tone === "muted"
      ? "text-ink-fade"
      : "text-ink";
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-ink-fade">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold tabular-nums ${valueClass}`}>{value}</div>
      {hint && <div className="mt-0.5 text-[10px] text-ink-fade">{hint}</div>}
    </div>
  );
}
