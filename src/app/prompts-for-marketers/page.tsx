import type { Metadata } from "next";
import { UseCaseLandingPage } from "@/components/UseCaseLandingPage";

export const metadata: Metadata = {
  title:
    "AI Prompts for Marketers — ChatGPT, Claude & Gemini Templates",
  description:
    "Free AI prompt library for marketers and growth teams. Templates for ad copy, headlines, landing pages, customer personas, cold outreach, viral hooks, and algorithm reverse-engineering. Works with ChatGPT, Claude, Gemini, Grok.",
  keywords: [
    "ai prompts for marketers",
    "chatgpt prompts for marketers",
    "ai marketing prompts",
    "chatgpt copywriting prompts",
    "ai prompts for growth",
    "ai ad copy prompts",
    "ai landing page prompts",
    "ai social media prompts",
    "ai prompts for content marketing",
    "viral hook generator",
  ],
  alternates: { canonical: "/prompts-for-marketers" },
  openGraph: {
    title: "AI Prompts for Marketers — Templates for Ads, Copy, Hooks & Personas",
    description:
      "Ad copy, landing pages, personas, viral hooks, algorithm-aware posts. Works with every major AI.",
    url: "https://fixaiprompt.com/prompts-for-marketers",
    type: "website",
  },
};

export default function Page() {
  return (
    <UseCaseLandingPage
      slug="prompts-for-marketers"
      audience="Marketers"
      audienceFull="marketers and growth teams"
      title="AI Prompts for Marketers"
      description="Free AI prompts for ad copy, landing pages, personas, viral hooks, and growth experiments."
      heroH1={
        <>
          AI prompts for{" "}
          <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-violet-300 bg-clip-text text-transparent">
            marketers
          </span>{" "}
          who hate buzzwords.
        </>
      }
      heroBlurb={
        <>
          Every marketing template here bans the buzzwords (
          <em className="text-ink-fade">revolutionize, leverage, empower, seamless, cutting-edge</em>
          ), forces concrete proof points, and writes for a specific buyer
          persona instead of the universe. Plus an Algorithm Whisperer that
          reverse-engineers reach per platform. Free, no signup.
        </>
      }
      templateSlugs={[
        "high-ctr-headlines",
        "landing-page-copy",
        "cold-outreach-email",
        "viral-hook-generator",
        "customer-persona-builder",
        "linkedin-post-writer",
        "carousel-post-writer",
        "tweet-rewriter",
        "algorithm-whisperer",
      ]}
      pains={[
        {
          problem: "Headlines from AI all sound the same and underperform on CTR.",
          solution: "Generate 10 with explicit distinct mechanics (contrarian, specific number, identity hook, curiosity gap, problem framing). Then pick the top 3 with one-line justification.",
          templateSlug: "high-ctr-headlines",
        },
        {
          problem: "Landing page copy reads like every other B2B SaaS — 'revolutionize your workflow'.",
          solution: "Banned-words list + customer's actual pain + one measurable proof point + 6-word headline cap. Output is shippable.",
          templateSlug: "landing-page-copy",
        },
        {
          problem: "Cold outreach emails get ignored — feel generic + 200 words long.",
          solution: "Force a specific observation as opener + sub-90-word body + soft yes/no ask. Goal is the meeting, not the sale.",
          templateSlug: "cold-outreach-email",
        },
        {
          problem: "Customer personas are useless 12-page docs — nobody on the team remembers them.",
          solution: "One-line summary + day-in-life timestamps + 3 verbatim pains + trigger event + the objection that kills the deal. Actionable in 5 minutes.",
          templateSlug: "customer-persona-builder",
        },
        {
          problem: "Posted on LinkedIn 5x and got 12 likes. No idea why.",
          solution: "Algorithm Whisperer reverse-engineers the signals the platform reads, predicts above/at/below baseline, and gives you 3 specific edits.",
          templateSlug: "algorithm-whisperer",
        },
        {
          problem: "Need 30 viral hooks for short-form video and can't think of one.",
          solution: "Generate 10 hooks across 3 mechanisms (contrarian / curiosity / specificity). Each implies the payoff without spoiling it.",
          templateSlug: "viral-hook-generator",
        },
      ]}
      faqs={[
        {
          q: "Which AI is best for marketing copy?",
          a: "For long-form (landing pages, blog posts, email sequences): Claude Sonnet 3.5 has the least 'AI voice'. For short-form social hooks: ChatGPT or Grok. For data-heavy customer personas: Gemini 1.5 Pro can ingest entire research docs in one shot.",
        },
        {
          q: "Are these AI marketing prompts free?",
          a: "Yes. Every tool on FixAIPrompt is free, browser-only, and requires no signup or API key.",
        },
        {
          q: "Will these prompts get me past AI-content detection?",
          a: "AI-content detectors are unreliable across the board, but the goal of these templates isn't to fool a detector — it's to produce copy that actually performs. Banned-words lists, specific proof points, and concrete customer personas all push output away from generic AI voice.",
        },
        {
          q: "Can I use these in HubSpot / Mailchimp / Notion?",
          a: "Yes — every template outputs plain text or markdown. Copy and paste into any tool. The npx fixaiprompt CLI also lets you script this in any pipeline.",
        },
        {
          q: "What's the best AI prompt for viral hooks?",
          a: "The Viral Hook Generator template generates 10 hooks across 3 distinct mechanisms (contrarian, curiosity gap, specific number) so every variant is structurally different. After that, the Algorithm Whisperer template tells you which mechanism your platform's algorithm is currently favoring.",
        },
        {
          q: "How do I run growth experiments with AI prompts?",
          a: "Use the Prompt Diff tool to A/B two variants and the Tournament Pairwise Ranking template to compare 5+ candidates pairwise. Both work for headlines, ad copy, subject lines, and CTAs.",
        },
      ]}
    />
  );
}
