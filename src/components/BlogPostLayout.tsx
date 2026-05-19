import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { JsonLd } from "@/components/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  SITE_URL,
} from "@/lib/seo";
import { ArrowLeft, ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

export function BlogPostLayout({
  post,
  faqs,
  children,
}: {
  post: BlogPost;
  faqs?: { q: string; a: string }[];
  children: React.ReactNode;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url },
          ]),
          articleJsonLd({
            headline: post.title,
            description: post.description,
            url,
            keywords: post.keywords,
            datePublished: post.publishedAt,
          }),
          ...(faqs && faqs.length ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <main className="relative min-h-screen bg-hero-radial">
        <article className="mx-auto max-w-3xl px-6 pb-16 pt-8 sm:pt-12">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-dim transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-ink-fade">
            <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 font-bold uppercase tracking-wider text-violet-300">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readingMinutes} min read
            </span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-ink-dim sm:text-lg">
            {post.description}
          </p>

          {/* Article body */}
          <div className="prose-fix mt-8 space-y-5 text-[15px] leading-relaxed text-ink">
            {children}
          </div>

          {/* FAQ */}
          {faqs && faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">FAQ</h2>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <details key={i} className="card group p-5">
                    <summary className="cursor-pointer list-none text-sm font-medium text-ink sm:text-base">
                      <span className="mr-2 text-accent-glow">›</span>
                      {f.q}
                    </summary>
                    <p className="mt-3 text-sm text-ink-dim">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-transparent to-cyan-400/10 p-6">
            <h3 className="inline-flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-accent-glow" />
              Now try it on your own prompt
            </h3>
            <p className="mt-2 text-sm text-ink-dim">
              The FixAIPrompt auto-fixer applies every pattern in this
              article automatically — paste any rough prompt and get a
              polished, model-aware version back. Free, no signup, no API key.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/fix" className="btn-primary">
                Try the Prompt Fixer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/templates" className="btn-ghost">
                Browse 58 templates
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
