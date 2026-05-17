import Link from "next/link";
import { ArrowRight, Flame, Zap } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

const FEATURED_SLUGS = [
  "chain-of-thought-reasoning",
  "tree-of-thoughts",
  "self-refine-loop",
  "adversarial-red-team",
  "pre-mortem",
  "personality-forensics",
];

export function FeaturedTechniques() {
  const featured = FEATURED_SLUGS.map((slug) => TEMPLATES.find((t) => t.slug === slug)).filter(
    (t): t is NonNullable<typeof t> => !!t
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
          <Zap className="h-3 w-3" /> Steal these prompts
        </div>
        <h2 className="text-balance text-2xl font-bold sm:text-3xl">
          Six prompt-engineering patterns the{" "}
          <span className="bg-gradient-to-r from-violet-300 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            pros actually use
          </span>
          .
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-ink-dim">
          Each one is interactive — paste your scenario into the fields,
          get a fully-filled production prompt back. No API key.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((t) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="card group relative flex flex-col overflow-hidden p-5 ring-1 ring-violet-400/20 transition hover:-translate-y-0.5 hover:border-accent/40"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-50 transition group-hover:opacity-100" />
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                <Zap className="h-3 w-3" />
                {t.technique || "Technique"}
              </div>
              {t.viral && (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
                  <Flame className="h-2.5 w-2.5" /> Viral
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-ink group-hover:text-accent-glow">{t.title}</h3>
            <p className="mt-2 flex-1 text-sm text-ink-dim">{t.tagline}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-glow">
              Try it <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/templates" className="btn-ghost">
          See all {TEMPLATES.length} templates <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
