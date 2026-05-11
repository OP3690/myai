import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import {
  ArrowRight,
  BookOpen,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FixAIPrompt — Fix prompts. Remove secrets. Use AI safely.",
  description:
    "The privacy layer for AI. Lint and rewrite any prompt, detect API keys / JWTs / PII before pasting into ChatGPT, Claude, or Gemini. Free, 100% client-side.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-12 text-center sm:pt-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Zap className="h-3 w-3 text-accent-glow" />
            Free · 100% browser-only · Nothing leaves your laptop
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Fix prompts. Remove{" "}
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              secrets
            </span>
            .{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              Use AI safely.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Millions of people paste logs, API keys, JWTs, customer data, and
            credentials into ChatGPT — without realising the risk. FixAIPrompt
            is the <strong className="text-ink">privacy layer for AI</strong>:
            optimize the prompt, redact the dangerous bits.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/safe-paste" className="btn-primary">
              <Shield className="h-4 w-4" /> Try Safe Paste
            </Link>
            <Link href="/fix" className="btn-ghost">
              <Sparkles className="h-4 w-4" /> Try Prompt Fixer
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
              <KeyRound className="h-3.5 w-3.5 text-accent-glow" /> Your API key stays local
            </span>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              href="/safe-paste"
              accent="from-rose-500/20 via-orange-500/10 to-amber-500/10"
              icon={<Shield className="h-6 w-6" />}
              tag="Safe Paste"
              title="Mask secrets before they hit AI."
              body="Detects API keys, JWTs, PII, credentials, and database secrets in logs, JSON, SQL, and code — and gives you a safe-to-paste version with an AI Leak Score."
              cta="Open Safe Paste"
            />
            <ToolCard
              href="/fix"
              accent="from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10"
              icon={<Sparkles className="h-6 w-6" />}
              tag="Prompt Fixer"
              title="Better prompts in one click."
              body="A linter for prompts: flags vague verbs, missing format, contradictions, weak language. Then rewrites for Claude, GPT, Gemini, Cursor, or Copilot."
              cta="Open Prompt Fixer"
            />
            <ToolCard
              href="/templates"
              accent="from-emerald-500/20 via-teal-500/10 to-sky-500/10"
              icon={<BookOpen className="h-6 w-6" />}
              tag="Templates"
              title="Steal prompts that actually work."
              body="A growing library of before/after prompt templates with explanations. Copy, customise, and lint before pasting into your favourite AI."
              cta="Browse templates"
            />
          </div>
        </section>

        <section id="how" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            How FixAIPrompt protects you
          </h2>
          <p className="mt-2 text-center text-ink-dim">
            One workflow. Two checks. No data leaves your browser.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step
              n={1}
              title="Lint the prompt"
              body="The rules engine catches lazy phrasing, missing structure, hallucination triggers, and contradictions in your actual ask."
            />
            <Step
              n={2}
              title="Scan the data"
              body="A regex + entropy detector spots 30+ types of secrets and PII you didn't mean to share. Output highlighted, masked, and ready to copy."
            />
            <Step
              n={3}
              title="Paste with confidence"
              body="Send the rewritten, redacted version to ChatGPT, Claude, Gemini, Cursor, or Copilot. The unsafe original never crossed the wire."
            />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="card relative overflow-hidden p-6 sm:p-10">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/10 via-transparent to-accent/10" />
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">
              The category nobody&apos;s building.
            </h2>
            <p className="mt-3 max-w-2xl text-balance text-ink-dim">
              Generic prompt tools are everywhere. The real wedge is{" "}
              <strong className="text-ink">
                AI Data Loss Prevention
              </strong>
              : the layer that keeps developers, students, teachers, and whole
              companies from accidentally leaking real-world data into chat
              boxes. That&apos;s us.
            </p>
            <ul className="mt-6 grid gap-4 text-sm text-ink-dim sm:grid-cols-2">
              <Bullet>For developers — paste logs, stack traces, and API responses without exposing tokens.</Bullet>
              <Bullet>For founders — share customer data with AI for analysis without uploading PII.</Bullet>
              <Bullet>For teachers — paste student work without exposing names or emails.</Bullet>
              <Bullet>For everyone — every prompt is shorter, sharper, and safer.</Bullet>
            </ul>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">FAQ</h2>
          <div className="mt-8 space-y-4">
            <Faq
              q="Is FixAIPrompt free?"
              a="Yes — the linter, detector, masker, and templates are 100% free. The optional AI rewriter uses your own Anthropic API key, so you pay Anthropic directly for those tokens. We charge nothing."
            />
            <Faq
              q="Where does my data go?"
              a="Nowhere. Detection, masking, and linting all run as JavaScript in your browser. There is no server-side processing — we cannot see what you paste because we never receive it."
            />
            <Faq
              q="What does the detector catch?"
              a="30+ patterns: AWS / OpenAI / Anthropic / GitHub / Stripe / Slack / Google / SendGrid keys, JWTs, bearer tokens, private key blocks, Mongo / Postgres / MySQL / Redis URIs, .env-style lines, emails, phone numbers, SSNs, Aadhaar, credit cards (Luhn-validated), IPv4/IPv6 — plus an entropy fallback for unknown secrets."
            />
            <Faq
              q="Can my team get this?"
              a="Yes — we're building an enterprise version (browser extension + team rules + audit logs). If your team is interested, the same client-side detection moves into a Chrome extension that scans the clipboard before paste."
            />
            <Faq
              q="What models do you optimize prompts for?"
              a="Claude, ChatGPT/GPT-4, Gemini, Cursor, Copilot, and a generic model-agnostic mode. The Prompt Fixer adapts structure and phrasing to each."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ToolCard({
  href,
  accent,
  icon,
  tag,
  title,
  body,
  cta,
}: {
  href: string;
  accent: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="card group relative flex flex-col overflow-hidden p-6 transition hover:border-accent/40"
    >
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-50 transition group-hover:opacity-100 ${accent}`} />
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

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-sm font-semibold text-accent-glow ring-1 ring-accent/30">
        {n}
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
