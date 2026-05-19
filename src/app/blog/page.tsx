import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { BLOG_POSTS } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title:
    "AI Prompt Engineering Blog — Guides for ChatGPT, Claude & Gemini",
  description:
    "Practical AI prompt-engineering guides. How to write better ChatGPT prompts, ChatGPT vs Claude vs Gemini comparisons, and explainers for techniques like Chain-of-Thought, Tree-of-Thoughts, and Self-Refine.",
  keywords: [
    "ai blog",
    "prompt engineering blog",
    "chatgpt blog",
    "claude blog",
    "gemini blog",
    "ai writing tips",
    "ai prompt guides",
    "how to use chatgpt",
    "how to use claude",
  ],
  alternates: { canonical: "/blog" },
};

const TONE: Record<string, string> = {
  Guides: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  Comparisons: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Techniques: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  Templates: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

export default function BlogIndex() {
  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Blog", url: `${SITE_URL}/blog` },
          ]),
        ]}
      />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-8 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <BookOpen className="h-3 w-3 text-accent-glow" />
            FixAIPrompt Blog · {BLOG_POSTS.length} articles
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Practical AI prompt engineering,{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              no fluff
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Deep guides for ChatGPT, Claude, and Gemini. Honest comparisons.
            Real examples. Written by people who ship AI products — not
            content marketers chasing keywords.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TONE[post.category]}`}
                  >
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-fade">
                    <Clock className="h-3 w-3" /> {post.readingMinutes} min read
                  </span>
                </div>
                <h2 className="text-base font-semibold leading-snug text-ink group-hover:text-accent-glow sm:text-lg">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-ink-dim">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-fade">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-accent-glow" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
