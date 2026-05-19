import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("chain-of-thought-prompting-practical-guide")!;

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
    q: "What is Chain-of-Thought prompting?",
    a: "Chain-of-Thought (CoT) is a prompting technique where you instruct the model to show its reasoning step by step before giving a final answer. It dramatically improves accuracy on multi-step problems — arithmetic, logic, planning — because the model uses the reasoning tokens to ground the answer.",
  },
  {
    q: "Does 'Let's think step by step' really work?",
    a: "Yes, but the structured version works better. Zero-shot CoT (just appending \"Let's think step by step\") gives a modest boost. Scaffolded CoT (\"First state what you know, then what you don't, then bridge them, then check\") gives a much bigger one. Our Chain-of-Thought template uses the scaffolded version.",
  },
  {
    q: "When should I NOT use Chain-of-Thought?",
    a: "On simple factual lookups (\"What's the capital of France?\"), on short creative tasks where reasoning flattens the prose, and on token-budget-sensitive flows where the extra reasoning tokens cost more than the accuracy gain. Save CoT for problems with more than one logical step.",
  },
  {
    q: "Is CoT the same as 'reasoning models' like o1?",
    a: "Closely related. Models like OpenAI's o1 and Claude's extended-thinking mode run CoT internally and only show you the final answer. CoT prompting is the manual version — works on every model, costs more tokens, but you see the reasoning.",
  },
];

export default function Page() {
  return (
    <BlogPostLayout post={post} faqs={faqs}>
      <p>
        Chain-of-Thought (CoT) prompting is the single highest-ROI move in
        prompt engineering. It&apos;s a one-line addition that turns a
        confidently-wrong answer into a correct one on multi-step problems —
        without changing the model or the rest of the prompt.
      </p>
      <p>
        This guide covers: what it is, when it works, when it doesn&apos;t,
        and 6 real before/after examples across coding, math, decisions, and
        writing.
      </p>

      <h2 className="mt-10 text-2xl font-bold">What CoT actually is</h2>
      <p>
        Instead of asking the model to answer directly, you instruct it to{" "}
        <em>show its reasoning</em> step by step first, then give the final
        answer. The reasoning tokens condition the final answer on more
        deliberate context — essentially making the model &ldquo;think out
        loud&rdquo; before committing.
      </p>

      <p>
        The simplest form is the famous &ldquo;Let&apos;s think step by step&rdquo;
        suffix. The scaffolded form forces specific stages: restate the
        problem → list what&apos;s known → list what&apos;s unknown → state
        the bridge → walk the steps → sanity-check → answer. The scaffolded
        version is what we use in our{" "}
        <Link href="/templates/chain-of-thought-reasoning" className="text-accent-glow hover:underline">
          interactive CoT template
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-bold">When CoT actually helps</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Multi-step math, word problems, unit conversions.</li>
        <li>Logic puzzles, deductive reasoning, classification with edge cases.</li>
        <li>Code debugging — &ldquo;trace through this function&rdquo; before suggesting a fix.</li>
        <li>Decision analysis — comparing options against multiple criteria.</li>
        <li>Anywhere the model would otherwise jump to a confident but wrong answer.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold">When CoT hurts (or wastes tokens)</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Simple factual lookups — reasoning adds noise, not signal.</li>
        <li>Creative writing — explicit reasoning can flatten voice.</li>
        <li>Long-context tasks where token budget is tight.</li>
        <li>Tasks the model already does correctly without it.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold">6 before/after examples</h2>

      <h3 className="mt-6 text-lg font-semibold">1. Math word problem</h3>
      <p><strong>Before</strong>:</p>
      <pre className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink-dim">
{`A bakery sells 3 muffins for $5 and 5 cookies for $4. If I have $30 and want a 2:1 muffin-to-cookie ratio by count, how many of each can I buy? Maximize total items.`}
      </pre>
      <p><strong>After</strong> — wrap with CoT scaffolding:</p>
      <pre className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink">
{`Solve step by step. Do not jump to the answer.

1. Restate the problem in your own words.
2. List the constraints (budget, ratio, item counts).
3. Define variables.
4. Set up the equations.
5. Solve.
6. Verify with substitution.
7. State the answer.

A bakery sells 3 muffins for $5 and 5 cookies for $4 ...`}
      </pre>
      <p>
        Without CoT, GPT-4 and Claude both occasionally get this wrong (off by
        one or two items). With scaffolded CoT, both get it right consistently.
      </p>

      <h3 className="mt-6 text-lg font-semibold">2. Code debug</h3>
      <p><strong>Before</strong>: &ldquo;Find the bug in this code.&rdquo;</p>
      <p><strong>After</strong>: &ldquo;Trace through this function with the
      following input. State each variable&apos;s value after each line.
      Then identify where the actual output diverges from the expected
      output. Then explain the root cause. Then suggest a fix.&rdquo;</p>
      <p>
        Forcing the trace step catches subtle off-by-one and state-mutation
        bugs that &ldquo;find the bug&rdquo; misses.
      </p>

      <h3 className="mt-6 text-lg font-semibold">3. Decision analysis</h3>
      <p><strong>Before</strong>: &ldquo;Should I take this job offer?&rdquo;</p>
      <p><strong>After</strong>: &ldquo;Walk through this in order. (1) What are the explicit pros? (2) What are the explicit cons? (3) What&apos;s the opportunity cost? (4) What&apos;s the reversibility — can I un-take this? (5) What do I assume? (6) What would change my answer? (7) Recommendation + confidence.&rdquo;</p>

      <h3 className="mt-6 text-lg font-semibold">4. Classification with edge cases</h3>
      <p><strong>Before</strong>: &ldquo;Classify this customer message: billing / technical / feature request.&rdquo;</p>
      <p><strong>After</strong>: &ldquo;For this customer message: (1) Restate the literal complaint in 1 sentence. (2) Identify any sub-issues. (3) Match each to the closest category. (4) If multiple match, explain the precedence rule. (5) Final classification + confidence.&rdquo;</p>

      <h3 className="mt-6 text-lg font-semibold">5. Comparison / tradeoff</h3>
      <p><strong>Before</strong>: &ldquo;Compare React and Vue for our project.&rdquo;</p>
      <p><strong>After</strong>: &ldquo;Step through 5 dimensions: (1) developer experience, (2) hiring pool, (3) bundle size, (4) ecosystem maturity, (5) future-proofing. For each, state what we know vs what we assume. End with a recommendation tied to specific project constraints.&rdquo;</p>

      <h3 className="mt-6 text-lg font-semibold">6. Self-check on a written draft</h3>
      <p><strong>Before</strong>: &ldquo;Is this email professional?&rdquo;</p>
      <p><strong>After</strong>: &ldquo;Read the email below. (1) Identify the tone in one phrase. (2) Find any phrase that could be misread. (3) Check for missing context the reader would need. (4) Check the ask is unambiguous. (5) Rate professionalism 1-10 with reasoning.&rdquo;</p>

      <h2 className="mt-10 text-2xl font-bold">Why CoT works (the boring real reason)</h2>
      <p>
        LLMs are autoregressive — each new token is conditioned on every
        token that came before. When the model generates reasoning tokens
        first, those tokens become the &ldquo;workspace&rdquo; the final answer
        token gets to use. The final answer is no longer the model&apos;s
        first instinct on the raw question; it&apos;s the model&apos;s
        considered answer after it&apos;s done some work.
      </p>
      <p>
        This is also why &ldquo;think harder&rdquo; doesn&apos;t help — the model
        can&apos;t think without writing tokens. Structuring the reasoning
        gives it more tokens to think with.
      </p>

      <h2 className="mt-10 text-2xl font-bold">Variants worth knowing</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <Link href="/glossary/tree-of-thoughts" className="text-accent-glow hover:underline">
            Tree-of-Thoughts (ToT)
          </Link>{" "}
          — generate 3 branches per decision point, evaluate each, prune.
          Better than linear CoT for high-stakes decisions.
        </li>
        <li>
          <Link href="/glossary/self-refine" className="text-accent-glow hover:underline">
            Self-Refine
          </Link>{" "}
          — generate → critique own output → revise. Loop 2-3 times. Roughly
          doubles output quality on creative tasks.
        </li>
        <li>
          <Link href="/glossary/self-consistency" className="text-accent-glow hover:underline">
            Self-Consistency
          </Link>{" "}
          — run the same CoT prompt N times with temperature &gt; 0, take
          the majority answer. Beats single-sample CoT on benchmarks.
        </li>
        <li>
          <Link href="/glossary/step-back-prompting" className="text-accent-glow hover:underline">
            Step-Back Prompting
          </Link>{" "}
          — abstract the general principle before answering the specific
          question. Better generalization, fewer hallucinations.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold">Try it in 30 seconds</h2>
      <p>
        Paste a multi-step problem into our{" "}
        <Link href="/templates/chain-of-thought-reasoning" className="text-accent-glow hover:underline">
          interactive Chain-of-Thought template
        </Link>{" "}
        — fill the placeholder, copy the result, paste into ChatGPT or
        Claude, and watch accuracy jump on whatever problem you&apos;re
        stuck on.
      </p>
      <p>
        Or use the{" "}
        <Link href="/fix" className="text-accent-glow hover:underline">
          Prompt Fixer
        </Link>{" "}
        — when it detects a multi-step task in your prompt, it auto-adds
        CoT scaffolding to the corrected version.
      </p>
    </BlogPostLayout>
  );
}
