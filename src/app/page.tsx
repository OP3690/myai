import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { HomePromptHero } from "@/components/HomePromptHero";
import { HomeChunkerHero } from "@/components/HomeChunkerHero";
import { LiveDemo } from "@/components/LiveDemo";
import { ByTheNumbers } from "@/components/ByTheNumbers";
import { BattleOfTheLLMs } from "@/components/BattleOfTheLLMs";
import { ViralSnarkWall } from "@/components/ViralSnarkWall";
import { FeaturedTechniques } from "@/components/FeaturedTechniques";
import { TechniqueOfTheDay } from "@/components/TechniqueOfTheDay";
import {
  ArrowRight,
  BookOpen,
  KeyRound,
  Layers,
  Lock,
  Network,
  Scissors,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FixAIPrompt — Make Every AI Actually Listen",
  description:
    "Paste any rough prompt. FixAIPrompt grades it across 5 metrics, rewrites it for ChatGPT, Claude, Gemini, or Grok, and masks API keys and PII before you hit send. 58 templates. Free, browser-only, no signup.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen overflow-hidden bg-hero-radial">
        <div className="aurora" aria-hidden>
          <div className="orb" />
        </div>
        {/* What's new ticker */}
        <div className="border-b border-white/5 bg-gradient-to-r from-rose-500/5 via-accent/10 to-accent-cyan/5">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 font-bold uppercase tracking-wider text-rose-300">
              <Zap className="h-3 w-3" /> New
            </span>
            <span className="text-ink-dim">
              <strong className="text-ink">Prompt Chunker</strong> — split long text and decompose complex tasks for any LLM.
            </span>
            <Link
              href="/chunker"
              className="inline-flex items-center gap-1 font-medium text-accent-glow transition hover:text-accent"
            >
              Try it <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <section className="mx-auto max-w-5xl px-6 pb-10 pt-12 text-center sm:pt-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Zap className="h-3 w-3 text-accent-glow" />
            Free · No signup · No API key · 100% browser-only
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Make{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              every AI
            </span>{" "}
            actually{" "}
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              listen
            </span>
            .
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Paste any rough prompt. FixAIPrompt grades it across{" "}
            <strong className="text-ink">5 metrics</strong>, rewrites it in the syntax{" "}
            <strong className="text-ink">ChatGPT, Claude, Gemini, or Grok</strong>{" "}
            handles best, and masks{" "}
            <strong className="text-ink">30+ kinds of API keys and PII</strong>{" "}
            before you hit send. 58 templates. 16 technique guides. The
            model isn&apos;t the problem — your prompt is.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/safe-paste" className="btn-ghost">
              <Shield className="h-4 w-4" /> Safe Paste
            </Link>
            <Link href="/chunker" className="btn-ghost">
              <Scissors className="h-4 w-4" /> Chunker
            </Link>
            <Link href="/templates" className="btn-ghost">
              <BookOpen className="h-4 w-4" /> Templates
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-dim">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Runs entirely in your browser
            </span>
            <span className="text-ink-fade">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-accent-cyan" /> No uploads, no logs, no tracking
            </span>
            <span className="text-ink-fade">·</span>
            <span className="inline-flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-accent-glow" /> No signup, no API keys
            </span>
          </div>

          <HomePromptHero />

          <HomeChunkerHero />
        </section>

        <SectionDivider />

        <LiveDemo />

        <SectionDivider />

        <ByTheNumbers />

        <SectionDivider />

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">Four tools. One mission.</h2>
            <p className="mt-2 text-ink-dim">Keep your data safe. Get better answers. Ship faster.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              href="/safe-paste"
              accent="from-rose-500/20 via-orange-500/10 to-amber-500/10"
              ring="ring-rose-400/20"
              icon={<Shield className="h-6 w-6" />}
              tag="Safe Paste"
              title="Mask secrets before they hit AI."
              body="Detects API keys, JWTs, PII, credentials, and database secrets in logs, JSON, SQL, and code — and gives you a safe-to-paste version with an AI Leak Score."
              cta="Open Safe Paste"
            />
            <ToolCard
              href="/fix"
              accent="from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10"
              ring="ring-accent/20"
              icon={<Sparkles className="h-6 w-6" />}
              tag="Prompt Fixer"
              title="Task-aware prompt rewriting."
              body="A linter for prompts plus task-type detection (Code / Writing / Analysis / Decision / …) that adapts role, format, and example to each task. No API key needed."
              cta="Open Prompt Fixer"
            />
            <ToolCard
              href="/chunker"
              accent="from-cyan-500/20 via-sky-500/10 to-emerald-500/10"
              ring="ring-cyan-400/20"
              icon={<Scissors className="h-6 w-6" />}
              tag="Chunker · New"
              title="Split big inputs. Decompose hard asks."
              body="Two browser-only tools. Chunk long text into model-ready pieces for ChatGPT / Claude / Gemini, or decompose a complex prompt into a chain of focused sub-prompts."
              cta="Open Chunker"
              newBadge
            />
            <ToolCard
              href="/templates"
              accent="from-emerald-500/20 via-teal-500/10 to-sky-500/10"
              ring="ring-emerald-400/20"
              icon={<BookOpen className="h-6 w-6" />}
              tag="Templates"
              title="Steal prompts that actually work."
              body="A growing library of before/after prompt templates with explanations. Copy, customise, and lint before pasting into your favourite AI."
              cta="Browse templates"
            />
          </div>
        </section>

        <SectionDivider />

        <BattleOfTheLLMs />

        <SectionDivider />

        <TechniqueOfTheDay />

        <SectionDivider />

        <FeaturedTechniques />

        <SectionDivider />

        <ViralSnarkWall />

        <SectionDivider />

        {/* Advanced techniques promo */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="card relative overflow-hidden p-6 sm:p-10">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/20 via-rose-500/5 to-amber-500/10" />
            <div className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" aria-hidden />
            <div className="absolute -bottom-20 -left-20 -z-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" aria-hidden />
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Zap className="h-3 w-3" />
                  10 advanced techniques
                </div>
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  The patterns the{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                    pros
                  </span>{" "}
                  actually use.
                </h2>
                <p className="mt-4 max-w-xl text-balance text-ink-dim">
                  Chain-of-Thought. Tree-of-Thoughts. Self-Refine. Multi-Persona Debate. Adversarial Red-Team. Pre-Mortem. Bias Audit. Personality Forensics. Algorithm Whisperer. Each one with the lazy prompt, the technique, and exactly why it works.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/templates" className="btn-primary">
                    Open the technique library <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="grid gap-2.5 text-sm">
                <TechniqueChip name="Chain-of-Thought" tone="violet" />
                <TechniqueChip name="Tree-of-Thoughts" tone="cyan" />
                <TechniqueChip name="Self-Refine Loop" tone="emerald" />
                <TechniqueChip name="Multi-Persona Council" tone="amber" />
                <TechniqueChip name="Adversarial Red-Team" tone="rose" />
                <TechniqueChip name="Pre-Mortem Analysis" tone="sky" />
                <TechniqueChip name="Cognitive Bias Audit" tone="violet" />
                <TechniqueChip name="Algorithm Whisperer" tone="rose" />
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        <section id="how" className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">How FixAIPrompt protects you</h2>
            <p className="mt-2 text-ink-dim">One workflow. Three checks. No data leaves your browser.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Step
              n={1}
              icon={<Sparkles className="h-4 w-4 text-accent-glow" />}
              title="Lint & rewrite the prompt"
              body="Multi-metric scoring (clarity / context / structure / specificity / risk) plus task-aware rewriting catches lazy phrasing, missing structure, and contradictions."
            />
            <Step
              n={2}
              icon={<Shield className="h-4 w-4 text-rose-300" />}
              title="Scan the data"
              body="A regex + entropy detector spots 30+ types of secrets and PII before you paste. Highlighted, masked, copy-ready output."
            />
            <Step
              n={3}
              icon={<Layers className="h-4 w-4 text-cyan-300" />}
              title="Chunk what's too big"
              body="Long transcripts, contracts, and documents get split into model-ready chunks. Complex prompts get decomposed into focused chains."
            />
          </div>
        </section>

        <SectionDivider />

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="card relative overflow-hidden p-6 sm:p-10">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/10 via-transparent to-accent/10" />
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">
              The category nobody&apos;s building.
            </h2>
            <p className="mt-3 max-w-2xl text-balance text-ink-dim">
              Generic prompt tools are everywhere. The real wedge is{" "}
              <strong className="text-ink">AI Data Loss Prevention</strong>: the layer
              that keeps developers, students, teachers, and whole companies from
              accidentally leaking real-world data into chat boxes. That&apos;s us.
            </p>
            <ul className="mt-6 grid gap-4 text-sm text-ink-dim sm:grid-cols-2">
              <Bullet>For developers — paste logs, stack traces, and API responses without exposing tokens.</Bullet>
              <Bullet>For founders — share customer data with AI for analysis without uploading PII.</Bullet>
              <Bullet>For teachers — paste student work without exposing names or emails.</Bullet>
              <Bullet>For everyone — every prompt is shorter, sharper, and safer.</Bullet>
            </ul>
          </div>
        </section>

        <SectionDivider />

        <section id="faq" className="mx-auto max-w-3xl px-6 pb-24 pt-8">
          <div className="mb-8 text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">FAQ</h2>
            <p className="mt-2 text-ink-dim">The questions we hear most.</p>
          </div>
          <div className="space-y-4">
            <Faq
              q="Is FixAIPrompt free?"
              a="Yes — the linter, detector, masker, chunker, decomposer, and templates are 100% free. Nothing is gated. We don't charge anyone."
            />
            <Faq
              q="Where does my data go?"
              a="Nowhere. Detection, masking, linting, chunking, and decomposition all run as JavaScript in your browser. There is no server-side processing — we cannot see what you paste because we never receive it."
            />
            <Faq
              q="What does the detector catch?"
              a="30+ patterns: AWS / OpenAI / Anthropic / GitHub / Stripe / Slack / Google / SendGrid keys, JWTs, bearer tokens, private key blocks, Mongo / Postgres / MySQL / Redis URIs, .env-style lines, emails, phone numbers, SSNs, Aadhaar, credit cards (Luhn-validated), IPv4/IPv6 — plus an entropy fallback for unknown secrets."
            />
            <Faq
              q="What models does the chunker support?"
              a="9 presets: GPT-3.5 16k, GPT-4 8k, GPT-4 Turbo 128k, Claude Haiku 200k, Claude Sonnet 200k, Claude Opus 1M, Gemini 1.5 Pro 1M, Llama 3 8k, Mistral Large 32k, plus a custom mode. Chunk size is pre-filled to a sensible default per model and you can override it."
            />
            <Faq
              q="Can my team get this?"
              a="Yes — we're building an enterprise version (browser extension + team rules + audit logs). If your team is interested, the same client-side detection moves into a Chrome extension that scans the clipboard before paste."
            />
            <Faq
              q="What models does the Prompt Fixer optimize for?"
              a="Claude, ChatGPT/GPT-4, Gemini, and a model-agnostic Plain mode. The auto-fixer renders each prompt in the syntax that model handles best — XML for Claude, markdown for GPT, bulleted for Gemini, prose for everything else."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

function TechniqueChip({
  name,
  tone,
}: {
  name: string;
  tone: "violet" | "rose" | "amber" | "cyan" | "emerald" | "sky";
}) {
  const map: Record<string, string> = {
    violet: "border-violet-400/30 bg-violet-400/10 text-violet-200",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    sky: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  };
  return (
    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 backdrop-blur-sm ${map[tone]}`}>
      <span className="font-mono text-xs sm:text-sm">{name}</span>
      <Zap className="h-3.5 w-3.5 opacity-60" />
    </div>
  );
}

function ToolCard({
  href,
  accent,
  ring,
  icon,
  tag,
  title,
  body,
  cta,
  newBadge,
}: {
  href: string;
  accent: string;
  ring: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
  cta: string;
  newBadge?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card group relative flex flex-col overflow-hidden p-6 transition hover:border-accent/40 hover:translate-y-[-2px] ${ring}`}
    >
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-50 transition group-hover:opacity-100 ${accent}`} />
      {newBadge && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-300">
          <Zap className="h-2.5 w-2.5" /> New
        </span>
      )}
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-ink ring-1 ring-white/10">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-dim">{body}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-glow">
        {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function Step({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card group p-6 transition hover:border-white/15">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-sm font-semibold text-accent-glow ring-1 ring-accent/30">
          {n}
        </div>
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-ink-dim">{body}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
      <span>{children}</span>
    </li>
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
