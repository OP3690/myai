import type { Metadata } from "next";
import { UseCaseLandingPage } from "@/components/UseCaseLandingPage";

export const metadata: Metadata = {
  title:
    "AI Prompts for Students — ChatGPT & Claude Templates for Studying",
  description:
    "Free AI prompts for students. Tutoring templates that explain (don't solve), quiz drills, exam revision plans, language-practice partners, and homework helpers — designed to make you smarter, not lazier. Works with ChatGPT, Claude, Gemini.",
  keywords: [
    "ai prompts for students",
    "chatgpt prompts for students",
    "claude prompts for students",
    "best ai prompts for studying",
    "chatgpt for homework",
    "ai tutor prompts",
    "ai exam prep prompts",
    "language learning ai prompts",
    "ai prompts for school",
  ],
  alternates: { canonical: "/prompts-for-students" },
  openGraph: {
    title: "AI Prompts for Students — Smarter, Not Lazier",
    description:
      "Tutoring prompts that explain instead of solve. Quiz drills, exam revision, language practice. Free.",
    url: "https://fixaiprompt.com/prompts-for-students",
    type: "website",
  },
};

export default function Page() {
  return (
    <UseCaseLandingPage
      slug="prompts-for-students"
      audience="Students"
      audienceFull="high-school and university students"
      title="AI Prompts for Students"
      description="Free AI prompts for studying that make you smarter, not lazier. Tutoring, quizzes, exam prep, language."
      heroH1={
        <>
          AI prompts for{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
            students
          </span>{" "}
          who want to actually learn.
        </>
      }
      heroBlurb={
        <>
          Every template here is built around{" "}
          <strong className="text-ink">explain, don&apos;t solve</strong>. The AI
          tutors you step-by-step, quizzes you until you master a topic, helps
          you make a revision plan, and corrects your language mistakes — but
          never just hands you the answer. Free, no signup.
        </>
      }
      templateSlugs={[
        "step-by-step-math-solver",
        "quiz-me-until-i-master-it",
        "explain-like-im-5",
        "exam-revision-generator",
        "language-conversation-partner",
        "chain-of-thought-reasoning",
        "step-back-prompt",
        "personality-forensics",
      ]}
      pains={[
        {
          problem: "I asked ChatGPT for help with a math problem and it just gave me the answer. I learned nothing.",
          solution: "Use the step-by-step solver — forces the AI to teach the method, not just compute. Each step states the goal, the math, and the why.",
          templateSlug: "step-by-step-math-solver",
        },
        {
          problem: "I'm cramming for an exam and don't know where to start.",
          solution: "Paste your syllabus + available study time. Get a day-by-day revision plan with weakest topics double-passed and a 1-page cheat-sheet outline.",
          templateSlug: "exam-revision-generator",
        },
        {
          problem: "I read a topic but can't tell if I actually understand it.",
          solution: "The Quiz Me Until I Master It template drills you with adaptive questions and re-asks weak sub-topics until you get them right twice in a row.",
          templateSlug: "quiz-me-until-i-master-it",
        },
        {
          problem: "I'm learning Spanish/Japanese/French and need conversation practice but I'm shy.",
          solution: "Set up a language-partner AI that only replies in the target language, corrects you in English after each message, and runs a topic-based scenario.",
          templateSlug: "language-conversation-partner",
        },
        {
          problem: "I don't understand a concept no matter how many times I read the textbook.",
          solution: "Use Explain Like I'm 5 — forces an everyday analogy, no jargon, and ends with a follow-up question to extend the lesson.",
          templateSlug: "explain-like-im-5",
        },
        {
          problem: "I have a hard physics problem and I keep getting it wrong.",
          solution: "Step-Back prompting forces the AI to derive the general principle first, then apply it to your specific case. Catches the formula-recall mistakes.",
          templateSlug: "step-back-prompt",
        },
      ]}
      faqs={[
        {
          q: "Is using ChatGPT for homework cheating?",
          a: "Depends on the assignment and how you use it. Using it as a tutor (explain the method, quiz me, check my work) is the same as using a private tutor — most schools allow it. Using it to hand in answers as your own is cheating. Our templates default to the tutor mode.",
        },
        {
          q: "Which AI is best for studying?",
          a: 'For step-by-step explanations: Claude Sonnet 3.5. For long PDFs (textbooks, papers): Gemini 1.5 Pro\'s 1M context. For quick chat-style help: ChatGPT. All three work with our templates.',
        },
        {
          q: "Are these AI prompts free?",
          a: "Yes — every tool on FixAIPrompt is free, browser-only, no signup, no API key. Open any template, fill in your scenario, copy the result into your AI of choice.",
        },
        {
          q: "Can I use these in any language?",
          a: 'Yes — the prompts themselves are in English, but you can ask the AI to respond in any language. The Language Conversation Partner template is built around this.',
        },
        {
          q: "How do I stop ChatGPT from just giving me the answer?",
          a: 'The Step-by-Step Math Solver template explicitly forbids it: "For each step: state the goal, show the math, explain why. Do not skip any step, even obvious ones." The AI obeys.',
        },
        {
          q: "Can I share a filled template with my study group?",
          a: 'Yes — every template page has a "Copy share link" button that encodes the filled values into a URL. Send the link and your study group sees the prompt pre-filled.',
        },
      ]}
    />
  );
}
