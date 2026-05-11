import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { ArrowRight, ShieldCheck } from "lucide-react";

export type LandingProps = {
  eyebrow: string;
  title: React.ReactNode;
  blurb: React.ReactNode;
  exampleBefore: string;
  exampleAfter: string;
  beforeLabel?: string;
  afterLabel?: string;
  bullets: string[];
  ctaText?: string;
};

export function LandingShell({
  eyebrow,
  title,
  blurb,
  exampleBefore,
  exampleAfter,
  beforeLabel = "Before — risky",
  afterLabel = "After — safe to paste",
  bullets,
  ctaText = "Try Safe Paste",
}: LandingProps) {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <ShieldCheck className="h-3 w-3 text-accent-glow" />
            {eyebrow}
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <div className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            {blurb}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/safe-paste" className="btn-primary">
              {ctaText} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card overflow-hidden">
              <div className="border-b border-white/5 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-300">
                {beforeLabel}
              </div>
              <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink-dim">
                {exampleBefore}
              </pre>
            </div>
            <div className="card overflow-hidden ring-1 ring-emerald-400/30">
              <div className="border-b border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {afterLabel}
              </div>
              <pre className="max-h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink">
                {exampleAfter}
              </pre>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">What you get</h2>
          <ul className="mt-8 space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="card flex items-start gap-3 p-4 text-sm text-ink-dim">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/safe-paste" className="btn-primary">
              {ctaText} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
