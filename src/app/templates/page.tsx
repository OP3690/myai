import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { TemplatesBrowser } from "@/components/TemplatesBrowser";
import { TEMPLATES } from "@/lib/templates";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title:
    "58 AI Prompt Templates — Best Prompts for ChatGPT, Claude, Gemini & Grok",
  description:
    "58 hand-curated AI prompt templates with interactive fill-in fields, including 27 advanced techniques (Chain-of-Thought, Tree-of-Thoughts, Self-Refine, ReAct, Multi-Persona, Pre-Mortem, Adversarial Red-Team). Free, no signup, copy-paste ready for any LLM.",
  keywords: [
    "ai prompt templates",
    "chatgpt prompts",
    "claude prompts",
    "gemini prompts",
    "grok prompts",
    "best ai prompts",
    "best chatgpt prompts",
    "prompt library",
    "prompt examples",
    "chain of thought template",
    "tree of thoughts template",
    "self-refine template",
    "react agent template",
  ],
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  const advanced = TEMPLATES.filter((t) => t.category === "techniques");

  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-8 pt-10 text-center sm:pt-14">
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
            Search, filter, and save the patterns that work. Chain-of-Thought,
            Tree-of-Thoughts, Self-Refine, Multi-Persona Debate, Pre-Mortem,
            Adversarial Red-Team — each one interactive, with fill-in
            placeholders and one-click sample values.
          </p>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <TemplatesBrowser />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
