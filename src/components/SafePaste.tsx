"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  categoryLabel,
  severityColorClass,
  type Detection,
  type Severity,
} from "@/lib/detector";
import { mask, type MaskMode } from "@/lib/masker";
import { bandColor, bandRing, computeLeakScore } from "@/lib/leakScore";
import { events } from "@/lib/analytics";

const SAMPLES: Record<string, string> = {
  log: `[2026-05-11 09:12:44] User john.doe@acme.com signed in from 49.207.181.22
Bearer eyJhbGciOiJIUzI1NiIsInR0eXAiOiJKV1QifQ.eyJ1aWQiOiJqZG9lIiwiZXhwIjoxNzgxMjM0NTY3fQ.aR3kKjT5_pkqQv0w8m2bRzvLpPYxn4VHs3rZsBSqLuI
GET /api/users  200  124ms
DB: postgres://acme:hunter2@db.internal:5432/prod
OPENAI_API_KEY=sk-proj-abc123def456ghij789klmn012opqr345stuvwx678
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`,
  json: `{
  "user": {
    "email": "ananya.sharma@example.com",
    "phone": "+91 98765 43210",
    "ssn": "458-29-1234"
  },
  "auth": {
    "api_key": "sk-ant-api03-aXz0AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz",
    "github_token": "ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ012345abcd",
    "stripe": "sk_test_EXAMPLEEXAMPLEEXAMPLEEXAMPLEexample"
  },
  "infra": {
    "mongo": "mongodb+srv://prod:Sup3rSecret@cluster0.abcde.mongodb.net/main"
  }
}`,
  sql: `INSERT INTO users (email, password, phone, ssn)
VALUES ('rahul@acme.co', 'P@ssw0rd!123', '+91-9876543210', '402-11-7788');

UPDATE accounts SET api_key = 'sk-live-aBcDeFgHiJkLmNoPqRsTuVwXyZ012345'
WHERE email = 'admin@acme.co';

SELECT * FROM logs WHERE token = 'ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ012345abcd';`,
};

export function SafePaste() {
  const [input, setInput] = useState<string>("");
  const [mode, setMode] = useState<MaskMode>("plain");
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [copied, setCopied] = useState<"none" | "masked" | "summary">("none");

  // Pick up content stashed by the bookmarklet on first mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stashed = sessionStorage.getItem("fixaiprompt.bookmarklet");
      if (stashed) {
        setInput(stashed);
        sessionStorage.removeItem("fixaiprompt.bookmarklet");
      }
    } catch {}
  }, []);

  const { output, detections } = useMemo(() => mask(input, mode), [input, mode]);
  const score = useMemo(() => computeLeakScore(detections), [detections]);

  // Debounced "scanned" event — fires after user stops typing.
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScannedRef = useRef<string>("");
  useEffect(() => {
    if (!input.trim()) return;
    if (lastScannedRef.current === input + mode) return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      lastScannedRef.current = input + mode;
      events.safePasteScanned({
        chars: input.length,
        detections: detections.length,
        band: score.band,
        mode,
      });
    }, 1200);
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, [input, mode, detections.length, score.band]);

  async function copy(value: string, which: "masked" | "summary") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied("none"), 1500);
      events.safePasteCopied({ mode, what: which });
    } catch {}
  }

  function loadSample(key: keyof typeof SAMPLES) {
    setInput(SAMPLES[key]);
    if (key === "json") setMode("json");
    else if (key === "sql") setMode("sql");
    else setMode("plain");
    events.safePasteSampleLoaded({ sample: key });
  }

  function buildShareSummary(): string {
    if (!detections.length) return "FixAIPrompt scanned this — 0 secrets detected. Score 100/100.";
    const byCategory = new Map<string, number>();
    for (const d of detections) {
      byCategory.set(d.label, (byCategory.get(d.label) || 0) + 1);
    }
    const lines = [
      `AI Leak Score: ${score.score}/100 (${score.band.toUpperCase()})`,
      `${detections.length} sensitive item${detections.length === 1 ? "" : "s"} detected:`,
      ...Array.from(byCategory.entries()).map(([k, v]) => `  • ${v}× ${k}`),
      ``,
      `Scanned with FixAIPrompt — https://fixaiprompt.com/safe-paste`,
    ];
    return lines.join("\n");
  }

  return (
    <div className="space-y-6">
      <ScoreCard score={score} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* INPUT */}
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
              Paste anything — logs, JSON, SQL, code
            </h2>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => loadSample("log")}
                className="rounded-md border border-white/10 px-2 py-1 text-ink-dim transition hover:bg-white/5 hover:text-ink"
              >
                Log sample
              </button>
              <button
                onClick={() => loadSample("json")}
                className="rounded-md border border-white/10 px-2 py-1 text-ink-dim transition hover:bg-white/5 hover:text-ink"
              >
                JSON sample
              </button>
              <button
                onClick={() => loadSample("sql")}
                className="rounded-md border border-white/10 px-2 py-1 text-ink-dim transition hover:bg-white/5 hover:text-ink"
              >
                SQL sample
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a log line, JSON blob, SQL dump, API response — anything you'd normally throw at ChatGPT/Claude. Detection runs locally in your browser."
            className="input-base min-h-[320px] font-mono text-sm leading-relaxed"
            spellCheck={false}
            data-testid="safe-paste-input"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-fade">
            <span>
              {input.length} char{input.length === 1 ? "" : "s"}
              {detections.length > 0 && (
                <> · <span className="text-rose-300">{detections.length} sensitive item{detections.length === 1 ? "" : "s"}</span></>
              )}
            </span>
            <div className="flex items-center gap-2">
              <ModeToggle
                mode={mode}
                setMode={(m) => {
                  setMode(m);
                  events.safePasteModeChanged({ mode: m });
                }}
              />
              <button
                onClick={() => setInput("")}
                disabled={!input}
                className="rounded-md border border-white/10 px-2 py-1 transition hover:bg-white/5 disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-ink-dim">
              <Shield className="h-4 w-4 text-accent-glow" />
              Masked output
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowRaw((v) => !v)}
                disabled={!output}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/5 hover:text-ink disabled:opacity-40"
                title={showRaw ? "Hide diff view" : "Show diff view"}
              >
                {showRaw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showRaw ? "Hide highlights" : "Show highlights"}
              </button>
              <button
                onClick={() => copy(output, "masked")}
                disabled={!output}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/5 hover:text-ink disabled:opacity-40"
              >
                {copied === "masked" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy safe text
                  </>
                )}
              </button>
            </div>
          </div>

          {output ? (
            showRaw ? (
              <HighlightedInput input={input} detections={detections} />
            ) : (
              <pre className="max-h-[420px] min-h-[320px] overflow-auto rounded-lg border border-white/10 bg-bg-soft p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
                {output}
              </pre>
            )
          ) : (
            <div className="grid min-h-[320px] place-items-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-ink-fade">
              Paste something on the left — your safe-to-share version appears here.
            </div>
          )}

          {detections.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-ink-fade">
              <span>
                <Sparkles className="mr-1 inline h-3.5 w-3.5 text-accent-glow" />
                Share the safety summary instead of the data
              </span>
              <button
                onClick={() => copy(buildShareSummary(), "summary")}
                className="rounded-md border border-white/10 px-2 py-1 text-ink-dim transition hover:bg-white/5 hover:text-ink"
              >
                {copied === "summary" ? "Copied summary" : "Copy summary"}
              </button>
            </div>
          )}
        </div>
      </div>

      <DetectionList detections={detections} />
    </div>
  );
}

function ModeToggle({ mode, setMode }: { mode: MaskMode; setMode: (m: MaskMode) => void }) {
  const opts: { v: MaskMode; label: string }[] = [
    { v: "plain", label: "Plain" },
    { v: "json", label: "JSON" },
    { v: "sql", label: "SQL" },
  ];
  return (
    <div className="inline-flex rounded-md border border-white/10 bg-bg-soft p-0.5">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => setMode(o.v)}
          className={`rounded px-2 py-1 transition ${
            mode === o.v
              ? "bg-accent/20 text-accent-glow"
              : "text-ink-dim hover:text-ink"
          }`}
          data-testid={`mask-mode-${o.v}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ScoreCard({ score }: { score: ReturnType<typeof computeLeakScore> }) {
  const Icon =
    score.band === "safe" ? ShieldCheck : score.band === "warning" ? Shield : ShieldAlert;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 sm:p-6 ${bandColor(score.band)}`}
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-xl bg-black/30 ring-1 ${bandRing(score.band)}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider opacity-70">
              AI Leak Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">{score.score}</span>
              <span className="text-sm opacity-70">/ 100</span>
            </div>
            <div className="mt-1 text-sm font-medium">{score.headline}</div>
          </div>
        </div>
        <div className="max-w-md text-sm opacity-90">{score.message}</div>
      </div>
      {score.breakdown.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {score.breakdown.map((b) => (
            <span
              key={b.severity}
              className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1"
            >
              {b.count}× {b.severity}
              <span className="ml-1.5 opacity-60">−{b.deduction}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DetectionList({ detections }: { detections: Detection[] }) {
  if (!detections.length) return null;
  // Group by label
  const groups = new Map<string, { label: string; severity: Severity; category: string; samples: string[]; }>();
  for (const d of detections) {
    const cur = groups.get(d.label) || {
      label: d.label,
      severity: d.severity,
      category: categoryLabel(d.category),
      samples: [],
    };
    if (cur.samples.length < 3) cur.samples.push(d.match);
    groups.set(d.label, cur);
  }
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-dim">
        What we found ({detections.length})
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {Array.from(groups.values()).map((g) => (
          <li key={g.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex flex-wrap items-center gap-2">
              <AlertCircle className="h-4 w-4 text-severity-warn" />
              <span className={`chip ${severityColorClass(g.severity)}`}>
                {g.severity}
              </span>
              <span className="text-sm font-medium text-ink">{g.label}</span>
              <span className="text-xs text-ink-fade">· {g.category}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {g.samples.map((s, i) => (
                <li
                  key={i}
                  className="overflow-hidden rounded border border-white/5 bg-bg-soft px-2 py-1 font-mono text-xs text-ink-dim"
                  title={s}
                >
                  {truncate(s)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function truncate(s: string, n = 64): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

function HighlightedInput({
  input,
  detections,
}: {
  input: string;
  detections: Detection[];
}) {
  if (!detections.length) {
    return (
      <pre className="max-h-[420px] min-h-[320px] overflow-auto rounded-lg border border-white/10 bg-bg-soft p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
        {input}
      </pre>
    );
  }
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  const sorted = [...detections].sort((a, b) => a.start - b.start);
  sorted.forEach((d, i) => {
    if (d.start < cursor) return; // skip overlap
    if (d.start > cursor) parts.push(input.slice(cursor, d.start));
    parts.push(
      <mark
        key={`${i}-${d.start}`}
        className={`rounded px-0.5 font-mono ${
          d.severity === "critical"
            ? "bg-rose-500/30 text-rose-200"
            : d.severity === "high"
            ? "bg-orange-500/30 text-orange-200"
            : d.severity === "medium"
            ? "bg-amber-500/25 text-amber-200"
            : "bg-sky-500/25 text-sky-200"
        }`}
        title={d.label}
      >
        {input.slice(d.start, d.end)}
      </mark>
    );
    cursor = d.end;
  });
  if (cursor < input.length) parts.push(input.slice(cursor));
  return (
    <pre className="max-h-[420px] min-h-[320px] overflow-auto rounded-lg border border-white/10 bg-bg-soft p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
      {parts}
    </pre>
  );
}
