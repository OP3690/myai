import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  TEMPLATES,
  type TemplateCategory,
} from "@/lib/templates";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Prompt Templates — Tested before/after prompts for ChatGPT, Claude, Gemini",
  description:
    "A curated, growing library of prompt templates. Each one shows the lazy prompt, the better prompt, and exactly why it works. Free, no signup.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  const grouped = new Map<TemplateCategory, typeof TEMPLATES>();
  for (const t of TEMPLATES) {
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
            Templates · {TEMPLATES.length} curated · growing
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Prompt templates that{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              actually work
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Every template shows the lazy prompt, the upgraded version, and a
            short explanation of <em>why</em> the upgrade matters. Steal them,
            adapt them, and stop guessing.
          </p>
        </section>

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
                  <Link
                    key={t.slug}
                    href={`/templates/${t.slug}`}
                    className="card group flex flex-col p-5 transition hover:border-accent/30 hover:bg-bg-card"
                  >
                    <h3 className="text-base font-semibold text-ink group-hover:text-accent-glow">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm text-ink-dim">
                      {t.tagline}
                    </p>
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
