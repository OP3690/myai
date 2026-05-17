import type { Metadata } from "next";
import { PromptWorkspace } from "@/components/PromptWorkspace";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Sparkles, ShieldCheck, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Prompt Fixer & Optimizer — ChatGPT, Claude, Gemini, Grok",
  description:
    "Free AI prompt fixer and optimizer. Paste any prompt, get a multi-metric score (clarity, context, structure) and an auto-rewritten version tailored for ChatGPT, Claude, Gemini, Grok, Cursor, or Copilot. No API key, 100% browser-only.",
  keywords: [
    "ai prompt fixer",
    "ai prompt optimizer",
    "prompt linter",
    "prompt rewriter",
    "chatgpt prompt generator",
    "claude prompt generator",
    "gemini prompt generator",
    "grok prompts",
    "fix ai prompt",
    "free prompt generator",
  ],
  alternates: { canonical: "/fix" },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default function FixPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawPrompt = searchParams?.prompt;
  const initialPrompt =
    typeof rawPrompt === "string" ? rawPrompt.slice(0, 6000) : undefined;

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
            Paste any prompt. Get a multi-metric score, lint feedback, and an
            AI-powered rewrite tailored to Claude, GPT, Gemini, Grok, Cursor,
            or Copilot.
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
          <PromptWorkspace initialPrompt={initialPrompt} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
