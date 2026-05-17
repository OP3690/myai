import type { Metadata } from "next";
import { PromptDiffTool } from "@/components/PromptDiffTool";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { ArrowLeftRight, Trophy, Zap } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Prompt Diff — Compare AI Prompts for ChatGPT, Claude, Gemini & Grok",
  description:
    "Paste two AI prompts side-by-side. We score each on Clarity, Context, Structure, Specificity, and Hallucination Risk — then declare a winner with the reasoning. Free, browser-only, instant.",
  keywords: [
    "prompt diff",
    "compare ai prompts",
    "compare chatgpt prompts",
    "prompt comparison",
    "prompt ab test",
    "which prompt is better",
    "prompt benchmark",
  ],
  alternates: { canonical: "/prompt-diff" },
};

export default function PromptDiffPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Zap className="h-3 w-3 text-accent-glow" />
            Prompt Diff · Browser-only · 5-metric comparison
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Two prompts walk into a ring.{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              One wins.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Paste any two AI prompts. We score both on Clarity, Context, Structure, Specificity, and Hallucination Risk — then declare a winner with the reasoning.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <PromptDiffTool />
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Step icon={<ArrowLeftRight className="h-5 w-5 text-accent-glow" />} title="Paste both">
              Drop a quick prompt vs. a polished one — or two of your team&apos;s drafts.
            </Step>
            <Step icon={<Zap className="h-5 w-5 text-amber-300" />} title="See the metrics">
              We lint both prompts locally, score each on 5 dimensions, and detect the task type.
            </Step>
            <Step icon={<Trophy className="h-5 w-5 text-amber-300" />} title="Pick a winner">
              The card at the bottom shows which prompt wins each metric and explains the reasoning.
            </Step>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Step({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
        {icon}
      </div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      <p className="mt-1 text-xs text-ink-dim">{children}</p>
    </div>
  );
}
