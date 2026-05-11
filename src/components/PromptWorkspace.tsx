"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Info,
} from "lucide-react";
import {
  lintPrompt,
  severityColor,
  severityLabel,
  type LintIssue,
  type LintReport,
} from "@/lib/linter";
import { MetricBreakdown } from "./MetricBreakdown";
import { PromptImprovement } from "./PromptImprovement";

const SAMPLE_PROMPT =
  "can you please help me with writing something about climate change it should be good and detailed but also short and simple thanks";

export function PromptWorkspace({ initialPrompt }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState<string>(initialPrompt ?? "");
  const [copied, setCopied] = useState<boolean>(false);
  const [findingsOpen, setFindingsOpen] = useState<boolean>(false);

  const report: LintReport = useMemo(() => lintPrompt(prompt), [prompt]);
  const hasContent = report.stats.words > 0;

  async function copyOriginal() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Input + metrics */}
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
          placeholder="Paste any prompt. We'll lint it, score it on 5 dimensions, and rewrite it locally — no API key needed."
          className="input-base min-h-[180px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="prompt-input"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-fade">
          <span>
            {report.stats.words} word{report.stats.words === 1 ? "" : "s"} ·{" "}
            {report.stats.chars} char{report.stats.chars === 1 ? "" : "s"} ·{" "}
            {report.stats.sentences} sentence
            {report.stats.sentences === 1 ? "" : "s"}
            {hasContent && (
              <>
                {" "}·{" "}
                <span
                  className={
                    report.score >= 80
                      ? "text-emerald-300"
                      : report.score >= 50
                      ? "text-amber-300"
                      : "text-rose-300"
                  }
                >
                  Score {report.score}/100
                </span>
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyOriginal}
              disabled={!prompt}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 transition hover:bg-white/5 disabled:opacity-40"
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
            <button
              type="button"
              onClick={() => setPrompt("")}
              disabled={!prompt}
              className="rounded-md border border-white/10 px-2 py-1 transition hover:bg-white/5 disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        {hasContent && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-dim">
              Score breakdown
            </div>
            <MetricBreakdown metrics={report.metrics} />
          </div>
        )}
      </div>

      {/* Improved prompt + insights */}
      {hasContent && <PromptImprovement prompt={prompt} />}

      {/* Lint findings (collapsible) */}
      {hasContent && report.issues.length > 0 && (
        <div className="card overflow-hidden">
          <button
            type="button"
            onClick={() => setFindingsOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6"
            data-testid="findings-toggle"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-ink-dim">
              Lint findings ({report.issues.length})
            </span>
            <span className="text-xs text-accent-glow">
              {findingsOpen ? "Hide" : "Show"} detail
            </span>
          </button>
          {findingsOpen && (
            <ul className="space-y-2.5 px-5 pb-5 sm:px-6 sm:pb-6">
              {report.issues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </ul>
          )}
        </div>
      )}
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
