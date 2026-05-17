"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  improvePrompt,
  renderForModel,
  TASK_TYPE_BLURB,
  TASK_TYPE_EMOJI,
  TASK_TYPE_LABEL,
  type Insight,
  type TargetModel,
} from "@/lib/autoFix";
import { METRIC_LABEL, type Metric } from "@/lib/linter";
import { events } from "@/lib/analytics";

const MODEL_TABS: { value: TargetModel; label: string; hint: string }[] = [
  { value: "claude", label: "Claude", hint: "XML-tagged sections, anthropic-style" },
  { value: "gpt", label: "ChatGPT", hint: "Markdown headings, system-style role" },
  { value: "gemini", label: "Gemini", hint: "Tight bulleted instructions" },
  { value: "plain", label: "Plain", hint: "Works for any chat LLM" },
];

const STORAGE_KEY_MODEL = "fixaiprompt.outputModel";

export function PromptImprovement({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const [model, setModel] = useState<TargetModel>(() => {
    if (typeof window === "undefined") return "claude";
    return (localStorage.getItem(STORAGE_KEY_MODEL) as TargetModel) || "claude";
  });
  const [showExample, setShowExample] = useState(true);

  const result = useMemo(() => improvePrompt(prompt), [prompt]);
  const improved = useMemo(
    () => renderForModel(result, model),
    [result, model]
  );

  if (!prompt.trim()) return null;
  if (!result.changed && result.insights.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
        <CheckCircle2 className="mr-2 inline h-4 w-4 align-text-bottom" />
        Your prompt already has the structure we&apos;d add. Nothing to improve.
      </div>
    );
  }

  function pickModel(m: TargetModel) {
    setModel(m);
    try { localStorage.setItem(STORAGE_KEY_MODEL, m); } catch {}
    events.promptModelChanged({ surface: "home", model: m });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      events.promptCopied({ surface: "home", model });
    } catch {}
  }

  return (
    <div className="space-y-4">
      <ScoreJumpAndTaskCard
        scoreBefore={result.scoreBefore}
        scoreAfter={result.scoreAfter}
        taskType={result.taskType}
        topic={result.topic}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-3">
          <div className="border-b border-accent/20 bg-accent/10">
            <div className="flex items-center justify-between px-4 py-2">
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
                    <Copy className="h-3.5 w-3.5" /> Copy for {modelShort(model)}
                  </>
                )}
              </button>
            </div>
            <ModelTabs value={model} onChange={pickModel} />
          </div>
          <pre className="max-h-[480px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {improved}
          </pre>
          {result.sections.example && (
            <div className="border-t border-white/5 bg-white/[0.02] px-4 py-2 text-xs text-ink-fade">
              <button
                type="button"
                onClick={() => setShowExample((v) => !v)}
                className="inline-flex items-center gap-1 transition hover:text-ink"
              >
                {showExample ? "Hide" : "Show"} generated example shape
              </button>
            </div>
          )}
        </div>

        <div className="card p-4 sm:p-5 lg:col-span-2">
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
    </div>
  );
}

function modelShort(m: TargetModel): string {
  switch (m) {
    case "claude": return "Claude";
    case "gpt": return "ChatGPT";
    case "gemini": return "Gemini";
    default: return "any LLM";
  }
}

function ModelTabs({ value, onChange }: { value: TargetModel; onChange: (m: TargetModel) => void }) {
  return (
    <div className="flex border-t border-white/5 bg-bg-soft/40 text-xs">
      {MODEL_TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`flex-1 border-r border-white/5 px-3 py-2 transition last:border-r-0 ${
              active
                ? "bg-accent/15 text-accent-glow"
                : "text-ink-dim hover:bg-white/5 hover:text-ink"
            }`}
            title={tab.hint}
            data-testid={`model-tab-${tab.value}`}
          >
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ScoreJumpAndTaskCard({
  scoreBefore,
  scoreAfter,
  taskType,
  topic,
}: {
  scoreBefore: number;
  scoreAfter: number;
  taskType: ReturnType<typeof improvePrompt>["taskType"];
  topic: string;
}) {
  const delta = scoreAfter - scoreBefore;
  const pct = scoreBefore > 0 ? Math.round((delta / Math.max(scoreBefore, 1)) * 100) : null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="card relative overflow-hidden p-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-400/15 via-transparent to-accent/10" />
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-dim">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
            Predicted score jump
          </span>
          {delta > 0 && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              +{delta} pts{pct !== null && Number.isFinite(pct) ? ` · +${pct}%` : ""}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-3 text-2xl font-bold">
          <span className={scoreBefore < 50 ? "text-rose-300" : scoreBefore < 80 ? "text-amber-300" : "text-emerald-300"}>
            {scoreBefore}
          </span>
          <span className="text-ink-fade">→</span>
          <span className={scoreAfter < 50 ? "text-rose-300" : scoreAfter < 80 ? "text-amber-300" : "text-emerald-300"}>
            {scoreAfter}
          </span>
          <span className="ml-1 text-sm text-ink-fade">/100</span>
        </div>
        <p className="mt-1 text-xs text-ink-fade">
          Same linter, applied to the rewritten prompt. Higher is better.
        </p>
      </div>

      <div className="card relative overflow-hidden p-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/15 via-transparent to-accent-cyan/10" />
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-dim">
          Detected task
        </span>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl">{TASK_TYPE_EMOJI[taskType]}</span>
          <span className="text-lg font-semibold text-ink">{TASK_TYPE_LABEL[taskType]}</span>
        </div>
        <p className="mt-1 text-xs text-ink-fade">{TASK_TYPE_BLURB[taskType]}</p>
        {topic && (
          <p className="mt-2 truncate text-xs text-accent-glow" title={topic}>
            Topic: {topic}
          </p>
        )}
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
