"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, CheckCircle2, Sparkles } from "lucide-react";

type Model = "claude" | "gpt" | "gemini";

const ORIGINAL = "explain how vector databases work to a backend engineer who knows postgres";

const RENDERED: Record<Model, { label: string; tagline: string; tone: string; body: string }> = {
  claude: {
    label: "Claude",
    tagline: "XML-tagged sections — Anthropic-style",
    tone: "from-amber-400/20 via-orange-400/10 to-rose-400/10",
    body: `<role>an experienced backend engineer who explains complex topics through Postgres analogies</role>

<task>
Explain how vector databases work to a backend engineer who knows Postgres.
</task>

<output_format>
Open with one Postgres analogy that bridges the gap, then 3 short paragraphs (one new mechanism each), end with a follow-up question.
</output_format>

<constraints>
- Length: under 250 words
- Audience: engineering peer — assume comfort with relational DBs
</constraints>

<safeguard>
If anything is unclear, ask before guessing. If you don't know something, say "I don't know" rather than making it up.
</safeguard>`,
  },
  gpt: {
    label: "ChatGPT",
    tagline: "Markdown headings + system-style role",
    tone: "from-emerald-400/20 via-teal-400/10 to-cyan-400/10",
    body: `**Role**: You are an experienced backend engineer who explains complex topics through Postgres analogies.

## Task
Explain how vector databases work to a backend engineer who knows Postgres.

## Output format
Open with one Postgres analogy that bridges the gap, then 3 short paragraphs (one new mechanism each), end with a follow-up question.

## Constraints
- Length: under 250 words
- Audience: engineering peer — assume comfort with relational DBs

---
If anything is unclear, ask before guessing.`,
  },
  gemini: {
    label: "Gemini",
    tagline: "Tight bulleted instructions",
    tone: "from-sky-400/20 via-violet-400/10 to-rose-400/10",
    body: `Role: an experienced backend engineer who explains complex topics through Postgres analogies.
Task: Explain how vector databases work to a backend engineer who knows Postgres.
Output: open with one Postgres analogy, 3 short paragraphs (one mechanism each), end with a follow-up question.
Length: under 250 words.
Audience: engineering peer — assume comfort with relational DBs.

If unclear, ask.`,
  },
};

export function BattleOfTheLLMs() {
  const [model, setModel] = useState<Model>("claude");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(RENDERED[model].body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const current = RENDERED[model];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
          <Sparkles className="h-3 w-3 text-accent-glow" /> Same prompt · 3 models
        </div>
        <h2 className="text-balance text-2xl font-bold sm:text-3xl">
          One prompt, rendered for{" "}
          <span className="bg-gradient-to-r from-amber-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            the model that fits
          </span>
          .
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-ink-dim">
          The Prompt Fixer detects your task, then renders the result in
          the syntax each model handles best — XML tags for Claude,
          markdown headings for ChatGPT, tight bullets for Gemini.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Original */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-300">
            Lazy original
          </div>
          <div className="space-y-3 p-4">
            <pre className="rounded-lg border border-white/5 bg-white/[0.02] p-3 font-mono text-sm leading-relaxed text-ink-dim">
              {ORIGINAL}
            </pre>
            <ul className="space-y-1 text-xs text-rose-200">
              <li>• No role</li>
              <li>• No output format</li>
              <li>• No length constraint</li>
              <li>• No anti-hallucination safeguard</li>
            </ul>
          </div>
        </div>

        {/* Rendered */}
        <div className="card overflow-hidden lg:col-span-3">
          <div className={`relative border-b border-white/5 px-4 py-2`}>
            <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${current.tone}`} />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                Rendered for {current.label}
              </span>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink-dim transition hover:bg-white/10 hover:text-ink"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-0.5 text-xs text-ink-dim">{current.tagline}</p>
          </div>
          {/* Model tabs */}
          <div className="flex border-b border-white/5 bg-bg-soft/40 text-xs">
            {(["claude", "gpt", "gemini"] as Model[]).map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`flex-1 border-r border-white/5 px-3 py-2 transition last:border-r-0 ${
                  model === m
                    ? "bg-accent/15 text-accent-glow"
                    : "text-ink-dim hover:bg-white/5 hover:text-ink"
                }`}
              >
                {RENDERED[m].label}
              </button>
            ))}
          </div>
          <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {current.body}
          </pre>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/fix" className="btn-primary">
          <Sparkles className="h-4 w-4" />
          Try with your own prompt
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/glossary/persona-prompting" className="btn-ghost">
          Why role-prompting works
        </Link>
      </div>
    </section>
  );
}
