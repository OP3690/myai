import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("how-to-write-better-chatgpt-prompts-2026")!;

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
    q: "What is the best ChatGPT prompt structure?",
    a: "Role + Task + Output Format + Length + Audience + (optional) Example + Anti-hallucination safeguard. This 6-part structure consistently outperforms any single-sentence prompt. Our auto-fixer applies it automatically based on the task type it detects.",
  },
  {
    q: "Should I always use Chain-of-Thought with ChatGPT?",
    a: "No. Chain-of-Thought shines on multi-step reasoning, math, and logic problems — but it burns extra tokens and can introduce errors on simple lookup questions. Use it when the task involves more than one logical step.",
  },
  {
    q: "How long should a ChatGPT prompt be?",
    a: "Long enough to be unambiguous, short enough to keep the actual task at the top. ~150–250 words is the sweet spot for most production prompts. Under 60 words is usually too vague; over 500 starts losing the model's attention.",
  },
  {
    q: "Do prompt-engineering tricks still matter on GPT-4o?",
    a: "Yes — the patterns matter more, not less. Instruction-tuned models like GPT-4o follow good prompts dramatically better, but they still fall back to generic answers when the prompt is generic. Role-setting, format spec, and examples are the highest-ROI moves on any GPT-4-class model.",
  },
  {
    q: "What's the worst mistake people make with ChatGPT prompts?",
    a: "Asking for both \"short\" and \"detailed\" in the same prompt. ChatGPT splits the difference and produces mediocre output for both. Our linter catches this contradiction automatically.",
  },
];

export default function Page() {
  return (
    <BlogPostLayout post={post} faqs={faqs}>
      <p>
        Most ChatGPT prompts are bad in a predictable way. They&apos;re vague where
        they should be specific, polite where they should be direct, and missing
        the four pieces of context that turn a one-line ask into a great
        answer. After analyzing thousands of prompts inside our{" "}
        <Link href="/fix" className="text-accent-glow hover:underline">Prompt Fixer</Link>,
        we&apos;ve seen the same patterns over and over. This guide is the
        condensed version.
      </p>

      <p>
        The patterns work on GPT-4, GPT-4o, and every future ChatGPT model.
        They also work on <Link href="/claude-prompts" className="text-accent-glow hover:underline">Claude</Link>,
        {" "}<Link href="/gemini-prompts" className="text-accent-glow hover:underline">Gemini</Link>,
        and{" "}<Link href="/grok-prompts" className="text-accent-glow hover:underline">Grok</Link> —
        just with slightly different syntax preferences.
      </p>

      <h2 className="mt-10 text-2xl font-bold">The 6-part structure that always works</h2>

      <p>
        Every great ChatGPT prompt has the same six parts. You don&apos;t need
        to include all six every time, but missing more than two of them is
        the single biggest cause of mediocre output.
      </p>

      <ol className="list-decimal space-y-3 pl-6">
        <li>
          <strong>Role</strong> — &ldquo;Act as a senior backend engineer who has shipped
          systems at scale.&rdquo; This is the highest-ROI move in prompt engineering.
          Specific roles beat generic ones (&ldquo;senior backend engineer&rdquo; beats
          &ldquo;expert&rdquo;).
        </li>
        <li>
          <strong>Task</strong> — the actual ask, stated as an imperative verb:
          &ldquo;Write...&rdquo;, &ldquo;Explain...&rdquo;, &ldquo;Compare...&rdquo;. Not &ldquo;Can you maybe
          help me with...&rdquo;.
        </li>
        <li>
          <strong>Output format</strong> — &ldquo;Return as a markdown table with
          columns A, B, C&rdquo;, or &ldquo;3 short paragraphs&rdquo;, or &ldquo;a JSON object with
          these exact keys&rdquo;. Without this, you get unpredictable structure.
        </li>
        <li>
          <strong>Length</strong> — &ldquo;Under 200 words&rdquo;, &ldquo;in 3 sentences&rdquo;.
          Hard numbers beat soft adjectives.
        </li>
        <li>
          <strong>Audience</strong> — &ldquo;For a senior product manager who doesn&apos;t
          know SQL.&rdquo; ChatGPT&apos;s default audience is &ldquo;internet generic&rdquo;.
          Naming the actual reader shifts vocabulary, depth, and analogies.
        </li>
        <li>
          <strong>Safeguard</strong> — &ldquo;If anything is ambiguous, ask before
          guessing.&rdquo; This single line cuts hallucinations dramatically.
        </li>
      </ol>

      <p>
        For non-trivial tasks, add a <strong>concrete example</strong> showing
        one input → desired output pair. Few-shot examples are the most reliable
        way to lock in the format you want.
      </p>

      <h2 className="mt-10 text-2xl font-bold">12 patterns that actually move the needle</h2>

      <h3 className="mt-6 text-lg font-semibold">1. Pin a specific role, not a generic one</h3>
      <p>
        &ldquo;Act as an expert&rdquo; beats nothing. &ldquo;Act as a senior security
        engineer who has shipped 3 incident response runbooks&rdquo; beats
        &ldquo;expert&rdquo;. The more specific the role, the more specific the answer.
      </p>

      <h3 className="mt-6 text-lg font-semibold">2. Demand a format up front</h3>
      <p>
        ChatGPT defaults to bulleted lists for almost everything. If you want
        a paragraph, a table, or a JSON object, say so. If you don&apos;t,
        you&apos;re going to reformat the output by hand.
      </p>

      <h3 className="mt-6 text-lg font-semibold">3. Use hard length constraints</h3>
      <p>
        &ldquo;Brief&rdquo; means nothing to a model trained on Wikipedia. &ldquo;Under 100
        words&rdquo; means exactly that. Same with &ldquo;in 3 bullets&rdquo; or
        &ldquo;2 sentences&rdquo;.
      </p>

      <h3 className="mt-6 text-lg font-semibold">4. Name the audience</h3>
      <p>
        &ldquo;Explain how vector embeddings work&rdquo; → average Wikipedia paragraph.
        &ldquo;Explain how vector embeddings work for a backend engineer who
        already uses Postgres&rdquo; → tailored Postgres analogies, skips the
        intro fluff.
      </p>

      <h3 className="mt-6 text-lg font-semibold">5. Show one concrete example (few-shot)</h3>
      <p>
        Few-shot prompting (&ldquo;Here&apos;s one example of input → output, now do
        this one&rdquo;) is the most reliable consistency-booster. Use 2–5
        examples for production prompts. See our{" "}
        <Link href="/glossary/few-shot-prompting" className="text-accent-glow hover:underline">
          glossary entry on Few-Shot Prompting
        </Link>
        {" "}for details.
      </p>

      <h3 className="mt-6 text-lg font-semibold">6. Force Chain-of-Thought for multi-step</h3>
      <p>
        For arithmetic, logic, or any task with more than one decision: add
        &ldquo;Think step by step before answering. State the reasoning, then
        the answer.&rdquo; This is{" "}
        <Link href="/glossary/chain-of-thought" className="text-accent-glow hover:underline">
          Chain-of-Thought prompting
        </Link>
        , and it&apos;s the single highest-ROI technique in modern prompt
        engineering.
      </p>

      <h3 className="mt-6 text-lg font-semibold">7. Pre-bake the anti-hallucination rule</h3>
      <p>
        Append: &ldquo;If you don&apos;t know something, say &lsquo;I don&apos;t know&rsquo; rather
        than making it up. If the question is ambiguous, ask before guessing.&rdquo;
        It feels redundant. It saves you from confidently wrong answers
        weekly.
      </p>

      <h3 className="mt-6 text-lg font-semibold">8. Use anti-patterns / forbidden words</h3>
      <p>
        Tell ChatGPT what NOT to do. &ldquo;Don&apos;t use the word &lsquo;leverage&rsquo;,
        &lsquo;empower&rsquo;, or &lsquo;cutting-edge&rsquo;.&rdquo; &ldquo;No emojis. No exclamation
        marks. No &lsquo;in conclusion&rsquo;.&rdquo; Anti-patterns close the output
        space more reliably than positive instructions widen it.
      </p>

      <h3 className="mt-6 text-lg font-semibold">9. Reset on contradictions</h3>
      <p>
        &ldquo;Short but detailed.&rdquo; &ldquo;Simple but technical.&rdquo; &ldquo;Formal but
        casual.&rdquo; All produce mush. Pick one side. If you really need both,
        explain the trade-off: &ldquo;Short, but if you skip a key detail flag
        it explicitly.&rdquo;
      </p>

      <h3 className="mt-6 text-lg font-semibold">10. Self-Refine for quality</h3>
      <p>
        &ldquo;Generate a draft. Then switch to a critical-editor voice and find
        3 specific weaknesses. Then revise. Repeat 2 more times.&rdquo; This
        roughly doubles output quality on creative tasks. See{" "}
        <Link href="/templates/self-refine-loop" className="text-accent-glow hover:underline">
          Self-Refine template
        </Link>
        .
      </p>

      <h3 className="mt-6 text-lg font-semibold">11. Multi-persona for high-stakes decisions</h3>
      <p>
        &ldquo;Simulate 5 different experts debating this question. Each has a
        distinct bias.&rdquo; Surfaces what a single-persona answer would have
        missed. Especially powerful for strategic or ethical questions. See{" "}
        <Link href="/templates/multi-persona-council" className="text-accent-glow hover:underline">
          Multi-Persona Council template
        </Link>
        .
      </p>

      <h3 className="mt-6 text-lg font-semibold">12. Adversarial review before shipping</h3>
      <p>
        Before you act on any AI output, ask the same model to attack it.
        &ldquo;Find the strongest argument against this. Find 3 things this gets
        wrong. Find the hidden assumption.&rdquo; Catches blind spots cheaply.
      </p>

      <h2 className="mt-10 text-2xl font-bold">7 anti-patterns to avoid</h2>

      <ol className="list-decimal space-y-2 pl-6">
        <li><strong>&ldquo;Can you please help me with...&rdquo;</strong> — vague filler that adds nothing.</li>
        <li><strong>&ldquo;Be creative&rdquo; without constraints</strong> — produces median creativity.</li>
        <li><strong>&ldquo;Make it good&rdquo;</strong> — &ldquo;good&rdquo; means nothing to a model.</li>
        <li><strong>Contradictions</strong> — &ldquo;short and detailed&rdquo; etc.</li>
        <li><strong>No format spec</strong> — defaults to bullets. Always.</li>
        <li><strong>No role</strong> — defaults to generic internet voice.</li>
        <li><strong>&ldquo;Thanks!&rdquo; at the end</strong> — burns tokens, helps nothing.</li>
      </ol>

      <h2 className="mt-10 text-2xl font-bold">Quick before/after</h2>

      <p><strong>Before</strong> (47 words, score 24/100):</p>
      <pre className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink-dim">
{`can you please help me write a blog post about ai it should be detailed but also short and engaging for general readers thanks`}
      </pre>

      <p><strong>After</strong> (auto-fixed in 1 click, score 99/100):</p>
      <pre className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink">
{`Act as a sharp tech writer who hooks the reader in the first line and earns the rest.

Task: Write a blog post about AI.

Format: 3-5 short paragraphs with a hook line and no fluff.
Length: under 250 words.
Audience: general readers, intermediate (skip the obvious, but flag anything truly advanced).

If anything in this prompt is ambiguous, ask before guessing. If you don't know something, say "I don't know" rather than making it up.`}
      </pre>

      <p>
        Try it yourself in the{" "}
        <Link href="/fix" className="text-accent-glow hover:underline">
          Prompt Fixer
        </Link>
        . Paste any prompt — the auto-fixer applies every pattern in this
        article automatically based on the task type it detects.
      </p>

      <h2 className="mt-10 text-2xl font-bold">Where to go next</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <Link href="/templates" className="text-accent-glow hover:underline">
            58 prompt templates
          </Link>{" "}
          with interactive fill-in fields — including 27 advanced techniques
          (Chain-of-Thought, Tree-of-Thoughts, Self-Refine, Multi-Persona,
          Pre-Mortem, Adversarial Red-Team).
        </li>
        <li>
          <Link href="/glossary" className="text-accent-glow hover:underline">
            16 prompt-engineering techniques explained
          </Link>{" "}
          — when to use, when not to, common pitfalls.
        </li>
        <li>
          <Link href="/blog/chatgpt-vs-claude-vs-gemini" className="text-accent-glow hover:underline">
            ChatGPT vs Claude vs Gemini comparison
          </Link>{" "}
          — which model handles what best.
        </li>
        <li>
          <Link href="/prompt-iq" className="text-accent-glow hover:underline">
            Take the 60-second Prompt IQ test
          </Link>{" "}
          — see how your prompt-engineering skills stack up.
        </li>
      </ul>
    </BlogPostLayout>
  );
}
