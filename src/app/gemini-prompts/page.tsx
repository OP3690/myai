import type { Metadata } from "next";
import { ModelLandingPage } from "@/components/ModelLandingPage";

export const metadata: Metadata = {
  title: "Gemini Prompts — Free Generator + Templates for Gemini 1.5 Pro",
  description:
    "Free Gemini prompt generator and library. 58 hand-curated Gemini prompts with interactive fill-in fields. Auto-rewrites in Gemini's preferred tight-bullet style. Supports Gemini 1.5 Pro's 1M context. No API key, no signup.",
  keywords: [
    "gemini prompts",
    "google gemini prompts",
    "gemini ai prompts",
    "gemini prompt generator",
    "best gemini prompts",
    "gemini 1.5 pro prompts",
    "gemini 1.5 flash prompts",
    "gemini system prompt",
    "how to prompt gemini",
    "gemini prompt examples",
    "google bard prompts",
  ],
  alternates: { canonical: "/gemini-prompts" },
  openGraph: {
    title: "Gemini Prompts — Free Generator + Templates for Gemini 1.5 Pro",
    description:
      "Free Gemini prompt generator. 58 templates. 1M-context chunker. Tight-bullet auto-rewriter Gemini prefers.",
    url: "https://fixaiprompt.com/gemini-prompts",
    type: "website",
  },
};

export default function Page() {
  return (
    <ModelLandingPage
      slug="gemini-prompts"
      model="Gemini"
      modelFull="Google's Gemini (1.5 Pro, 1.5 Flash)"
      title="Gemini Prompts — Free Generator + Templates for Gemini 1.5 Pro"
      description="Free Gemini prompt generator and library. 58 templates with tight-bullet output Gemini prefers."
      heroH1={
        <>
          Gemini prompts for{" "}
          <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-rose-300 bg-clip-text text-transparent">
            the 1M-context era
          </span>
          .
        </>
      }
      heroBlurb={
        <>
          Gemini 1.5 Pro&apos;s 1M-token context window is the largest in any
          production LLM. The Prompt Fixer renders every prompt in the
          {" "}<strong className="text-ink">tight bulleted Role/Task/Output/Length format</strong>
          {" "}Gemini handles best, and the Chunker can split entire books to
          fit. Free, no API key, no signup.
        </>
      }
      featuredTemplateSlugs={[
        "explain-like-im-5",
        "language-conversation-partner",
        "carousel-post-writer",
        "decision-maker",
        "exam-revision-generator",
        "skeleton-of-thought",
      ]}
      tips={[
        {
          title: "Keep instructions terse",
          body: "Gemini responds best to short, bulleted instructions. Avoid long prose preambles — get to the role and task fast.",
        },
        {
          title: "Use the 1M-token window wisely",
          body: "Gemini 1.5 Pro accepts up to 1M tokens of context. Paste entire books, codebases, or long video transcripts. Our Chunker has Gemini-1M as a preset.",
        },
        {
          title: "Explicitly state the output schema",
          body: "Gemini is excellent at structured output. Tell it 'return a JSON object with keys: …' and it will reliably stick to the schema.",
        },
        {
          title: "Multimodal — but say so",
          body: "Gemini handles image and audio input. If your prompt references an image, mention it explicitly so Gemini doesn't default to text-only reasoning.",
        },
        {
          title: "Avoid contradictions in constraints",
          body: '"Short and detailed" or "simple and technical" — Gemini handles contradictions worse than Claude. Pick one side. Our linter flags these automatically.',
        },
        {
          title: "Use the Chunker for very long input",
          body: "Even with 1M context, the cheaper Gemini Flash model has a smaller window. The Chunker auto-detects content type and splits cleanly at paragraph boundaries.",
        },
      ]}
      faqs={[
        {
          q: "What's the best Gemini prompt format?",
          a: "Tight bulleted lines: 'Role: …', 'Task: …', 'Output: …', 'Length: …'. Avoid long markdown headings. Our auto-fixer produces exactly this format when 'Gemini' is the selected target — click the Gemini tab in the corrected-prompt preview.",
        },
        {
          q: "Does this work with Gemini 1.5 Pro and Gemini 1.5 Flash?",
          a: "Yes, the prompts work on every Gemini model including 1.5 Pro (1M context), 1.5 Flash (1M context), and Ultra. The Chunker has both presets built in.",
        },
        {
          q: "How do I make Gemini follow my output schema?",
          a: "State the schema explicitly in your prompt: 'Return a JSON object with these exact keys: name (string), score (number), reasoning (string).' Gemini is one of the best models for structured output. The Prompt Fixer suggests the right schema based on the task type it detects.",
        },
        {
          q: "Are Gemini prompts free?",
          a: "Every tool on FixAIPrompt is free, browser-only, and requires no signup or API key.",
        },
        {
          q: "Can I share a filled Gemini prompt template?",
          a: "Yes — each template page has a 'Copy share link' button that encodes your filled values into a URL. Anyone who opens the link sees the prompt pre-filled.",
        },
        {
          q: "What's the best Gemini prompt for long-document analysis?",
          a: "Paste your document into the Chunker first to see how many tokens it is and where it would split. For 1M-context analysis, you can usually skip chunking. The Plan-and-Solve, Skeleton-of-Thought, and First-Principles Decomposer templates work especially well on long Gemini contexts.",
        },
      ]}
    />
  );
}
