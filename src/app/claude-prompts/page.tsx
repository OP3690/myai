import type { Metadata } from "next";
import { ModelLandingPage } from "@/components/ModelLandingPage";

export const metadata: Metadata = {
  title: "Claude Prompts — Free Generator + Templates for Claude 3.5 & Opus",
  description:
    "Free Claude prompt generator and library. 58 hand-curated Claude prompts with interactive fill-in fields. Multi-metric scoring auto-rewrites your prompt with the XML-tagged structure Claude Sonnet and Opus handle best. No API key, no signup.",
  keywords: [
    "claude prompts",
    "claude ai prompts",
    "claude prompt generator",
    "best claude prompts",
    "anthropic claude prompts",
    "claude 3.5 prompts",
    "claude sonnet prompts",
    "claude opus prompts",
    "claude xml prompts",
    "how to prompt claude",
    "claude system prompt",
    "claude prompt examples",
  ],
  alternates: { canonical: "/claude-prompts" },
  openGraph: {
    title: "Claude Prompts — Free Generator + Templates for Claude 3.5 & Opus",
    description:
      "Free Claude prompt generator, 58 templates, 5-metric scoring, XML-tagged output that Claude handles best.",
    url: "https://fixaiprompt.com/claude-prompts",
    type: "website",
  },
};

export default function Page() {
  return (
    <ModelLandingPage
      slug="claude-prompts"
      model="Claude"
      modelFull="Anthropic's Claude (Sonnet, Opus, Haiku)"
      title="Claude Prompts — Free Generator + Templates for Claude 3.5 & Opus"
      description="Free Claude prompt generator and library. 58 templates with interactive fill-in fields. XML-tag-aware auto-rewriter."
      heroH1={
        <>
          Claude prompts that{" "}
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            unlock Sonnet
          </span>
          .
        </>
      }
      heroBlurb={
        <>
          The Prompt Fixer renders every rewritten prompt in
          {" "}<strong className="text-ink">Claude&apos;s preferred XML-tagged format</strong>
          {" "}— with{" "}<code className="rounded bg-white/5 px-1 py-0.5 text-[12px] text-accent-glow">&lt;role&gt;</code>,{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-[12px] text-accent-glow">&lt;task&gt;</code>,{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-[12px] text-accent-glow">&lt;constraints&gt;</code>{" "}
          tags Claude actually keys on. Plus 58 ready-to-fill Claude
          templates and a 200k-context chunker. Free, no API key.
        </>
      }
      featuredTemplateSlugs={[
        "self-refine-loop",
        "tree-of-thoughts",
        "constitutional-self-critique",
        "multi-persona-council",
        "adversarial-red-team",
        "pre-mortem",
      ]}
      tips={[
        {
          title: "Use XML tags for sections",
          body: "Claude was trained on XML-tagged sections. Wrap role, task, context, and output_format in tags and watch obedience to instructions jump.",
        },
        {
          title: "Let Claude think before answering",
          body: 'Append "Think step by step before responding" — Claude is especially good at Chain-of-Thought reasoning when explicitly invited.',
        },
        {
          title: "Use the 200k context window",
          body: "Claude Sonnet/Opus has a 200k-token window. Paste entire codebases, long docs, full transcripts. Our chunker has Claude presets built-in.",
        },
        {
          title: "Ask for citations from context",
          body: "When using RAG with Claude, instruct it to quote the source text. Claude is unusually good at refusing to fabricate when asked to cite.",
        },
        {
          title: "System prompt > user prompt for rules",
          body: "Put hard constraints (never quote competitors, always respond in JSON) in Claude's system parameter, not the user message — much harder to jailbreak.",
        },
        {
          title: "Use Multi-Persona Debate",
          body: "Claude is exceptionally good at simulating multiple personas. Have it convene a 5-expert council to pressure-test important decisions.",
        },
      ]}
      faqs={[
        {
          q: "Why does Claude prefer XML tags?",
          a: "Anthropic trained Claude with heavy use of XML in its instruction data. Tagged sections like <role>, <task>, <context>, <output_format> reliably increase output quality and obedience compared to plain prose. Our Prompt Fixer renders every prompt in this XML style when 'Claude' is the selected target.",
        },
        {
          q: "What's the difference between a Claude prompt and a ChatGPT prompt?",
          a: "Same content, different syntax. Claude responds best to XML-tagged sections; ChatGPT responds best to markdown headings; Gemini responds best to tight bullets. Our auto-fixer produces all three from a single input — click between the Claude/ChatGPT/Gemini tabs in the corrected-prompt preview.",
        },
        {
          q: "Are these Claude prompts free?",
          a: "Yes. Every prompt template, the auto-rewriter, the chunker, and the secret detector are 100% free and run entirely in your browser. No accounts, no API keys.",
        },
        {
          q: "Do these work on Claude Sonnet and Opus?",
          a: "Yes — the templates work on Claude Haiku, Sonnet, Sonnet 3.5, Opus, and any future Claude model. They use plain-English XML and rely on Anthropic's instruction-following.",
        },
        {
          q: "Can I use the Chunker with Claude's 200k context?",
          a: "Yes. The Chunker has Claude Sonnet (200k), Claude Opus (1M), and Claude Haiku (200k) as built-in model presets — each pre-fills the recommended chunk size and overlap.",
        },
        {
          q: "What's the best Claude prompt for code?",
          a: "Try the ReAct Agent Skeleton, Self-Refine Loop, or Constitutional Self-Critique templates. All three use XML tags and structured reasoning that Claude was explicitly trained on.",
        },
      ]}
    />
  );
}
