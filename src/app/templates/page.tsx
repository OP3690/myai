import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  TEMPLATES,
  type Template,
  type TemplateCategory,
} from "@/lib/templates";
import { ArrowRight, BookOpen, Flame, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Prompt Templates — Advanced techniques + before/after for ChatGPT, Claude, Gemini",
  description:
    "Curated prompt-engineering templates including advanced techniques (Chain-of-Thought, Tree-of-Thoughts, Self-Refine, Multi-Persona, Pre-Mortem). Each shows the lazy prompt, the better prompt, and why it works.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  const advanced = TEMPLATES.filter((t) => t.category === "techniques");
  const others = TEMPLATES.filter((t) => t.category !== "techniques");
  const viral = TEMPLATES.filter((t) => t.viral && t.category !== "techniques");

  const grouped = new Map<TemplateCategory, Template[]>();
  for (const t of others) {
    const arr = grouped.get(t.category) || [];
    arr.push(t);
    grouped.set(t.category, arr);
  }
  const cats = Array.from(grouped.keys());

  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <BookOpen className="h-3 w-3 text-accent-glow" />
            Templates · {TEMPLATES.length} curated · {advanced.length} advanced techniques
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Prompt templates with{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              real prompt engineering
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Not a prompt list. A library of <strong className="text-ink">advanced patterns</strong> — Chain-of-Thought, Tree-of-Thoughts, Self-Refine, Multi-Persona Debate, Adversarial Red-Team, Pre-Mortem, Bias Audit, Algorithm Whisperer — plus everyday templates with before/after.
          </p>
        </section>

        {/* Advanced Techniques — featured */}
        {advanced.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
            <div className="card relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/15 via-rose-500/5 to-amber-500/10" />
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="inline-flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
                    <Zap className="h-5 w-5 text-amber-300" />
                    Advanced Techniques
                  </h2>
                  <p className="mt-1 text-sm text-ink-dim">
                    Cutting-edge prompt patterns used in real agentic systems. Each one explains the technique it&apos;s based on.
                  </p>
                </div>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                  {advanced.length} patterns
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {advanced.map((t) => (
                  <TemplateCard key={t.slug} t={t} variant="advanced" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Viral picks */}
        {viral.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
            <div className="card relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/15 via-orange-500/5 to-amber-500/10" />
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="inline-flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
                    <Flame className="h-5 w-5 text-rose-300" />
                    Viral picks
                  </h2>
                  <p className="mt-1 text-sm text-ink-dim">
                    Shareable, screenshot-able outputs people post about.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {viral.map((t) => (
                  <TemplateCard key={t.slug} t={t} variant="viral" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All the rest, grouped */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {cats.map((cat) => (
            <div key={cat} className="mb-12">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-2xl">{CATEGORY_EMOJI[cat]}</span>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {CATEGORY_LABEL[cat]}
                </h2>
                <span className="text-sm text-ink-fade">
                  {grouped.get(cat)!.length} template
                  {grouped.get(cat)!.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {grouped.get(cat)!.map((t) => (
                  <TemplateCard key={t.slug} t={t} />
                ))}
              </div>
            </div>
          ))}

          <div className="card mt-6 flex flex-col items-center gap-3 p-8 text-center">
            <Sparkles className="h-8 w-8 text-accent-glow" />
            <h3 className="text-lg font-semibold">Want to upgrade your own?</h3>
            <p className="max-w-md text-sm text-ink-dim">
              Paste your prompt into the Prompt Fixer — get instant lint
              feedback and an AI-powered rewrite tailored to your target model.
            </p>
            <Link href="/fix" className="btn-primary">
              Open Prompt Fixer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function TemplateCard({
  t,
  variant,
}: {
  t: Template;
  variant?: "advanced" | "viral";
}) {
  return (
    <Link
      href={`/templates/${t.slug}`}
      className={`card group relative flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-accent/30 hover:bg-bg-card ${
        variant === "advanced" ? "ring-1 ring-violet-400/20" : ""
      } ${variant === "viral" ? "ring-1 ring-rose-400/20" : ""}`}
    >
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-ink group-hover:text-accent-glow">
          {t.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {t.advanced && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
              <Zap className="h-2.5 w-2.5" /> Advanced
            </span>
          )}
          {t.viral && (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
              <Flame className="h-2.5 w-2.5" /> Viral
            </span>
          )}
        </div>
      </div>
      {t.technique && (
        <div className="mb-2 text-xs font-medium text-accent-glow">
          {t.technique}
        </div>
      )}
      <p className="flex-1 text-sm text-ink-dim">{t.tagline}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-ink-fade">
        <span className="flex flex-wrap gap-1.5">
          {t.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-accent-glow" />
      </div>
    </Link>
  );
}
