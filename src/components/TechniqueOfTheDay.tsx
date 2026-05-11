import Link from "next/link";
import { ArrowRight, Calendar, Zap } from "lucide-react";
import { TEMPLATES, type Template } from "@/lib/templates";

function pickToday(): Template {
  const advanced = TEMPLATES.filter((t) => t.category === "techniques");
  // Day-of-year index so the same technique features for the entire UTC day,
  // then rotates the next day. Predictable, no storage needed.
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start) / 86_400_000);
  return advanced[dayOfYear % advanced.length] || advanced[0] || TEMPLATES[0];
}

export function TechniqueOfTheDay() {
  const t = pickToday();
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="card relative overflow-hidden p-5 sm:p-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-500/15" />
        <div className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" aria-hidden />
        <div className="grid items-center gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                <Calendar className="h-3 w-3" /> Technique of the day
              </span>
              <span className="text-xs text-ink-fade">{dateLabel}</span>
            </div>
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              {t.title}
            </h2>
            {t.technique && (
              <div className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300">
                <Zap className="h-3.5 w-3.5" /> {t.technique}
              </div>
            )}
            <p className="mt-3 max-w-xl text-balance text-ink-dim">
              {t.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/templates/${t.slug}`}
                className="btn-primary"
              >
                Try today&apos;s technique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/templates" className="btn-ghost">
                See all advanced patterns
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-xl border border-white/10 bg-bg-soft/60 p-3 font-mono text-xs leading-relaxed text-ink-dim">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-amber-300">
                Lazy prompt
              </div>
              <div className="line-clamp-3">{t.beforePrompt}</div>
              <div className="mt-2 mb-1 text-[10px] uppercase tracking-wider text-emerald-300">
                Upgrade preview
              </div>
              <div className="line-clamp-4 text-ink">
                {t.betterPrompt.split("\n").slice(0, 5).join("\n")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
