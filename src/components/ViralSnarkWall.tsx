import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

type Snark = {
  text: string;
  triggers: string;
  metric: string;
};

const SNARKS: Snark[] = [
  {
    text: "“Short but detailed.” That's like asking for hot ice. Pick a side.",
    triggers: "Contradicting instructions",
    metric: "Clarity",
  },
  {
    text: "I've gotten more detail from a fortune cookie. What do you actually want?",
    triggers: "Prompt is too short",
    metric: "Specificity",
  },
  {
    text: "“Can you please help me with…” — sure, with what exactly? Reading minds isn't on my résumé.",
    triggers: "Vague opener",
    metric: "Clarity",
  },
  {
    text: "No role set, so I'll just guess. Want me to answer as a chef? A neuroscientist? A 19-year-old marketing intern? Pick one.",
    triggers: "Missing role / persona",
    metric: "Context",
  },
  {
    text: "Stop yelling. I'm right here.",
    triggers: "Excessive ALL CAPS",
    metric: "Clarity",
  },
  {
    text: "Four asks in one prompt. I'll do the first two well and skim the rest.",
    triggers: "Multiple requests",
    metric: "Structure",
  },
  {
    text: "You asked for the “latest” and “everything” — buckle up for some confidently wrong answers.",
    triggers: "Hallucination triggers",
    metric: "Risk",
  },
  {
    text: "Lots of “maybe” and “try to” in here. Bold of you to assume I have free will.",
    triggers: "Weak / hedging language",
    metric: "Specificity",
  },
  {
    text: "I read this three times. I'm not sure what you want me to do. Try a verb?",
    triggers: "No clear ask",
    metric: "Clarity",
  },
  {
    text: "No format requested, so I'll produce 8 paragraphs. You'll hate them. We both know it.",
    triggers: "No output format",
    metric: "Structure",
  },
];

const METRIC_TONE: Record<string, string> = {
  Clarity: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  Context: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  Structure: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Specificity: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  Risk: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
};

export function ViralSnarkWall() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
          <MessageCircle className="h-3 w-3" /> What the AI would say to your face
        </div>
        <h2 className="text-balance text-2xl font-bold sm:text-3xl">
          Your prompts deserve{" "}
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300 bg-clip-text text-transparent">
            an honest editor
          </span>
          .
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-ink-dim">
          Every prompt you type into the Fix My Prompt widget gets a dry,
          one-line review based on which lint rule fired. Here&apos;s the
          wall of shame.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SNARKS.map((s, i) => (
          <figure
            key={i}
            className="card group relative flex flex-col gap-3 p-5 transition hover:-translate-y-0.5"
          >
            <MessageCircle className="absolute right-4 top-4 h-5 w-5 text-ink-fade transition group-hover:text-amber-300" />
            <blockquote className="text-sm leading-relaxed text-ink">{s.text}</blockquote>
            <figcaption className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-ink-fade">Triggered by: {s.triggers}</span>
              <span
                className={`rounded-full border px-2 py-0.5 font-medium ${METRIC_TONE[s.metric] || "border-white/10 bg-white/5 text-ink-dim"}`}
              >
                ↓ {s.metric}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/#fix-my-prompt" className="btn-primary">
          Get roasted by your own prompt <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
