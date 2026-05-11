"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
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
  TARGET_MODELS,
  rewriteWithClaude,
  type TargetModel,
} from "@/lib/rewriter";

const SAMPLE_PROMPT =
  "can you please help me with writing something about climate change it should be good and detailed but also short and simple thanks";

const STORAGE_KEY_API = "fixaiprompt.apikey";
const STORAGE_KEY_TARGET = "fixaiprompt.target";

export function PromptWorkspace() {
  const [prompt, setPrompt] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);
  const [target, setTarget] = useState<TargetModel>("claude");
  const [rewriting, setRewriting] = useState<boolean>(false);
  const [rewritten, setRewritten] = useState<string>("");
  const [rationale, setRationale] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<"none" | "original" | "rewritten">("none");

  useEffect(() => {
    try {
      const k = localStorage.getItem(STORAGE_KEY_API);
      if (k) setApiKey(k);
      const t = localStorage.getItem(STORAGE_KEY_TARGET) as TargetModel | null;
      if (t) setTarget(t);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (apiKey) localStorage.setItem(STORAGE_KEY_API, apiKey);
      else localStorage.removeItem(STORAGE_KEY_API);
    } catch {}
  }, [apiKey]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TARGET, target);
    } catch {}
  }, [target]);

  const report: LintReport = useMemo(() => lintPrompt(prompt), [prompt]);

  async function handleRewrite() {
    setError("");
    setRewriting(true);
    setRewritten("");
    setRationale("");
    try {
      const result = await rewriteWithClaude({
        apiKey,
        prompt,
        target,
        issues: report.issues,
      });
      setRewritten(result.rewritten);
      setRationale(result.rationale);
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
      {/* LEFT: input */}
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
          className="input-base min-h-[220px] font-mono text-sm leading-relaxed"
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
                setError("");
              }}
              disabled={!prompt && !rewritten}
              className="rounded-md border border-white/10 px-2 py-1 transition hover:bg-white/5 disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Lint findings */}
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
              Lint findings
            </h3>
            <ScorePill score={report.score} hasContent={report.stats.words > 0} />
          </div>
          {report.stats.words === 0 ? (
            <EmptyState text="Type or paste a prompt above to see lint findings." />
          ) : report.issues.length === 0 ? (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
              <CheckCircle2 className="mr-2 inline h-4 w-4 align-text-bottom" />
              Looks clean — no rule violations detected. You can still get a sharper rewrite below.
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

      {/* RIGHT: rewrite */}
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

          <button
            type="button"
            onClick={handleRewrite}
            disabled={!canRewrite}
            className="btn-primary w-full"
            data-testid="rewrite-btn"
          >
            {rewriting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Rewriting…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" /> Rewrite with Claude
              </>
            )}
          </button>

          {error && (
            <div className="rounded-lg border border-severity-error/30 bg-severity-error/10 p-3 text-sm text-severity-error">
              <AlertCircle className="mr-2 inline h-4 w-4 align-text-bottom" />
              {error}
            </div>
          )}

          {rewritten && (
            <div className="mt-2 space-y-3">
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

function ScorePill({ score, hasContent }: { score: number; hasContent: boolean }) {
  if (!hasContent) return null;
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
