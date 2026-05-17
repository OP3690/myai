import type { Metadata } from "next";
import { ModelLandingPage } from "@/components/ModelLandingPage";

export const metadata: Metadata = {
  title: "Free AI Prompt Generator — ChatGPT, Claude, Gemini & Grok",
  description:
    "The free AI prompt generator that works with every major LLM. Paste any rough prompt, get a multi-metric score (clarity / context / structure / specificity / risk), and an auto-rewritten version tailored for ChatGPT, Claude, Gemini, or Grok. 58 ready-made templates. 100% browser-only.",
  keywords: [
    "ai prompt generator",
    "free ai prompt generator",
    "ai prompt builder",
    "prompt generator chatgpt",
    "prompt generator claude",
    "prompt generator gemini",
    "ai prompt creator",
    "best ai prompt generator",
    "prompt engineering tool",
    "prompt optimizer",
    "free prompt builder",
  ],
  alternates: { canonical: "/ai-prompt-generator" },
  openGraph: {
    title: "Free AI Prompt Generator — ChatGPT, Claude, Gemini & Grok",
    description:
      "Generate, optimize, and chunk prompts for any LLM. 58 templates, 5-metric scoring, model-aware output. 100% browser-only.",
    url: "https://fixaiprompt.com/ai-prompt-generator",
    type: "website",
  },
};

export default function Page() {
  return (
    <ModelLandingPage
      slug="ai-prompt-generator"
      model="any LLM"
      modelFull="ChatGPT, Claude, Gemini, Grok, Cursor, and Copilot"
      title="Free AI Prompt Generator — ChatGPT, Claude, Gemini & Grok"
      description="Generate, score, and chunk AI prompts for any major LLM. 58 templates. 5-metric auto-rewriter."
      heroH1={
        <>
          The free{" "}
          <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            AI prompt generator
          </span>{" "}
          that fits every model.
        </>
      }
      heroBlurb={
        <>
          Paste any rough prompt → get a clarity score, a corrected version,
          and a model-aware rendering for whichever LLM you&apos;re using —
          Claude (XML tags), ChatGPT (markdown), Gemini (bullets), or Grok
          (direct). Plus 58 prompt templates and a 9-model chunker. Free,
          no signup, no API key.
        </>
      }
      featuredTemplateSlugs={[
        "chain-of-thought-reasoning",
        "tree-of-thoughts",
        "self-refine-loop",
        "multi-persona-council",
        "adversarial-red-team",
        "system-prompt-designer",
      ]}
      tips={[
        {
          title: "Always set a role",
          body: 'Adding "Act as a senior <X>" before any task improves output more than any other single move. Free templates already include this.',
        },
        {
          title: "Pick the right model render",
          body: 'Same prompt, three formats. The auto-fixer\'s "Claude / ChatGPT / Gemini" tabs render the corrected prompt in the syntax that model handles best.',
        },
        {
          title: "Use few-shot for consistency",
          body: "If you call the prompt repeatedly (e.g. in a script), include 2–5 example input → output pairs. Few-shot is the most reliable consistency-booster.",
        },
        {
          title: "Constrain length explicitly",
          body: '"Under 200 words" or "in 3 sentences" beats "be brief". Every modern LLM follows hard numbers better than soft adjectives.',
        },
        {
          title: "Tell it to ask",
          body: 'Append "If anything is ambiguous, ask before guessing" so the model surfaces ambiguity instead of confidently inventing an answer.',
        },
        {
          title: "Add anti-patterns",
          body: 'Tell the model what NOT to do: "Do not use the word \'leverage\'", "no emojis", "avoid filler phrases like \'in conclusion\'". Anti-patterns close the output space.',
        },
      ]}
      faqs={[
        {
          q: "Is this AI prompt generator actually free?",
          a: "Yes — every tool on FixAIPrompt is free, browser-only, and works without an API key. There are no usage limits, no signup, and no paywalled features.",
        },
        {
          q: "Which LLMs does the prompt generator work with?",
          a: "Every major LLM. The auto-rewriter has built-in render modes for Claude (XML tags), ChatGPT (markdown headings), Gemini (tight bullets), and a model-agnostic Plain mode that works on Grok, Cursor, Copilot, and any other LLM.",
        },
        {
          q: "How is this different from ChatGPT?",
          a: "We're not an LLM — we're the layer that makes your prompt better before you send it to ChatGPT/Claude/Gemini/Grok. Think Grammarly for AI prompts. The rewriter, lint scoring, secret detector, and chunker all run locally in your browser.",
        },
        {
          q: "Do you have an API or SDK?",
          a: "Not yet — the entire engine runs client-side as TypeScript. There's also a free CLI (`npx fixaiprompt`) you can pipe text through in your terminal.",
        },
        {
          q: "How accurate is the multi-metric score?",
          a: "The score is rule-based, not LLM-judged. It's deterministic — the same prompt always gets the same score. The 5 metrics (clarity, context, structure, specificity, hallucination risk) are weighted from ~20 lint rules. In practice, a 90+ score correlates strongly with high-quality model output.",
        },
        {
          q: "Can I use the prompt generator in production?",
          a: 'Yes. The CLI (`npx fixaiprompt`) is built for that. You can pipe prompts through it in CI, in build scripts, or in your own AI pipelines. Returns JSON with --json. Or import the lint/improve functions directly from the repo.',
        },
      ]}
    />
  );
}
