"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { lintPrompt } from "@/lib/linter";
import { MetricBreakdown } from "./MetricBreakdown";

const PLACEHOLDER =
  "Paste your prompt — e.g. \"help me learn coding\" or \"write a blog post about AI\"";

const SAMPLES: { label: string; text: string }[] = [
  { label: "Vague learning ask", text: "help me learn coding" },
  { label: "Generic email ask", text: "write a reply to this email" },
  { label: "Lazy debug", text: "fix this bug" },
  { label: "Polite mess", text: "can you please help me with writing something about climate change it should be detailed but also short thanks" },
];

export function HomePromptHero() {
  const [prompt, setPrompt] = useState<string>("");
  const report = useMemo(() => lintPrompt(prompt), [prompt]);
  const hasContent = report.stats.words > 0;

  const ctaHref =
    "/fix" + (prompt.trim() ? `?prompt=${encodeURIComponent(prompt.trim())}` : "");

  return (
    <div className="mx-auto mt-10 max-w-3xl">
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

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-xs text-ink-fade">
              {hasContent ? (
                <>
                  {report.stats.words} words ·{" "}
                  <span className={report.score >= 80 ? "text-emerald-300" : report.score >= 50 ? "text-amber-300" : "text-rose-300"}>
                    Score {report.score}/100
                  </span>{" "}
                  · {report.issues.length} issue{report.issues.length === 1 ? "" : "s"}
                </>
              ) : (
                <>Type or paste a prompt above — instant local score, no upload.</>
              )}
            </span>
          </div>
          <Link
            href={ctaHref}
            className="btn-primary"
            data-testid="home-improve-cta"
          >
            <Wand2 className="h-4 w-4" />
            {hasContent ? "Improve with AI" : "Open Prompt Fixer"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {hasContent && (
          <div className="mt-4">
            <MetricBreakdown metrics={report.metrics} />
          </div>
        )}
      </div>
    </div>
  );
}
