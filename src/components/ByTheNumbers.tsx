import { GLOSSARY } from "@/lib/glossary";
import { TEMPLATES } from "@/lib/templates";
import { BookOpen, Layers, ShieldCheck, Zap } from "lucide-react";

const STATS = (templateCount: number, advancedCount: number, glossaryCount: number) => [
  {
    value: "30+",
    label: "Secret patterns detected",
    sub: "AWS · OpenAI · GitHub · Stripe · JWTs · DB URIs · PII",
    icon: ShieldCheck,
    tone: "rose",
  },
  {
    value: `${templateCount}`,
    label: "Prompt templates",
    sub: `${advancedCount} advanced techniques · interactive fill-in fields`,
    icon: Layers,
    tone: "violet",
  },
  {
    value: `${glossaryCount}`,
    label: "Techniques explained",
    sub: "CoT · ToT · Self-Refine · ReAct · RAG · Constitutional AI",
    icon: BookOpen,
    tone: "cyan",
  },
  {
    value: "100%",
    label: "Browser-only",
    sub: "No uploads · no logs · no API keys · no accounts",
    icon: Zap,
    tone: "emerald",
  },
];

const TONE: Record<string, { text: string; bg: string; ring: string }> = {
  rose: { text: "text-rose-300", bg: "bg-rose-400/10", ring: "ring-rose-400/30" },
  violet: { text: "text-violet-300", bg: "bg-violet-400/10", ring: "ring-violet-400/30" },
  cyan: { text: "text-cyan-300", bg: "bg-cyan-400/10", ring: "ring-cyan-400/30" },
  emerald: { text: "text-emerald-300", bg: "bg-emerald-400/10", ring: "ring-emerald-400/30" },
};

export function ByTheNumbers() {
  const stats = STATS(
    TEMPLATES.length,
    TEMPLATES.filter((t) => t.advanced).length,
    GLOSSARY.length
  );
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
          <Zap className="h-3 w-3 text-accent-glow" /> By the numbers
        </div>
        <h2 className="text-balance text-2xl font-bold sm:text-3xl">
          One product. Every privacy + prompt move covered.
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const tone = TONE[s.tone];
          return (
            <div
              key={s.label}
              className={`card relative overflow-hidden p-5 transition hover:-translate-y-0.5 ${tone.ring} ring-1`}
            >
              <div className={`absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full ${tone.bg} blur-2xl`} aria-hidden />
              <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${tone.bg} ring-1 ${tone.ring}`}>
                <Icon className={`h-4 w-4 ${tone.text}`} />
              </div>
              <div className={`text-4xl font-bold tabular-nums ${tone.text}`}>{s.value}</div>
              <div className="mt-1 text-sm font-medium text-ink">{s.label}</div>
              <div className="mt-2 text-xs text-ink-fade">{s.sub}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
