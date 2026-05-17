import type { Metadata } from "next";
import { ModelLandingPage } from "@/components/ModelLandingPage";

export const metadata: Metadata = {
  title: "Grok Prompts — Free Generator + Templates for xAI's Grok",
  description:
    "Free Grok prompt generator and library. 58 hand-curated prompts with interactive fill-in fields, tuned for Grok's direct, irreverent voice. No API key, no signup.",
  keywords: [
    "grok prompts",
    "grok ai prompts",
    "xai grok prompts",
    "grok prompt generator",
    "best grok prompts",
    "grok 3 prompts",
    "how to prompt grok",
    "grok prompt examples",
    "x ai grok",
  ],
  alternates: { canonical: "/grok-prompts" },
  openGraph: {
    title: "Grok Prompts — Free Generator + Templates for xAI's Grok",
    description:
      "Free Grok prompt generator. 58 templates. Tuned for Grok's direct, slightly irreverent voice.",
    url: "https://fixaiprompt.com/grok-prompts",
    type: "website",
  },
};

export default function Page() {
  return (
    <ModelLandingPage
      slug="grok-prompts"
      model="Grok"
      modelFull="xAI's Grok"
      title="Grok Prompts — Free Generator + Templates for xAI's Grok"
      description="Free Grok prompt generator and library. Templates tuned for Grok's direct, slightly irreverent voice."
      heroH1={
        <>
          Grok prompts with{" "}
          <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-violet-300 bg-clip-text text-transparent">
            the right voice
          </span>
          .
        </>
      }
      heroBlurb={
        <>
          Grok has a different default register than ChatGPT or Claude — it
          rewards <strong className="text-ink">direct, slightly irreverent</strong>
          {" "}prompts and over-rewards verbose corporate framing. The Prompt
          Fixer&apos;s Grok target keeps instructions short and punchy. Plus 58
          template prompts you can fill in and ship. Free, no signup.
        </>
      }
      featuredTemplateSlugs={[
        "viral-hook-generator",
        "tweet-rewriter",
        "roast-my-resume",
        "roast-my-prompt",
        "adversarial-red-team",
        "personality-forensics",
      ]}
      tips={[
        {
          title: "Be direct, skip the niceties",
          body: 'Grok rewards "Do X. Format as Y." better than "Could you please help me with X if possible?" Verbose corporate framing is a tell — and it shows in the output.',
        },
        {
          title: "Lean into its voice",
          body: "Grok is comfortable with humor, contrarian takes, and casual register. If your task allows it, name the voice explicitly: \"slightly snarky\", \"deadpan\", \"contrarian\".",
        },
        {
          title: "It still benefits from a role",
          body: '"Act as a senior X" works on Grok exactly like every other LLM. Don\'t skip the role just because Grok feels casual.',
        },
        {
          title: "Specify the social-media context",
          body: "Grok was trained heavily on X/Twitter content. For posts/threads/replies, mentioning the target platform shifts the output toward the right format.",
        },
        {
          title: "Use the Roast templates",
          body: 'The "Roast My Prompt" and "Roast My Resume" templates were tuned for Grok\'s strengths — dry, observational, useful. Give them a shot.',
        },
        {
          title: "Algorithm Whisperer for reach",
          body: "The Algorithm Whisperer template reverse-engineers reach signals per platform. Especially powerful when paired with Grok's social-savvy training.",
        },
      ]}
      faqs={[
        {
          q: "What makes a Grok prompt different from a ChatGPT prompt?",
          a: 'Grok handles direct phrasing and humor better than ChatGPT, but doesn\'t need extra structure to follow instructions. Our Prompt Fixer\'s Grok target keeps the format tight and avoids over-padding the prompt with safety preambles ChatGPT users sometimes add reflexively.',
        },
        {
          q: "Are these Grok prompts free?",
          a: "Yes, every tool on FixAIPrompt is free, browser-only, and works without an API key or signup.",
        },
        {
          q: "Do these prompts work for X/Twitter content?",
          a: "Especially well. Grok was trained heavily on X content, so prompts for tweets, threads, replies, and viral hooks consistently produce on-platform output. The Viral Hook Generator, Tweet Rewriter, and Thread-from-Article templates are tuned for this.",
        },
        {
          q: "Can I share filled Grok templates?",
          a: 'Yes — each template page has a "Copy share link" button that encodes your filled fields into the URL. Anyone you send the link to sees the prompt pre-filled.',
        },
        {
          q: "What's the best Grok prompt for roasting / criticism?",
          a: "Adversarial Red-Team, Roast My Prompt, Roast My Resume, and Personality Forensics — all four lean into Grok's irreverent voice while still delivering useful output. They're under /templates with the 🔥 Viral tag.",
        },
      ]}
    />
  );
}
