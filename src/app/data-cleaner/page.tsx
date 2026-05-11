import type { Metadata } from "next";
import { DataCleaner } from "@/components/DataCleaner";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Database, Lock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "CSV / JSON PII Stripper — Remove sensitive columns before sharing data",
  description:
    "Paste a CSV or JSON. Auto-detect PII columns (email, phone, name, SSN, address, secrets) and download a redacted version. 100% in-browser — your dataset never leaves your laptop.",
  alternates: { canonical: "/data-cleaner" },
};

export default function DataCleanerPage() {
  return (
    <>
      <SiteNav />
      <main className="relative min-h-screen bg-hero-radial">
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-10 text-center sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-dim">
            <Database className="h-3 w-3 text-accent-glow" />
            Data Cleaner · CSV + JSON · Browser-only
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Strip{" "}
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              PII
            </span>{" "}
            from CSV &amp; JSON.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-dim sm:text-lg">
            Paste a dataset, get a column-aware redaction plan, toggle which
            columns to mask, and download the cleaned file. Built for
            analysts, support teams, and anyone who needs to share data with
            an AI without leaking real customers.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-dim">
            <Pill icon={Lock} text="Runs entirely in your browser" />
            <span className="text-ink-fade">·</span>
            <Pill icon={Zap} text="11 column types detected automatically" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <DataCleaner />
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            What gets caught
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Block title="Column-name auto-classification" items={[
              "email / e_mail / user_email",
              "phone / mobile / cell",
              "name / first_name / last_name",
              "ssn / aadhaar / pan",
              "card_number / cvv",
              "ip / ip_address",
              "dob / birth_date",
              "address / street / zip",
              "passport / license / national_id",
              "password / token / api_key / secret",
              "latitude / longitude",
            ]} />
            <Block title="Value-level detection (any column)" items={[
              "API keys (AWS / OpenAI / GitHub / Stripe / Anthropic / …)",
              "JWTs and bearer tokens",
              "Private key blocks",
              "Mongo / Postgres / MySQL connection URIs",
              "Emails inside notes / comments columns",
              "Phone numbers in international formats",
              "Credit cards (Luhn-validated)",
              "Aadhaar (Verhoeff-validated)",
              "IPv4 / IPv6 addresses",
            ]} />
            <Block title="Output" items={[
              "Structurally identical to your input",
              "CSV mode: preserves headers, escapes correctly",
              "JSON mode: parses + walks the tree",
              "Masked tokens are descriptive ([EMAIL_MASKED])",
              "Download as .csv / .json",
              "Or copy-paste into your data tool",
            ]} />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">FAQ</h2>
          <div className="mt-8 space-y-4">
            <Faq
              q="Will this work on huge datasets?"
              a="Yes — parsing and masking run in your browser. The bottleneck is browser memory; 100,000-row CSVs work comfortably on typical laptops. For multi-million-row datasets, use the CLI (npx fixaiprompt) when we ship it."
            />
            <Faq
              q="Does anything leave my browser?"
              a="No. All parsing, classification, and redaction happens client-side. There is no server-side processing — we never receive your data."
            />
            <Faq
              q="What if my column has a weird name?"
              a="Anything we don't recognize gets classified as 'Other' and left un-masked by default. Toggle the checkbox to force-mask any column you want."
            />
            <Faq
              q="Can it catch secrets buried inside a free-text column?"
              a="Yes — even on un-masked columns, we run the same secret/PII detector that powers Safe Paste over every cell. If you have an API key sitting inside a 'notes' or 'description' column, it'll get caught."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Pill({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-accent-glow" />
      {text}
    </span>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-dim">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-glow" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
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
