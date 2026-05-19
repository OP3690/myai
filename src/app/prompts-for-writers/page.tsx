import type { Metadata } from "next";
import { UseCaseLandingPage } from "@/components/UseCaseLandingPage";

export const metadata: Metadata = {
  title:
    "AI Prompts for Writers — ChatGPT, Claude & Gemini Templates That Don't Sound AI",
  description:
    "Free AI prompt library for writers, copywriters, and content creators. Templates for blog posts, emails, social posts, headlines, threads, and more — tuned to avoid the AI-voice tells. Works with ChatGPT, Claude, and Gemini.",
  keywords: [
    "ai prompts for writers",
    "chatgpt prompts for writers",
    "claude prompts for writers",
    "ai writing prompts",
    "best ai prompts for content",
    "chatgpt copywriting prompts",
    "ai blog post prompts",
    "ai email prompts",
    "ai twitter prompts",
    "ai linkedin prompts",
  ],
  alternates: { canonical: "/prompts-for-writers" },
  openGraph: {
    title: "AI Prompts for Writers — Templates That Don't Sound Like AI",
    description:
      "Blog, email, headline, thread, carousel prompts that produce real voice. Works with ChatGPT, Claude, Gemini.",
    url: "https://fixaiprompt.com/prompts-for-writers",
    type: "website",
  },
};

export default function Page() {
  return (
    <UseCaseLandingPage
      slug="prompts-for-writers"
      audience="Writers"
      audienceFull="writers, copywriters, and content creators"
      title="AI Prompts for Writers"
      description="Free prompt templates for blog, email, headlines, threads, and copy that doesn't sound like AI."
      heroH1={
        <>
          AI prompts for{" "}
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300 bg-clip-text text-transparent">
            writers
          </span>{" "}
          who don&apos;t want it to sound like AI.
        </>
      }
      heroBlurb={
        <>
          Every template here bans the dead giveaways — &ldquo;leverage&rdquo;,
          &ldquo;empower&rdquo;, &ldquo;cutting-edge&rdquo;, &ldquo;in conclusion&rdquo; —
          and forces concrete openers, specific examples, and a clear point.
          Templates for blog posts, emails, headlines, threads, carousels,
          and YouTube scripts. Free, no signup.
        </>
      }
      templateSlugs={[
        "viral-hook-generator",
        "tweet-rewriter",
        "youtube-script-writer",
        "carousel-post-writer",
        "thread-from-article",
        "professional-email-writer",
        "linkedin-post-writer",
        "high-ctr-headlines",
        "landing-page-copy",
      ]}
      pains={[
        {
          problem: "Every blog post sounds like ChatGPT wrote it — generic, fluffy, full of em-dashes.",
          solution: "Ban the tell-tale phrases, demand a specific opening line (scene/stat/contrarian claim), and constrain length.",
          templateSlug: "youtube-script-writer",
        },
        {
          problem: "Email replies sound corporate — 'I hope this finds you well' energy.",
          solution: "Strip the filler, force one clear ask, hit a specific tone (warm but direct).",
          templateSlug: "professional-email-writer",
        },
        {
          problem: "LinkedIn posts read like LinkedIn — motivational mush, no specific insight.",
          solution: "Open with a number/scene/contrarian claim. No emojis. No 'thoughts?'. End with the insight stated plainly.",
          templateSlug: "linkedin-post-writer",
        },
        {
          problem: "Headlines from AI all feel the same — 'The Ultimate Guide to X'.",
          solution: "Generate 10 with explicit mechanic labels (contrarian / specific number / curiosity / identity hook) so every variant is distinct.",
          templateSlug: "high-ctr-headlines",
        },
        {
          problem: "Twitter threads read like ChatGPT cosplaying a thread-bro.",
          solution: "Each tweet must stand alone, no 'continued in next', no 🧵 preamble, no 'like and follow'.",
          templateSlug: "thread-from-article",
        },
        {
          problem: "Landing page copy that 'revolutionizes the workflow' and 'empowers users to leverage AI'.",
          solution: "Banned-words list + specific customer problem + measurable proof point.",
          templateSlug: "landing-page-copy",
        },
      ]}
      faqs={[
        {
          q: "Will these prompts make AI writing undetectable?",
          a: "Not the goal. The goal is to make the writing actually good — specific, voice-driven, opinion-having. Modern AI detectors are unreliable anyway. Write something a reader would share.",
        },
        {
          q: "What words do these templates ban?",
          a: 'The usual AI tells: "leverage", "empower", "synergy", "revolutionize", "cutting-edge", "seamless", "in conclusion", "delve", "tapestry", "navigate the landscape", "in today\'s fast-paced world". You can add your own banned list in any template.',
        },
        {
          q: "Are these prompts free?",
          a: "Yes, every tool on FixAIPrompt is free, browser-only, and works without an API key.",
        },
        {
          q: "Which AI is best for writing — ChatGPT, Claude, or Gemini?",
          a: 'For long-form writing with the least "AI voice", Claude Sonnet 3.5 wins. For short social copy, ChatGPT and Grok are both good. For SEO-targeted blog posts, Claude or GPT-4o. See our full comparison at /blog/chatgpt-vs-claude-vs-gemini.',
        },
        {
          q: "Can I see what the AI thinks of MY writing voice?",
          a: 'Yes — the AI Personality Forensics template at /templates/personality-forensics reads 3 of your writing samples for HOW vs what, and produces an uncomfortably-accurate voice profile.',
        },
      ]}
    />
  );
}
