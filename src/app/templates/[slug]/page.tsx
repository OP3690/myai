import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { CATEGORY_EMOJI, CATEGORY_LABEL, TEMPLATES, getTemplate } from "@/lib/templates";
import { TemplateActions } from "@/components/TemplateActions";
import { ArrowLeft, Flame, Lightbulb, Zap } from "lucide-react";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = getTemplate(params.slug);
  if (!t) return { title: "Template not found" };
  return {
    title: `${t.title} — Better AI prompt template`,
    description: t.tagline,
    alternates: { canonical: `/templates/${t.slug}` },
  };
}

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const t = getTemplate(params.slug);
  if (!t) notFound();

  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-8 sm:pt-12">
          <Link
            href="/templates"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-dim transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> All templates
          </Link>

          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-fade">
            <span>
              {CATEGORY_EMOJI[t.category]} {CATEGORY_LABEL[t.category]}
            </span>
            <span>·</span>
            <span>Works on: {t.platforms.join(", ")}</span>
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          {t.technique && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <Zap className="h-3 w-3" />
              Technique: {t.technique}
            </div>
          )}
          <p className="mt-3 max-w-2xl text-base text-ink-dim">{t.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
            {t.advanced && (
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/15 px-2 py-0.5 font-bold uppercase tracking-wider text-violet-300">
                <Zap className="h-3 w-3" /> Advanced
              </span>
            )}
            {t.viral && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 font-bold uppercase tracking-wider text-rose-300">
                <Flame className="h-3 w-3" /> Viral
              </span>
            )}
            {t.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-ink-dim">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="card overflow-hidden">
              <div className="border-b border-white/5 bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-fade">
                Before — the lazy prompt
              </div>
              <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink-dim">
                {t.beforePrompt}
              </pre>
            </div>
            <div className="card overflow-hidden ring-1 ring-accent/30">
              <div className="border-b border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-glow">
                After — better prompt
              </div>
              <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
                {t.betterPrompt}
              </pre>
            </div>
          </div>

          <TemplateActions prompt={t.betterPrompt} />

          <div className="card mt-8 p-5 sm:p-6">
            <h2 className="inline-flex items-center gap-2 text-base font-semibold">
              <Lightbulb className="h-5 w-5 text-accent-glow" />
              Why it works
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-dim">
              {t.whyItWorks.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 rounded-2xl border border-white/5 bg-bg-card p-5 sm:p-6">
            <h3 className="text-base font-semibold">Make this one yours</h3>
            <p className="mt-2 text-sm text-ink-dim">
              Replace the bracketed placeholders, then paste into the Prompt
              Fixer to lint your customisation before hitting send.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/fix" className="btn-primary">
                Open Prompt Fixer
              </Link>
              <Link href="/templates" className="btn-ghost">
                Browse more templates
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
