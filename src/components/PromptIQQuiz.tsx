"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Linkedin,
  RotateCcw,
  Sparkles,
  Twitter,
  XCircle,
} from "lucide-react";
import { QUESTIONS, bandForScore } from "@/lib/promptIQ";
import { events, track } from "@/lib/analytics";

type AnswerMap = Record<string, number>; // questionId -> option index

export function PromptIQQuiz({ initialScore }: { initialScore?: number }) {
  const [step, setStep] = useState<number>(initialScore !== undefined ? QUESTIONS.length : 0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [copied, setCopied] = useState(false);

  const score = useMemo(() => {
    if (initialScore !== undefined && step >= QUESTIONS.length && Object.keys(answers).length === 0) {
      return initialScore;
    }
    if (step < QUESTIONS.length) return 0;
    let correct = 0;
    for (const q of QUESTIONS) {
      const idx = answers[q.id];
      if (idx !== undefined && q.options[idx]?.correct) correct += 1;
    }
    return Math.round((correct / QUESTIONS.length) * 100);
  }, [answers, step, initialScore]);

  const result = bandForScore(score);

  const completed = step >= QUESTIONS.length;
  const current = QUESTIONS[step];

  function pick(qId: string, optIdx: number) {
    setAnswers((cur) => ({ ...cur, [qId]: optIdx }));
  }

  function next() {
    const nextStep = step + 1;
    if (nextStep >= QUESTIONS.length) {
      // Final step — compute score and emit event
      let correct = 0;
      for (const q of QUESTIONS) {
        const idx = answers[q.id];
        if (idx !== undefined && q.options[idx]?.correct) correct += 1;
      }
      const finalScore = Math.round((correct / QUESTIONS.length) * 100);
      track("prompt_iq_completed", {
        score: finalScore,
        band: bandForScore(finalScore).band,
      });
    }
    setStep(nextStep);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    // Clear the ?score= param if any
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function shareUrl(): string {
    if (typeof window === "undefined") return "https://fixaiprompt.com/prompt-iq";
    const u = new URL(window.location.origin + "/prompt-iq");
    u.searchParams.set("score", String(score));
    return u.toString();
  }

  function shareText(): string {
    return `I just scored ${score}/100 on the Prompt IQ test — ${result.label}. Top ${result.topPercent}% of prompt engineers. Take it: ${shareUrl()}`;
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(shareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      events.shareCardAction({ action: "copy", delta: score });
    } catch {}
  }

  // ─── Result screen ─────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="card relative overflow-hidden p-6 text-center sm:p-10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/15 via-transparent to-cyan-400/15" />
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent-glow">
            Your Prompt IQ
          </div>
          <div className="text-6xl font-bold tabular-nums sm:text-7xl">
            <span
              className={
                score >= 90 ? "text-emerald-300" : score >= 70 ? "text-cyan-300" : score >= 40 ? "text-amber-300" : "text-rose-300"
              }
            >
              {score}
            </span>
            <span className="ml-2 text-3xl text-ink-fade sm:text-4xl">/100</span>
          </div>
          <div className="mt-4 text-xl font-semibold sm:text-2xl">
            {result.label}
          </div>
          <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-ink-dim sm:text-base">
            {result.blurb}
          </p>
          <div className="mt-2 text-xs text-ink-fade">
            Top {result.topPercent}% of prompt engineers
          </div>
        </div>

        {/* Share row */}
        <div className="card p-5 sm:p-6">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-glow">
            <Sparkles className="h-3.5 w-3.5" /> Share your score
          </div>
          <p className="text-sm text-ink-dim">
            Daring people to beat your score is the whole point.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => events.shareCardAction({ action: "x", delta: score })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-black/60"
            >
              <Twitter className="h-3.5 w-3.5" />
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl())}&summary=${encodeURIComponent(shareText())}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => events.shareCardAction({ action: "linkedin", delta: score })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0a66c2]/30 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-[#0a66c2]/50"
            >
              <Linkedin className="h-3.5 w-3.5" />
              Share on LinkedIn
            </a>
            <button
              type="button"
              onClick={copyResult}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-white/10"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy result text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Review answers + restart */}
        {Object.keys(answers).length > 0 && (
          <div className="card p-5 sm:p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-dim">
              Review your answers
            </div>
            <ol className="space-y-3">
              {QUESTIONS.map((q, i) => {
                const idx = answers[q.id];
                const picked = idx !== undefined ? q.options[idx] : null;
                return (
                  <li key={q.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm">
                    <div className="text-xs text-ink-fade">Question {i + 1} · {q.tests}</div>
                    <div className="mt-1 text-ink">{q.prompt}</div>
                    {picked && (
                      <div className="mt-2 flex items-start gap-2 text-xs">
                        {picked.correct ? (
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-400" />
                        ) : (
                          <XCircle className="mt-0.5 h-3.5 w-3.5 flex-none text-rose-400" />
                        )}
                        <div>
                          <div className="text-ink-dim">You picked: <span className="text-ink">&ldquo;{picked.label}&rdquo;</span></div>
                          {picked.explainer && (
                            <div className="mt-1 text-ink-fade">{picked.explainer}</div>
                          )}
                          {!picked.correct && (
                            <div className="mt-1 text-emerald-300">
                              Correct: &ldquo;{q.options.find((o) => o.correct)?.label}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              onClick={restart}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-dim transition hover:bg-white/10 hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retake the quiz
            </button>
          </div>
        )}

        {/* Where to go next */}
        <div className="card relative overflow-hidden p-5 sm:p-6">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
          <h3 className="text-lg font-bold">Want to score higher?</h3>
          <p className="mt-2 text-sm text-ink-dim">
            Every concept this quiz tests is explained in plain English in our glossary, and applied automatically in our auto-fixer.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/glossary" className="btn-primary">
              Open the glossary <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/fix" className="btn-ghost">
              Try the Prompt Fixer
            </Link>
            <Link href="/templates" className="btn-ghost">
              Browse 58 templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question screen ───────────────────────────────────────────────────
  const picked = answers[current.id];
  const pct = Math.round((step / QUESTIONS.length) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-medium text-ink-dim">
          Question {step + 1} / {QUESTIONS.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-cyan transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent-glow">
          <Sparkles className="h-3 w-3" />
          Tests: {current.tests}
        </div>
        <h2 className="text-xl font-bold sm:text-2xl">{current.prompt}</h2>
        {current.scenario && (
          <p className="mt-2 text-sm text-ink-dim">{current.scenario}</p>
        )}

        <ul className="mt-5 space-y-2">
          {current.options.map((opt, i) => {
            const isPicked = picked === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => pick(current.id, i)}
                  className={`group w-full rounded-xl border p-4 text-left transition ${
                    isPicked
                      ? "border-accent/50 bg-accent/10 ring-1 ring-accent/40"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-bold ${
                        isPicked
                          ? "bg-accent text-white"
                          : "bg-white/10 text-ink-dim"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`text-sm ${isPicked ? "text-ink" : "text-ink-dim"}`}>
                      {opt.label}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={next}
            disabled={picked === undefined}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="iq-next"
          >
            {step === QUESTIONS.length - 1 ? "See my score" : "Next question"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
