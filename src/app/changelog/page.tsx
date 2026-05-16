import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Sparkles } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Changelog — What's new in FixAIPrompt",
  description:
    "Recent shipped features, fixes, and ideas. From the initial prompt linter MVP to the full privacy-layer toolkit with CLI and browser extension.",
  alternates: { canonical: "/changelog" },
};

type Entry = {
  date: string;
  title: string;
  body: string[];
  badge?: "shipped" | "in-progress" | "next";
};

const ENTRIES: Entry[] = [
  {
    date: "2026-05-12",
    title: "Live demo + command palette + shareable filled templates",
    badge: "shipped",
    body: [
      "Animated live-demo hero on the homepage — cycles through 4 real prompts being fixed, with score-jump animation.",
      "Command palette (Cmd/Ctrl+K) with fuzzy search across all tools, templates, glossary entries, and pages.",
      "Shareable permalinks on every advanced template — click \"Copy share link\" to send a URL that pre-fills the template with your inputs.",
      "/tools directory page and /about page with the full story.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Mega-push: CSV/JSON cleaner, +10 glossary, +15 advanced templates, CLI, browser extension",
    badge: "shipped",
    body: [
      "New CSV / JSON PII Stripper at /data-cleaner with column-aware redaction and 11 PII column types auto-classified.",
      "Glossary doubled from 6 to 16 entries — added Few-Shot, Zero-Shot, System Prompt Design, Persona Prompting, Function Calling, RAG, ReAct, Constitutional AI, Self-Consistency, Step-Back Prompting.",
      "Advanced templates expanded by 15 — Few-Shot Builder, Plan-and-Solve, Step-Back, Self-Consistency, Generator-Verifier, Tournament Ranking, Skeleton-of-Thought, Devil's Advocate, 5 Whys, Six Hats, Analogical Reasoning, System Prompt Designer, ReAct Agent Skeleton, Constitutional Self-Critique, Negative-Example Prompting.",
      "CLI package — npx fixaiprompt for terminal users.",
      "Browser extension (Manifest V3) — paste-event listener that scans clipboard before pasting into ChatGPT / Claude / Gemini / Copilot / Grok.",
      "DEPLOY.md guide with step-by-step Vercel + DNS setup.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Six viral / retention features",
    badge: "shipped",
    body: [
      "Per-page OG image generation (next/og) — every URL now unfurls with a branded social card.",
      "Prompt Diff tool — paste two prompts, see which wins on each metric.",
      "Streak counter — habit-formation badge in the nav.",
      "Snarky review — a witty one-liner reaction to your prompt under the score.",
      "Browser bookmarklet — drag-to-bookmarks to scan clipboard from any page.",
      "Glossary section with the first 6 advanced technique entries.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Interactive Template Filler + viral share card + Technique of the Day",
    badge: "shipped",
    body: [
      "Templates became interactive — every <PLACEHOLDER> is parsed, the right input type is auto-generated, and a live preview shows the filled prompt with highlighted pills.",
      "Filled values persist to localStorage per template.",
      "SharePromptFix card on the homepage appears when score delta ≥ 5 — with Twitter / LinkedIn share intents.",
      "Technique of the Day section rotates one of the 10 advanced templates daily, anchored to UTC day-of-year.",
    ],
  },
  {
    date: "2026-05-11",
    title: "10 advanced prompt-engineering technique templates",
    badge: "shipped",
    body: [
      "Chain-of-Thought, Tree-of-Thoughts, Self-Refine, Multi-Persona Council, Adversarial Red-Team, Pre-Mortem, First-Principles Decomposer, Cognitive Bias Audit, AI Personality Forensics, Algorithm Whisperer.",
      "Each codifies a real, peer-reviewed prompt-engineering technique.",
      "Advanced / Viral badges on cards + named-technique chips.",
      "Hero promo: \"The patterns the pros actually use.\"",
    ],
  },
  {
    date: "2026-05-11",
    title: "Prompt Chunker + homepage polish",
    badge: "shipped",
    body: [
      "Text chunker — splits long text into model-ready chunks for 9 model presets (GPT-4o, Claude Opus 1M, Gemini 1.5, etc.) with token-aware natural break points and configurable overlap.",
      "Task decomposer — detects complex prompts and emits a 5-stage chain (Research → Plan → Draft → Critique → Polish, or for code: Spec → Design → Implement → Test → Refactor).",
      "Homepage gets a What's New ticker, 4-tool grid, refined hero, smoother section transitions.",
    ],
  },
  {
    date: "2026-05-11",
    title: "AI-grade auto-fix — task-type detection, model rendering, score jump",
    badge: "shipped",
    body: [
      "Task type detection (10 categories) drives the auto-fixer.",
      "Model-specific rendering: Claude XML tags, GPT markdown, Gemini bulleted, plain prose.",
      "Predicted Score Jump card after every rewrite.",
      "Detected Task card with topic extraction.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Kill API-key flow — show corrected prompt + insights inline, no key needed",
    badge: "shipped",
    body: [
      "Removed the BYOK Claude rewriter. Replaced with a pure-TypeScript auto-fixer that produces a corrected prompt + insights timeline in real time.",
      "Cascading vague-opener stripping, weak-word removal, contradiction resolution, role / format / length / audience / example / safeguard inference.",
      "Zero friction — no API keys, no signup.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Multi-metric scoring + sophistication slider + personas + Roast Mode",
    badge: "shipped",
    body: [
      "Single score replaced with 5 metric bars: Clarity, Context, Structure, Specificity, Hallucination Risk.",
      "Sophistication slider: Beginner / Intermediate / Expert / God Mode.",
      "Personality presets (Professor, Hacker, Therapist, Mentor, CEO, Comedian, PM) and style presets.",
      "Roast My Prompt — separate witty-roast button alongside the standard rewrite.",
    ],
  },
  {
    date: "2026-05-11",
    title: "Pivot to \"the privacy layer for AI\"",
    badge: "shipped",
    body: [
      "Added Safe Paste — detector + masker + AI Leak Score.",
      "Templates library: 21 curated before/after templates across 8 categories.",
      "SEO landing pages: /safe-chatgpt-paste, /mask-api-keys, /sanitize-logs-for-ai, /remove-pii-from-json.",
      "New shared SiteNav + SiteFooter.",
      "Homepage rebrand: \"Fix prompts. Remove secrets. Use AI safely.\"",
    ],
  },
  {
    date: "2026-05-11",
    title: "Initial MVP — Prompt Linter + BYOK Claude Rewriter",
    badge: "shipped",
    body: [
      "Rules-based linter with 12+ rules (vague openers, missing role / format / length / audience, contradictions, weak language, politeness fluff, no clear ask, all-caps, too-short, multi-ask).",
      "BYOK Claude rewriter — user pastes their Anthropic API key, POSTs directly to api.anthropic.com.",
      "Hero, two-pane workspace, how-it-works, FAQ.",
      "First commit.",
    ],
  },
];

const NEXT: Entry[] = [
  {
    date: "Next",
    title: "Coming soon",
    badge: "next",
    body: [
      "Multi-language support (Hindi, Spanish, Mandarin, Portuguese).",
      "Chrome Web Store + Firefox Add-ons listing for the extension.",
      "Team workspace for shared rules and template libraries.",
      "API mode for embedding the engine in customer apps.",
      "Real-time leak-statistics dashboard for enterprises.",
    ],
  },
];

const BADGE_STYLES: Record<NonNullable<Entry["badge"]>, string> = {
  shipped: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
  "in-progress": "border-amber-400/30 bg-amber-400/15 text-amber-300",
  next: "border-violet-400/30 bg-violet-400/15 text-violet-300",
};

export default function ChangelogPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-3xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Calendar className="h-3 w-3 text-accent-glow" />
            Changelog · {ENTRIES.length} releases
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            What we{" "}
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
              shipped
            </span>
            .
          </h1>
          <p className="mx-auto mt-5 text-balance text-base text-ink-dim sm:text-lg">
            Honest, dated, no spin. The most recent at the top.
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-12">
          <ol className="relative border-l border-white/10 pl-6">
            {ENTRIES.map((e, idx) => (
              <li key={idx} className="mb-10">
                <span className="absolute -left-1.5 mt-1.5 grid h-3 w-3 place-items-center rounded-full bg-accent ring-4 ring-bg" />
                <div className="card p-5 sm:p-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                    <time className="font-mono text-ink-fade">{e.date}</time>
                    {e.badge && (
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[e.badge]}`}>
                        {e.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-ink sm:text-lg">{e.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm text-ink-dim">
                    {e.body.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-accent-glow" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="mb-4 inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-ink-dim">
            <Sparkles className="h-4 w-4 text-accent-glow" />
            Roadmap
          </h2>
          {NEXT.map((e, idx) => (
            <div key={idx} className="card p-5 sm:p-6">
              <h3 className="mb-2 text-base font-bold text-ink">{e.title}</h3>
              <ul className="space-y-2 text-sm text-ink-dim">
                {e.body.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-violet-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-8 text-center">
            <Link href="/tools" className="btn-primary">
              See every shipped tool
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
