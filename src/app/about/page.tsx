import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "About FixAIPrompt — The privacy layer for AI",
  description:
    "Why FixAIPrompt exists, what it does, what it won't do. Built so anyone — developer, founder, teacher, student — can talk to AI without leaking the data they care about.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-3xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Sparkles className="h-3 w-3 text-accent-glow" />
            About FixAIPrompt
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            The{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              privacy layer
            </span>{" "}
            for AI.
          </h1>
          <p className="mx-auto mt-5 text-balance text-base text-ink-dim sm:text-lg">
            Built for anyone who uses ChatGPT, Claude, Gemini, Cursor, or
            Copilot — and quietly worries about what just left their
            laptop.
          </p>
        </section>

        <article className="mx-auto max-w-3xl px-6 pb-20 leading-relaxed text-ink-dim">
          <h2 className="mt-10 text-xl font-bold text-ink">Why this exists</h2>
          <p className="mt-3">
            Hundreds of millions of people now paste code, customer data,
            production logs, contracts, medical notes, and worse into AI chat
            boxes — every day, without thinking. The AI is helpful. The leak
            is silent. Tokens travel to third-party servers. Some are
            stored. Some are used for training. Some end up in audit logs
            you didn&apos;t know existed.
          </p>
          <p className="mt-3">
            The standard advice — &quot;just be careful what you paste&quot; — does
            not scale. We needed a layer between the user and the model.
            One that catches the things humans miss, before the paste lands.
            That&apos;s FixAIPrompt.
          </p>

          <h2 className="mt-10 text-xl font-bold text-ink">What we do</h2>
          <p className="mt-3">
            Two jobs, deeply intertwined:
          </p>
          <ol className="mt-3 space-y-3">
            <li className="flex gap-3">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent-glow ring-1 ring-accent/30">1</span>
              <div>
                <strong className="text-ink">Make prompts better.</strong>{" "}
                Task-aware rewriting, multi-metric scoring, advanced
                technique templates (Chain-of-Thought, Tree-of-Thoughts,
                Self-Refine, ReAct, Constitutional AI, and more). The
                output is dramatically better than the input — and the
                user learns prompt engineering by osmosis.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent-glow ring-1 ring-accent/30">2</span>
              <div>
                <strong className="text-ink">Make pastes safe.</strong>{" "}
                Detect 30+ types of API keys, JWTs, PII, credentials, and
                database secrets — in logs, JSON, SQL, and CSVs — before
                they reach the AI. With an AI Leak Score, masked output,
                and download for cleaned datasets.
              </div>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-bold text-ink">What we won&apos;t do</h2>
          <ul className="mt-3 space-y-3">
            <li className="flex gap-3">
              <Shield className="mt-1 h-4 w-4 flex-none text-emerald-300" />
              <div>
                <strong className="text-ink">Receive your data.</strong>{" "}
                Detection, masking, linting, chunking, and decomposition all
                run as JavaScript in your browser. We never have your
                pasted content because we never receive it.
              </div>
            </li>
            <li className="flex gap-3">
              <Lock className="mt-1 h-4 w-4 flex-none text-emerald-300" />
              <div>
                <strong className="text-ink">Track you.</strong> No analytics
                pixels on tool pages. No fingerprinting. No third-party
                scripts in the path between you and a result. The site is
                static. The behaviour is yours.
              </div>
            </li>
            <li className="flex gap-3">
              <Zap className="mt-1 h-4 w-4 flex-none text-emerald-300" />
              <div>
                <strong className="text-ink">Gate the basics.</strong> The
                linter, detector, masker, chunker, decomposer, templates,
                glossary, prompt diff, and data cleaner are all free. No
                signup. No API keys. Forever.
              </div>
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-ink">Who we&apos;re for</h2>
          <ul className="mt-3 space-y-2 text-ink-dim">
            <li>
              <strong className="text-ink">Developers</strong> — paste logs,
              stack traces, and API responses to ChatGPT without leaking
              tokens.
            </li>
            <li>
              <strong className="text-ink">Founders &amp; analysts</strong> —
              share customer data and CSVs with AI for analysis, without
              uploading PII.
            </li>
            <li>
              <strong className="text-ink">Teachers &amp; students</strong> —
              paste student work or notes without exposing real names or
              emails.
            </li>
            <li>
              <strong className="text-ink">Everyone</strong> — every prompt
              shorter, sharper, and safer.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-bold text-ink">What&apos;s under the hood</h2>
          <p className="mt-3">
            Pure TypeScript, Next.js 14, Tailwind. No backend (yet). Detection
            uses a regex pipeline plus Shannon-entropy fallbacks and validators
            (Luhn for cards, Verhoeff for Aadhaar). The auto-fix runs on a
            task-type classifier — generative-writing, generative-code,
            analytical, educational, extraction, transformation, decisional,
            creative, conversational — and emits Claude-XML, GPT-markdown,
            Gemini-bulleted, or plain-prose output depending on the target.
          </p>
          <p className="mt-3">
            The same engine ships as a <Link href="/tools" className="text-accent-glow hover:underline">CLI and a browser extension</Link>, so
            you can use it from a terminal, from your browser&apos;s toolbar,
            or as a draggable bookmarklet.
          </p>

          <h2 className="mt-10 text-xl font-bold text-ink">Roadmap</h2>
          <ul className="mt-3 space-y-2 text-ink-dim">
            <li>Multi-language support (Hindi, Spanish, Mandarin, Portuguese).</li>
            <li>Chrome Web Store + Firefox Add-ons listing for the extension.</li>
            <li>Team workspace for shared rules and shared template libraries.</li>
            <li>API mode for embedding the engine in customer apps.</li>
          </ul>

          <div className="card mt-10 flex flex-col items-start gap-3 p-6">
            <h3 className="text-base font-semibold text-ink">Want to get involved?</h3>
            <p className="text-sm text-ink-dim">
              The engine is open in spirit — the detection rules, the
              linter, the task classifier, and the auto-fix are all pure
              functions. If your team has a use case we haven&apos;t covered,
              tell us and we&apos;ll add it.
            </p>
            <Link
              href="/tools"
              className="btn-primary"
            >
              See every tool <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
