import { PromptWorkspace } from "@/components/PromptWorkspace";
import { Sparkles, ShieldCheck, Zap, KeyRound } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-hero-radial">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/20 ring-1 ring-accent/40">
            <Sparkles className="h-4 w-4 text-accent-glow" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            fixai<span className="text-accent-glow">prompt</span>
          </span>
        </div>
        <nav className="hidden gap-6 text-sm text-ink-dim sm:flex">
          <a href="#workspace" className="transition hover:text-ink">Tool</a>
          <a href="#how" className="transition hover:text-ink">How it works</a>
          <a href="#faq" className="transition hover:text-ink">FAQ</a>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-10 pt-6 text-center sm:pt-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
          <Zap className="h-3 w-3 text-accent-glow" />
          Free · Browser-only · Bring your own key
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Fix your AI prompt.{" "}
          <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-cyan bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
          Paste any prompt. Get instant lint warnings — like a code linter, but
          for the way you talk to AI — plus an optimized rewrite for Claude,
          GPT, Gemini, Cursor, or Copilot.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-dim">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Your prompt never leaves your browser
          </span>
          <span className="text-ink-fade">·</span>
          <span className="inline-flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-accent-cyan" /> Your API key is stored locally only
          </span>
        </div>
      </section>

      <section id="workspace" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <PromptWorkspace />
      </section>

      <section id="how" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-center text-ink-dim">
          Two passes. One free. One AI-powered.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Step
            n={1}
            title="Lint"
            body="A rules engine runs in your browser and flags vague verbs, missing format, contradictions, weak language, missing audience, and 10+ other common prompt mistakes."
          />
          <Step
            n={2}
            title="Rewrite"
            body="Paste your Anthropic API key and click Rewrite. We send the prompt + lint findings to Claude with a prompt-engineering system prompt and return a polished version."
          />
          <Step
            n={3}
            title="Ship"
            body="Copy the rewritten prompt into Claude, ChatGPT, Gemini, Cursor, or Copilot. Watch the response quality go up."
          />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">FAQ</h2>
        <div className="mt-8 space-y-5">
          <Faq
            q="Is this free?"
            a="The linter is 100% free and runs entirely in your browser. The AI rewriter uses your own Anthropic API key — you pay Anthropic directly for those tokens. We charge nothing."
          />
          <Faq
            q="Where does my API key go?"
            a="It's stored only in your browser's localStorage. It is sent directly from your browser to Anthropic's API. Our servers never see it."
          />
          <Faq
            q="Do you store my prompts?"
            a="No. The linter runs locally. The rewriter sends your prompt directly to Anthropic from your browser. Nothing is logged on our side."
          />
          <Faq
            q="Why does the rewrite use Claude?"
            a="Claude is the strongest model we've tested for the meta-task of fixing prompts. We may add other providers later — let us know what you want."
          />
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-ink-fade">
        © {new Date().getFullYear()} FixAIPrompt · Built for developers, students, teachers, and anyone who talks to AI.
      </footer>
    </main>
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

function Faq({ q, a }: { q: string; a: string }) {
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
