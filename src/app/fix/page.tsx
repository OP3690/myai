import type { Metadata } from "next";
import { PromptWorkspace } from "@/components/PromptWorkspace";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Sparkles, ShieldCheck, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Prompt Fixer — Lint and rewrite any AI prompt",
  description:
    "Free, browser-only prompt linter and AI-powered rewriter. Catch vague verbs, missing format, contradictions, weak language. Optimize for Claude, GPT, Gemini, Cursor, or Copilot.",
  alternates: { canonical: "/fix" },
};

export default function FixPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Sparkles className="h-3 w-3 text-accent-glow" />
            Prompt Fixer · Free · Browser-only
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Fix your AI prompt.{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              Instantly.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Paste any prompt. Get instant lint warnings — like a code linter,
            but for the way you talk to AI — plus an optimized rewrite for
            Claude, GPT, Gemini, Cursor, or Copilot.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-dim">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Your prompt never leaves your browser
            </span>
            <span className="text-ink-fade">·</span>
            <span className="inline-flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-accent-cyan" /> Your API key is stored locally only
            </span>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <PromptWorkspace />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
