import type { Metadata } from "next";
import { ChunkerTool } from "@/components/ChunkerTool";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Layers, ListOrdered, Network, Scissors, Zap } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Free Prompt Chunker — Split Long Text for ChatGPT, Claude, Gemini & Grok",
  description:
    "The fastest prompt chunker for long text. Token-aware splitting with 9 model presets (GPT-4, GPT-4 Turbo, Claude 200k, Claude Opus 1M, Gemini 1.5 Pro 1M, Llama 3, Mistral). Plus a task decomposer for complex multi-step prompts. 100% browser-only.",
  keywords: [
    "prompt chunker",
    "ai prompt chunker",
    "text chunker",
    "token chunker",
    "split text for chatgpt",
    "split text for claude",
    "split text for gemini",
    "task decomposer",
    "prompt decomposition",
    "claude 200k context",
    "gemini 1m context",
    "long text llm",
  ],
  alternates: { canonical: "/chunker" },
};

export default function ChunkerPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Zap className="h-3 w-3 text-accent-glow" />
            Prompt Chunker · Free · 100% browser-only
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Split the{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              big stuff
            </span>{" "}
            into chunks AI can handle.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Two tools in one. <strong className="text-ink">Chunk long text</strong> into model-ready pieces with token-aware splitting and configurable overlap. Or <strong className="text-ink">decompose a complex prompt</strong> into a chain of focused sub-prompts that produce dramatically better results than a one-shot.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-dim">
            <Pill icon={Scissors} text="Token-aware splitting" />
            <span className="text-ink-fade">·</span>
            <Pill icon={Network} text="Smart task decomposition" />
            <span className="text-ink-fade">·</span>
            <Pill icon={Layers} text="9 model presets" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <ChunkerTool />
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Why chunking changes the answer
          </h2>
          <p className="mt-2 text-center text-ink-dim">
            Two patterns. Both proven in real-world AI work.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Block
              icon={<Scissors className="h-5 w-5 text-accent-glow" />}
              title="Text Chunker — for inputs that don't fit"
              body={
                <>
                  Long transcripts, contracts, research papers, log files. Pick your target model, set chunk size and overlap, and the tool walks backwards to find natural break points — paragraph &gt; sentence &gt; word &gt; character — so chunks never split mid-thought. Each chunk arrives copy-paste ready with a header or XML wrapper so the model knows where it is in the sequence.
                </>
              }
              bullets={[
                "9 model presets (GPT-4o, Claude Opus 1M, Gemini 1.5 Pro 1M, etc.)",
                "Token estimate per chunk + total token count",
                "Configurable overlap so context doesn't break across chunks",
                "Three prefix styles: --- header, XML tags, or bare",
              ]}
            />
            <Block
              icon={<Network className="h-5 w-5 text-accent-glow" />}
              title="Task Decomposer — for asks too big for one shot"
              body={
                <>
                  When a prompt has 4+ distinct deliverables, models cut corners and produce mediocre results on each. A prompt chain — research → plan → draft → critique → polish — consistently beats a one-shot, even with the same model. The decomposer detects complex prompts and emits a tailored chain (knowledge work or code) with each step ready to run.
                </>
              }
              bullets={[
                "Detects complexity signals: verb count, connectives, sentence count",
                "Knowledge chain: Research → Plan → Draft → Critique → Polish",
                "Code chain: Spec → Design → Implement → Test → Refactor",
                "Each step shipped as a stand-alone prompt with role + format",
              ]}
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">FAQ</h2>
          <div className="mt-8 space-y-4">
            <Faq
              q="How accurate is the token count?"
              a="It's an estimate. We use max(chars/4, words × 1.3) which tracks BPE-style tokenizers within ±10% for English prose. For absolute accuracy, run the chunks through your provider's tokenizer — but the estimate is usually close enough to plan chunk sizes."
            />
            <Faq
              q="Does the chunker work for non-English text?"
              a="Yes — the chunker is language-agnostic. The token estimate is calibrated for English; languages with denser tokenization (e.g. CJK) may use more tokens per character, so use a smaller chunk size as a safety margin."
            />
            <Faq
              q="What's the right chunk size?"
              a="We pre-fill the recommended size for the model you pick (e.g. ~12k for Claude Sonnet, ~32k for Gemini 1.5 Pro). The right answer depends on your task: smaller chunks = more retrieval precision; larger chunks = more context for the model to reason about."
            />
            <Faq
              q="Does anything leave my browser?"
              a="No. The chunker and decomposer are pure JavaScript running in your tab. Your text never reaches any server."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Pill({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-accent-glow" />
      {text}
    </span>
  );
}

function Block({
  icon,
  title,
  body,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  bullets: string[];
}) {
  return (
    <div className="card p-6">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/30">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-ink-dim">{body}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-ink-dim">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="card group p-5">
      <summary className="cursor-pointer list-none text-sm font-medium text-ink sm:text-base">
        <span className="mr-2 text-accent-glow">›</span>
        {q}
      </summary>
      <p className="mt-3 text-sm text-ink-dim">{a}</p>
    </details>
  );
}
