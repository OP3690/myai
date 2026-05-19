import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { PromptIQQuiz } from "@/components/PromptIQQuiz";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, SITE_URL } from "@/lib/seo";
import { Sparkles, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Prompt IQ Test — How Good Are You at Prompt Engineering? (10 Q · 2 min)",
  description:
    "Take the free 10-question Prompt IQ test. Find out where you stack up against other AI users on Chain-of-Thought, contradictions, few-shot examples, per-model syntax, and anti-hallucination patterns. Shareable score.",
  keywords: [
    "prompt iq",
    "prompt engineering quiz",
    "prompt engineering test",
    "ai prompt test",
    "how good am i at prompts",
    "chatgpt iq test",
    "ai skill test",
    "prompt skills assessment",
  ],
  alternates: { canonical: "/prompt-iq" },
  openGraph: {
    title: "Prompt IQ Test — How Good Are You at Prompt Engineering?",
    description: "Free 10-question test. Shareable score. Find out where you stack up.",
    url: "https://fixaiprompt.com/prompt-iq",
    type: "website",
  },
};

const FAQS = [
  {
    q: "How long does the Prompt IQ test take?",
    a: "About 2 minutes — 10 multiple-choice questions, no signup, no email capture. Each question tests a specific prompt-engineering concept.",
  },
  {
    q: "Is the Prompt IQ score scientific?",
    a: "It's a quick self-assessment, not a peer-reviewed metric. The questions are drawn from the same lint rules our auto-fixer uses on real prompts. If you score 90+, you've internalized the patterns that produce great AI output.",
  },
  {
    q: "Can I retake the quiz?",
    a: 'Yes — there\'s a "Retake the quiz" button on the result page. Your score is not stored anywhere on our servers (there is no server).',
  },
  {
    q: "How do I share my score?",
    a: 'Every result page has X (Twitter), LinkedIn, and "Copy result text" share buttons. The share URL encodes your score so people clicking your link see your result first, then can take the test themselves.',
  },
  {
    q: "What does the score actually test?",
    a: "Specific role-setting, output format constraints, length constraints, audience awareness, Chain-of-Thought, few-shot examples, per-model syntax (Claude XML vs ChatGPT markdown vs Gemini bullets), anti-hallucination phrasing, and task-decomposition.",
  },
];

export default function PromptIQPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const rawScore = searchParams?.score;
  const initialScore =
    typeof rawScore === "string" && /^\d+$/.test(rawScore)
      ? Math.max(0, Math.min(100, parseInt(rawScore, 10)))
      : undefined;

  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Prompt IQ Test", url: `${SITE_URL}/prompt-iq` },
          ]),
          faqJsonLd(FAQS),
        ]}
      />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-8 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Trophy className="h-3 w-3" /> 10 questions · 2 min · shareable score
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            What&apos;s your{" "}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300 bg-clip-text text-transparent">
              Prompt IQ
            </span>
            ?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            10 questions covering the patterns that actually move the needle —
            role-setting, format, length, Chain-of-Thought, few-shot,
            per-model syntax, anti-hallucination. Free, no signup. Share
            your score and dare others to beat it.
          </p>
          {initialScore !== undefined && (
            <p className="mt-4 text-sm text-accent-glow">
              <Sparkles className="mr-1 inline h-3.5 w-3.5" />
              Showing a shared score of {initialScore}/100 — take the quiz yourself below.
            </p>
          )}
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <PromptIQQuiz initialScore={initialScore} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
