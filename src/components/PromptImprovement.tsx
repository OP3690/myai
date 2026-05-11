"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Minus, Pencil, Plus, Sparkles } from "lucide-react";
import { improvePromptLocal, type Insight } from "@/lib/autoFix";
import { METRIC_LABEL, type Metric } from "@/lib/linter";

export function PromptImprovement({
  prompt,
  compact = false,
}: {
  prompt: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => improvePromptLocal(prompt), [prompt]);

  if (!prompt.trim()) return null;
  if (!result.changed && result.insights.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
        <CheckCircle2 className="mr-2 inline h-4 w-4 align-text-bottom" />
        Your prompt already has the structure we&apos;d add. Nothing to improve.
      </div>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-5"}`}>
      <div className={`card overflow-hidden ${compact ? "" : "lg:col-span-3"}`}>
        <div className="flex items-center justify-between border-b border-accent/20 bg-accent/10 px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-glow">
            <Sparkles className="h-3.5 w-3.5" />
            Corrected prompt
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
            data-testid="copy-improved"
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
        </div>
        <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {result.improved}
        </pre>
      </div>

      <div className={`card p-4 sm:p-5 ${compact ? "" : "lg:col-span-2"}`}>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
            Insights
          </h3>
          <span className="text-xs text-ink-fade">
            {result.insights.length} change
            {result.insights.length === 1 ? "" : "s"}
          </span>
        </div>
        <ul className="space-y-2.5">
          {result.insights.map((insight, i) => (
            <InsightRow key={i} insight={insight} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function InsightRow({ insight }: { insight: Insight }) {
  const tone =
    insight.kind === "added"
      ? "border-emerald-400/20 bg-emerald-400/5"
      : insight.kind === "removed"
      ? "border-rose-400/20 bg-rose-400/5"
      : "border-amber-400/20 bg-amber-400/5";
  const Icon =
    insight.kind === "added" ? Plus : insight.kind === "removed" ? Minus : Pencil;
  const iconColor =
    insight.kind === "added"
      ? "text-emerald-300"
      : insight.kind === "removed"
      ? "text-rose-300"
      : "text-amber-300";
  const verb =
    insight.kind === "added" ? "Added" : insight.kind === "removed" ? "Removed" : "Rewrote";

  return (
    <li className={`rounded-lg border p-2.5 text-sm ${tone}`}>
      <div className="flex items-start gap-2">
        <Icon className={`mt-0.5 h-3.5 w-3.5 flex-none ${iconColor}`} />
        <div className="min-w-0 flex-1">
          <div className="text-xs text-ink">
            <span className={`font-semibold ${iconColor}`}>{verb}:</span>{" "}
            <span className="text-ink">{insight.text}</span>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-ink-dim">
            {insight.reason}
          </div>
          {insight.improves.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {insight.improves.map((m) => (
                <MetricTag key={m} metric={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function MetricTag({ metric }: { metric: Metric }) {
  return (
    <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-glow">
      ↑ {METRIC_LABEL[metric]}
    </span>
  );
}
