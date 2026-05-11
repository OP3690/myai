import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { GLOSSARY } from "@/lib/glossary";
import { ArrowRight, BookOpen, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Prompt Engineering Glossary — Chain-of-Thought, Tree-of-Thoughts, Self-Refine, More",
  description:
    "Plain-English explanations of the prompt-engineering techniques real teams use. Each entry includes when-to-use, how it works, pitfalls, and a working interactive template.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryIndexPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <BookOpen className="h-3 w-3 text-accent-glow" />
            Glossary · {GLOSSARY.length} prompt-engineering techniques
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Prompt engineering,{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              in plain English
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Real techniques used in production AI systems — what they are, when to use them, when not to, and a one-click interactive template for each.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GLOSSARY.map((g) => (
              <Link
                key={g.slug}
                href={`/glossary/${g.slug}`}
                className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  <Zap className="h-3 w-3" />
                  Technique
                </div>
                <h3 className="text-base font-semibold text-ink group-hover:text-accent-glow">
                  {g.term}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-dim">{g.short}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-fade">
                  {g.alsoKnownAs && (
                    <span>also: {g.alsoKnownAs.slice(0, 1).join(", ")}</span>
                  )}
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
