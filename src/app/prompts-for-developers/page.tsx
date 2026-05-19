import type { Metadata } from "next";
import { UseCaseLandingPage } from "@/components/UseCaseLandingPage";

export const metadata: Metadata = {
  title:
    "AI Prompts for Developers — ChatGPT, Claude & Copilot Templates",
  description:
    "Free AI prompt library for software engineers. Templates for debugging, code review, SQL optimization, API documentation, system design, stack-trace explanation, and more. Works with ChatGPT, Claude, Cursor, and Copilot.",
  keywords: [
    "ai prompts for developers",
    "chatgpt prompts for developers",
    "claude prompts for developers",
    "ai coding prompts",
    "best ai prompts for programmers",
    "chatgpt code review prompts",
    "ai debugging prompts",
    "cursor prompts",
    "github copilot prompts",
  ],
  alternates: { canonical: "/prompts-for-developers" },
  openGraph: {
    title: "AI Prompts for Developers — Free Templates for ChatGPT, Claude & Copilot",
    description:
      "Templates for debugging, code review, SQL, API docs, system design. Works with every AI coding assistant.",
    url: "https://fixaiprompt.com/prompts-for-developers",
    type: "website",
  },
};

export default function Page() {
  return (
    <UseCaseLandingPage
      slug="prompts-for-developers"
      audience="Developers"
      audienceFull="software engineers and developers"
      title="AI Prompts for Developers"
      description="Free prompt templates for coding, debugging, code review, SQL, and system design."
      heroH1={
        <>
          AI prompts for{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-rose-300 bg-clip-text text-transparent">
            developers
          </span>{" "}
          that ship.
        </>
      }
      heroBlurb={
        <>
          A curated library of prompts for the coding work you actually do —
          debugging cryptic stack traces, getting a real code review,
          optimizing SQL queries, explaining legacy code, generating API
          docs, and pressure-testing your system design. Works with ChatGPT,
          Claude, Cursor, and Copilot. Free, no signup.
        </>
      }
      templateSlugs={[
        "debug-my-code",
        "refactor-legacy-code",
        "regex-generator",
        "explain-stack-trace",
        "sql-query-optimizer",
        "api-documentation-generator",
        "react-agent",
        "system-prompt-designer",
        "first-principles-decomposer",
      ]}
      pains={[
        {
          problem: "ChatGPT 'fixes' your bug by rewriting half the function and introducing 2 new bugs.",
          solution: "Force a root-cause analysis first, then a minimal fix. The Debug My Code template does exactly this.",
          templateSlug: "debug-my-code",
        },
        {
          problem: "Asked for a code review, got 30 lines of 'consider adding comments' generic feedback.",
          solution: "Pin a specific reviewer persona + demand evidence per critique. Skip the platitudes.",
          templateSlug: "refactor-legacy-code",
        },
        {
          problem: "Cryptic stack trace, model invents a fix that doesn't address the actual cause.",
          solution: "Make the model translate trace → root cause → 2 lines to check, before suggesting fixes.",
          templateSlug: "explain-stack-trace",
        },
        {
          problem: "Generated SQL is 'correct' but does a sequential scan over your 100M-row table.",
          solution: "Demand the optimizer pass — index suggestions, complexity change, and CREATE INDEX statements.",
          templateSlug: "sql-query-optimizer",
        },
        {
          problem: "API docs look generated — no edge cases, no error responses, no runnable curl.",
          solution: "Mandate sections: method/path, what it does, request, response, edge cases, runnable curl, assumptions to verify.",
          templateSlug: "api-documentation-generator",
        },
        {
          problem: "Building an agent and it loops on the same tool call without progress.",
          solution: "ReAct skeleton with explicit Thought/Action/Observation markers + 10-step cap + CONFIRM before irreversible actions.",
          templateSlug: "react-agent",
        },
      ]}
      faqs={[
        {
          q: "Which AI is best for coding — ChatGPT, Claude, or Copilot?",
          a: "For pure code review and refactoring, Claude Sonnet 3.5 produces the most readable suggestions. For inline completion while writing, Cursor + Claude or GitHub Copilot beats chat. For agentic / multi-step tool use, Claude's tool use is the most reliable. Our templates work on all three.",
        },
        {
          q: "Are these prompts free?",
          a: "Yes. Every tool on FixAIPrompt is free, browser-only, and works without an API key or signup.",
        },
        {
          q: "Do these prompts work with Cursor?",
          a: 'Yes — most coding templates work directly. The Cursor target in our Prompt Fixer optimizes prompts for the file-scoped, codebase-aware context Cursor provides.',
        },
        {
          q: "How do I share a filled template with my team?",
          a: 'Each template page has a "Copy share link" button that encodes your filled fields into the URL. Teammates who open the link see the prompt pre-filled and can fork it.',
        },
        {
          q: "What about prompts for system design interviews?",
          a: "The First-Principles Decomposer, Tree-of-Thoughts, and System Prompt Designer templates all help with system design problems. The Decision Maker template is good for the trade-off discussion.",
        },
        {
          q: "Can I use these prompts in CI / production?",
          a: "Yes. The npx fixaiprompt CLI (see /tools) lets you pipe text through the linter and auto-fixer from scripts. JSON output supported.",
        },
      ]}
    />
  );
}
