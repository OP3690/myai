import type { Metadata } from "next";
import { ModelLandingPage } from "@/components/ModelLandingPage";

export const metadata: Metadata = {
  title: "ChatGPT Prompts — Free Generator + 58 Best Templates (2026)",
  description:
    "Free ChatGPT prompt generator and library. 58 hand-curated ChatGPT prompts with interactive fill-in fields covering coding, writing, marketing, decisions, learning, and more. Multi-metric scoring auto-optimizes your prompt for GPT-4 / GPT-4o. No API key, no signup.",
  keywords: [
    "chatgpt prompts",
    "chatgpt prompt generator",
    "best chatgpt prompts",
    "chatgpt prompts 2026",
    "free chatgpt prompts",
    "gpt-4 prompts",
    "gpt-4o prompts",
    "chatgpt prompt examples",
    "chatgpt prompt library",
    "chatgpt prompt optimizer",
    "how to write chatgpt prompts",
  ],
  alternates: { canonical: "/chatgpt-prompts" },
  openGraph: {
    title: "ChatGPT Prompts — Free Generator + 58 Best Templates",
    description:
      "Free ChatGPT prompt generator, 58 curated templates, and a 5-metric prompt scorer. Optimized for GPT-4 and GPT-4o. No signup.",
    url: "https://fixaiprompt.com/chatgpt-prompts",
    type: "website",
  },
};

export default function Page() {
  return (
    <ModelLandingPage
      slug="chatgpt-prompts"
      model="ChatGPT"
      modelFull="OpenAI's ChatGPT (GPT-4, GPT-4o)"
      title="ChatGPT Prompts — Free Generator + 58 Best Templates"
      description="Free ChatGPT prompt generator and library. 58 templates, 5-metric scoring, GPT-4 and GPT-4o optimized."
      heroH1={
        <>
          ChatGPT prompts that{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            actually work
          </span>
          .
        </>
      }
      heroBlurb={
        <>
          Paste any rough ChatGPT prompt — get a multi-metric score and an
          auto-rewritten version with proper role, format, length, and
          examples baked in. Plus a library of <strong className="text-ink">58 ChatGPT prompts</strong>
          {" "}with fill-in fields for coding, writing, decisions, and more.
          Free, no signup, no API key.
        </>
      }
      featuredTemplateSlugs={[
        "chain-of-thought-reasoning",
        "viral-hook-generator",
        "debug-my-code",
        "cold-outreach-email",
        "self-refine-loop",
        "decision-maker",
      ]}
      tips={[
        {
          title: "Always set a role",
          body: '"Act as a senior <X>" is the single highest-ROI move in any ChatGPT prompt. Vague defaults to "average internet writer".',
        },
        {
          title: "Specify the output format",
          body: "ChatGPT will give you 8 paragraphs by default. Demand markdown headings, a JSON object, a numbered list, or exact length.",
        },
        {
          title: "Strip vague phrasing",
          body: '"Help me with…", "Can you please…", "maybe try" — these phrases produce wishy-washy answers. Use action verbs.',
        },
        {
          title: "Add one concrete example",
          body: "Few-shot examples consistently outperform descriptive instructions. Show one input → desired output pair when the task is non-trivial.",
        },
        {
          title: "Tell it to ask if unclear",
          body: 'Append "If anything is ambiguous, ask before guessing" to stop ChatGPT from confidently filling in wrong assumptions.',
        },
        {
          title: "Specify the audience",
          body: "ChatGPT's response to \"explain X\" looks very different for a 5-year-old vs. a senior engineer. Always state the reader.",
        },
      ]}
      faqs={[
        {
          q: "What's the best ChatGPT prompt format?",
          a: "Role + Task + Output format + Length + Audience + (optional) Example. Our auto-fixer applies this structure automatically based on what your prompt is trying to do. The 'Battle of the LLMs' on the home page shows the same prompt rendered in ChatGPT's preferred markdown-heading style vs Claude's XML and Gemini's bullets.",
        },
        {
          q: "Is this a ChatGPT prompt generator?",
          a: "Yes. Paste any rough ask into the Prompt Fixer at /fix and it produces a polished, copy-paste-ready ChatGPT prompt with role, format, length, and audience filled in. You can also browse 58 ready-made ChatGPT prompt templates at /templates.",
        },
        {
          q: "Do these prompts work on GPT-4 and GPT-4o?",
          a: "Yes — every template is model-agnostic but our auto-fixer can render the same prompt in three styles (ChatGPT/markdown, Claude/XML, Gemini/bullets) so you get the best output on each. GPT-4 and GPT-4o both prefer the markdown-headings style.",
        },
        {
          q: "Are these ChatGPT prompts free?",
          a: "Yes. Every tool on FixAIPrompt is free and 100% browser-only. There are no accounts, no API keys, no usage limits, and no tracking beyond standard page analytics.",
        },
        {
          q: "Can I share my filled ChatGPT prompt?",
          a: "Yes — every template page has a 'Copy share link' button that encodes your filled-in values into a URL hash. Anyone who opens that link sees the prompt pre-filled with your values.",
        },
        {
          q: "What about ChatGPT prompts for coding?",
          a: "The Coding category has templates for Debug My Code, Refactor Legacy Code, SQL Query Optimizer, API Documentation Generator, Regex Generator, Explain Stack Trace, and more — each with fill-in fields for your specific scenario.",
        },
      ]}
    />
  );
}
