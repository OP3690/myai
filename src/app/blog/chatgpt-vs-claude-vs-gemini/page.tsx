import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("chatgpt-vs-claude-vs-gemini")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://fixaiprompt.com/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  },
};

const faqs = [
  {
    q: "Which AI model is best overall in 2026?",
    a: "There is no universal winner. Claude Sonnet 3.5/Opus is the best general-purpose model for thinking-heavy tasks (analysis, writing, code review). GPT-4o is the best for general chat and multimodal. Gemini 1.5 Pro is the best for very long context (1M tokens). Pick based on the task — our comparison table below covers 7 dimensions.",
  },
  {
    q: "Is Claude better than ChatGPT?",
    a: "For long-form writing, code review, multi-step reasoning, and refusing to fabricate citations — yes. For raw speed, multimodal, ecosystem integrations, and casual chat — ChatGPT (especially GPT-4o) is hard to beat. Both are excellent.",
  },
  {
    q: "Is Gemini 1.5 Pro worth using?",
    a: "If you have very long documents (50k+ tokens) and need them all in one shot — yes, the 1M-token context is unmatched. For short conversational tasks, Gemini lags slightly behind Claude and GPT-4o in instruction-following. Improving fast.",
  },
  {
    q: "Do I need to write different prompts for each model?",
    a: "The content is identical; the syntax differs. Claude prefers XML tags, ChatGPT prefers markdown headings, Gemini prefers tight bullets. Our auto-fixer renders the same input in all three styles — switch tabs to see each version.",
  },
  {
    q: "Which model is cheapest?",
    a: "As of 2026: Gemini 1.5 Flash and Claude Haiku are the cheapest, ~10x cheaper than the flagship models. GPT-4o-mini is also extremely cheap. Use the flagships for hard tasks, the cheap variants for high-volume work.",
  },
];

export default function Page() {
  return (
    <BlogPostLayout post={post} faqs={faqs}>
      <p>
        Every &ldquo;which AI is best&rdquo; article on the internet is wrong because
        it picks one winner. The honest answer is: each of the three
        flagship models has tasks it&apos;s best at and tasks it&apos;s mediocre at.
        Here&apos;s the working comparison after a year of shipping production
        AI features with all three.
      </p>

      <p>
        TL;DR — use Claude for thinking-heavy work, ChatGPT for general
        chat + multimodal + ecosystem, Gemini for very long context. Try
        all three on the same task with our{" "}
        <Link href="/prompt-diff" className="text-accent-glow hover:underline">
          Prompt Diff tool
        </Link>{" "}
        and the answer for your specific use case becomes obvious in 60
        seconds.
      </p>

      <h2 className="mt-10 text-2xl font-bold">The headline comparison</h2>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-ink-fade">
              <th className="py-2 pr-3">Dimension</th>
              <th className="py-2 pr-3">ChatGPT (GPT-4o)</th>
              <th className="py-2 pr-3">Claude (Sonnet 3.5 / Opus)</th>
              <th className="py-2">Gemini (1.5 Pro)</th>
            </tr>
          </thead>
          <tbody className="text-ink-dim">
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 font-medium text-ink">Long-form writing</td>
              <td className="py-2 pr-3">Strong</td>
              <td className="py-2 pr-3 text-emerald-300">Best — less &ldquo;AI voice&rdquo;</td>
              <td className="py-2">Good</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 font-medium text-ink">Code generation</td>
              <td className="py-2 pr-3">Excellent (esp. with tools)</td>
              <td className="py-2 pr-3 text-emerald-300">Best — code review + refactor</td>
              <td className="py-2">Strong on TS/Python</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 font-medium text-ink">Multi-step reasoning</td>
              <td className="py-2 pr-3">Strong</td>
              <td className="py-2 pr-3 text-emerald-300">Best — &ldquo;think step by step&rdquo;</td>
              <td className="py-2">Strong</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 font-medium text-ink">Multimodal (image / audio)</td>
              <td className="py-2 pr-3 text-emerald-300">Best — voice mode is unmatched</td>
              <td className="py-2 pr-3">Strong (images)</td>
              <td className="py-2">Strong (native multimodal)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 font-medium text-ink">Context window</td>
              <td className="py-2 pr-3">128k</td>
              <td className="py-2 pr-3">200k (Opus: 1M)</td>
              <td className="py-2 text-emerald-300">1M — best for long docs</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 font-medium text-ink">Refusal accuracy</td>
              <td className="py-2 pr-3">Sometimes over-refuses</td>
              <td className="py-2 pr-3 text-emerald-300">Best — won&apos;t fabricate when uncertain</td>
              <td className="py-2">Variable</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-medium text-ink">Speed + price</td>
              <td className="py-2 pr-3 text-emerald-300">Fastest tier (GPT-4o-mini)</td>
              <td className="py-2 pr-3">Haiku is cheap; Sonnet mid</td>
              <td className="py-2">Flash is the cheapest</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-2xl font-bold">When to use ChatGPT</h2>
      <p>
        <strong>Pick ChatGPT (GPT-4o) when:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>You need voice mode or real-time multimodal input.</li>
        <li>You&apos;re using the broader OpenAI ecosystem (Assistants, function calling, Code Interpreter).</li>
        <li>Speed matters more than depth — GPT-4o is fast.</li>
        <li>You need image generation in the same conversation.</li>
        <li>You&apos;re building a consumer-facing chat product (the brand is familiar).</li>
      </ul>
      <p>
        Format prompts for ChatGPT with markdown headings:{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">## Task</code>,{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">## Output format</code>,{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">## Constraints</code>.
        See our{" "}
        <Link href="/chatgpt-prompts" className="text-accent-glow hover:underline">
          ChatGPT prompts guide
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-bold">When to use Claude</h2>
      <p>
        <strong>Pick Claude (Sonnet 3.5, Opus) when:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Quality of output matters more than speed.</li>
        <li>You&apos;re doing serious writing, editing, or analysis.</li>
        <li>You need code review or refactoring (Claude is the best code reviewer).</li>
        <li>You can&apos;t tolerate fabricated citations or facts.</li>
        <li>You want multi-step reasoning — Claude is especially good at Chain-of-Thought.</li>
      </ul>
      <p>
        Format prompts for Claude with XML tags:{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">&lt;role&gt;</code>,{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">&lt;task&gt;</code>,{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">&lt;output_format&gt;</code>,{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-glow">&lt;constraints&gt;</code>.
        See our{" "}
        <Link href="/claude-prompts" className="text-accent-glow hover:underline">
          Claude prompts guide
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-bold">When to use Gemini</h2>
      <p>
        <strong>Pick Gemini (1.5 Pro) when:</strong>
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>You have very long input (50k+ tokens) — books, long codebases, hour-long transcripts.</li>
        <li>You need the cheapest fast model (Gemini Flash).</li>
        <li>You&apos;re already in the Google Workspace ecosystem.</li>
        <li>You&apos;re doing video understanding (Gemini handles it natively).</li>
        <li>Cost-per-token matters at scale.</li>
      </ul>
      <p>
        Format prompts for Gemini with tight bulleted lines: &ldquo;Role: ...&rdquo;,
        &ldquo;Task: ...&rdquo;, &ldquo;Output: ...&rdquo;. See our{" "}
        <Link href="/gemini-prompts" className="text-accent-glow hover:underline">
          Gemini prompts guide
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-bold">How to test on YOUR task</h2>
      <p>
        Generic benchmarks are misleading. The only test that matters is
        your task on the model you&apos;d actually use. Our{" "}
        <Link href="/prompt-diff" className="text-accent-glow hover:underline">
          Prompt Diff tool
        </Link>{" "}
        scores any two prompts side-by-side on 5 metrics — paste your prompt
        in both Claude-format and ChatGPT-format, see which scores higher.
      </p>
      <p>
        Or use the{" "}
        <Link href="/fix" className="text-accent-glow hover:underline">
          Prompt Fixer
        </Link>{" "}
        to render the same prompt in all three syntaxes — switch tabs
        between Claude/ChatGPT/Gemini in the corrected-prompt preview.
        Copy each version into the respective chat and compare outputs.
      </p>

      <h2 className="mt-10 text-2xl font-bold">What about Grok?</h2>
      <p>
        Grok (xAI) is the dark-horse fourth model worth knowing. It handles
        casual, irreverent, and contrarian framings better than any of the
        big three. For social-media content, roasts, and contrarian-takes
        prompts, Grok often outperforms even Claude. For serious analysis,
        the big three still win. See our{" "}
        <Link href="/grok-prompts" className="text-accent-glow hover:underline">
          Grok prompts page
        </Link>
        {" "}for examples.
      </p>

      <h2 className="mt-10 text-2xl font-bold">My production stack (2026)</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong>Claude Sonnet 3.5</strong> for: code review, complex analysis, long-form writing, anything where quality matters.</li>
        <li><strong>GPT-4o-mini</strong> for: high-volume classification, intent detection, simple chat — cheap and fast.</li>
        <li><strong>Gemini 1.5 Flash</strong> for: long-document Q&A, transcript summarization.</li>
        <li><strong>Claude Haiku</strong> as a backup when GPT-4o-mini is being weird.</li>
      </ul>
      <p>
        No single model wins everything. Use the right model for the right
        task, and use the right prompt syntax for the right model.
      </p>
    </BlogPostLayout>
  );
}
