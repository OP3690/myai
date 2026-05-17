import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  softwareApplicationJsonLd,
  SITE_URL,
} from "@/lib/seo";
import { TEMPLATES } from "@/lib/templates";

export type ModelLandingProps = {
  /** Lowercase slug used in URL paths, e.g. "chatgpt-prompts". */
  slug: string;
  /** Display name for the model, e.g. "ChatGPT". */
  model: string;
  /** Full vendor name, e.g. "OpenAI's ChatGPT". */
  modelFull: string;
  /** SEO-optimised page title. */
  title: string;
  /** SEO-optimised page meta description. */
  description: string;
  /** Big H1 the page renders. */
  heroH1: React.ReactNode;
  /** Intro paragraph below the H1. */
  heroBlurb: React.ReactNode;
  /** Color tone for the hero gradient — Tailwind class. */
  accent?: string;
  /** Optional list of slugs to feature as platform-specific top prompts. */
  featuredTemplateSlugs?: string[];
  /** Per-model FAQ pairs. */
  faqs: { q: string; a: string }[];
  /** Per-model quick tips ("How to write a great X prompt"). */
  tips: { title: string; body: string }[];
};

export function ModelLandingPage(props: ModelLandingProps) {
  const featured = (props.featuredTemplateSlugs || [])
    .map((slug) => TEMPLATES.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => !!t);
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
            name: `${props.model} Prompt Generator — FixAIPrompt`,
            url,
            description: props.description,
          }),
          faqJsonLd(props.faqs),
        ]}
      />
      <main className={`relative min-h-screen bg-hero-radial ${props.accent || ""}`}>
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Sparkles className="h-3 w-3 text-accent-glow" />
            Free · No signup · 100% browser-only
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
              Open the prompt generator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/templates" className="btn-ghost">
              <BookOpen className="h-4 w-4" />
              Browse 58 templates
            </Link>
          </div>
        </section>

        {/* Featured templates */}
        {featured.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
              Top {props.model} prompts to steal today
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="card group relative flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-accent/40 ring-1 ring-violet-400/20"
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
                    Try this {props.model} prompt
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            How to write a great {props.model} prompt
          </h2>
          <p className="mb-8 text-center text-ink-dim">
            The same patterns the FixAIPrompt linter checks for, condensed
            into actionable tips.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {props.tips.map((tip, i) => (
              <div key={i} className="card p-5">
                <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-sm font-semibold text-accent-glow ring-1 ring-accent/30">
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold">{tip.title}</h3>
                <p className="mt-2 text-sm text-ink-dim">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why FixAIPrompt for this model */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="card relative overflow-hidden p-6 sm:p-10">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-transparent to-accent/10" />
            <h2 className="text-2xl font-bold sm:text-3xl">
              Why use FixAIPrompt with {props.modelFull}?
            </h2>
            <ul className="mt-5 grid gap-3 text-sm text-ink-dim sm:grid-cols-2">
              <Check>Free, browser-only, no API key needed</Check>
              <Check>Auto-rewrites for {props.model}&apos;s preferred syntax</Check>
              <Check>5-metric score (clarity / context / structure / specificity / risk)</Check>
              <Check>58 prompt templates with interactive fill-in fields</Check>
              <Check>Detects 30+ secrets/PII before you paste into {props.model}</Check>
              <Check>Chunks long text to fit {props.model}&apos;s context window</Check>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/fix" className="btn-primary">
                Try the {props.model} prompt fixer
              </Link>
              <Link href="/safe-paste" className="btn-ghost">
                Scan secrets before pasting
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-8">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            {props.model} prompt FAQ
          </h2>
          <p className="mb-8 text-center text-ink-dim">
            Answers to the most-asked questions about {props.modelFull} prompting.
          </p>
          <div className="space-y-4">
            {props.faqs.map((faq, i) => (
              <details key={i} className="card group p-5">
                <summary className="cursor-pointer list-none text-sm font-medium text-ink sm:text-base">
                  <span className="mr-2 text-accent-glow">›</span>
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm text-ink-dim">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
      <span>{children}</span>
    </li>
  );
}
