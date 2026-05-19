import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Zap } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  SITE_URL,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { TEMPLATES, type Template } from "@/lib/templates";

export type UseCaseLandingProps = {
  slug: string;
  audience: string;
  audienceFull: string;
  title: string;
  description: string;
  heroH1: React.ReactNode;
  heroBlurb: React.ReactNode;
  templateSlugs: string[];
  pains: { problem: string; solution: string; templateSlug?: string }[];
  faqs: { q: string; a: string }[];
};

export function UseCaseLandingPage(props: UseCaseLandingProps) {
  const templates = props.templateSlugs
    .map((s) => TEMPLATES.find((t) => t.slug === s))
    .filter((t): t is Template => !!t);
  const url = `${SITE_URL}/${props.slug}`;

  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: props.title, url },
          ]),
          softwareApplicationJsonLd({
            name: `AI Prompts for ${props.audience} — FixAIPrompt`,
            url,
            description: props.description,
          }),
          faqJsonLd(props.faqs),
        ]}
      />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Sparkles className="h-3 w-3 text-accent-glow" />
            For {props.audience} · Free · No signup
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            {props.heroH1}
          </h1>
          <div className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            {props.heroBlurb}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/fix" className="btn-primary">
              <Sparkles className="h-4 w-4" />
              Open the prompt fixer
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/templates" className="btn-ghost">
              <BookOpen className="h-4 w-4" />
              All 58 templates
            </Link>
          </div>
        </section>

        {/* Pain → solution table */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            Common {props.audience.toLowerCase()} prompting problems — solved
          </h2>
          <p className="mb-8 text-center text-ink-dim">
            Each row maps a real pain to the exact template that fixes it.
          </p>
          <div className="space-y-3">
            {props.pains.map((pain, i) => {
              const tmpl = pain.templateSlug
                ? TEMPLATES.find((t) => t.slug === pain.templateSlug)
                : null;
              return (
                <div
                  key={i}
                  className="card group flex flex-col gap-3 p-5 transition hover:border-accent/40 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                      Pain
                    </div>
                    <div className="mt-1 text-sm text-ink">{pain.problem}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Solution
                    </div>
                    <div className="mt-1 text-sm text-ink-dim">{pain.solution}</div>
                  </div>
                  {tmpl && (
                    <Link
                      href={`/templates/${tmpl.slug}`}
                      className="inline-flex flex-none items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-glow transition hover:bg-accent/20"
                    >
                      {tmpl.title.split(" — ")[0]}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured templates grid */}
        {templates.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
              Top prompt templates for {props.audience.toLowerCase()}
            </h2>
            <p className="mb-8 text-center text-ink-dim">
              Each template has interactive fill-in fields. Copy the result
              into ChatGPT, Claude, Gemini, or Grok.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
                >
                  {t.technique && (
                    <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                      <Zap className="h-3 w-3" />
                      {t.technique}
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-ink group-hover:text-accent-glow">
                    {t.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink-dim">{t.tagline}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-glow">
                    Open template
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-8">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            FAQ for {props.audienceFull}
          </h2>
          <div className="mt-8 space-y-4">
            {props.faqs.map((f, i) => (
              <details key={i} className="card group p-5">
                <summary className="cursor-pointer list-none text-sm font-medium text-ink sm:text-base">
                  <span className="mr-2 text-accent-glow">›</span>
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-ink-dim">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
