import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { GLOSSARY, getGlossary } from "@/lib/glossary";
import { FavoriteButton } from "@/components/FavoriteButton";
import { TrackEvent } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, SITE_URL } from "@/lib/seo";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, XCircle, Zap } from "lucide-react";

export function generateStaticParams() {
  return GLOSSARY.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGlossary(params.slug);
  if (!g) return { title: "Glossary entry not found" };
  const aliases = g.alsoKnownAs?.join(", ") || g.term;
  return {
    title: `What is ${g.term}? Prompt-engineering technique explained`,
    description: `${g.short} Plain-English guide with when to use, how it works, common pitfalls, and an interactive prompt template. Also known as: ${aliases}.`,
    keywords: [
      `what is ${g.term.toLowerCase()}`,
      g.term.toLowerCase(),
      ...(g.alsoKnownAs || []).map((a) => a.toLowerCase()),
      "prompt engineering",
      "ai prompting",
      "chatgpt",
      "claude",
    ],
    alternates: { canonical: `/glossary/${g.slug}` },
  };
}

export default function GlossaryDetailPage({ params }: { params: { slug: string } }) {
  const g = getGlossary(params.slug);
  if (!g) notFound();
  const related = (g.related || [])
    .map((slug) => getGlossary(slug))
    .filter(Boolean) as ReturnType<typeof getGlossary>[];

  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Glossary", url: `${SITE_URL}/glossary` },
            { name: g.term, url: `${SITE_URL}/glossary/${g.slug}` },
          ]),
          articleJsonLd({
            headline: `What is ${g.term}?`,
            description: g.short,
            url: `${SITE_URL}/glossary/${g.slug}`,
            keywords: [g.term, ...(g.alsoKnownAs || []), "prompt engineering"],
          }),
          faqJsonLd([
            { q: `When should you use ${g.term}?`, a: g.whenToUse.join(" ") },
            { q: `When NOT to use ${g.term}?`, a: g.whenNotToUse.join(" ") },
            { q: `How does ${g.term} work?`, a: g.howItWorks.join(" ") },
          ]),
        ]}
      />
      <TrackEvent name="glossary_opened" params={{ slug: g.slug }} />
      <main className="relative min-h-screen bg-hero-radial">
        <article className="mx-auto max-w-3xl px-6 pb-20 pt-8 sm:pt-12">
          <Link
            href="/glossary"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-dim transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> All techniques
          </Link>

          <div className="mb-2 inline-flex items-center gap-2 text-xs text-ink-fade">
            <BookOpen className="h-3 w-3 text-accent-glow" />
            Glossary · Technique
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {g.term}
            </h1>
            <FavoriteButton kind="glossary" slug={g.slug} variant="chip" />
          </div>
          {g.alsoKnownAs && g.alsoKnownAs.length > 0 && (
            <p className="mt-2 text-sm text-ink-fade">
              Also known as: {g.alsoKnownAs.join(", ")}
            </p>
          )}
          <p className="mt-4 text-base leading-relaxed text-ink-dim sm:text-lg">
            {g.short}
          </p>

          {g.templateSlug && (
            <Link
              href={`/templates/${g.templateSlug}`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-accent-glow"
            >
              <Zap className="h-4 w-4" /> Try the interactive template
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {/* When to use / when not */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card title="When to use it" icon={<CheckCircle2 className="h-4 w-4 text-emerald-300" />}>
              <ul className="space-y-1.5 text-sm text-ink-dim">
                {g.whenToUse.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="When not to use it" icon={<XCircle className="h-4 w-4 text-rose-300" />}>
              <ul className="space-y-1.5 text-sm text-ink-dim">
                {g.whenNotToUse.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-rose-400" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* How it works */}
          <Card className="mt-8" title="How it works" icon={<Zap className="h-4 w-4 text-accent-glow" />}>
            <ol className="space-y-2 text-sm text-ink-dim">
              {g.howItWorks.map((w, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent/15 text-[10px] font-semibold text-accent-glow ring-1 ring-accent/30">
                    {i + 1}
                  </span>
                  <span>{w}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Example */}
          <Card className="mt-8" title="Example" icon={<BookOpen className="h-4 w-4 text-accent-glow" />}>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-rose-300">
                  Lazy prompt
                </div>
                <pre className="rounded-lg border border-white/5 bg-white/[0.02] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink-dim">
                  {g.example.bad}
                </pre>
              </div>
              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Using the technique
                </div>
                <pre className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink">
                  {g.example.good}
                </pre>
              </div>
            </div>
          </Card>

          {/* Pitfalls */}
          <Card className="mt-8" title="Common pitfalls" icon={<XCircle className="h-4 w-4 text-amber-300" />}>
            <ul className="space-y-1.5 text-sm text-ink-dim">
              {g.pitfalls.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-amber-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Card>

          {g.origin && (
            <Card className="mt-8" title="Where this came from">
              <p className="text-sm text-ink-dim">{g.origin}</p>
            </Card>
          )}

          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-dim">
                Related techniques
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r!.slug}
                    href={`/glossary/${r!.slug}`}
                    className="card group flex items-start gap-3 p-3 transition hover:border-accent/30"
                  >
                    <Zap className="mt-0.5 h-4 w-4 flex-none text-accent-glow" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink group-hover:text-accent-glow">
                        {r!.term}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-ink-dim">{r!.short}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {g.templateSlug && (
            <div className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-6">
              <h3 className="text-base font-semibold">Try it interactively</h3>
              <p className="mt-2 text-sm text-ink-dim">
                The interactive template lets you fill in your scenario and
                generates a copy-ready prompt that uses this technique.
              </p>
              <Link
                href={`/templates/${g.templateSlug}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-accent-glow"
              >
                Open the template <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Card({
  title,
  icon,
  className = "",
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`card p-5 sm:p-6 ${className}`}>
      <h2 className="mb-3 inline-flex items-center gap-2 text-base font-semibold">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}
