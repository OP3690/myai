"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const SCRIPT: { bad: string; good: string; before: number; after: number; topic: string }[] = [
  {
    bad: "help me learn coding",
    topic: "Learning ask",
    before: 75,
    after: 92,
    good: `Act as a senior engineer.

Task: Learn coding.

Format: a short structured response — 1) the answer, 2) the reasoning, 3) what to do next.
Length: under 250 words.
Audience: intermediate.`,
  },
  {
    bad: "write a blog post about ai",
    topic: "Writing task",
    before: 95,
    after: 99,
    good: `Act as a sharp writer who hooks the reader in the first line.

Task: Write a blog post about AI.

Format: 3–5 short paragraphs with a hook line and no fluff.
Length: under 250 words.
Audience: intermediate.

If anything is unclear, ask before guessing.`,
  },
  {
    bad: "fix this bug in my react app",
    topic: "Code task",
    before: 95,
    after: 99,
    good: `Act as a senior frontend engineer with strong opinions about accessibility.

Task: Fix this bug in my React app.

Format: code block with the full fix, then 2–3 lines of plain-English explanation, then edge cases.
Audience: engineering peers — assume comfort with React.

If anything is unclear, ask before guessing.`,
  },
  {
    bad: "should i quit my job for a saas",
    topic: "Decision",
    before: 90,
    after: 95,
    good: `Act as a trusted advisor who pushes back on lazy reasoning.

Task: Should I quit my job for a SaaS?

Format: recommendation (1 sentence), confidence rating, 3 key reasons, strongest counterargument, what would change your mind.

Don't flatter me.`,
  },
];

const TYPE_SPEED = 28; // ms per char on the bad prompt
const PAUSE_AFTER_BAD = 900;
const REVEAL_SPEED = 8; // ms per char on the good prompt
const PAUSE_AFTER_GOOD = 2400;

export function LiveDemo() {
  const [step, setStep] = useState(0); // index in SCRIPT
  const [phase, setPhase] = useState<"type-bad" | "show-score" | "reveal-good" | "hold">("type-bad");
  const [typedBad, setTypedBad] = useState("");
  const [typedGood, setTypedGood] = useState("");
  const [scoreDisplayed, setScoreDisplayed] = useState(0);
  const [paused, setPaused] = useState(false);

  const current = SCRIPT[step];

  // Type-bad phase
  useEffect(() => {
    if (paused || phase !== "type-bad") return;
    if (typedBad.length >= current.bad.length) {
      const t = setTimeout(() => setPhase("show-score"), PAUSE_AFTER_BAD);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTypedBad(current.bad.slice(0, typedBad.length + 1));
    }, TYPE_SPEED + Math.random() * 25);
    return () => clearTimeout(t);
  }, [phase, typedBad, current.bad, paused]);

  // Score animation
  useEffect(() => {
    if (paused || phase !== "show-score") return;
    setScoreDisplayed(current.before);
    let v = current.before;
    const id = setInterval(() => {
      v += v < current.after ? 1 : -1;
      setScoreDisplayed(v);
      if (v === current.after) {
        clearInterval(id);
        setTimeout(() => setPhase("reveal-good"), 400);
      }
    }, 35);
    return () => clearInterval(id);
  }, [phase, current.before, current.after, paused]);

  // Reveal good
  useEffect(() => {
    if (paused || phase !== "reveal-good") return;
    if (typedGood.length >= current.good.length) {
      const t = setTimeout(() => setPhase("hold"), PAUSE_AFTER_GOOD);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTypedGood(current.good.slice(0, typedGood.length + 4));
    }, REVEAL_SPEED);
    return () => clearTimeout(t);
  }, [phase, typedGood, current.good, paused]);

  // Hold → next loop
  useEffect(() => {
    if (paused || phase !== "hold") return;
    const t = setTimeout(() => {
      setStep((s) => (s + 1) % SCRIPT.length);
      setTypedBad("");
      setTypedGood("");
      setScoreDisplayed(0);
      setPhase("type-bad");
    }, 1500);
    return () => clearTimeout(t);
  }, [phase, paused]);

  const score = phase === "type-bad" ? 0 : scoreDisplayed;
  const showAfter = phase === "reveal-good" || phase === "hold";
  const delta = showAfter ? current.after - current.before : 0;

  return (
    <div
      className="mx-auto mt-10 max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="card relative overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-transparent to-accent-cyan/10" />
        <div className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden />

        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
            <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
            Live demo · {paused ? "paused" : "playing"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-fade">
            <span className="hidden sm:inline">{current.topic}</span>
            <span className="text-ink-fade">({step + 1}/{SCRIPT.length})</span>
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left: the user's bad prompt */}
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.04] p-4">
            <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
              Lazy prompt
            </div>
            <pre className="min-h-[52px] font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink-dim">
              {typedBad}
              {phase === "type-bad" && !paused && <span className="animate-pulse text-accent-glow">▍</span>}
            </pre>
          </div>

          {/* Right: corrected prompt */}
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
            <div className="mb-2 inline-flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Auto-corrected
              </span>
              <Link
                href="/fix"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-accent-glow transition hover:text-accent"
              >
                Try it <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <pre className="min-h-[180px] max-h-[260px] overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
              {typedGood}
              {phase === "reveal-good" && !paused && <span className="animate-pulse text-accent-glow">▍</span>}
              {!showAfter && (
                <span className="text-ink-fade">{phase === "show-score" ? "Rewriting…" : "Waiting for prompt…"}</span>
              )}
            </pre>
          </div>
        </div>

        {/* Score strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-amber-300" />
            <span className="text-ink-dim">Score</span>
            <span className="font-mono text-rose-300">{phase === "type-bad" ? "—" : current.before}</span>
            <span className="text-ink-fade">→</span>
            <span className="font-mono text-emerald-300">{showAfter ? current.after : phase === "show-score" ? score : "—"}</span>
            {delta > 0 && (
              <span className="ml-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-300">
                +{delta} pts
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-fade">
            <span className="hidden sm:inline">Hover to pause · auto-cycles through 4 examples</span>
          </div>
        </div>
      </div>
    </div>
  );
}
