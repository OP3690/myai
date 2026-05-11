"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { improvePrompt } from "@/lib/autoFix";
import { lintPrompt } from "@/lib/linter";
import { MetricBreakdown } from "./MetricBreakdown";
import { PromptImprovement } from "./PromptImprovement";
import { SharePromptFix } from "./SharePromptFix";
import { SnarkyReview } from "./SnarkyReview";

const PLACEHOLDER =
  "Paste your prompt — e.g. \"help me learn coding\" or \"write a blog post about AI\"";

const SAMPLES: { label: string; text: string }[] = [
  { label: "Vague learning ask", text: "help me learn coding" },
  { label: "Generic email ask", text: "write a reply to this email" },
  { label: "Lazy debug", text: "fix this bug" },
  {
    label: "Polite mess",
    text:
      "can you please help me with writing something about climate change it should be detailed but also short thanks",
  },
];

export function HomePromptHero() {
  const [prompt, setPrompt] = useState<string>("");
  const report = useMemo(() => lintPrompt(prompt), [prompt]);
  const improved = useMemo(() => (prompt.trim() ? improvePrompt(prompt) : null), [prompt]);
  const hasContent = report.stats.words > 0;

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-6">
      <div className="card relative overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-transparent to-accent-cyan/10" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-dim">
            <Sparkles className="h-4 w-4 text-accent-glow" />
            Fix my prompt
          </h2>
          <div className="hidden flex-wrap gap-1 sm:flex">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => setPrompt(s.text)}
                className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-dim transition hover:bg-white/5 hover:text-ink"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={PLACEHOLDER}
          className="input-base min-h-[110px] font-mono text-sm leading-relaxed"
          spellCheck={false}
          data-testid="home-prompt-input"
        />

        <div className="mt-3 flex flex-wrap items-baseline gap-3 text-xs text-ink-fade">
          {hasContent ? (
            <>
              <span>{report.stats.words} words</span>
              <span>·</span>
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
              <span>·</span>
              <span>
                {report.issues.length} issue
                {report.issues.length === 1 ? "" : "s"}
              </span>
            </>
          ) : (
            <span>
              Type or paste a prompt above — corrected version and insights appear instantly. Nothing leaves your browser.
            </span>
          )}
        </div>

        {hasContent && (
          <div className="mt-4 space-y-3">
            <MetricBreakdown metrics={report.metrics} />
            <SnarkyReview report={report} />
          </div>
        )}
      </div>

      {hasContent && <PromptImprovement prompt={prompt} />}

      {hasContent && improved && (
        <SharePromptFix
          scoreBefore={improved.scoreBefore}
          scoreAfter={improved.scoreAfter}
          taskType={improved.taskType}
        />
      )}
    </div>
  );
}
