import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GitCompareArrows,
  Layers,
  Scissors,
  Shield,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { TEMPLATES } from "@/lib/templates";
import { GLOSSARY } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "All tools — FixAIPrompt directory",
  description:
    "Every FixAIPrompt tool in one place. Prompt Fixer, Safe Paste, Chunker, CSV/JSON Cleaner, Prompt Diff, Templates, Glossary, CLI, and Browser Extension.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/fix",
    icon: Sparkles,
    title: "Prompt Fixer",
    blurb: "Multi-metric scoring + task-aware rewriting. Detects whether you're asking for code / analysis / writing / a decision — and adapts.",
    bullets: ["Clarity / Context / Structure / Specificity / Risk scoring", "Auto-detect 10 task types", "Render for Claude / GPT / Gemini"],
    accent: "from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10",
    cta: "Open Prompt Fixer",
  },
  {
    href: "/safe-paste",
    icon: Shield,
    title: "Safe Paste",
    blurb: "Scan any log, JSON, or config for 30+ types of API keys, JWTs, and PII before pasting into an AI chat.",
    bullets: ["AWS / OpenAI / Anthropic / GitHub / Stripe / Slack keys", "JWTs, bearer tokens, private key blocks", "DB connection strings, .env-style lines"],
    accent: "from-rose-500/20 via-orange-500/10 to-amber-500/10",
    cta: "Open Safe Paste",
  },
  {
    href: "/chunker",
    icon: Scissors,
    title: "Prompt Chunker",
    blurb: "Split long text into model-ready chunks. Or decompose a complex prompt into a chain of focused sub-prompts.",
    bullets: ["9 model presets (GPT-4o, Claude Opus 1M, Gemini 1.5)", "Token-aware natural break points", "Knowledge-chain or code-chain decomposition"],
    accent: "from-cyan-500/20 via-sky-500/10 to-emerald-500/10",
    cta: "Open Chunker",
  },
  {
    href: "/data-cleaner",
    icon: Wand2,
    title: "CSV / JSON Cleaner",
    blurb: "Column-aware PII redaction for analysts and support teams. Paste a dataset, get a cleaned version back.",
    bullets: ["Auto-classifies 11 PII column types", "JSON tree walk + value-level secret scan", "Download cleaned CSV / JSON"],
    accent: "from-emerald-500/20 via-teal-500/10 to-sky-500/10",
    cta: "Open Data Cleaner",
    isNew: true,
  },
  {
    href: "/prompt-diff",
    icon: GitCompareArrows,
    title: "Prompt Diff",
    blurb: "Paste two prompts side by side. See which scores higher across 5 metrics — with a winner card and the reasoning.",
    bullets: ["Per-metric pairwise comparison", "Task type detection per side", '"Why B wins" auto-explanation'],
    accent: "from-amber-500/20 via-yellow-500/10 to-orange-500/10",
    cta: "Open Prompt Diff",
  },
  {
    href: "/templates",
    icon: BookOpen,
    title: "Templates",
    blurb: `${TEMPLATES.length} curated before/after prompt templates including 25+ advanced prompt-engineering techniques (Chain-of-Thought, Tree-of-Thoughts, Self-Refine, ReAct, Constitutional AI, etc.).`,
    bullets: ["Interactive placeholder filler", "One-click sample values", "Live preview with click-to-focus pills"],
    accent: "from-violet-500/20 via-purple-500/10 to-rose-500/10",
    cta: "Browse Templates",
  },
  {
    href: "/glossary",
    icon: Layers,
    title: "Glossary",
    blurb: `${GLOSSARY.length} plain-English explanations of real prompt-engineering techniques used in production AI systems.`,
    bullets: ["When to use it / when not to", "Numbered how-it-works steps", "Pitfalls + paper origins + related techniques"],
    accent: "from-sky-500/20 via-cyan-500/10 to-violet-500/10",
    cta: "Open Glossary",
  },
];

const SURFACES = [
  {
    title: "Web",
    blurb: "All tools live in your browser. Nothing is uploaded. No accounts.",
    extra: "100% client-side",
  },
  {
    title: "CLI",
    blurb: "Lint and rewrite any prompt from your terminal. Same engine. Same scoring.",
    extra: "npx fixaiprompt",
  },
  {
    title: "Browser Extension",
    blurb: "Watches paste events on ChatGPT / Claude / Gemini / Copilot / Grok and warns before secrets leak.",
    extra: "Chrome / Edge (MV3)",
  },
  {
    title: "Bookmarklet",
    blurb: "Drag-to-bookmark button. Click anywhere to scan your clipboard in Safe Paste.",
    extra: "Zero install",
  },
];

export default function ToolsPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Zap className="h-3 w-3 text-accent-glow" />
            {TOOLS.length} tools · 4 distribution surfaces · 100% client-side
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Every tool, in{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              one place
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            FixAIPrompt is a privacy-first toolkit for talking to AI. Lint
            prompts, redact secrets, chunk huge inputs, decompose tasks, compare
            prompts, and pick from a library of advanced techniques.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="card group relative flex flex-col overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-accent/30"
              >
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-50 transition group-hover:opacity-100 ${t.accent}`} />
                {t.isNew && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-300">
                    <Zap className="h-2.5 w-2.5" /> New
                  </span>
                )}
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                  <t.icon className="h-5 w-5 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-ink group-hover:text-accent-glow">{t.title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{t.blurb}</p>
                <ul className="mt-3 space-y-1 text-xs text-ink-dim">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-accent-glow" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-glow">
                  {t.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="mb-6 text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">Available everywhere</h2>
            <p className="mt-2 text-ink-dim">Same engine. Web, terminal, browser. Pick your surface.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map((s) => (
              <div key={s.title} className="card p-5">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent-glow">{s.title}</div>
                <div className="text-sm text-ink-dim">{s.blurb}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-ink">
                  {s.extra}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
