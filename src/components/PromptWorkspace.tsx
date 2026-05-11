"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Flame,
  Info,
  KeyRound,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  lintPrompt,
  severityColor,
  severityLabel,
  type LintIssue,
  type LintReport,
} from "@/lib/linter";
import {
  LEVELS,
  PERSONALITIES,
  STYLES,
  TARGET_MODELS,
  rewriteWithClaude,
  type Level,
  type Personality,
  type RewriteMode,
  type Style,
  type TargetModel,
} from "@/lib/rewriter";
import { MetricBreakdown } from "./MetricBreakdown";

const SAMPLE_PROMPT =
  "can you please help me with writing something about climate change it should be good and detailed but also short and simple thanks";

const STORAGE_KEY_API = "fixaiprompt.apikey";
const STORAGE_KEY_TARGET = "fixaiprompt.target";
const STORAGE_KEY_LEVEL = "fixaiprompt.level";
const STORAGE_KEY_PERSONALITY = "fixaiprompt.personality";
const STORAGE_KEY_STYLE = "fixaiprompt.style";
const STORAGE_KEY_WATERMARK = "fixaiprompt.watermark";

export function PromptWorkspace({ initialPrompt }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState<string>(initialPrompt ?? "");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);
  const [target, setTarget] = useState<TargetModel>("claude");
  const [level, setLevel] = useState<Level>("expert");
  const [personality, setPersonality] = useState<Personality>("default");
  const [style, setStyle] = useState<Style>("default");
  const [watermark, setWatermark] = useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [rewriting, setRewriting] = useState<boolean>(false);
  const [mode, setMode] = useState<RewriteMode>("improve");
  const [rewritten, setRewritten] = useState<string>("");
  const [rationale, setRationale] = useState<string>("");
  const [roast, setRoast] = useState<string>("");
  const [scoreBefore, setScoreBefore] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<"none" | "original" | "rewritten">("none");

  useEffect(() => {
    try {
      const k = localStorage.getItem(STORAGE_KEY_API);
      if (k) setApiKey(k);
      const t = localStorage.getItem(STORAGE_KEY_TARGET) as TargetModel | null;
      if (t) setTarget(t);
      const lvl = localStorage.getItem(STORAGE_KEY_LEVEL) as Level | null;
      if (lvl) setLevel(lvl);
      const p = localStorage.getItem(STORAGE_KEY_PERSONALITY) as Personality | null;
      if (p) setPersonality(p);
      const s = localStorage.getItem(STORAGE_KEY_STYLE) as Style | null;
      if (s) setStyle(s);
      const wm = localStorage.getItem(STORAGE_KEY_WATERMARK);
      if (wm === "1") setWatermark(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (apiKey) localStorage.setItem(STORAGE_KEY_API, apiKey);
      else localStorage.removeItem(STORAGE_KEY_API);
    } catch {}
  }, [apiKey]);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_TARGET, target); } catch {} }, [target]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_LEVEL, level); } catch {} }, [level]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_PERSONALITY, personality); } catch {} }, [personality]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_STYLE, style); } catch {} }, [style]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_WATERMARK, watermark ? "1" : "0"); } catch {} }, [watermark]);

  const report: LintReport = useMemo(() => lintPrompt(prompt), [prompt]);
  const afterReport: LintReport | null = useMemo(
    () => (rewritten ? lintPrompt(rewritten) : null),
    [rewritten]
  );

  async function handleRewrite(targetMode: RewriteMode = "improve") {
    setError("");
    setRewriting(true);
    setRewritten("");
    setRationale("");
    setRoast("");
    setMode(targetMode);
    setScoreBefore(report.score);
    try {
      const result = await rewriteWithClaude({
        apiKey,
        prompt,
        target,
        issues: report.issues,
        personality,
        style,
        level,
        mode: targetMode,
        watermark,
      });
      setRewritten(result.rewritten);
      setRationale(result.rationale);
      if (result.roast) setRoast(result.roast);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setRewriting(false);
    }
  }

  async function copy(value: string, which: "original" | "rewritten") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied("none"), 1500);
    } catch {}
  }

  const canRewrite = prompt.trim().length > 0 && apiKey.trim().length > 0 && !rewriting;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* LEFT: input + lint */}
      <div className="card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
            Your prompt
          </h2>
          <button
            type="button"
            className="text-xs text-accent-glow transition hover:text-accent"
            onClick={() => setPrompt(SAMPLE_PROMPT)}
          >
            Try a sample
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your prompt here. We'll lint it locally and (optionally) rewrite it with Claude."
          className="input-base min-h-[200px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="prompt-input"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-fade">
          <span>
            {report.stats.words} word{report.stats.words === 1 ? "" : "s"} ·{" "}
            {report.stats.chars} char{report.stats.chars === 1 ? "" : "s"} ·{" "}
            {report.stats.sentences} sentence
            {report.stats.sentences === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copy(prompt, "original")}
              disabled={!prompt}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 transition hover:bg-white/5 disabled:opacity-40"
            >
              {copied === "original" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setPrompt("");
                setRewritten("");
                setRationale("");
                setRoast("");
                setError("");
              }}
              disabled={!prompt && !rewritten}
              className="rounded-md border border-white/10 px-2 py-1 transition hover:bg-white/5 disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
              Score breakdown
            </h3>
            {report.stats.words > 0 && (
              <ScorePill score={report.score} />
            )}
          </div>
          <MetricBreakdown metrics={report.metrics} hidden={report.stats.words === 0} />
        </div>

        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-dim">
            Lint findings
          </h3>
          {report.stats.words === 0 ? (
            <EmptyState text="Type or paste a prompt to see what to fix." />
          ) : report.issues.length === 0 ? (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
              <CheckCircle2 className="mr-2 inline h-4 w-4 align-text-bottom" />
              Looks clean — no rule violations. You can still get a sharper rewrite.
            </div>
          ) : (
            <ul className="space-y-2.5">
              {report.issues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT: rewrite controls + output */}
      <div className="card p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-dim">
          AI Rewriter
        </h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-dim">
              Target model
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as TargetModel)}
              className="input-base"
              data-testid="target-model"
            >
              {TARGET_MODELS.map((m) => (
                <option key={m.value} value={m.value} className="bg-bg-soft">
                  {m.label} — {m.hint}
                </option>
              ))}
            </select>
          </div>

          <LevelSlider value={level} onChange={setLevel} />

          <div>
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-dim transition hover:text-ink"
              data-testid="advanced-toggle"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition ${advancedOpen ? "rotate-180" : ""}`} />
              Advanced: personality, style, watermark
            </button>
            {advancedOpen && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-dim">
                    Personality
                  </label>
                  <select
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value as Personality)}
                    className="input-base"
                  >
                    {PERSONALITIES.map((p) => (
                      <option key={p.value} value={p.value} className="bg-bg-soft">
                        {p.emoji}  {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-dim">
                    Output style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as Style)}
                    className="input-base"
                  >
                    {STYLES.map((s) => (
                      <option key={s.value} value={s.value} className="bg-bg-soft">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="col-span-full inline-flex items-center gap-2 text-xs text-ink-dim">
                  <input
                    type="checkbox"
                    checked={watermark}
                    onChange={(e) => setWatermark(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-white/20 bg-bg-soft"
                  />
                  Append a tiny &quot;Optimized with FixAIPrompt.com&quot; footer to the rewritten prompt (off by default).
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink-dim">
              <KeyRound className="h-3.5 w-3.5" /> Anthropic API key (stored locally only)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                autoComplete="off"
                spellCheck={false}
                className="input-base pr-10 font-mono"
                data-testid="api-key"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-dim transition hover:bg-white/5 hover:text-ink"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-ink-fade">
              Get one at{" "}
              <a
                className="text-accent-glow underline-offset-2 hover:underline"
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
              >
                console.anthropic.com
              </a>
              . We never send it anywhere except api.anthropic.com.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleRewrite("improve")}
              disabled={!canRewrite}
              className="btn-primary"
              data-testid="rewrite-btn"
            >
              {rewriting && mode === "improve" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Rewriting…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Improve with Claude
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleRewrite("roast")}
              disabled={!canRewrite}
              className="btn-ghost"
              data-testid="roast-btn"
            >
              {rewriting && mode === "roast" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Roasting…
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 text-rose-400" /> Roast My Prompt
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-severity-error/30 bg-severity-error/10 p-3 text-sm text-severity-error">
              <AlertCircle className="mr-2 inline h-4 w-4 align-text-bottom" />
              {error}
            </div>
          )}

          {roast && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/5 p-4">
              <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300">
                <Flame className="h-3.5 w-3.5" /> The roast
              </div>
              <p className="text-sm leading-relaxed text-ink">{roast}</p>
            </div>
          )}

          {rewritten && (
            <div className="mt-2 space-y-3">
              {afterReport && scoreBefore !== null && (
                <ScoreJump before={scoreBefore} after={afterReport.score} />
              )}
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Sparkles className="h-4 w-4 text-accent-glow" />
                  Rewritten prompt
                </h3>
                <button
                  type="button"
                  onClick={() => copy(rewritten, "rewritten")}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-xs transition hover:bg-white/5"
                >
                  {copied === "rewritten" ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-bg-soft p-3 font-mono text-sm leading-relaxed text-ink whitespace-pre-wrap">
                {rewritten}
              </pre>
              {rationale && (
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm text-ink-dim">
                  <span className="font-medium text-accent-glow">Why these changes:</span>{" "}
                  {rationale}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LevelSlider({ value, onChange }: { value: Level; onChange: (v: Level) => void }) {
  const idx = LEVELS.findIndex((l) => l.value === value);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label className="text-xs font-medium text-ink-dim">Sophistication</label>
        <span className="text-xs font-semibold text-accent-glow">{LEVELS[idx]?.label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={LEVELS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange(LEVELS[Number(e.target.value)].value)}
        className="w-full accent-accent"
        data-testid="level-slider"
        aria-label="Sophistication level"
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-ink-fade">
        {LEVELS.map((l) => (
          <span key={l.value}>{l.label}</span>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-fade">{LEVELS[idx]?.hint}</p>
    </div>
  );
}

function ScoreJump({ before, after }: { before: number; after: number }) {
  const delta = after - before;
  const pct = before > 0 ? Math.round((delta / before) * 100) : null;
  return (
    <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
      <div className="text-sm">
        <span className="text-ink-dim">Score</span>{" "}
        <span className="font-semibold text-rose-300">{before}</span>{" "}
        <span className="text-ink-dim">→</span>{" "}
        <span className="font-semibold text-emerald-300">{after}</span>
        {delta > 0 && (
          <span className="ml-2 text-xs text-emerald-300">
            +{delta} pts{pct !== null && pct !== Infinity ? ` (${pct > 0 ? "+" : ""}${pct}%)` : ""}
          </span>
        )}
      </div>
      <span className="text-xs text-ink-fade">Expected output quality boost</span>
    </div>
  );
}

function IssueRow({ issue }: { issue: LintIssue }) {
  const Icon =
    issue.severity === "error"
      ? AlertCircle
      : issue.severity === "warning"
      ? AlertCircle
      : Info;
  return (
    <li className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon
            className={
              issue.severity === "error"
                ? "h-4 w-4 text-severity-error"
                : issue.severity === "warning"
                ? "h-4 w-4 text-severity-warn"
                : "h-4 w-4 text-severity-info"
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`chip ${severityColor(issue.severity)}`}>
              {severityLabel(issue.severity)}
            </span>
            <span className="text-sm font-medium text-ink">{issue.title}</span>
          </div>
          <p className="mt-1.5 text-sm text-ink-dim">{issue.message}</p>
          <p className="mt-1.5 text-sm">
            <span className="font-medium text-accent-glow">Fix:</span>{" "}
            <span className="text-ink-dim">{issue.fix}</span>
          </p>
        </div>
      </div>
    </li>
  );
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-300 border-emerald-400/30 bg-emerald-400/10"
      : score >= 50
      ? "text-amber-300 border-amber-400/30 bg-amber-400/10"
      : "text-rose-300 border-rose-400/30 bg-rose-400/10";
  return (
    <span className={`chip ${color}`} title="Prompt clarity score">
      Score {score}/100
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-ink-fade">
      {text}
    </div>
  );
}
